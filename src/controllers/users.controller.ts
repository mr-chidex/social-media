import { RequestHandler } from "express";
import mongoose from "mongoose";

import { IRequest, UserDoc, UserDocument } from "../libs/types";
import { User } from "../models";
import cloudinary from "../utils/cloudinary";

/**
 *
 * @route GET /api/v1/users
 * @desc - get all users
 * @acces Private
 */
export const getUsers: RequestHandler = async (_, res) => {
  const users = await User.find().sort({ _id: -1 });

  res.json({ users });
};

/**
 *
 * @route PUT /api/v1/users
 * @desc - update a user
 * @acces Private
 */
export const updateUser: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?._id;

  const { username, email } = req.body as UserDoc;

  const user = (await User.findById(userId)) as UserDocument;

  if (user.username !== username) {
    const isExist = await User.findOne({ username });
    if (isExist)
      return res.status(400).json({ message: "username already in use" });
  }

  if (user.email !== email) {
    const isExist = await User.findOne({ email });
    if (isExist)
      return res.status(400).json({ message: "email already in use" });
  }

  user.username = username;
  user.email = email;

  const { profilePic, coverPic } = req.files as any;

  if (profilePic) {
    //delete old image
    user.profilePic?.id &&
      (await cloudinary.v2.uploader.destroy(user.profilePic.id));

    //upload new
    const profileImage = await cloudinary.v2.uploader.upload(
      profilePic[0].path
    );

    user.profilePic = {
      url: profileImage.secure_url,
      id: profileImage.public_id,
    };
  }

  if (coverPic) {
    //delete old image
    user.coverPic?.id &&
      (await cloudinary.v2.uploader.destroy(user.coverPic.id));

    //upload new
    const coverImage = await cloudinary.v2.uploader.upload(coverPic[0].path);

    user.coverPic = {
      url: coverImage.secure_url,
      id: coverImage.public_id,
    };
  }

  await user.save();

  res.json(user);
};

/**
 *
 * @route PATCH /api/v1/users/follow?userId=id
 * @desc - follow a user
 * @acces Private
 */
export const followAUser: RequestHandler = async (req: IRequest, res) => {
  const { userId } = req.query; //user to follow id
  const id = req.user?._id as never; //current user id

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  if (userId === id)
    return res.status(403).json({ message: "cannot follow yourself" });

  const user = await User.findById(userId);
  if (!user)
    return res
      .status(400)
      .json({ message: "user about to follow does not exist" });

  const currentUser = await User.findById(id);
  if (!currentUser) return res.status(400).json({ message: "user not found" });

  // check if user is already followed
  if (user.followers?.includes(id)) {
    return res.status(403).json({ message: "You already followed this user" });
  }

  //update followers and followings
  await user.updateOne({ $addToSet: { followers: id } });
  await currentUser.updateOne({ $addToSet: { following: userId } });

  res.json({ message: "user followed" });
};

/**
 *
 * @route PATCH /api/v1/users/unfollow?userId=id
 * @desc - unfollow a user
 * @acces Private
 */
export const unfollowAUser: RequestHandler = async (req: IRequest, res) => {
  const { userId } = req.query; //user to unfollw
  const id = req.user?._id as never; //current user id

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  if (userId === id)
    return res.status(403).json({ message: "cannot unfollow yourself" });

  const user = await User.findById(userId);
  if (!user)
    return res
      .status(400)
      .json({ message: "user about to unfollow does not exist" });

  const currentUser = await User.findById(id);
  if (!currentUser) return res.status(400).json({ message: "user not found" });

  // check if you're following user
  if (!user.followers?.includes(id)) {
    return res
      .status(403)
      .json({ message: "can't unfollow a user you're not following" });
  }

  //update followers and followings
  await user.updateOne({ $pull: { followers: id } });
  await currentUser.updateOne({ $pull: { following: userId } });

  res.json({ message: "user unfollowed" });
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
export const deleteUser: RequestHandler = async (req: IRequest, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(400).json({ message: "user does not exist" });

  //destroy images if exist
  user.profilePic?.id &&
    (await cloudinary.v2.uploader.destroy(user.profilePic.id));
  user.coverPic?.id && (await cloudinary.v2.uploader.destroy(user.coverPic.id));

  res.status(200).json({ message: "user deleted" });
};
