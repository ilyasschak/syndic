import mongoose from "mongoose";
import { config } from "dotenv";
config();

const dbUri = process.env.DATABASE_URL

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(dbUri);
        console.log(`mongodb connected at : ${conn.connection.host}`);
    }catch(e){
        console.error(e);
        process.exit(1);
    }
}

export {connectDb};