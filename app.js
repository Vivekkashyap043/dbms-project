import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from "./routes/user-routes.js";
import adminRouter from './routes/admin-routes.js'
import movieRouter from "./routes/movie-routes.js";

dotenv.config();
const app = express();

//middlewares
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);


mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.xg8onxn.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(()=>
        app.listen(5000, () => 
            console.log("connected to database and server successfully")
        )
    )
    .catch((e)=> console.log(e));
