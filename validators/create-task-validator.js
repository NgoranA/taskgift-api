import Joi from "joi";

const createTaskSchema = Joi.object({
  title: Joi.string().min(10).required(),
  description: Joi.string().optional(),
})

export const createTaskValidator = (req, res, next) => {
  const { error } = createTaskSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
