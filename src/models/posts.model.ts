import mongoose, { Schema } from "mongoose";
import { PostDocument } from "../libs/types";

const postSchema = new Schema<PostDocument>({
  content: { type: String, default: "" },
  image: {
    type: Object,
    default: {
      url: String,
      id: String,
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default mongoose.model<PostDocument>("Post", postSchema);
