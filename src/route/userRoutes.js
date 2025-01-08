import express from "express";
import { SIGN_UP, LOGIN } from "../controller/userController.js";

const router = express.Router();

router.post("/register", SIGN_UP);
router.post("/login", LOGIN);

export default router;
