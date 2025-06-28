import { generateToken } from "../lib/utils.js"
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signUp = async (req, res) => {
  const { fullName, email, password, bio } = req.body
  try{
    if(!fullName || !email || !password || !bio){
      return res.json({success: false, message: 'All fields are required'})
    }
    const alreadyExist = await User.findOne({email})
    if(alreadyExist){
      return res.json({success: false, message: 'User already exist'})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({fullName, email, password: hashedPassword, bio})
    await newUser.save()

    const token = await generateToken(newUser._id);

    return res.json({success: true, userData: newUser, token, message: 'User created successfully'})
  }catch(error){
    return res.json({success: false, message: error.message})
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try{
    if(!email || !password){
      return res.json({success: false, message: 'All fields are required'})
    }
    const userExist = await User.findOne({email})
    if(!userExist){
      return res.json({success: false, message: 'User does not exist'})
    }
    const isPasswordMatch = await bcrypt.compare(password, userExist.password)
    if(!isPasswordMatch){
      return res.json({success: false, message: 'Invalid credentials'})
    }
    const token = await generateToken(userExist._id);
    return res.json({success: true, userData: userExist, token, message: 'Login successful'})
  }catch(error){
    return res.json({success: false, message: error.message})
  }
}

export const checkAuth = (req, res) => {
  try{
    return res.json({success: true, user: req.user})
  }catch(error){
    return res.json({success: false, message: error.message})
  }
}

export const updateProfile = async (req, res) => {
  try{
    const { fullName, bio, profilePic } = req.body
    const userId = req.user._id
    const userExist = await User.findById(userId)
    if(!userExist){
      return res.json({success: false, message: 'User does not exist'})
    }
    if(!profilePic){
      userExist.fullName = fullName
      userExist.bio = bio
      await userExist.save()
    } else {
      const upload = await cloudinary.uploader.upload(profilePic)
      userExist.fullName = fullName
      userExist.bio = bio
      userExist.profilePic = upload.secure_url
      await userExist.save()
    }
    return res.json({success: true, userData: userExist, message: 'Profile updated successfully'})
  }catch(error){
    return res.json({success: false, message: error.message})
  }
}