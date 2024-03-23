import { asyncHandler } from "../utils/asyncHander.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { ApiError } from "../utils/AppiError.js";
import { ApiResponse } from "../utils/AppiResponse.js";

//---------------------------------------------------------------------

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "please login first");
  }
  console.log(req.user._id);
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    throw new ApiResponse(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, fullChat, "chat has been created successfully")
      );
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

//---------------------------------------------------------------------

const fetchChat = asyncHandler(async (req, res) => {
  console.log("Hi i am working");
});

//---------------------------------------------------------------------

const creatGroutChat = asyncHandler(async (req, res) => {
  console.log("I am working from createGroupChat");
});

//---------------------------------------------------------------------

const removeFromGroup = asyncHandler(async (req, res) => {
  console.log("I am working from removeFromGroup");
});

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
