import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { extractAudio, segmentVideoBasedOnTimestamps } from "../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq } from "../RecapPro-ai/index.js";

const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "❌ No video file uploaded." });

    const videoPath = req.file.path;
    const outputDir = "processed/";

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    try {
        console.log("📌 Processing started...");
        
        const audioPath = await extractAudio(videoPath, outputDir);
        const { topics, content, transcriptFile } = await transcribeAudioWithGroq(audioPath);
        const videoSegments = await segmentVideoBasedOnTimestamps(videoPath, topics, outputDir);
    
        res.json({ message: "✅ Video segmented successfully!", segments: videoSegments, topics, content, transcript: transcriptFile });
    
      } catch (error) {
        console.error("❌ Processing error:", error);
        res.status(500).json({ error: "Error processing video." });
      }
  });
app.use(express.json());

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));