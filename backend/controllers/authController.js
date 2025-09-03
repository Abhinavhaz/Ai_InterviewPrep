const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// JWT token
const generateToken =(userID)=>{
return jwt.sign({id:userID},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
}


// post /api/auth/register
 const registerUser=async(req,res)=>{
    try {
        const {name,email,password ,profileImageUrl}=req.body;
        // Check if a user is already exists
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // Create a new User 
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl
        })

        res.status(201).json({
            _id :user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        })
        console.log("registered user",user)
    } catch (error) {
        res.status(500).json({message:"Internal Server Error register",error:error.message})
    }
}

// post /api/auth/login
const loginUser=async(req,res)=>{
try {
    const {email,password}=req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid email or password"})
    }
    res.status(200).json({
        _id :user._id,
        name:user.name,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        token:generateToken(user._id)
    })
    console.log("logged in ",user)
} catch (error) {
   res.status(500).json({message:"Internal Server Error loginUser",error:error.message}) 
}
}


// get /api/auth/profile
const getUserProfile=async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password")
        
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        res.status(200).json(user)
        
    } catch (error) {
   res.status(500).json({message:"Internal Server Error profile",error:error.message}) 
        
    }
}

module.exports={registerUser,loginUser,getUserProfile}