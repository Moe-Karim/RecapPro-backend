import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { extractAudio, segmentVideoBasedOnTimestamps, detectSilence} from "../RecapPro-video-processing/index.js";
import { transcribeAudioWithGroq } from "../RecapPro-ai/index.js";

const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" });

app.use(express.json());

app.post("/upload", upload.single("video"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "❌ No video file uploaded." });

    const videoPath = req.file.path;
    const outputDir = "processed/";

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    try {
        console.log("📌 Processing started...");

        const audioPath = await extractAudio(videoPath, outputDir);
        const Text = await transcribeAudioWithGroq(`${audioPath}.mp3`);
        const topics= Text.Topic;
        const srt = Text.Content;
        const videoSegments = await segmentVideoBasedOnTimestamps(videoPath, audioPath,topics, outputDir);
        const gaps = await detectSilence(audioPath);

        res.json({
            message: "Video segmented successfully",
            segments: videoSegments || [], // Ensure it's always an array
            topic: topics || [],
            content: srt
          });
      } catch (error) {
        console.error("❌ Processing error:", error);
        res.status(500).json({ error: "Error processing video." });
      }
  });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
