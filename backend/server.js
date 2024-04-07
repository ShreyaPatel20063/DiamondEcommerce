import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import dbconnect from "./database/dbconnect.js";


const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("/ root path");
  res.send("Home Page");
});

dbconnect();
app.listen(port, () => {
  console.log("connection successfully");
});
