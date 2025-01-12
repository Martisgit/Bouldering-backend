import express from "express";
import auth from "../middleware/auth.js";
import {
  addBeta,
  getBetasByBoulder,
  likeDislikeBeta,
  deleteBeta,
} from "../controller/betaController.js";

const router = express.Router();

router.post("/boulders/:boulderId/beta", auth, addBeta);
router.get("/boulders/:boulderId/beta", getBetasByBoulder);
router.put(
  "/boulders/:boulderId/beta/:betaId/like-dislike",
  auth,
  likeDislikeBeta
);
router.delete("/boulders/:boulderId/beta/:betaId", auth, deleteBeta);

export default router;
