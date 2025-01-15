import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../model/userModel.js";

export const SIGN_UP = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new UserModel({
      id: uuidv4(),
      email: req.body.email,
      name: req.body.name,
      password: hash,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(201).json({
      message: "User was created",
      token: token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "We have some problems" });
  }
};

export const LOGIN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "You have provided bad data" });
    }

    const isPasswordsMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordsMatch) {
      return res.status(401).json({ message: "You have provided bad data" });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "We have some problems" });
  }
};
