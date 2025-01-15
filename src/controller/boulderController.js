import Boulder from "../model/boulderModel.js";
import User from "../model/userModel.js";
import { v4 as uuidv4 } from "uuid";

const addBoulder = async (req, res) => {
  const name = req.body.name;
  const gym = req.body.gym;
  const picture = req.body.picture;
  const difficulty = req.body.difficulty;

  try {
    if (difficulty < 1 || difficulty > 10) {
      return res
        .status(400)
        .json({ message: "Difficulty must be between 1 and 10" });
    }

    const boulder = await Boulder.create({
      id: uuidv4(),
      name: name || "",
      gym: gym || "",
      picture: picture,
      difficulty: difficulty,
      createdBy: req.user.id,
    });

    res.status(201).json({
      response: "Boulder added successfully",
      boulder: boulder,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBoulderById = async (req, res) => {
  try {
    const { id } = req.params;

    const boulder = await Boulder.findOne({ id });

    if (!boulder) {
      return res.status(404).json({ message: "Boulder not found" });
    }

    return res.status(200).json(boulder);
  } catch (err) {
    console.error("Error fetching boulder:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBoulders = async (req, res) => {
  try {
    const boulders = await Boulder.find();

    const bouldersWithNames = await Promise.all(
      boulders.map(async (boulder) => {
        const users = await User.find(
          { id: { $in: boulder.completedBy } },
          "name"
        );
        return { ...boulder._doc, completedBy: users };
      })
    );

    res.status(200).json({ boulders: bouldersWithNames });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const markCompleted = async (req, res) => {
  const boulderId = req.params.id;
  const userId = req.user.id;

  try {
    const boulder = await Boulder.findOne({ id: boulderId });
    if (!boulder) return res.status(404).json({ message: "Boulder not found" });

    const alreadyCompleted = boulder.completedBy.includes(userId);

    if (alreadyCompleted) {
      boulder.completedBy = boulder.completedBy.filter((id) => id !== userId);
    } else {
      boulder.completedBy.push(userId);
    }

    await boulder.save();

    res.status(200).json({
      message: alreadyCompleted
        ? "Boulder unmarked as completed"
        : "Boulder marked as completed",
      completedBy: boulder.completedBy,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const deleteBoulder = async (req, res) => {
  const id = req.params.id;

  try {
    const boulder = await Boulder.findOne({ id: id });
    if (!boulder) return res.status(404).json({ message: "Boulder not found" });

    await Boulder.findOneAndDelete({ id: id });

    res.status(200).json({ message: "Boulder deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
  addBoulder,
  getBoulders,
  markCompleted,
  deleteBoulder,
  getBoulderById,
};
