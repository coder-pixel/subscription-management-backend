import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// someone is making a request -> middleware (authorize) -> verify -> if valid -> next() => get user details

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req?.headers?.authorization &&
      req?.headers?.authorization?.startsWith("Bearer")
    ) {
      token = req?.headers?.authorization?.split(" ")?.[1];
    }

    // if no token found -> return error
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
