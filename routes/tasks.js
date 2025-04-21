import express from "express"
import authMiddleware from "../middlewares/authmiddleware.js"
import { createTaskHandler, getAllTasks, getTaskById, updateTask, } from "../controllers/tasks-controller.js"
import { createTaskValidator, readTaskIdValidator } from "../validators/create-task-validator.js"

const router = express.Router()

router.post("/create-task", createTaskValidator, authMiddleware, createTaskHandler)

router.get("/", authMiddleware, getAllTasks)

router.get("/:id", readTaskIdValidator, authMiddleware, getTaskById)

router.put("/:id/update-task", readTaskIdValidator, createTaskValidator, authMiddleware, updateTask)

export default router
