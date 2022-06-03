import { RequestHandler, Request } from "express";
import JWT from "jsonwebtoken";
import { UserDoc } from "../libs/types";
import { User } from "../models";

export const authUser: RequestHandler = async (
  req: Request | any,
  res,
  next
) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer"))
    return res.status(401).json({
      message: "Unauthorized access: Invalid token format",
      status: "error",
    });

  const token = authorization.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({
      message: "Unauthorized access: Token not found",
      status: "error",
    });

  const decodeToken = JWT.verify(token, process.env.SECRET_KEY!);
  const user = await User.findById((decodeToken as UserDoc)._id);

  if (!user) {
    res
      .status(401)
      .json({ message: "Unauthorized access: User does not exist" });
  }

  req.user = user;

  if (req.user._id?.toString() === req.params?.id || req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied!" });
  }
};

export const authAdmin: RequestHandler = async (
  req: Request | any,
  res,
  next
) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer"))
    return res.status(401).json({
      message: "Unauthorized access: Invalid token format",
      status: "error",
    });

  const token = authorization.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({
      message: "Unauthorized access: Token not found",
      status: "error",
    });

  const decodeToken = JWT.verify(token, process.env.SECRET_KEY!);
  const user = await User.findById((decodeToken as UserDoc)._id);

  if (!user) {
    res
      .status(401)
      .json({ message: "Unauthorized access: User does not exist" });
  }

  req.user = user;

  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied!" });
  }
};

export const verifyUser: RequestHandler = async (
  req: Request | any,
  res,
  next
) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer"))
    return res.status(401).json({
      message: "Unauthorized access: Invalid token format",
      status: "error",
    });

  const token = authorization.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({
      message: "Unauthorized access: Token not found",
      status: "error",
    });

  const decodeToken = JWT.verify(token, process.env.SECRET_KEY!);
  const user = await User.findById((decodeToken as UserDoc)._id);

  if (!user) {
    res
      .status(401)
      .json({ message: "Unauthorized access: User does not exist" });
  }

  req.user = user;

  next();
};
