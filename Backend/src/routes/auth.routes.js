import express from "express"
import { loginWitEmailPassword } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/loginWitEmailPassword',loginWitEmailPassword)


export default authRouter