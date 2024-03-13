const express = require("express");
const mongoose = require("./dbconnect");
const app = express();

app.get("/", (req, res) => {
  console.log("/ root path");
  res.send("Home Page");
});

app.listen(3000);
