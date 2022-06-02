import expressPromise from "express-promise-router";
import {
  deleteUser,
  followAUser,
  getUser,
  getUsers,
  unfollowAUser,
  updateUser,
} from "../controllers";
import { authAdmin, authUser } from "../middlewares";

const router = expressPromise();

router.route("/").get(authAdmin, getUsers);
router
  .route("/:id")
  .get(authUser, getUser)
  .put(authUser, updateUser)
  .delete(authUser, deleteUser);
router.route("/:id/follow").patch(authUser, followAUser);
router.route("/:id/unfollow").patch(authUser, unfollowAUser);

export const usersRoute = router;
