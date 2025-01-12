import { v4 as uuidv4 } from "uuid";
import Beta from "../model/betaModel.js";
import Boulder from "../model/boulderModel.js";

const addBeta = async (req, res) => {
  try {
    const boulderId = req.params.boulderId;
    const media = req.body.media;
    const userId = req.user.id; // Authenticated user

    const boulder = await Boulder.findOne({ id: boulderId });

    if (!boulder) {
      console.log("Boulder not found in database.");
      return res.status(404).json({ message: "Boulder not found" });
    }

    console.log("Boulder found:", boulder);

    const newBeta = new Beta({
      id: uuidv4(),
      boulderId: boulderId,
      media: media,
      createdBy: userId,
    });

    const response = await newBeta.save();
    return res
      .status(201)
      .json({ message: "Beta added successfully", beta: response });
  } catch (error) {
    console.error("Error in addBeta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBetasByBoulder = async (req, res) => {
  try {
    const boulderId = req.params.boulderId;
    const betas = await Beta.find({ boulderId: boulderId });

    if (betas.length === 0) {
      return res
        .status(404)
        .json({ message: "No beta found for this boulder" });
    }

    return res.status(200).json({ betas: betas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likeDislikeBeta = async (req, res) => {
  try {
    const betaId = req.params.betaId;
    const action = req.body.action; // "like" or "dislike"

    console.log(`Processing ${action} for Beta ID: ${betaId}`);

    const beta = await Beta.findOne({ id: betaId });
    if (!beta) {
      return res.status(404).json({ message: "Beta not found" });
    }

    if (action === "like") {
      if (beta.likes > 0) {
        beta.likes -= 1;
      } else {
        beta.likes += 1;
        beta.dislikes = 0;
      }
    } else if (action === "dislike") {
      if (beta.dislikes > 0) {
        beta.dislikes -= 1;
      } else {
        beta.dislikes += 1;
        beta.likes = 0;
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'like' or 'dislike'." });
    }

    await beta.save();
    return res
      .status(200)
      .json({ message: `Beta ${action}d successfully`, beta });
  } catch (error) {
    console.error("Error in likeDislikeBeta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBeta = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const beta = await Beta.findOne({ id: id });
    if (!beta) {
      return res.status(404).json({ message: "Beta not found" });
    }

    if (beta.createdBy !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this beta" });
    }

    await Beta.findOneAndDelete({ id: id });

    return res.status(200).json({ message: "Beta deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addBeta, getBetasByBoulder, likeDislikeBeta, deleteBeta };
