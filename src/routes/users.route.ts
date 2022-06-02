import expressPromise from "express-promise-router";
import { signupUser } from "../controllers/auth.controller";

const router = expressPromise();

router.route("/signup").post(signupUser);

export default router;
