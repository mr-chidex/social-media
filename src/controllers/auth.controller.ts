import { Request, Response } from "express";
import { User } from "../models";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  //validate req.body

  //check if username is already in use
  let userExist = await User.findOne({ username });
  if (userExist)
    return res
      .status(400)
      .json({ message: "username already in use", status: "error" });

  //check if emal is already in use
  userExist = await User.findOne({ email });
  if (userExist)
    return res
      .status(400)
      .json({ message: "emal already in use", status: "error" });

  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  res.status(201).json({ message: "signup successful", status: "success" });
};
