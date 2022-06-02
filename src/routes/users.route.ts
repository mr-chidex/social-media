import expressPromise from "express-promise-router";
import {
  deleteUser,
  followAUser,
  getUser,
  getUsers,
  unfollowAUser,
  updateUser,
} from "../controllers";
import { authUser } from "../middlewares";

const router = expressPromise();

router.route("/").get(getUsers);
router
  .route("/:id")
  .get(authUser, getUser)
  .put(authUser, updateUser)
  .delete(authUser, deleteUser);
router.route("/:id/follow").patch(authUser, followAUser);
router.route("/:id/unfollow").patch(authUser, unfollowAUser);

export const usersRoute = router;
