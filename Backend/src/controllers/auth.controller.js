import User from "../models/userModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import { check_otp, generate_otp } from "../utils/opt.utils.js";
import { generateOTPEmail, sendEmail } from "../utils/email.utils.js";
import redisDb from "../config/redis.config.js";


const loginWitEmailPassword =async (req ,res)=>{
try{
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({email: email})

    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "password is invaild"
        })
    }
    //Generate otp

    const otp = generate_otp(email)

    //send opt

   const result = await sendEmail(
        email,
        'Otp for varification',
        'use this otp to verify ',
        generateOTPEmail(otp)
    )

    // check if the email is sent or not
   if (!result.success) {
    return res.status(500).json({
        message: result.error
    });
}

 await redisDb.setEx(`login ${email}`,600,
    JSON.stringify({
        userId: user._id,
        email: user.email,
        role: user.role
    })
    
)
    res.status(200).json({
        message : "email password verified",
       
    })



}
catch(err){
    res.staus(400).json({
        message:"Auth failed",
        error: err.message
    })
}
    
    
}
const verifyOtp = async( req,res)=>{

    const userOtp = req.body.otp
    const email = req.body.email

    const loginsession = await redisDb.get(`login:${email}`)

    if(!loginsession){
        return res.status(400).json({
            message: "login session expired"
        })
    }

    const storedotp = await redisDb.get(`otphash:${email}`)

    if(!storedotp){
        return res.status(400).json({
            meaasge :" otp expired"
        })
    }

   const result = await bcrypt.compare(otp,storedotp)

   if(!result){
    return res.status(400).json({
        message:"invaild otp"
    })
   }

   // create refresh and access token 
   
   //store refresh in cookie

   // create a session 

   //give access token in response 

}

export {loginWitEmailPassword,verifyOtp}