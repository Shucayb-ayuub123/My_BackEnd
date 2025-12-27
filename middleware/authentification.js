import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JW_SECRET);

    // 4️⃣ Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid" });
  }
};