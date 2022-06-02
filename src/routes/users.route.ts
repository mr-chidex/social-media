import expressPromise from "express-promise-router";
import { signIn, signupUser } from "../controllers/auth.controller";

const router = expressPromise();

router.route("/signup").post(signupUser);
router.route("/signin").post(signIn);

export default router;
