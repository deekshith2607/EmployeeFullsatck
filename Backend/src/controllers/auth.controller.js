import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { check_otp, generate_otp } from "../utils/opt.utils.js";
import { generateOTPEmail, sendEmail } from "../utils/email.utils.js";
import redisDb from "../config/redis.config.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth.utils.js";

const loginWitEmailPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "password is invaild",
      });
    }
    //Generate otp

    const otp = generate_otp(email);

    //send opt

    const result = await sendEmail(
      email,
      "Otp for varification",
      "use this otp to verify ",
      generateOTPEmail(otp),
    );

    // check if the email is sent or not
    if (!result.success) {
      return res.status(500).json({
        message: result.error,
      });
    }
//set login session
    await redisDb.setEx(
      `login ${email}`,
      600,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        role: user.role,
      }),
    );

    res.status(200).json({
      email: email,
      message: "email password verified",
    });
  } catch (err) {
    res.staus(400).json({
      message: "Auth failed",
      error: err.message,
    });
  }
};

// verifing otp
const verifyOtp = async (req, res) => {
  try {
    const userOtp = req.body.otp;
    const email = req.body.email;

    const loginsession = await redisDb.get(`login:${email}`);

    if (!loginsession) {
      return res.status(400).json({
        message: "login session expired",
      });
    }

    const user = JSON.parse(loginsession);

    const storedotp = await redisDb.get(`otphash:${email}`);

    if (!storedotp) {
      return res.status(400).json({
        meaasge: " otp expired",
      });
    }

    const result = await bcrypt.compare(userOtp, storedotp);

    if (!result) {
      return res.status(400).json({
        message: "invaild otp",
      });
    }

    // create refresh and access token
    const refreshToken = await generateRefreshToken();

    const accessToken = await generateAccessToken();
    //store refresh in cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // create a session
    await redisDb.setEx(
      `refresh:${user.userId}`,
      7 * 24 * 60 * 60,
      refreshToken,
    );
    //give access token in response
    res.status(200).json({
      message: "Login successfull",
      accessToken: accessToken,
    });
  } catch (err) {
    res.status(400).json({
      message: "Login Failed",
      error: err,
    });
  }
};

export { loginWitEmailPassword, verifyOtp };
