import { asyncHandler } from "../utils/asyncHander.js";
import { ApiError } from "../utils/AppiError.js";
import { ApiResponse } from "../utils/AppiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

// Token generating
const generateAcessToken = async (userId) => {
  try {
    const user = User.findById(userId);

    const token = user.generateToken();

    await user.save({ validateBeforeSave: false });

    return token;
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating token");
  }
};
//--------------------------------------------------------------------------------------

// user register controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    throw new ApiError(400, "all fields are empty");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = await req.file?.path;

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
// -----------------------------------------------------------------------------------------

// user login controller
const logInUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!(email, password)) {
    throw new ApiError(400, "Fill in the form with both email and password");
  }

  const user = User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user dosn't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }
  const token = await generateAcessToken(user._id);

  const logedIn = await findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedIn,
          token,
        },
        "user logged in successfully"
      )
    );
});

const humUser = asyncHandler(async (req, res) => {
  const Name = req.body;
  console.log(Name, req.body);
});

export { registerUser, logInUser, humUser };
