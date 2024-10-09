// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);

// controllers/transactionController.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany(); // Clear old data
    await Transaction.insertMany(data); // Insert new data
    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// routes/transactionRoutes.js
const express = require('express');
const { initializeDatabase } = require('../controllers/transactionController');
const router = express.Router();

router.post('/initialize', initializeDatabase);
module.exports = router;
