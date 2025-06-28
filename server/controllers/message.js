import Message from '../models/message.js'
import User from '../models/user.js'
import cloudinary from '../lib/cloudinary.js'
import { io, userSocketMap } from '../server.js'

export const getUsersForSidebar = async (req, res) => {
  try{
    const userId = req.user._id
    const users = await User.find({ _id: { $ne: userId } }).select('-password')
    const unseenMessages = {}
    const promises = users.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false
      })
      if(message.length > 0){
        unseenMessages[user._id] = message.length
      }
    })
    await Promise.all(promises)
    return res.json({success: true, users, unseenMessages})
  }catch{
    return res.json({success: false, message: error.message})
  }
}

export const getMessages = async (req, res) => {
  try{
    const { id: selectedUserId } = req.params
    const myId = req.user._id

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: selectedUserId},
        {senderId: selectedUserId, receiverId: myId}
      ]
    })
    await Message.updateMany({
      senderId: selectedUserId,
      receiverId: myId
    }, {seen: true})
    return res.json({success: true, messages})
  }catch{
    return res.json({success: false, message: error.message})
  }
}

export const markMessageAsSeen = async (req, res) => {
  try{
    const { id: messageId } = req.params
    const message = await Message.findByIdAndUpdate(messageId, {seen: true})
    return res.json({success: true})
  }catch{
    return res.json({success: false, message: error.message})
  }
}

export const sendMessage = async (req, res) => {
  try{
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id
    
    let messageData;
    if(image){
      const upload = await cloudinary.uploader.upload(image)
      messageData = await Message.create({senderId, receiverId, text, image: upload.secure_url})
    } else {
      messageData = await Message.create({senderId, receiverId, text})
    }

    // Emit new message
    const receiverSocketId = userSocketMap[receiverId]
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage', messageData)
    }

    return res.json({success: true, message: messageData})
  }catch (error) {
    return res.json({success: false, message: error.message})
  }
}