const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/diamondEcommerce";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected to DB...");
});

module.exports = mongoose;