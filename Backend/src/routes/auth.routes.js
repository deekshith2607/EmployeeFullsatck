import express from "express"
import { loginWitEmailPassword, verifyOtp } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/loginWitEmailPassword',loginWitEmailPassword)
authRouter.post('/verify-otp',verifyOtp)
//refresh

//logout




export default authRouter