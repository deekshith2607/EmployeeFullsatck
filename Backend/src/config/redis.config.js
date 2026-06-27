import { createClient } from "redis";

const redisDb = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
  },
});


redisDb.on("error", (err) => {
  console.error("Redis runtime error:", err);
});



export const connectRedis = async () => {
  try {
    await redisDb.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis failed to connect:", err);
    process.exit(1);
  }
};


export default redisDb;