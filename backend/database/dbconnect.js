import { connect } from "mongoose";
import 'dotenv/config';

export default function dbconnect(){
  connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to DB..."))
    .catch((err) => console.log(err));
}
