import express from 'express';
import authMiddleware from '../middlewares/authmiddleware.js';
import { upload } from '../utils/multer.js';
import { uploadProfileImage } from '../controllers/users-controller.js';
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile information and management
 */


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     description: Retrieves the profile information for the currently authenticated user (based on JWT).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Current user data }
 *                 user: { $ref: '#/components/schemas/User' } # Reusing the User schema
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/me", authMiddleware, (req, res, next) => {
  logger.info('Fetching current user data for:', req.user);
  return res.json({ user: req.user })
})

/**
 * @swagger
 * /users/me/profile-image:
 *   patch:
 *     summary: Upload or update profile image
 *     tags: [Users]
 *     description: Uploads a profile image for the authenticated user. Replaces existing image if one exists.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage: # Must match the name used in upload.single()
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (jpg, png, gif allowed, max 5MB).
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Profile image uploaded successfully! }
 *                 user: { $ref: '#/components/schemas/User' } # Shows updated user with profileImageUrl
 *       400:
 *         description: No file provided or invalid file type/size.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during upload or database update.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.patch('/me/upload-profile', authMiddleware, upload.single("profile-image"), uploadProfileImage);

export default router;
