import dotenv from "dotenv";
import cors from "cors";
import express from "express";

export const init = (app) => {
  dotenv.config();

  app.use(express.json());

  app.use(
    cors({
      origin: "*",
    })
  );
};

export const registerRoutes = (app, ...routers) => {
  routers.forEach((customedRouter) => {
    app.use(
      customedRouter.prefix,
      ...customedRouter.middlewares,
      customedRouter.router
    );
  });
};
