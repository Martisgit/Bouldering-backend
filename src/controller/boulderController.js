import Boulder from "../model/boulderModel.js";
import User from "../model/userModel.js";
import { v4 as uuidv4 } from "uuid";

export const addBoulder = async (req, res) => {
  console.log("Received request to add boulder");
  console.log("User object in request:", req.user); // Debugging step
  const { name, gym, picture, difficulty } = req.body;

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
      picture,
      difficulty,
      createdBy: req.user.id,
    });

    return res
      .status(201)
      .json({ response: "Boulder added successfully", boulder });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getBoulders = async (req, res) => {
  try {
    const boulders = await Boulder.find();
    const bouldersWithNames = await Promise.all(
      boulders.map(async (boulder) => {
        const users = await User.find(
          { id: { $in: boulder.completedBy } },
          "name"
        ); // ✅ Find users by UUID
        return { ...boulder._doc, completedBy: users };
      })
    );

    return res.status(200).json({ boulders: bouldersWithNames });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const markCompleted = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const boulder = await Boulder.findOne({ id });
    if (!boulder) return res.status(404).json({ message: "Boulder not found" });

    const alreadyCompleted = boulder.completedBy.includes(userId);

    if (alreadyCompleted) {
      // If user already completed it, remove them from the list (uncomplete)
      boulder.completedBy = boulder.completedBy.filter((uid) => uid !== userId);
    } else {
      // If user hasn't completed it, add them to the list
      boulder.completedBy.push(userId);
    }

    await boulder.save();

    return res.status(200).json({
      message: alreadyCompleted
        ? "Boulder unmarked as completed"
        : "Boulder marked as completed",
      boulder,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const deleteBoulder = async (req, res) => {
  const { id } = req.params;

  try {
    const boulder = await Boulder.findOne({ id });
    if (!boulder) return res.status(404).json({ message: "Boulder not found" });

    await Boulder.findOneAndDelete({ id });

    return res.status(200).json({ message: "Boulder deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
