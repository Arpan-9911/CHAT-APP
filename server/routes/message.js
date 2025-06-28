import express from 'express'
import { protectRoute } from '../middleware/auth.js'
import { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage } from '../controllers/message.js'

const router = express.Router()

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)
router.put("/mark/:id", protectRoute, markMessageAsSeen)
router.post("/send/:id", protectRoute, sendMessage)

export default router