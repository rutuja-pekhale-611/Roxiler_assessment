// controllers/transactionController.js
exports.getTransactions = async (req, res) => {
    const { month, page = 1, perPage = 10, search = '' } = req.query;
    const startOfMonth = new Date(2023, month - 1, 1);
    const endOfMonth = new Date(2023, month, 0);
  
    try {
      const query = {
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } }
        ]
      };
  
      const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(perPage);
      
      const total = await Transaction.countDocuments(query);
      res.json({ transactions, total });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  