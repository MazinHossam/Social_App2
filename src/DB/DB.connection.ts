import { connect } from "mongoose"
import { DB_URI } from "../config/config"

const connectDB=async()=>{
    try{
   await connect(DB_URI,{serverSelectionTimeoutMS:30000})
   console.log(`DB connected successfly `)
    }catch(error){
        console.log(error)
    }
}

export default connectDB