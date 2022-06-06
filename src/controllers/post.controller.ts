import { RequestHandler } from "express";
import mongoose from "mongoose";

import { Image, IRequest, PostDoc } from "../libs/types";
import { Post, User, ValidatePost } from "../models";
import cloudinary from "../utils/cloudinary";
const folder = "image/socialMedia";

/**
 *
 * @route POST /api/v1/posts
 * @desc - create post
 * @acces Private
 */
export const createPost: RequestHandler = async (req: IRequest, res) => {
  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { content } = value as PostDoc;

  if (!req.file)
    return res.status(422).json({ message: "post image not uploaded" });

  const image: Image = { url: "", id: "" };

  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
      folder,
    });

    image.url = uploadedImage.secure_url;
    image.id = uploadedImage.public_id?.split("/")[2];
  } catch (err) {
    throw new Error("error uploading file");
  }

  const post = new Post({
    content,
    user: req.user?._id,
    image,
  });

  await post.save();

  res.status(201).json({ message: "post successfully created" });
};

/**
 *
 * @route GET /api/v1/posts
 * @desc - get all post
 * @acces Private
 */
export const getPosts: RequestHandler = async (_, res) => {
  const posts = await Post.find().sort({ _id: -1 });

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
export const deletePost: RequestHandler = async (req: IRequest, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;
  const isAdmin = req.user?.isAdmin;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  let post: PostDoc | null;

  if (isAdmin) {
    post = await Post.findByIdAndDelete(postId);
  } else {
    post = await Post.findOneAndDelete({ _id: postId, user: userId });
  }

  if (!post) return res.status(400).json({ message: " post does not exist" });

  //delete image
  post.image?.id && (await cloudinary.v2.uploader.destroy(post.image?.id));

  res.json({ message: "post deleted" });
};

/**
 *
 * @route PUT /api/v1/posts/:postId
 * @desc - update post
 * @acces Private
 */
export const updatePost: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?._id;

  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { content } = value as PostDoc;

  const { postId } = req.params;

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).json({ message: "invalid post id" });

  const post = await Post.findOneAndUpdate(
    { _id: postId, user: userId },
    { $set: { content } },
    { new: true }
  );

  if (!post) return res.status(400).json({ message: "post does not exist" });

  if (req.file) {
    try {
      //delete old image
      post?.image?.id &&
        (await cloudinary.v2.uploader.destroy(post?.image?.id));

      //upload new image
      const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder,
      });

      post.image = {
        url: uploadedImage.secure_url,
        id: uploadedImage.public_id?.split("/")[2],
      };

      await post.save();
    } catch (err) {
      throw new Error("error uploading file");
    }
  }

  res.json({ message: "post updated" });
};

/**
 *
 * @route PATCH /api/v1/posts/:postId/like
 * @desc - like post
 * @acces Private
 */
export const likePost: RequestHandler = async (req: IRequest, res) => {
  const { postId } = req.params;
  const userId = req.user?._id as never;

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

export const getTimelinePosts: RequestHandler = async (req: IRequest, res) => {
  const userId = req.user?._id;

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ message: "invalid user id" });

  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "user not found" });

  let userPosts = await Post.find({ user: userId });

  await Promise.all(
    user.following?.map(async (follId: string) => {
      const post = await Post.find({ user: follId });
      userPosts = [...userPosts, ...post];
    }) as []
  );

  res.json({ posts: userPosts });
};
