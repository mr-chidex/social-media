import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import Joi from "joi";

import { UserDoc, UserDocument } from "../libs/types";

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: Object,
      default: {
        url: "",
        id: "",
      },
    },
    coverPic: {
      type: Object,
      default: {
        url: "",
        id: "",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(this.password, salt);
    this.password = hashedPass;

    next();
  } catch (error: any) {
    next(error);
  }
});

export const getToken = (user: UserDoc) => {
  return JWT.sign(
    {
      iat: Date.now(),
      iss: "Mr-Chidex",
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
      follow: user.following,
      followers: user.followers,
    },
    process.env.SECRET_KEY as string,
    { expiresIn: "24h" }
  );
};

export const ValidateUser = (userData: UserDoc) => {
  return Joi.object({
    username: Joi.string().min(3).trim().required(),
    email: Joi.string().required().email().normalize(),
    password: Joi.string().min(4).trim().required(),
  }).validate(userData);
};

export const Validate = (userData: UserDoc) => {
  return Joi.object({
    username: Joi.string().min(3).trim().required(),
    email: Joi.string().required().email().normalize(),
  }).validate(userData);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
