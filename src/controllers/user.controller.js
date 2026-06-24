import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import { ApiResponse } from "../utils/ApiResponce.js";


const registerUser = asyncHandler(async (req,res)=>{

    // get user details from frontend
    const {fullname, email,username,password }=req.body
    console.log("email: ",email);

    //validation -not empty

    // if(fullname===""){
    //     throw new ApiError(400, "fullname is required")     //if we want to validate indivallly
    // }
    if(
        [fullname,email,username,password].some((field)=>field?.trim() ==="")
        ){                                                                                  //multiple at once
            throw new ApiError(400,"All field are required")

        }

        //check if user already exist : by username , email
        const existedUser =User.findOne({
            $or:[{ username },{ email }]
        })
        if(existedUser){
            throw new ApiError(409,"User with email or username already exists ")
        }
        const  avatarLocalPath =req.files?.avatar[0]?.path;

        const coverImageLocalPath=req.files?.coverImage[0]?.path;
  //chck for image .check for avtar


        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is required")
        }

         //uplode them to cloudinary, avtar

      const avatar=  await uploadOnCloudinary(avatarLocalPath);
    const coverImage =  await uploadOnCloudinary(coverImageLocalPath)
      
     if(!avatar){
            throw new ApiError(400, "Avatar file is required")
        }
         //create user objects - create entry in db

         const user=await User.create({
            fullname,
            avatar:avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username:username.toLowerCase()
        })
         //remove password and refresh token field from responce
        const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
        )
          //check user creation
        if(!createdUser){
            throw new ApiError(500, "Something went wrong while registering the user")
        }
           //return res

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered succesfully")
        )



   } )

    
  
   
   
   
   
 


  

export {registerUser}