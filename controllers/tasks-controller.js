import { query } from "../config/db.js";
import logger from "../utils/logger.js";

export async function getAllTasks(req, res, nex) {
  const userId = req.user.id
  try {
    const fetchTasksQuery = `SELECT description, title, created_at, updated_at, due_date FROM tasks 
                              WHERE owner_id = $1 ORDER BY created_at DESC
                            `
    const result = await query(fetchTasksQuery, [userId])
    logger.debug(`Fetched ${result.rows.length} tasks for user : ${userId}`)
    return res.status(200).json(result.rows)
  } catch (error) {
    logger.error(`Error fetching tasks for user ${userId} : `, error)
    return res.status(error.status || 500).json({ message: error.message || "Server error while fetching the tasks" })
  }
}

export async function createTaskHandler(req, res, next) {
  const { title, description } = req.body
  const userId = req.user.id
  const due_date = new Date()
  try {
    const insertTaskQuery = `
      INSERT INTO tasks (owner_id, title, description, due_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await query(insertTaskQuery, [userId, title, description, due_date])
    const newTask = result.rows[0]
    logger.info(`Task created Successfully by the user ${userId} : ${newTask.id}`)
    return res.status(201).json(newTask)
  } catch (error) {
    logger.error(`Error creating task for user ${userId} : `, error)
    return res.status(error.status || 500).json({ message: error.message || "Server error while creating the task" })
  }
}
