// components/TransactionsStatistics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    soldItems: 0,
    unsoldItems: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`/api/statistics?month=${month}`);
        setStatistics(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h3>Statistics for {month}</h3>
      <p>Total Sales: ${statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.soldItems}</p>
      <p>Total Unsold Items: {statistics.unsoldItems}</p>
    </div>
  );
};

export default TransactionsStatistics;
