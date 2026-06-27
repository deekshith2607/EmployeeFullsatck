import { config } from "dotenv";
import mongoose from "mongoose";
config()
const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected")
    }
    catch(err){
        console.log("cant connect db ",err)
    }
    
}
export default connectDb