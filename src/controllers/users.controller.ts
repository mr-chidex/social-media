import { RequestHandler } from "express";
import mongoose from "mongoose";

import { User } from "../models";

/**
 *
 * @route GET /api/v1/users
 * @desc - get all users
 * @acces Private
 */
export const getUsers: RequestHandler = async (_, res) => {
  const users = await User.find().select("-password").sort({ _id: -1 });

  res.json({ users });
};

/**
 *
 * @route GET /api/v1/users/:id
 * @desc - get a user
 * @acces Private
 */
export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findById(id)
    .select("-password")
    .populate({ path: "followers", select: "username email profilePic" })
    .populate({ path: "following", select: "username email profilePic" });

  if (!user) return res.status(400).json({ message: " user does not exist" });

  res.json({ user });
};

/**
 *
 * @route DELETE /api/v1/users/:id
 * @desc - delete a user
 * @acces Private
 */
export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(400).json({ message: " user does not exist" });

  res.status(200).json({ message: "user deleted" });
};

/**
 *
 * @route PUT /api/v1/users/:id
 * @desc - update a user
 * @acces Private
 */
export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );

  res.json(user);
};

/**
 *
 * @route PATCH /api/v1/users/:id/follow?userId=id
 * @desc - follow a user
 * @acces Private
 */
export const followAUser: RequestHandler = async (req, res) => {
  const { userId } = req.query;
  const { id } = req.params as never;

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid follow id of user" });

  if (userId === id)
    return res.status(403).json({ message: "cannot follow yourself" });

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "user not found" });

  const followerUser = await User.findById(id);
  if (!followerUser) return res.status(400).json({ message: "user not found" });

  // check if user is already followed
  if (user.followers?.includes(id)) {
    return res.status(403).json({ message: "You already followed this user" });
  }

  //update followers and followings
  await user.updateOne({ $push: { followers: id } });
  await followerUser.updateOne({ $push: { following: userId } });

  res.json({ message: "user followed" });
};

/**
 *
 * @route PATCH /api/v1/users/:id/unfollow?userId=id
 * @desc - unfollow a user
 * @acces Private
 */
export const unfollowAUser: RequestHandler = async (req, res) => {
  const { userId } = req.query;
  const { id } = req.params as never;

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid follow id of user" });

  if (userId === id)
    return res.status(403).json({ message: "cannot unfollow yourself" });

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "user not found" });

  const followerUser = await User.findById(id);
  if (!followerUser) return res.status(400).json({ message: "user not found" });

  // check if you're following user
  if (!user.followers?.includes(id)) {
    return res
      .status(403)
      .json({ message: "can't unfollow a user you're not following" });
  }

  //update followers and followings
  await user.updateOne({ $pull: { followers: id } });
  await followerUser.updateOne({ $pull: { following: userId } });

  res.json({ message: "user unfollowed" });
};
