import jwt from "jsonwebtoken";
import { User } from "../config/prisma.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findUnique({
      where: { id: decodedToken.id },
      // omit: {password: true}   //as password is already hashed
    });
    if (!user) {
      res.status(401).json({ error: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error at verifying JWT middleware : ", error);
    res.status(401).json({ error: error?.message || "Invalid Access Token" });
  }
};

export { verifyJWT };
