import dotenv from "dotenv";
dotenv.config();

export const production = {
  port: +process.env.PROD_PORT,
  DEEP_KEY: process.env.PROD_DEEP_KEY,
};