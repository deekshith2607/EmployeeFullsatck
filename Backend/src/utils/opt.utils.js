import crypto from "crypto";
import redisDb from "../config/redis.config";
import bcrypt from "bcrypt";

const generate_otp = async (email) => {
    //crete otp
  const otp = crypto.randomInt(100000, 1000000).toString();

  //sets otp in redisDb
  const otphash = await bcrypt.hash(otp , 10)

  await redisDb.set(`otphash=${email}`,otphash,{EX: 300} );

  return otp;
};

const check_otp = () => {
  // check otp is valid or  not
};
