const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;