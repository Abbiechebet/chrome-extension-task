import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandler } from "./src/utils/globalErrHandler.js";
import { config } from "./src/config/index.js";
import videoRouter from './src/route/videoRoute.js';

const app = express();

dotenv.config();
const port = config.port || 3000;

app.use(express.static('./public'));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use('/api/video', videoRouter);

app.use(globalErrorHandler);

app.listen(port, () => {

    if (!fs.existsSync('./controller/videos')) {
        fs.mkdirSync('./controller/videos', { recursive: true });
    }
    console.log(`Server listening on PORT: ${port}...`);
});