import React from 'react';
import { Line } from 'react-chartjs-2';
import './Linechart.css';

import 'chart.js/auto'; // required for Chart.js v3+

const BasicLineChart = ({ data }) => { 


  const options = {
    scales: {
      x: { // Configure x-axis
        title: {
          display: true,
          text: 'Days', 
          
          font: {
            size: 16, 
          },
        },
        ticks: {
          // how to convert the tick/label to string
          callback: function(value, index, values) {
            return value;
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Absolute Number of Agents', 
          font: {
            size: 16, 
          },
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true, // Toggle visibility of the legend
        position: 'top', // Position the legend on the top of the chart
        labels: {
          color: 'black', 
        },
      },
    },
  
  };

  return (
    <div >
      <h2>Development of Aware Farmers and Adopters over time</h2>
      <Line className="chart-container" data={data} options={options} />
    </div>
  );
};

export default BasicLineChart;
