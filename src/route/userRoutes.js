import express from "express";
import User from "../model/userModel.js";
import { SIGN_UP, LOGIN } from "../controller/userController.js";

const router = express.Router();

router.post("/users/names", async (req, res) => {
  try {
    const userIds = req.body.userIds;

    const users = await User.find({ id: { $in: userIds } }, "name");

    const names = users.map((user) => user.name);

    res.status(200).json({ names });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", SIGN_UP);
router.post("/login", LOGIN);

export default router;
