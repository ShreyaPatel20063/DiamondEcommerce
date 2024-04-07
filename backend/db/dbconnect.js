import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import 'dotenv/config';

const dbconnect = async ()=>{
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
    console.log('MongoDB connected !! DB Host: ', connectionInstance.connection.host);
  } catch (error) {
    console.log('MongoDB connection FAILED : ', error);
    process.exit(1);
  }
}

export default dbconnect;



// export default function dbconnect(){
//   connect(`${process.env.DB_URL}/${DB_NAME}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("connected to DB..."))
//     .catch((err) => console.log(err));
// }
