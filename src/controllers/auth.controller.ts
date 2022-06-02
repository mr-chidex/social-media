import { Request, Response } from "express";

import { UserDoc } from "../libs/types";
import { User, ValdateUser } from "../models";

/**
 *
 * @route POST /ap/v1/signup
 * @desc - signup new user
 * @acces Public
 */
export const signupUser = async (req: Request, res: Response) => {
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
