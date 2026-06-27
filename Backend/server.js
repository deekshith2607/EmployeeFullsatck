import app from "./src/app.js";
import { config } from "dotenv";
import connectDb from "./src/config/db.config.js";
import dns from "node:dns"
import { connectRedis } from "./src/config/redis.config.js";
dns.setServers(["1.1.1.1" , "1.0.0.1"])
connectDb()
config()
connectRedis()
app.listen(3000, ()=>{

    console.log("Server has started....")


})