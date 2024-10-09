const axios = require('axios');
const Transaction = require('../models/Transaction');

// Fetch and initialize the database with third-party API data
exports.initializeDB = async (req, res) => {
  try {
    const { data } = await axios.get(process.env.THIRD_PARTY_API);
    await Transaction.insertMany(data);
    res.status(201).json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error initializing database' });
  }
};

// Get transactions with search and pagination
exports.getTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = '' } = req.query;
  const start = (page - 1) * perPage;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month.padStart(2, '0')}-` },
      $or: [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { price: new RegExp(search, 'i') }
      ]
    })
      .skip(start)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Get statistics for the selected month
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  try {
    const totalSale = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
      { $group: { _id: null, total: { $sum: '$price' }, soldItems: { $sum: { $cond: ['$sold', 1, 0] } }, notSoldItems: { $sum: { $cond: ['$sold', 0, 1] } } } }
    ]);

    res.json(totalSale[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};

// Get bar chart data
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  try {
    const priceRanges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const barChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: priceRanges,
          default: "901-above",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json(barChart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bar chart data' });
  }
};

// Get pie chart data for categories
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  try {
    const pieChart = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(pieChart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pie chart data' });
  }
};

// Get combined data
exports.getCombinedData = async (req, res) => {
  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      exports.getTransactions(req, res),
      exports.getStatistics(req, res),
      exports.getBarChart(req, res),
      exports.getPieChart(req, res)
    ]);

    res.json({ transactions, statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching combined data' });
  }
};
