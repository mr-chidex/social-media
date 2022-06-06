import expressPromise from "express-promise-router";
import {
  deleteUser,
  followAUser,
  getUser,
  getUsers,
  unfollowAUser,
  updateUser,
} from "../controllers";
import { authUser, verifyUser, uploads } from "../middlewares";

const router = expressPromise();

router
  .route("/")
  .get(verifyUser, getUsers)
  .put(
    verifyUser,
    uploads.fields([
      { name: "profilePic", maxCount: 1 },
      { name: "coverPic", maxCount: 1 },
    ]),
    updateUser
  );
router.route("/follow").patch(verifyUser, followAUser);
router.route("/unfollow").patch(verifyUser, unfollowAUser);
router.route("/:id").get(verifyUser, getUser).delete(authUser, deleteUser);

export const usersRoute = router;
