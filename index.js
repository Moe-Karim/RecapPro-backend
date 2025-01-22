import express from "express";
import transcribeRoute from "./routes/transcribe.js";
import segmentRoute from "./routes/segment.js";
import gapFillRoute from "./routes/gapFill.js";
import fs from "fs";
import path from "path";
import connectToDb from "./db/connection.js";
import { login, register, changePassword, deleteUser } from "./modules/auth/auth-controller.js";
import cors from "cors";

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/transcribe", transcribeRoute);
app.use("/segment", segmentRoute);
app.use("/gap-fill", gapFillRoute);
app.use("/login", login);
app.use("/register", register);
app.use("/change", changePassword);
app.use("/delete", deleteUser);

const processedPath = path.resolve("processed");
fs.mkdirSync(processedPath, { recursive: true });
app.use("/processed", express.static(processedPath));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
connectToDb();
