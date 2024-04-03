const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("./database/dbconnect");
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("/ root path");
  res.send("Home Page");
});

db.connect();
app.listen(process.env.PORT, () => {
  console.log("connection successfully");
});
