import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not logged in", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});