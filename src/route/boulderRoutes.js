import express from "express";
import {
  getBoulders,
  addBoulder,
  markCompleted,
  deleteBoulder,
  getBoulderById,
} from "../controller/boulderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/boulders", getBoulders);

router.get("/boulders/:id", auth, getBoulderById);
router.post("/boulders", auth, addBoulder);
router.put("/boulders/:id/completed", auth, markCompleted);
router.delete("/boulders/:id", auth, deleteBoulder);
export default router;
