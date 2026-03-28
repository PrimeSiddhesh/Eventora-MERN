const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect, admin } = require('../middleware/auth');

// POST /api/upload
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path // Cloudinary returns the remote URL in req.file.path
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
