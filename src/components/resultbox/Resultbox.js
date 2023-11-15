import React from 'react';
import './Resultbox.css';
import BasicLineChart from '../linechart/Linechart';

const ResultBox = ({ adopters, awareFarmers, totalCost, awareFarmersPerTick, adoptersPerTick }) => {

  let chartLabels = [];

  if (Array.isArray(awareFarmersPerTick) && Array.isArray(adoptersPerTick)) {
      // Both are arrays, proceed to generate chart labels
      chartLabels = Array.from({ length: Math.max(awareFarmersPerTick.length, adoptersPerTick.length) }, (_, i) => `Tick ${i + 1}`);
  } else {
      // One or both are null, handle this case appropriately
      console.log('One or both of the tick arrays are null');
  }

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Aware Agents',
        data: awareFarmersPerTick,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Adopters',
        data: adoptersPerTick,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };


  return (
    <div>
      <h2>Model Results</h2>
      <p>Number of adopters: {adopters}</p>
      <p>Number of aware farmers: {awareFarmers}</p>
      <p>Total Costs: {totalCost}</p>

      {/* Display Line Charts */}
      <div className="line-charts">
        <div className="line-chart">
          <BasicLineChart data={lineChartData} />
        </div>
      </div>
      <p> Aware agents have heard at least once of the innovation.​ <br></br>
    Adopters are aware agents that have chosen to adopt the innovation.​</p>
    </div>
    
  );
};

export default ResultBox;
