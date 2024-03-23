import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHander.js";
import { ApiError } from "../utils/AppiError.js";

const authorized = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      req.user = await User.findById(decoded._id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new ApiError(401, "Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new ApiError(401, "Not authorized, no token");
  }
});

export { authorized };
