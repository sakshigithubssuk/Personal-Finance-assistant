const fs = require('fs');
const pdf = require('pdf-parse');
const Transaction = require('../models/Transaction.js');

const parseHistoryText = (text) => {
  const transactions = [];
  const lines = text.split('\n');

  // Regex to capture the four key parts of a transaction line.
  const historyLineRegex = /^(\d{4}-\d{2}-\d{2})\s+(expense|income)\s+([\w\s]+?)\s+([\d.]+)$/i;

  for (const line of lines) {
    const match = line.trim().match(historyLineRegex);

    if (match) {
      // match[1] = Date, match[2] = Type, match[3] = Category, match[4] = Amount
      transactions.push({
        date: new Date(match[1]),
        type: match[2].toLowerCase(),
        category: match[3].trim(),
        amount: parseFloat(match[4]),
      });
    }
  }
  return transactions;
};

const uploadHistory = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed for history upload.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const parsedTransactions = parseHistoryText(data.text);

    if (parsedTransactions.length === 0) {
      return res.status(400).json({ message: 'Could not find any valid transaction lines in the PDF.' });
    }

   
    const transactionsToCreate = parsedTransactions.map(tx => ({
      ...tx,
      user: req.user._id,
      description: `Uploaded from history: ${req.file.originalname}`,
    }));

    const newTransactions = await Transaction.create(transactionsToCreate);
    res.status(201).json(newTransactions);

  } catch (error) {
    console.error('History Processing Error:', error);
    res.status(500).json({ message: 'Failed to process history PDF.' });
  }
};

module.exports = { uploadHistory };

