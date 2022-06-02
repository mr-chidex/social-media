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
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/follow").patch(followAUser);
router.route("/:id/unfollow").patch(unfollowAUser);

export const usersRoute = router;
