/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

// What is a req body? -> A req body is an object that contains the data sent in the request body from the client side.

export const signUp = async (req, res, next) => {
  // Sets the session for this aggregation. Useful for transactions
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    // Logic to create a new user

    // extracting the data from the req body
    const { name, email, password } = req.body;

    // checking if a user already exists?
    // Check if a user already exists with the provided email
    const existingUser = await checkExistingUser(email);

    if (existingUser) {
      // Handle existing user
      const error = new Error("User  with this email already exists");
      error.statusCode = "409";
      throw error;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10); // salt is like a complexity we wanna use for randomizing our hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // list of users wanna to create
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session } // attaching session here, so that if something goes wrong while creating the User, and we later on abort that session in catch block, then the suer will not be created
    );

    const token = jwt.sign({ userId: newUsers[0]?._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers?.[0],
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // comparing the entered password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {};

// --------------------- helper methods ---------------------

const checkExistingUser = async (email) => {
  const existingUser = await User.findOne({ email });
  return existingUser !== null;
};
