import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import { authRoutes, usersRoute } from "./routes";
import { postsRoute } from "./routes/posts.route";

const app: Application = express();
dotenv.config();
const apiVersion = process.env.API_VERSION || "v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use(`/api/${apiVersion}`, authRoutes);
app.use(`/api/${apiVersion}/users`, usersRoute);
app.use(`/api/${apiVersion}/posts`, postsRoute);

// error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    return res
      .status(500)
      .json({ message: err.message, error: true, stack: err.stack });
  }
  res.status(500).json({ message: err.message, error: true });
});

export default app;
