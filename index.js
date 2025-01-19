import express from "express";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));