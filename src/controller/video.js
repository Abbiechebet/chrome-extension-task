import VideoModel from "../model/videoModel.js";
import { sendError } from "../customError/error.js";
import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import path from 'path';

const client = new SpeechClient();

export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) return sendError(res, 400, 'No file uploaded.');

        const videoPath = path.join(__dirname, '..', 'uploads', req.file.originalname);
        fs.writeFileSync(videoPath, req.file.buffer);

        let transcript = "";
        const audioBytes = req.file.buffer.toString('base64');
        const audio = { content: audioBytes };
        const config = { encoding: 'LINEAR16', sampleRateHertz: 44100, languageCode: 'en-GB' };
        const request = { audio, config };

        const [response] = await client.recognize(request);
        const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
        transcript = transcription;

        const video = new VideoModel({
            title: req.body.title,
            filename: videoPath,
            transcript: transcript
        });

        await video.save();
        res.status(200).json({
            status: "success",
            message: "File saved & info saved in MongoDB.",
            video
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'An error occurred while processing the video.',
            error: error.message,
        });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await VideoModel.find();
        res.status(200).json({
            status: "success",
            message: "Videos retrieved successfully",
            videos
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'An error occurred while fetching videos.',
            error: error.message,
        });
    }
};

export const getVideo = async (req, res) => {
    try {
        const video = await VideoModel.findById(req.params.id);
        if (!video) return sendError(res, 404, 'Video not found!');
        res.status(200).json({
            status: "success",
            message: "Video retrieved successfully",
            video
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const streamVideo = async (req, res) => {
    try {
        const filename = req.params.filename;
        const video = await VideoModel.findOne({ title: filename });
        if (!video) return sendError(res, 404, 'Video not found!');
        const videoStream = fs.createReadStream(video.filename);
        videoStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
