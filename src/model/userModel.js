import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  completedBoulders: [{ type: String }],
});

export default mongoose.model("User", userSchema);
