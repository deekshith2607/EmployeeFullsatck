import crypto from "crypto";
import redisDb from "../config/redis.config";
import bcrypt from "bcrypt";

export const generate_otp = async (email) => {
  //crete otp
  const otp = crypto.randomInt(100000, 1000000).toString();

  //sets otp in redisDb
  const otphash = await bcrypt.hash(otp, 10);

await redisDb.setEx(`otphash:${email}`, 300, otphash);
  return otp;
};

export const check_otp = async (otp, email) => {
  // check otp is valid or  not
  const storedOtp = await redisDb.get(`otphash=${email}`);

  if (!storedOtp) {
    return {
      success: false,
      message: "otp doesn't exists",
    };
  }

  const isOtpvalid = await bcrypt.compare(otp, storedOtp);

  if (!is) {
    return {
      success: false,
      message: "invalid otp",
    };
  }

  await redisDb.del(`otp:${email}`);

  return {
    success: true,
    message: "OTP verified successfully",
  };
};
