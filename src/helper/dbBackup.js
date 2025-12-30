import dotenv from "dotenv";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import archiver from "archiver";
import cron from "node-cron";

dotenv.config();

const {
  MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
  BACKUP_FOLDER,
} = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();
const S3_BACKUP_PREFIX = "mongodb-backups/";


// ─────────────────────────────────────────────
// Keep only LAST 2 backups in S3
async function cleanupOldBackupsFromS3() {
  const { Contents } = await s3
    .listObjectsV2({
      Bucket: S3_BUCKET_NAME,
      Prefix: S3_BACKUP_PREFIX,
    })
    .promise();

  if (!Contents || Contents.length <= 2) {
    console.log("🧹 No old backups to delete");
    return;
  }

  // Sort by LastModified (newest first)
  const sorted = Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  );

  const oldBackups = sorted.slice(2);

  for (const file of oldBackups) {
    await s3
      .deleteObject({
        Bucket: S3_BUCKET_NAME,
        Key: file.Key,
      })
      .promise();

    console.log(`🗑️ Deleted old backup: ${file.Key}`);
  }
}

// ─────────────────────────────────────────────

async function createBackup() {
  const date = new Date().toISOString().slice(0, 10);
  const dumpPath = path.join(BACKUP_FOLDER, `dump-${date}`);
  const zipFilePath = `${dumpPath}.zip`;

  console.log(`📦 Weekly backup started: ${date}`);

  // 1️⃣ Mongo Dump
  await new Promise((resolve, reject) => {
    const command = `mongodump --uri="${MONGO_URI}" --out=${dumpPath}`;
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      resolve();
    });
  });

  // 2️⃣ Zip the dump
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(dumpPath, false);
    archive.finalize();

    output.on("close", resolve);
    archive.on("error", reject);
  });

  // 3️⃣ Upload to S3
  const s3Key = `${S3_BACKUP_PREFIX}${path.basename(zipFilePath)}`;

  await s3
    .upload({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fs.createReadStream(zipFilePath),
      ContentType: "application/zip",
    })
    .promise();

  console.log(`☁️ Uploaded to S3: ${s3Key}`);

  // 4️⃣ Cleanup old backups (keep only last 2)
  await cleanupOldBackupsFromS3();

  // 5️⃣ Remove local files
  fs.rmSync(dumpPath, { recursive: true, force: true });
  fs.unlinkSync(zipFilePath);

  console.log("✅ Weekly backup completed successfully\n");
}

// ─────────────────────────────────────────────
// ⏰ Run ONCE PER WEEK (Sunday at 2 AM)
cron.schedule("0 2 * * 0", () => {
  console.log("⏰ Running weekly MongoDB backup...");
  createBackup().catch(console.error);
});
