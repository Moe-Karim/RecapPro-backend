import { User } from "../../db/models/user-model.js";
import jwt from "jsonwebtoken";

export const uploadVideo = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { videoPath } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.videos.push({ path: videoPath, timestamp: new Date() });
    await user.save();

    return res
      .status(201)
      .json({ message: "Video uploaded successfully", videos: user.videos });
  } catch (error) {
    console.error("Error uploading video:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while uploading the video" });
  }
};

export const getVideo = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { videoId } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const video = user.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({ video });
  } catch (error) {
    console.error("Error fetching video:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the video" });
  }
};
