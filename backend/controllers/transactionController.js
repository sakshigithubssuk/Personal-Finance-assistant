const Transaction = require("../models/Transaction.js");

const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {
      user: req.user._id,
    };

    if (startDate && endDate) {
      const endOfDay = new Date(endDate);

      endOfDay.setUTCHours(23, 59, 59, 999);

      query.date = {
        $gte: new Date(startDate),
        $lte: endOfDay, // Use the adjusted end-of-day date
      };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/transactions (Private)
const createTransaction = async (req, res) => {
  // This function remains the same, it works correctly.
  const { type, amount, category, date } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const transaction = await Transaction.create({
    user: req.user._id,
    type,
    amount,
    category,
    date,
  });
  res.status(201).json(transaction);
};

module.exports = { getTransactions, createTransaction };
