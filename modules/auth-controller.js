import { User } from "../../db/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({
      message: "Invalid Credentials",
    });
  }

  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(400).send({
      message: "Invalid Credentials",
    });
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  return res.send({
    user,
    token,
  });
};
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
    });
    return res.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
