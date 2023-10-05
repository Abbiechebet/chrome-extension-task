import { Router } from 'express'
const router = Router()
import multer, { memoryStorage } from 'multer'
const storage = memoryStorage()
const upload = multer({ storage: storage })

import { startVideo, pauseVideo, resumeVideo, stopVideo, getVideo, saveChunckVideo, getSRTFile, uploadAll } from '../controller/videoController.js'

router.post('/save', upload.single('file'), saveChunckVideo)
router.get('/start', startVideo)
router.post('/upload', uploadAll)
router.post('/pause', pauseVideo)
router.post('/resume', resumeVideo)
router.post('/stop', upload.single('file'), stopVideo)
router.get('/:id', getVideo)
router.get('/srt/:id', getSRTFile)

export default router