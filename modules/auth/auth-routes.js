import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import { changePassword, login, register } from "./auth-controller.js";

const authRouter = new Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.put("/password", changePassword);

const router = new AppRouter({
  prefix: "/auth",
  router: authRouter,
  middlewares: [],
});

export default router;
