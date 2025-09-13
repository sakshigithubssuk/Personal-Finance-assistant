const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js'); // <-- ADD THIS LINE
const receiptRoutes = require('./routes/receiptRoutes.js'); // <-- ADD THIS
const historyRoutes = require('./routes/historyRoutes.js'); 
const path = require('path'); 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes); // <-- ADD THIS LINE
app.use('/api/receipts', receiptRoutes); // <-- ADD THIS
app.use('/api/history', historyRoutes);
// Serve the 'uploads' folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ... rest of the file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));