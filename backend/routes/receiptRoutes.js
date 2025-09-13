const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware.js');
const { uploadReceipt } = require('../controllers/receiptController.js');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  }
});
const upload = multer({ storage: storage });

router.post('/upload', protect, upload.single('receipt'), uploadReceipt);

module.exports = router;