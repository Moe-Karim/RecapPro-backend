import express from "express";
import multer from "multer";
import fs from "fs";
import { extractAudio } from "../../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq } from "../../RecapPro-AI/index.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "❌ No video file uploaded." });

    const videoPath = req.file.path;
    const outputDir = `processed/${Date.now()}/`;
    fs.mkdirSync(outputDir, { recursive: true });

    try {
        console.log("📌 Transcribing audio...");
        const audioPath = await extractAudio(videoPath, outputDir);
        const Text = await transcribeAudioWithGroq(`${audioPath}.mp3`);

        if (!Text || !Text.Content) throw new Error("❌ Transcription failed!");

        res.json({
            message: "✅ Transcription successful",
            content: Text.Content
        });
    } catch (error) {
        console.error("❌ Transcription error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
