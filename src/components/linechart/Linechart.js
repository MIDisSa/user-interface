import React from 'react';
import { Line } from 'react-chartjs-2';
import './Linechart.css';

import 'chart.js/auto'; // required for Chart.js v3+

const BasicLineChart = ({ data }) => { 


  const options = {
    scales: {
      x: { // Configure x-axis
        ticks: {
          // how to convert the tick/label to string
          callback: function(value, index, values) {
            return value;
          }
        }
      },
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, // control aspect ratio
  
  };

  return (
    <div>
      <h2>This is an ugly chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default BasicLineChart;
