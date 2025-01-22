import express from "express";
import transcribeRoute from "./routes/transcribe.js";
import segmentRoute from "./routes/segment.js";
import gapFillRoute from "./routes/gapFill.js";
import fs from "fs";
import path from "path";
import connectToDb from "./db/connection.js";
import {init,registerRoutes} from "./config/init.js";
import authRouter from "./modules/auth/auth-routes.js";
import  videosRouter from "./modules/videos/video-routes.js";

const app = express();
const PORT = process.env.SERVER_PORT;

app.use("/transcribe", transcribeRoute);
app.use("/segment", segmentRoute);
app.use("/gap-fill", gapFillRoute);

init(app);
registerRoutes(app, authRouter, videosRouter);

const processedPath = path.resolve("processed");
fs.mkdirSync(processedPath, { recursive: true });
app.use("/processed", express.static(processedPath));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
connectToDb();
