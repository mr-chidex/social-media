import expressPromise from "express-promise-router";
import {
  deleteUser,
  followAUser,
  getUser,
  getUsers,
  unfollowAUser,
  updateUser,
} from "../controllers";
import { authUser, verifyUser } from "../middlewares";

const router = expressPromise();

router.route("/").get(verifyUser, getUsers).put(verifyUser, updateUser);
router.route("/follow").patch(verifyUser, followAUser);
router.route("/unfollow").patch(verifyUser, unfollowAUser);
router.route("/:id").get(verifyUser, getUser).delete(authUser, deleteUser);

export const usersRoute = router;
