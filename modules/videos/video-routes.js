import { Router } from "express";
import {
    uploadVideo,
    getVideo,
    getAllVideos,
    deleteVideo,
    deleteAllVideos,
  } from "./videos-controller.js";

import { AppRouter } from "../../config/AppRouter.js";

import { authMiddleware } from "../../middleware/auth-middelware.js";

const videoRouters = new Router();

videoRouters.post("/upload", uploadVideo);
videoRouters.get("/:videoId", getVideo);
videoRouters.get("/", getAllVideos);
videoRouters.delete("/:videoId", deleteVideo);
videoRouters.delete("/", deleteAllVideos);

const router = new AppRouter({
  prefix: "/videos",
  router: videoRouters,
  middlewares: [authMiddleware],
});

export default router;
