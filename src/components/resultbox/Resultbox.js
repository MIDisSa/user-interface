import React from 'react';
import './Resultbox.css';
import BasicLineChart from '../linechart/Linechart';
import Button from '../button/Button';


const ResultBox = ({ adopters, awareFarmers, totalCost, awareFarmersPerTick, adoptersPerTick }) => {

  const downloadModelResults = async () => {
    try {
      const result = await fetch('http://localhost:8080/downloadModelResultsCSV')

      if (!result.ok) {
        const errorMessage = await result.json();
        window.alert(errorMessage.message)
        throw new Error('Network response was not ok' + result.statusText);
      }

      const blob = await result.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'model_results.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.log(error);
    }
  };

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
    <div className='button-box'>
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
      <div className='left'>
        <Button 
            label="Export Results"
            onClick={downloadModelResults}
            title={"Download a CSV file including the results of your optimization runs"}
          />
      </div>
    </div>
    
  );
};

export default ResultBox;
