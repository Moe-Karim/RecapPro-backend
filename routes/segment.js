import express from "express";
import multer from "multer";
import fs from "fs";
import { extractAudio, segmentVideoBasedOnTimestamps } from "../../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq } from "../../RecapPro-AI/index.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "❌ No video file uploaded." });

    const videoPath = req.file.path;
    const outputDir = `processed/${Date.now()}/`;
    fs.mkdirSync(outputDir, { recursive: true });

    try {
        console.log("📌 Processing video segmentation...");
        const audioPath = await extractAudio(videoPath, outputDir);
        const Text = await transcribeAudioWithGroq(`${audioPath}.mp3`);

        if (!Text || !Text.Topic) throw new Error("❌ Transcription failed!");

        const topics = Text.Topic;
        const videoSegments = await segmentVideoBasedOnTimestamps(videoPath, audioPath, topics, outputDir);

        res.json({
            message: "✅ Video segmented successfully",
            segments: videoSegments || []
        });
    } catch (error) {
        console.error("❌ Segmentation error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
