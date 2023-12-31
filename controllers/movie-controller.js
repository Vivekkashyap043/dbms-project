import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Movie from "../models/Movie.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

export const addMovie = async (req, res, next) =>{
    const extractToken = req.headers.authorization.split(" ")[1];
    console.log(extractToken);
    if(!extractToken && extractToken.trim()===""){
        return res.status(404).json({message: "Token not found"})
    }
    
    let adminId;
    // verify token
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
    // create new movie
    const {title, description, actors, releaseDate, posterUrl, featured,} = req.body;
    if(!title && title.trim()=="" && !description && description.trim()==""  && !posterUrl && posterUrl.trim()==""){
        return res.status(402).json({message:"Invalid inputs"});
    }

    let movie;
    try{
        movie = new Movie({title, description, releaseDate: new Date(`${releaseDate}`), posterUrl, featured, actors, admin: adminId});
        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({session});
        adminUser.addedMovies.push(movie);
        await adminUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log("error occured");
        return console.log(err);
    }
    if(!movie){
        return res.status(500).json({message:"Request Failed"});
    }
    return res.status(201).json({movie})
}

// get all movies

export const getAllMovies = async (req, res, next) =>{
    let movies;
    try{
        movies = await Movie.find();
    }catch(err){
        return console.log(err);
    }
    if(!movies){
        return res.sta(500).json({message: 'request failed'});
    }
    return res.status(200).json({movies});
}

//get movie by id
export const getMovieById = async (req, res, next) =>{
    const id = req.params.id;
    let movie;
    try{
        movie = await Movie.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!movie){
        return res.status(404).json({message:"Invalid movie id"});
    }
    return res.status(200).json({movie});
}