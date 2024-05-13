import dotenv from "dotenv";
import { app } from "./app.js";
import dbconnect from "./db/dbconnect.js";
dotenv.config({
    path: "./.env",
});
const port = process.env.PORT || 3000;

dbconnect()
    .then(() => {
        app.listen(port, () => {
            console.log("server running successfully on port ", port);
        });
    })
    .catch((err) => {
        console.log("server failed to start due to ", err);
    });
