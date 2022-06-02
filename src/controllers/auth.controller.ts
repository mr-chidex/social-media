import { RequestHandler } from "express";
import bcrypt from "bcrypt";

import { UserDoc } from "../libs/types";
import { User, ValdateUser, getToken } from "../models";

/**
 *
 * @route POST /api/v1/signup
 * @desc - signup new user
 * @acces Public
 */
export const signupUser: RequestHandler = async (req, res) => {
  //validate request body
  const { error, value } = ValdateUser(req.body as UserDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { username, email, password } = value as UserDoc;

  //check if username is already in use
  let userExist = await User.findOne({ username });
  if (userExist)
    return res
      .status(400)
      .json({ message: "username already in use", status: "error" });

  //check if email is already in use
  userExist = await User.findOne({ email });
  if (userExist)
    return res
      .status(400)
      .json({ message: "email already in user", status: "error" });

  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  res.status(201).json({ message: "signup successful", status: "success" });
};

/**
 * @route POST /api/v1/signin
 * @desc - signin user with username and password
 * @acces Public
 */
export const signIn: RequestHandler = async (req, res) => {
  const { username, password } = req.body as UserDoc;

  const user = await User.findOne({ username });

  if (!user)
    return res
      .status(422)
      .json({ message: "username or password is incorrect" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({ message: "email or password is incorrect" });

  const token = getToken(user);

  res.json({ token, status: "success" });
};
