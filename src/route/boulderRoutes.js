import express from "express";
import {
  addBoulder,
  getBoulders,
  markCompleted,
  deleteBoulder,
} from "../controller/boulderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/boulders", auth, addBoulder);
router.get("/boulders", getBoulders);
router.put("/boulders/:id/completed", auth, markCompleted);
router.delete("/boulders/:id", auth, deleteBoulder);
export default router;
