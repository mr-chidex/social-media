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
import { uploads, verifyUser } from "../middlewares";

const router = expressPromise();

router
  .route("/")
  .post(verifyUser, uploads.single("image"), createPost)
  .get(getPosts);
router.route("/timeline").get(verifyUser, getTimelinePosts);
router
  .route("/:postId")
  .get(getPost)
  .delete(verifyUser, deletePost)
  .put(verifyUser, uploads.single("image"), updatePost);
router.route("/:postId/like").patch(verifyUser, likePost);
export const postsRoute = router;
