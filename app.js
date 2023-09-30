import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { globalErrorHandler } from "./src/utils/globalErrHandler.js";
import { config } from "./src/config/index.js";
import { router as videoRouter } from "./src/route/videoRoute.js";

const app = express();

dotenv.config();

mongoose
  .connect(config.mongodb_connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log(e.message));

const port = config.port || 3000;

app.use(morgan("tiny"));
app.use(express.json());

app.use("/api", videoRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server runnning on port: ${port}`);
});