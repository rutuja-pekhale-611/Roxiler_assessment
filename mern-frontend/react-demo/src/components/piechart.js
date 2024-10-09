// src/components/PieChart.js

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getPieChartData } from '../api';

const PieChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchPieChartData = async () => {
      const response = await getPieChartData(month);
      const chartData = {
        labels: response.data.map(item => item._id),
        datasets: [
          {
            label: 'Number of Items',
            data: response.data.map(item => item.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
          }
        ]
      };
      setData(chartData);
    };
    fetchPieChartData();
  }, [month]);

  return (
    <div>
      <h3>Pie Chart for {month}</h3>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
