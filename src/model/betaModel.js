import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { isValidMedia } from "../utils/validation.js";

const BetaSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  boulderId: { type: String, required: true, ref: "Boulder" },
  media: {
    type: String,
    required: true,
    validate: {
      validator: isValidMedia,
      message: "Must be an image or video URL.",
    },
  },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  createdBy: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Beta", BetaSchema);
