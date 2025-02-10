import { Router } from "express";

const userRouter = Router();

// get all users
userRouter.get("/", (req, res) => {});

// get a user
userRouter.get("/:id", (req, res) => {});

// create a user
userRouter.post("/", (req, res) => {});

// update user by id
userRouter.put("/:id", (req, res) => {});

// delete user by id
userRouter.delete("/:id", (req, res) => {});

export default userRouter;
