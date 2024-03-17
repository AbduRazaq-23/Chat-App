import { asyncHandler } from "../utils/asyncHander.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";

//---------------------------------------------------------------------

const accessChat = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

const fetchChat = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

const creatGroutChat = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

const removeFromGroup = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

const addToGroup = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

const renameGroup = asyncHandler(async (req, res) => {});

//---------------------------------------------------------------------

export {
  accessChat,
  fetchChat,
  creatGroutChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
};
