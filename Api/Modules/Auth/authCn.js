import { catchAsync, HandleERROR } from "vanta-api";
import { sendAuthCode, verifyCode } from "../../Utils/smsHandler.js";
import User from "../User/userMd.js";
import jwt from "jsonwebtoken";
import Cart from "../Cart/cartMd.js";
import bcrypt from "bcryptjs";

export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user || !user?.password) {
    const smsResult = await sendAuthCode(phoneNumber);
    if (!smsResult.success) {
      return next(new HandleERROR(smsResult.message, 500));
    }
  }
  return res.status(200).json({
    success: true,
    message:
      !user || !user?.password
        ? "code sent successfully"
        : "Login With Password",
    data: {
      userExist: !!user,
      passwordExist: !!user?.password,
    },
  });
});
export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return next(
      new HandleERROR("Please provide phone number and password", 400),
    );
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new HandleERROR("Invalid password", 401));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_JWT,
    { expiresIn: "7d" },
  );
  const finalUser = await User.findById(user._id).select("-password");
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: finalUser,
      token: token,
    },
  });
});
export const loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  if (!phoneNumber || !code) {
    return next(new HandleERROR("Please provide phone number and code", 400));
  }
  const resultSms = await verifyCode(phoneNumber, code);
  if (!resultSms.success) {
    return next(new HandleERROR("incorrect otp code", 400));
  }
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({ phoneNumber, role: "user" });
    const cart = await Cart.create({ userId: user._id });
    user.cartId = cart._id;
    await user.save();
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_JWT,
    { expiresIn: "7d" },
  );
  const finalUser = await User.findById(user._id).select("-password");
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: finalUser,
      token: token,
    },
  });
});
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const smsResult = await sendAuthCode(phoneNumber);
  if (!smsResult.success) {
    return next(new HandleERROR(smsResult.message, 500));
  }
  return res.status(200).json({
    success: true,
    message: "code sent successfully",
  });
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, newPassword, code } = req.body;
  if (!phoneNumber || !newPassword || !code) {
    return next(
      new HandleERROR("Please provide phone number and password", 400),
    );
  }
  const passReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!passReg.test(newPassword)) {
    return next(new HandleERROR("invalid New Password", 400));
  }
  const resultSms = await verifyCode(phoneNumber, code);
  if (!resultSms.success) {
    return next(new HandleERROR("incorrect otp code", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }

  const hashPassword = bcrypt.hashSync(newPassword, 10);
  user.password = hashPassword;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "password changed successfully",
  });
});
