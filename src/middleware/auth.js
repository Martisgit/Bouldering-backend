import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log("Auth failed: No token provided");
    return res.status(401).json({ message: "no token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token", err.message);
      return res.status(401).json({ message: "invalid token" });
    }
    req.user = {
      email: decoded.email,
      id: decoded.id,
    };
    console.log("User authenticated:", req.user);
    next();
  });
};

export default auth;
