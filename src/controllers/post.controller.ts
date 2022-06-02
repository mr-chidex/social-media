import { RequestHandler, Request } from "express";
import { PostDoc } from "../libs/types";
import { Post, ValidatePost } from "../models";

export const createPost: RequestHandler = async (req: Request | any, res) => {
  const { error, value } = ValidatePost(req.body as PostDoc);

  if (error) return res.status(422).json({ message: error.details[0].message });

  const { content } = value as PostDoc;

  const post = new Post({ content, user: req.user._id });

  await post.save();

  res.status(201).json({ message: "post successfully created" });
};
