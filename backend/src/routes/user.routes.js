import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import registerUser from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

export default router;
