import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Movie from "../models/Movie.js";

dotenv.config();

export const addMovie = async (req, res, next) =>{
    const extractToken = req.headers.authorization.split(" ")[1];
    console.log(extractToken);
    if(!extractToken && extractToken.trim()===""){
        return res.status(404).json({message: "Token not found"})
    }
    
    let adminId;

    jwt.verify(extractToken, process.env.SECRET_KEY, (err, decrypted)=>{
        if(err){
            console.log("verification failed");
            return res.status(400).json({message:`${err.message}`});
        }else{
            adminId = decrypted.id;
            console.log("verified");
            return;
        }
    });

    const {title, description, actors, releaseDate, posterUrl, featured,} = req.body;
    if(!title && title.trim()=="" && !description && description.trim()==""  && !posterUrl && posterUrl.trim()==""){
        return res.status(402).json({message:"Invalid inputs"});
    }

    let movie;
    try{
        movie = new Movie({title, description, releaseDate: new Date(`${releaseDate}`), posterUrl, featured, actors, admin: adminId})
        movie = await movie.save();
    }catch(err){
        console.log("error occured");
        return console.log(err);
    }
    if(!movie){
        return res.status(500).json({message:"Request Failed"});
    }
    return res.status(201).json({movie})
}