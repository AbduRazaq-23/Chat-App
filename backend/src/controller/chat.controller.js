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

  const messageReceiver = await User.findById(userId);
  if (!messageReceiver) {
    throw new ApiError(404, "not found");
  }

  if (isChat.length > 0) {
    throw new ApiResponse(isChat[0]);
  } else {
    var chatData = {
      chatName: messageReceiver.name,
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
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).send(new ApiResponse(200, results));
      });
  } catch (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }
});

//---------------------------------------------------------------------

const creatGroutChat = asyncHandler(async (req, res) => {
  const { user, name } = req.body;
  if (!user || !name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.user);

  if (users.length < 2) {
    return res
      .status(400)
      .send(
        new ApiResponse(
          400,
          "More than 2 users are required to form a group chat"
        )
      );
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(new ApiResponse(200, fullGroupChat));
  } catch (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }
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
