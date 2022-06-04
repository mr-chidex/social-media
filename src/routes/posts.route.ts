import expressPromise from "express-promise-router";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getTimelinePosts,
  likePost,
  updatePost,
} from "../controllers";
import { verifyUser } from "../middlewares";

const router = expressPromise();

router.route("/").post(verifyUser, createPost).get(getPosts);
router.route("/timeline").get(verifyUser, getTimelinePosts);
router
  .route("/:postId")
  .get(verifyUser, getPost)
  .delete(verifyUser, deletePost)
  .put(verifyUser, updatePost);
router.route("/:postId/like").patch(verifyUser, likePost);
export const postsRoute = router;