import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import cascadeDeleteBetas from "../middleware/boulderMiddleware.js"; // Import the middleware

const BoulderSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: false },
  gym: { type: String, required: false },
  picture: { type: String, required: true },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  completedBy: [{ type: String }],
  createdBy: { type: String, required: true },
});

BoulderSchema.pre("findOneAndDelete", cascadeDeleteBetas);

export default mongoose.model("Boulder", BoulderSchema);
