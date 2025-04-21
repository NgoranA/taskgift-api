import Joi from "joi";


const createTaskSchema = Joi.object({
  title: Joi.string().min(10).required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().optional()
})

export const createTaskValidator = (req, res, next) => {
  const { error } = createTaskSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}


const taskIdSchema = Joi.object({
  id: Joi.string().required()
})

export const readTaskIdValidator = (req, res, next) => {
  const { error } = taskIdSchema.validate(req.params)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
