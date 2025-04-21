import express from "express"
import authMiddleware from "../middlewares/authmiddleware.js"
import { createTaskHandler } from "../controllers/tasks-controller.js"
import { createTaskValidator } from "../validators/create-task-validator.js"

const router = express.Router()


// router.get("/", authMiddleware, tasksHandler)

router.post("/create-task", createTaskValidator, authMiddleware, createTaskHandler)

export default router
