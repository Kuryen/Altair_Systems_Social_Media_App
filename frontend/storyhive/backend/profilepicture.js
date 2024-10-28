const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const { NodeSSH } = require("node-ssh");
var cors = require("cors");


router.use(cors());
const ssh = new NodeSSH();


//upload directory for pfps
const uploadDir = './uploads/profile_pictures';

// ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true});
}

//set up multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile_pictures');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const userId = req.user ? req.user.id : uniqueSuffix;  // Fallback to uniqueSuffix if req.user is undefined
    cb(null, userId + path.extname(file.originalname));  // Set file name
  }
});

// Multer middleware to handle file uploads
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },  // Limit the size to 2MB
  fileFilter: (req, file, cb) => {
      // Allow only images (jpeg, png)
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb(new Error('Images Only!'));
      }
  }
});

router.post('/upload-profile-picture', upload.single('profile_picture'), (req, res) => {
  const username = req.body.username;  // Extract the username from the request

  if (!username) {
    return res.status(400).json({ error: 'Username not provided.' });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Assuming you store the profile picture by username
    const filePath = `/uploads/profile_pictures/${req.file.filename}`;

    // Code to save profile picture path by username (e.g., save to a database or JSON file)
    // Example:
    const profileData = { username, profilePicture: filePath };
    
    res.status(200).json({ message: 'Profile picture uploaded successfully!', profilePicture: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during the upload process.' });
  }
});


// Serve static files (so profile pictures can be accessed by the front-end)
router.use('/uploads', express.static('uploads'));

module.exports = router;