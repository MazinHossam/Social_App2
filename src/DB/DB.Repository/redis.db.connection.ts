import { createClient } from "redis";
import { REDIS_URI } from "../../config/config";

export const readisClient =createClient({
    url:REDIS_URI
})
export const connectRedies=async()=>{
    try{
await readisClient.connect()
console.log("Connected to Redis");
    }catch{
console.error("Error connecting to Redis");
    }
}