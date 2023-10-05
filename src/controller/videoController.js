import * as dotenv from 'dotenv';
dotenv.config();
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import pkg1 from 'fluent-ffmpeg';
const { setFfmpegPath } = pkg1;
import { existsSync, readFileSync, writeFileSync, statSync, createReadStream, readFile } from 'fs';
import { join, resolve as _resolve } from 'path';
import pkg from '@deepgram/sdk';
const { Deepgram } = pkg;
setFfmpegPath(ffmpegPath);
import { BadRequestError, NotFoundError } from "../customError/error.js";
import { config } from "../config/index.js";

let videoChunks = []
let videoID
const deepgram = new Deepgram( config.DEEP_KEY );

let count = 1


const convert2audio = (videoPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .output(outputPath)
            .audioCodec('pcm_s16le')
            .toFormat('wav')
            .on('end', () => {
                console.log('Conversion complete');
                resolve();
            })
            .on('error', (err) => {
                console.log('Conversion error', err);
                reject(err);
            })
            .run()
    });
}

const saveChunckVideo = async (req, res, sta = true) => {
    try {
        const fileData = req.file
        await videoChunks.push(fileData.buffer)
        if (sta) {
            res.status(201).json({
                "msg": `${count} Chunk collected`,
                videoID
            })
            count++
        }
    } catch (error) {
        throw new BadRequestError("Invalid Blob file")
    }
}

const startVideo = async (req, res) => {
    try {
        videoChunks = [] // clears previous video
        count = 1
        // await recorder.startRecording()
        videoID = Math.floor(Math.random() * 9000000000) + 1000000000 //generated video ID
        res.status(200).json({ "msg": "Video begins", videoID })
    } catch (error) {
        res.status(401).json({ "msg": "Unable to start Video" })
    }

}

const pauseVideo = async (req, res) => {
    try {
        await saveChunckVideo(req, res, sta = false)
        res.status(200).json({ "msg": "Video paused", videoID })
    } catch (error) {
        throw new BadRequestError("Unable to pause video")
    }
}

const resumeVideo = (req, res) => {
    res.status(200).json({ "msg": "Video resumed", videoID })
}

const stopVideo = async (req, res) => {
    await saveChunckVideo(req, res, sta = false)
    await uploadAll(req, res)
}

const getTranscribe = async (folderPath, id) => {
    if (!existsSync(`${folderPath}.wav`)) {
        filePath = `${folderPath}.webm`

        await convert2audio(filePath, `${folderPath}.wav`)
            .then(() => {
                console.log('Conversion successfull')
            })
            .catch((err) => {
                console.log('An error occured: ', err)
            })

        const audioFile = {
            buffer: readFileSync(`${folderPath}.wav`),
            mimetype: 'audio/wav'
        }

        const transData = await deepgram.transcription.preRecorded(audioFile, {
            punctuation: true,
            utterances: true
        })
        const srtTranscript = await transData.toSRT()
        await writeFileSync(`${folderPath}.srt`, srtTranscript, (err) => {
            if (err) {
                throw err
            } else {
                console.log('Done!!!')
            }
        })
    }
}

const getVideo = async (req, res) => {
    try {
        const { id } = req.params
        const range = req.headers.range
        folderPath = join(__dirname, `videos/${id}`)
        filePath = folderPath + '.webm'

        const videoSize = statSync(filePath).size
        const chunkSize = 1 * 1e6;
        const start = Number(range.replace(/\D/g, ""))
        const end = Math.min(start + chunkSize, videoSize - 1)
        const videoLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": videoLength,
            "Content-Type": "video/webm"
        }
        res.writeHead(206, headers)
        const stream = await createReadStream(filePath, { start, end })

        // res.end({
        //     "status": 'Video acced',
        //     "videoPath": `${folderPath}.mp4`,
        //     "transcription": transData.results
        // })

        stream.pipe(res)
    } catch (error) {
        throw new NotFoundError("Cannot find ID'ed file")
    }
}

const uploadAll = async (req, res) => {
    const videoBuffer = await Buffer.concat(videoChunks)
    const folderPath = join(__dirname, 'videos', `${videoID}`)

    const videoPath = folderPath + '.webm'

    await writeFileSync(videoPath, videoBuffer)
    videoChunks = []
    await getTranscribe(folderPath, videoID)
    console.log(videoID)
    res.status(200).json({ "msg": "Video Upload successfully", videoID })
}

const getSRTFile = async (req, res) => {
    const { id } = req.params
    await readFile(_resolve(__dirname, `./videos/${id}.srt`), "utf8", (err, data) => {
        if (err) {
            throw new NotFoundError("File cannot be found")
        }
        res.status(200).send(data)
    })
}

export {
    startVideo,
    pauseVideo,
    resumeVideo,
    stopVideo,
    getVideo,
    saveChunckVideo,
    getSRTFile,
    uploadAll
}