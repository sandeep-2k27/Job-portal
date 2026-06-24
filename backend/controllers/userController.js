import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// REGISTER
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already registered", 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  sendToken(user, 201, res, "User Registered Successfully");
});

// LOGIN
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Role mismatch", 400));
  }

  sendToken(user, 200, res, "Login successful");
});

// LOGOUT
export const logout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// GET USER
export const getUser = catchAsyncErrors(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});