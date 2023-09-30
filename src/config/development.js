import dotenv from "dotenv";
dotenv.config();

export const development = {
  mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
  port: +process.env.DEV_PORT,
  cloud_name: process.env.DEV_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.DEV_CLOUDINARY_API_KEY,
  api_secret: process.env.DEV_CLOUDINARY_API_SECRET,
};