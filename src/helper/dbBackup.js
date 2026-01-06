import { exec } from "child_process";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import cron from "node-cron";
import config from "../config/index.js";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// ─────────────────────────────────────────────
// AWS S3 CLIENT (SDK v3)
const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key_id,
    secretAccessKey: config.aws.secret_access_key,
  },
});

const S3_BACKUP_PREFIX = "mongodb-backups/";

// ─────────────────────────────────────────────
// Keep only LAST 2 backups in S3
async function cleanupOldBackupsFromS3() {
  const { Contents } = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.aws.s3_bucket_name,
      Prefix: S3_BACKUP_PREFIX,
    })
  );

  if (!Contents || Contents.length <= 2) {
    console.log("🧹 No old backups to delete");
    return;
  }

  // Sort newest → oldest
  const sorted = Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  );

  const oldBackups = sorted.slice(2);

  for (const file of oldBackups) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: config.aws.s3_bucket_name,
        Key: file.Key,
      })
    );

    console.log(`🗑️ Deleted old backup: ${file.Key}`);
  }
}

// ─────────────────────────────────────────────
export async function createBackup() {
  const date = new Date().toISOString().slice(0, 10);
  const dumpPath = path.join(config.aws.backup_folder, `dump-${date}`);
  const zipFilePath = `${dumpPath}.zip`;

  console.log(`📦 Weekly backup started: ${date}`);

  // 1️⃣ Mongo Dump
  await new Promise((resolve, reject) => {
    const command = `mongodump --uri="${config.database_url}" --out=${dumpPath}`;
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

  // 3️⃣ Upload to S3 (SDK v3)
  const s3Key = `${S3_BACKUP_PREFIX}${path.basename(zipFilePath)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: config.aws.s3_bucket_name,
      Key: s3Key,
      Body: fs.createReadStream(zipFilePath),
      ContentType: "application/zip",
    })
  );

  console.log(`☁️ Uploaded to S3: ${s3Key}`);

  // 4️⃣ Cleanup old backups (keep last 2)
  await cleanupOldBackupsFromS3();

  // 5️⃣ Remove local files
  fs.rmSync(dumpPath, { recursive: true, force: true });
  fs.unlinkSync(zipFilePath);

  console.log("✅ Weekly backup completed successfully\n");
}


// ─────────────────────────────────────────────
// ⏰ Run ONCE PER WEEK (Sunday at 2 AM)
// cron.schedule("0 2 * * 0", () => {
//   console.log("⏰ Running weekly MongoDB backup...");
//   createBackup().catch(console.error);
// });
