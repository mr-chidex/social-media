import expressPromise from "express-promise-router";
import {
  deleteUser,
  followAUser,
  getUser,
  getUsers,
  unfollowAUser,
  updateUser,
} from "../controllers";

const router = expressPromise();

router.route("/").get(getUsers);
router.route("/follow").patch(followAUser);
router.route("/unfollow").patch(unfollowAUser);
router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

export const usersRoute = router;
