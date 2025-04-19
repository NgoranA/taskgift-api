import express from "express"
import authMiddleware from "../middlewares/authmiddleware.js"
import tasksHandler from "../controllers/tasks-controller.js"

const router = express.Router()


router.get("/", authMiddleware, tasksHandler)

export default router
