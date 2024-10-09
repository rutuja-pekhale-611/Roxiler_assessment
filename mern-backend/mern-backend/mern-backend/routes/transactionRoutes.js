const express = require('express');
const axios = require('axios');
const Transaction = require('../models/transaction');
const router = express.Router();

// Fetch and seed the database
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get(process.env.THIRD_PARTY_API);
        const transactions = response.data;

        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(transactions); // Insert new data
        res.json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get transactions (with search and pagination)
router.get('/', async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;

    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 0);

    const query = {
        dateOfSale: { $gte: startDate, $lte: endDate },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get statistics (total sales, sold items, and unsold items)
router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 0);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
        const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
        const soldItems = transactions.filter(t => t.sold).length;
        const unsoldItems = transactions.filter(t => !t.sold).length;

        res.json({
            totalSales,
            soldItems,
            unsoldItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get bar chart data (price ranges)
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 0);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startDate, $lte: endDate } });
        const priceRanges = [
            { range: '0-100', count: 0 },
            { range: '101-200', count: 0 },
            { range: '201-300', count: 0 },
            { range: '301-400', count: 0 },
            { range: '401-500', count: 0 },
            { range: '501-600', count: 0 },
            { range: '601-700', count: 0 },
            { range: '701-800', count: 0 },
            { range: '801-900', count: 0 },
            { range: '901-above', count: 0 }
        ];

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get pie chart data (categories)
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(2024, month - 1, 1);
    const endDate = new Date(2024, month, 0);

    try {
        const transactions = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Combined API
router.get('/combined', async (req, res) => {
    const { month } = req.query;

    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            Transaction.find({}),
            // Include statistics, bar chart, pie chart logic as before
        ]);
        res.json({ transactions, statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
