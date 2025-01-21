import express from "express";
import transcribeRoute from "./routes/transcribe.js";
import segmentRoute from "./routes/segment.js";
import gapFillRoute from "./routes/gapFill.js";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/transcribe", transcribeRoute);


const processedPath = path.resolve('processed');
fs.mkdirSync(processedPath, { recursive: true });
app.use('/processed', express.static(processedPath));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
