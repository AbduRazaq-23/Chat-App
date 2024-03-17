import express from "express";

import {
  accessChat,
  fetchChat,
  creatGroutChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} from "../controller/chat.controller.js";

import { authorized } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/accessChat").post(authorized, accessChat);
router.route("/fetchChat").get(authorized, fetchChat);
router.route("/createGroupChat").post(authorized, creatGroutChat);
router.route("/removeFromGroup").post(authorized, removeFromGroup);
router.route("/addToGroup").put(authorized, addToGroup);
router.route("/renameGroup").put(authorized, renameGroup);

export default router;
