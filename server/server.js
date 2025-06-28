import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import { Server } from 'socket.io'

import userRouter from './routes/user.js'
import messageRouter from './routes/message.js'

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: { origin: '*' } 
})
export const userSocketMap = {}
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  if(userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.send("Server is running")
})
app.use("/user", userRouter)
app.use("/message", messageRouter)

await connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})