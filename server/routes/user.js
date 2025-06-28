import express from 'express'
import { protectRoute } from '../middleware/auth.js'
import { checkAuth, login, signUp, updateProfile } from '../controllers/user.js'


const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.put("/update-profile", protectRoute, updateProfile)
router.get("/check", protectRoute, checkAuth)

export default router