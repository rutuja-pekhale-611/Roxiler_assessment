// components/TransactionsBarChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const TransactionsBarChart = ({ month }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`/api/bar-chart?month=${month}`);
        const labels = Object.keys(response.data);
        const data = Object.values(response.data);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Items',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
          ]
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchBarChartData();
  }, [month]);

  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
};

export default TransactionsBarChart;
