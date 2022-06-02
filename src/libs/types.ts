import { Document } from "mongoose";

export interface UserDoc {
  _id?: string;
  username: string;
  email: string;
  password: string;
  profilePic?: { url: string; id: string };
  coverPic?: { url: string; id: string };
  isAdmin?: boolean;
}

export type UserDocument = UserDoc & Document;
