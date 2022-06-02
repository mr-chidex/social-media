import { Document } from "mongoose";

export interface UserDoc {
  _id?: string;
  username: string;
  email: string;
  password: string;
  profilePic?: { url: string; id: string };
  coverPic?: { url: string; id: string };
  isAdmin?: boolean;
  getToken: () => string;
  followers?: [];
  following?: [];
}

export interface PostDoc {
  content: string;
  image?: { url: string; id: string };
  likes: number;
  user: string;
}

export type UserDocument = UserDoc & Document;
export type PostDocument = PostDoc & Document;
