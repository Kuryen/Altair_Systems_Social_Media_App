const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { NodeSSH } = require("node-ssh");
const cors = require('cors');

const ssh = new NodeSSH();
router.use(cors());

// Ensure uploads directory exists
const uploadDir = './uploads/profile_pictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/profile_pictures'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// In-memory cache to store profile picture paths
let profilePictureCache = {};

// Helper function to fetch profile picture from the database via SSH
async function fetchProfilePictureFromDB(username) {
  try {
    await ssh.connect({
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    });

    const findQuery = `EJSON.stringify(db.userProfile.findOne({ userID: "${username}" }, { profilePic: 1, _id: 0 }))`;
    const result = await ssh.execCommand(`mongosh testDB --quiet --eval '${findQuery}'`);

    if (result && result.stdout) {
      const data = JSON.parse(result.stdout);
      return data && data.profilePic ? data.profilePic : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile picture from DB:", error);
    throw error;
  }
}

// GET profile picture route with caching logic
router.get('/get-profile-picture/:username', async (req, res) => {
  const { username } = req.params;

  // Check cache first
  if (profilePictureCache[username]) {
    console.log('Cache hit');
    return res.status(200).json({ profilePicture: profilePictureCache[username] });
  }

  try {
    // Fetch from the database if not in cache
    const profilePicPath = await fetchProfilePictureFromDB(username);

    if (profilePicPath) {
      // Cache the retrieved profile picture path
      profilePictureCache[username] = profilePicPath;
      res.status(200).json({ profilePicture: profilePicPath });
    } else {
      res.status(404).json({ error: 'User profile picture not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile picture.' });
  }
});

// POST profile picture route to upload and update profile picture with cache update
router.post('/upload-profile-picture', upload.single('profile_picture'), async (req, res) => {
  const username = req.body.username;
  if (!username || !req.file) return res.status(400).json({ error: 'Invalid request' });

  const filePath = `/uploads/profile_pictures/${req.file.filename}`;

  try {
    await ssh.connect({
      host: process.env.SECRET_IP,
      username: process.env.SECRET_USER,
      privateKeyPath: process.env.SECRET_KEY,
    });
    
    const updateQuery = `db.userProfile.updateOne(
      { userID: "${username}" },
      { $set: { profilePic: "${filePath}" } },
      { upsert: true }
    )`;
    
    await ssh.execCommand(`mongosh testDB --quiet --eval '${updateQuery}'`);

    // Update the cache
    profilePictureCache[username] = filePath;

    res.status(200).json({ message: 'Profile picture uploaded successfully!', profilePicture: filePath });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

module.exports = router;
