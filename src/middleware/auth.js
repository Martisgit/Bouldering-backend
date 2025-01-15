import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      email: decoded.email,
      id: decoded.id,
    };
    next();
  });
};

export default auth;
