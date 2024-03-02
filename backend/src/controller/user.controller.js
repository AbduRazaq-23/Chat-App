import { asyncHandler } from "../utils/asyncHander.js";
import { ApiError } from "../utils/AppiError.js";
import { ApiResponse } from "../utils/AppiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    throw new ApiError(400, "all fields are empty");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }
  console.log(req.file);
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatars = await cloudinaryUpload(avatarLocalPath);
  if (!avatars) {
    throw new ApiError(400, "avatar has not uploaded to cloudinary");
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: avatars.url,
  });

  const createdUser = await User.findById(user._id).select("-password ");
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered succesfully"));
});

export default registerUser;
