import jwt from "jsonwebtoken";
import { User } from "../db/models/user-model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const splitted = authHeader.split(" ");

  if (splitted.length !== 2 || splitted[0] !== "Bearer") {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const token = splitted[1];

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);

    const id = payload.id;

    const user = await User.findById(id);

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);

    return res.status(401).send({
      message: "Unauthorized",
    });
  }
};
