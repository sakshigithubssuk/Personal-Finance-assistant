const Tesseract = require("tesseract.js");
const Transaction = require("../models/Transaction.js");
const fs = require("fs");
const pdf = require("pdf-parse");

const parseTextForDate = (text) => {
  //  date in the most common format: YYYY-MM-DD
  const dateRegex = /(\d{4}-\d{2}-\d{2})/;
  const match = text.match(dateRegex);

  if (match && match[0]) {
    return new Date(match[0]);
  }

  return null;
};

const parseTextForLineItems = (text) => {
  const items = [];
  const lines = text.split("\n");
  const lineItemRegex = /^([a-zA-Z\s]+?)\s+\$?(\d+\.\d{2})$/;

  for (const line of lines) {
    const lowerCaseLine = line.toLowerCase();

    if (
      lowerCaseLine.includes("total") ||
      lowerCaseLine.includes("subtotal") ||
      lowerCaseLine.includes("tax")
    ) {
      continue;
    }

    const match = line.trim().match(lineItemRegex);
    if (match) {
      const itemName = match[1].trim();
      const itemPrice = parseFloat(match[2]);
      items.push({ item: itemName, price: itemPrice });
    }
  }
  return items;
};

const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const filePath = req.file.path;
    let extractedText = "";

    if (req.file.mimetype === "text/plain") {
      extractedText = fs.readFileSync(filePath, "utf8");
    } else if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      extractedText = data.text;
    } else {
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, "eng");
      extractedText = text;
    }

    const parsedDate = parseTextForDate(extractedText);

    // 2. Find all the line items.
    const parsedItems = parseTextForLineItems(extractedText);

    if (parsedItems.length === 0) {
      return res
        .status(400)
        .json({
          message:
            "Could not automatically find any line items on the receipt.",
        });
    }

    const transactionsToCreate = parsedItems.map((item) => ({
      user: req.user._id,
      type: "expense",
      amount: item.price,
      category: item.item,

      date: parsedDate || new Date(),
      description: `Uploaded from receipt: ${req.file.originalname}`,
    }));

    const newTransactions = await Transaction.create(transactionsToCreate);
    res.status(201).json(newTransactions);
  } catch (error) {
    console.error("File Processing Error:", error);
    res.status(500).json({ message: "Failed to process file." });
  }
};

module.exports = { uploadReceipt };
