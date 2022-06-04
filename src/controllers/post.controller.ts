import { RequestHandler, Request } from "express";
import mongoose from "mongoose";

import { PostDoc } from "../libs/types";
import { Post, User, ValidatePost } from "../models";

/**
 *
 * @route POST /api/v1/posts
 * @desc - create post
 * @acces Private
 */
export const createPost: RequestHandler = async (req: Request | any, res) => {
  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { content } = value as PostDoc;

  const post = new Post({ content, user: req.user._id });

  await post.save();

  res.status(201).json({ message: "post successfully created" });
};

/**
 *
 * @route GET /api/v1/posts
 * @desc - get all post
 * @acces Private
 */
export const getPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find();

  res.json({ posts });
};

/**
 *
 * @route GET /api/v1/posts/:postId
 * @desc - get post
 * @acces Private
 */
export const getPost: RequestHandler = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  const post = await Post.findById(postId).populate({
    path: "user",
    select: "username email profilePic",
  });

  if (!post) return res.status(400).json({ message: " post does not exist" });

  res.json({ post });
};

/**
 *
 * @route DELETE /api/v1/posts/:postId
 * @desc - delete post
 * @acces Private
 */
export const deletePost: RequestHandler = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  const post = await Post.findByIdAndDelete(postId);

  if (!post) return res.status(400).json({ message: " post does not exist" });

  res.json({ message: "post deleted" });
};

/**
 *
 * @route PUT /api/v1/posts/:postId
 * @desc - update post
 * @acces Private
 */
export const updatePost: RequestHandler = async (req, res) => {
  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { content } = value as PostDoc;

  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  const post = await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: { content } },
    { new: true }
  );

  if (!post) return res.status(400).json({ message: " post does not exist" });

  res.json({ message: "post updated" });
};

/**
 *
 * @route PATCH /api/v1/posts/:postId/like?userd=id
 * @desc - like post
 * @acces Private
 */
export const likePost: RequestHandler = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.query as never;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "user not found" });

  const post = await Post.findById(postId);

  if (!post) return res.status(400).json({ message: " post does not exist" });

  if (post.likes.includes(userId)) {
    await post.updateOne({ $pull: { likes: userId } });
    return res.json({ message: "post unliked" });
  }

  await post.updateOne({ $addToSet: { likes: userId } });

  res.json({ message: "post liked" });
};

export const getTimelinePosts: RequestHandler = async (
  req: Request | any,
  res
) => {
  const userId = req.user?._id;

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "user not found" });

  // const userPosts = await Post.find({ user: userId });
};
