const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '/uploads/profile_pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the uploads directory
router.use('/uploads/profile_pictures', express.static(uploadDir));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with unique name
  }
});

const upload = multer({ storage });

// POST endpoint for profile picture upload
router.post('/upload-profile-picture', upload.single('profile_picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate the file path for storing locally
  const filePath = `/uploads/profile_pictures/${req.file.filename}`;

  // Send the file path to the frontend to save it in localStorage
  res.status(200).json({
    message: 'Profile picture uploaded successfully!',
    profilePicture: filePath
  });
});

// GET endpoint for fetching profile pictures
router.get('/get-profile-picture/:filePath', (req, res) => {
  const { filePath } = req.params;

  // Construct full file path
  const fullPath = path.join(__dirname, '/uploads/profile_pictures', filePath);
  if (fs.existsSync(fullPath)) {
    return res.sendFile(fullPath);
  } else {
    return res.status(404).json({ error: 'Profile picture not found.' });
  }
});

module.exports = router;
