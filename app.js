import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

import router from "./src/router.js";

dotenv.config()

const port = process.env.PORT || 5001;

const app = express();

mongoose.connect(
    "mongodb://127.0.0.1:27017/testing",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(res => {
    console.log( "Conection succesfully made" )
}).catch(res => {
    console.log( "Conection failed", res )
})

app.use(express.json())
app.use(cors())
app.use("/", router)

app.listen(port, () => { console.log(`Server running in port ${port}`) })