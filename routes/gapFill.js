import express from "express";
import multer from "multer";
import fs from "fs";
import { extractAudio, detectSilence, burnSubtitles } from "../../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq, fillGapWithAI } from "../../RecapPro-ai/index.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "❌ No video file uploaded." });

    const videoPath = req.file.path;
    const outputDir = `processed/${Date.now()}/`;
    fs.mkdirSync(outputDir, { recursive: true });

    try {
        console.log("📌 Detecting silence and filling gaps...");
        const audioPath = await extractAudio(videoPath, outputDir);
        const Text = await transcribeAudioWithGroq(`${audioPath}.mp3`);

        if (!Text || !Text.Content) throw new Error("❌ Transcription failed!");

        const srt = Text.Content;
        const gaps = await detectSilence(audioPath);
        const gapSrt = await fillGapWithAI(srt, gaps, outputDir);
        const subtitled = await burnSubtitles(videoPath, gapSrt, `${audioPath}.mp3`, `${outputDir}Recap_${Date.now()}.mp4`);

        res.json({
            message: "✅ Gap-filled subtitles generated",
            subtitles: subtitled
        });
    } catch (error) {
        console.error("❌ Gap-filling error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
