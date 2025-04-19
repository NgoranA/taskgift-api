import express from 'express';
import authMiddleware from '../middlewares/authmiddleware.js';
const router = express.Router();

/* GET users listing. */
router.get('/', authMiddleware, function (req, res, next) {
  console.log(req.user)
  res.send('respond with a resource')
});

export default router;
