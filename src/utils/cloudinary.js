import { response } from "express";
import {v2 as cloudinary} from cloudinary;

import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary =async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        //uplode file on cloudinary
        cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file uploaded succesfull
        console.log("file is uploaded succesfull",response.url);

        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as upload operation got failed

        return null;

    }
}

export {uploadOnCloudinary}