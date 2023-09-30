import {Router} from "express"
import { uploadVideo, getAllVideos, getVideo, streamVideo } from "../controller/video.js";
import  parser from "../config/setup.js";

const router = Router()

router.post('/upload-video', parser.single('video'), uploadVideo);
router.get('/get-videos', getAllVideos);
router.get('/get-video/:id', getVideo);
router.get('/stream-video/:filename', streamVideo);

export {router}