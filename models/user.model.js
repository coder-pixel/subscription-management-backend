import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"], // required and displaying error message
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true, // should be unique
      trim: true,
      lowercase: true, // email tends to be lowercase
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"], // validation for email
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
  },
  { timestamps: true }
);

// creatimg a user model for all the interactions
const User = mongoose.model("User", UserSchema);

export default User;
