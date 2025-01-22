import { User } from "../../db/models/user-model.js";
import bcrypt from "bcrypt";
import { json } from "express";
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


export const changePassword = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const {currentPassword, newPassword} = req.body;

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);


    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "An error occurred while updating password" });
  }
};
