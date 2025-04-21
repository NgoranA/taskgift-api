import express from "express"
import authMiddleware from "../middlewares/authmiddleware.js"
import { createTaskHandler, getAllTasks, } from "../controllers/tasks-controller.js"
import { createTaskValidator } from "../validators/create-task-validator.js"

const router = express.Router()


router.get("/", authMiddleware, getAllTasks)

router.post("/create-task", createTaskValidator, authMiddleware, createTaskHandler)

export default router
