import dotenv from "dotenv";
dotenv.config();

export const development = {
  port: +process.env.DEV_PORT,
  DEEP_KEY: process.env.DEV_DEEP_KEY,
};