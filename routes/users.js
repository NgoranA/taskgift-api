import express from 'express';
import authMiddleware from '../middlewares/authmiddleware.js';
import { upload } from '../utils/multer.js';
import { uploadProfileImage } from '../controllers/users-controller.js';
const router = express.Router();

/* GET users listing. */
router.patch('/upload-profile', authMiddleware, upload.single("profile-image"), uploadProfileImage);

export default router;
