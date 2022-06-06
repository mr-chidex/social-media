import mongoose, { Schema } from "mongoose";
import Joi from "joi";

import { PostDoc, PostDocument } from "../libs/types";

const postSchema = new Schema<PostDocument>({
  content: { type: String, default: "" },
  image: {
    type: Object,
    default: {
      url: String,
      id: String,
    },
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const ValidatePost = (post: PostDoc) => {
  return Joi.object({
    content: Joi.string().min(3).trim().required(),
  }).validate(post);
};

export const Post = mongoose.model<PostDocument>("Post", postSchema);
