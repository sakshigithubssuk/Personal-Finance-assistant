const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionController.js');
const { protect } = require('../middleware/authMiddleware.js'); // Import the gatekeeper

router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;