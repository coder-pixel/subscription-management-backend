/* eslint-disable no-unused-vars */
import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// get all users
userRouter.get("/", getUsers);

// get a user
userRouter.get("/:id", authorize, getUser);

// create a user
userRouter.post("/", (req, res) => {});

// update user by id
userRouter.put("/:id", (req, res) => {});

// delete user by id
userRouter.delete("/:id", (req, res) => {});

export default userRouter;
