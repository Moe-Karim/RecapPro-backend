import express from "express";
import multer from "multer";
import fs from "fs";
import { extractAudio, detectSilence, burnSubtitles } from "../../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq, fillGapWithAI } from "../../RecapPro-ai/index.js";
import jwt from "jsonwebtoken";
import {User} from "../db/models/user-model.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Middleware to verify the token
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];  // Extract Bearer token

    if (!token) return res.status(401).json({ error: "❌ No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace JWT_SECRET with your secret
        req.user = decoded;  // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ error: "❌ Invalid or expired token" });
    }
};

router.post("/", authenticateUser, upload.single("video"), async (req, res) => {
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

        const user = await User.findById(req.user.id);
        if (user) {
            user.videos.push({
                path: subtitled,
                title: `Video with subtitles - ${Date.now()}`,
            });
            await user.save();
        }

        res.json({
            message: "✅ Gap-filled subtitles generated and video stored",
            subtitles: subtitled
        });
    } catch (error) {
        console.error("❌ Gap-filling error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
