// src/components/BarChart.js

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getBarChartData } from '../api';

const BarChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await getBarChartData(month);
      const chartData = {
        labels: response.data.map(item => item._id),
        datasets: [
          {
            label: 'Number of Items',
            data: response.data.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };
      setData(chartData);
    };
    fetchBarChartData();
  }, [month]);

  return (
    <div>
      <h3>Bar Chart for {month}</h3>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
