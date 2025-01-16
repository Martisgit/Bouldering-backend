import { v4 as uuidv4 } from "uuid";
import Beta from "../model/betaModel.js";
import Boulder from "../model/boulderModel.js";

const addBeta = async (req, res) => {
  try {
    const boulderId = req.params.boulderId;
    const media = req.body.media;
    const userId = req.user.id;

    const boulder = await Boulder.findOne({ id: boulderId });

    if (!boulder) {
      return res.status(404).json({ message: "Boulder not found" });
    }

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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBetasByBoulder = async (req, res) => {
  try {
    const boulderId = req.params.boulderId;

    const betas = await Beta.find({ boulderId: boulderId });

    return res.status(200).json({ betas: betas });
  } catch (err) {
    console.error("Error fetching betas:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likeDislikeBeta = async (req, res) => {
  try {
    const betaId = req.params.betaId;
    const action = req.body.action; // "like" or "dislike"
    const userId = req.user.id;

    const beta = await Beta.findOne({ id: betaId });
    if (!beta) {
      return res.status(404).json({ message: "Beta not found" });
    }

    if (action === "like") {
      beta.dislikes = beta.dislikes.filter((id) => id !== userId);

      if (!beta.likes.includes(userId)) {
        beta.likes.push(userId);
      } else {
        beta.likes = beta.likes.filter((id) => id !== userId);
      }
    } else if (action === "dislike") {
      beta.likes = beta.likes.filter((id) => id !== userId);

      if (!beta.dislikes.includes(userId)) {
        beta.dislikes.push(userId);
      } else {
        beta.dislikes = beta.dislikes.filter((id) => id !== userId);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'like' or 'dislike'." });
    }

    await beta.save();

    return res.status(200).json({ beta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBeta = async (req, res) => {
  try {
    const { boulderId, betaId } = req.params;

    const beta = await Beta.findOne({ id: betaId, boulderId });

    if (!beta) {
      return res.status(404).json({ message: "Beta not found" });
    }

    if (beta.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this beta" });
    }

    await Beta.findOneAndDelete({ id: betaId });
    return res.status(200).json({ message: "Beta deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addBeta, getBetasByBoulder, likeDislikeBeta, deleteBeta };
