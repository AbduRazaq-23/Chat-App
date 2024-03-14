import { asyncHandler } from "../utils/asyncHander.js";
import { ApiError } from "../utils/AppiError.js";
import { ApiResponse } from "../utils/AppiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

// Token generating
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = user.generateToken();

    await user.save({ validateBeforeSave: false });

    return token;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong while generating token");
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
  const { email, password } = req.body;

  if (!(email, password)) {
    throw new ApiError(400, "Fill in the form with both email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user dosn't exist");
  }

  const isCorrect = await user.isPasswordCorrect(password);

  if (!isCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = await generateTokens(user._id);

  const logedIn = await User.findById(user._id).select("-password ");
  if (!logedIn) {
    throw new ApiError(404, "user not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).cookie("token", token, options).json(
    new ApiResponse(
      200,
      {
        logedIn,
        token,
      },
      "user logged in successfully"
    )
  );
});

export { registerUser, logInUser };
