import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  logInUser,
  registerUser,
  humUser,
} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/logIn").post(logInUser);

router.post("/hum", humUser);

export default router;
