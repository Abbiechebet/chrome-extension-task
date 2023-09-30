import dotenv from "dotenv";
dotenv.config();

export const production = {
  mongodb_connection_url: process.env.PROD_MONGODB_CONNECTION_URL,
  port: +process.env.PROD_PORT,
  cloud_name: process.env.PROD_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.PROD_CLOUDINARY_API_KEY,
  api_secret: process.env.PROD_CLOUDINARY_API_SECRET,
};