import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import { cloudinary } from "../utils/cloudinary.js";

export const uploadProfileImage = async (req, res, next) => {
  const userId = req.user.id; // User ID from auth middleware

  // Check if a file was uploaded by Multer
  if (!req.file) {
    logger.warn(`Profile image upload attempt failed: No file provided for user ${userId}.`);
    return res.status(400).json({ message: 'No image file provided.' });
  }

  if (!req.file) {
    // This could happen if no file was sent, or if fileFilter rejected silently.
    // It's often better practice for fileFilter to throw an error on rejection.
    return res.status(400).json({ message: 'No file uploaded or file type rejected.' });
  }

  logger.info('Middleware successful. File validated:', req.file.originalname);
  logger.info('Buffer available:', req.file.buffer instanceof Buffer);

  const uploadResult = await new Promise((resolve) => {
    cloudinary.uploader.upload_stream((error, uploadResult) => {
      return resolve(uploadResult);
    }).end(req.file.buffer);
  });


  // it is worth noting that you can use the public_id for deletion
  // it is also important to note that, often, when you want to delete a user, you should endeavor to make sure that you remove the user's profile from your cloud service.
  logger.info(`Received profile image upload for user ${userId}. Cloudinary URL: ${uploadResult.url}, Public ID: ${uploadResult.public_id}`);


  try {
    // Update the user's profile_image_url in the database
    const sql = `
            UPDATE users
            SET profile_image_url = $1
            WHERE id = $2
            RETURNING id, email, first_name, last_name, profile_image_url;
        `;
    const result = await query(sql, [uploadResult.url, userId]);

    if (result.rows.length === 0) {
      // This shouldn't happen if the user is authenticated, but handle defensively
      logger.error(`Failed to update profile image URL in DB for user ${userId} (User not found?).`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = result.rows[0];
    logger.info(`Profile image URL updated successfully in DB for user ${userId}.`);

    // Respond with the updated user info (excluding sensitive data)
    res.json({
      message: 'Profile image uploaded successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        profileImageUrl: updatedUser.profile_image_url
      }
    });

  } catch (error) {
    logger.error(`Error updating profile image URL in DB for user ${userId}:`, error);
    // Optional: Attempt to delete the uploaded image from Cloudinary if DB update fails
    // try {
    //     await cloudinary.uploader.destroy(publicId);
    //     logger.info(`Orphaned Cloudinary image deleted: ${publicId}`);
    // } catch (deleteError) {
    //     logger.error(`Failed to delete orphaned Cloudinary image ${publicId}:`, deleteError);
    // }
    res.status(500).json({ message: 'Server error while updating profile image.' });
  }
}
