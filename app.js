import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";

import router from "./src/router.js";

dotenv.config()

const port = process.env.PORT || 5000;

const app = express();

mongoose.connect(
    process.env.MONGODB_URI,
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