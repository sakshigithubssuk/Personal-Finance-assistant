const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware.js');
const { uploadHistory } = require('../controllers/histroyController.js');

// Use the same multer setup as for receipts
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage: storage });

router.post('/upload', protect, upload.single('history'), uploadHistory);

module.exports = router;