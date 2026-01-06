import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const validateConfig = (config) => {
  if (!config.jwt.secret) {
    throw new Error("Missing JWT secret");
  }
  if (!config.database_url) {
    throw new Error("Missing database URL");
  }
};

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  base_url: process.env.BASE_URL,
  database_url: process.env.MONGO_URL,
  auth_level: {
    user: ["USER", "ADMIN", "SUPER_ADMIN"],
    admin: ["ADMIN", "SUPER_ADMIN"],
    super_admin: ["SUPER_ADMIN"],
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  smtp: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_mail: process.env.SMTP_MAIL,
    smtp_password: process.env.SMTP_PASSWORD,
    NAME: process.env.SERVICE_NAME,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloudinary_url: process.env.CLOUDINARY_URL,
  },
  stripe: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret_test: process.env.STRIPE_WEBHOOK_SECRET_TEST,
    stripe_webhook_secret_production:
      process.env.STRIPE_WEBHOOK_SECRET_PRODUCTION,
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3_bucket_name: process.env.S3_BUCKET_NAME,
    backup_folder: process.env.BACKUP_FOLDER,
  },
  variables: {
    email_temp_image: process.env.EMAIL_TEMP_IMAGE,
    email_temp_text_secondary_color:
      process.env.EMAIL_TEMP_TEXT_SECONDARY_COLOR,
  },
};

// Validate configuration
validateConfig(config);

export default config;
