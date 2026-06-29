import User from "../models/userModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import { check_otp, generate_otp } from "../utils/opt.utils.js";


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

    const userOtp =ddd;


    
    //check otp

    const isvalidOtp = check_otp(userOtp,email)

    //give access

    res.status(200).json({
        message : "auth successfull",
        role: user.role
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

}

export {loginWitEmailPassword,verifyOtp}