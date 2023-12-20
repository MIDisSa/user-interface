import React from 'react';
import './Resultbox.css';
import BasicLineChart from '../linechart/Linechart';
import Button from '../button/Button';


const ResultBox = ({ adopters, awareFarmers, totalCost, awareFarmersPerTick, adoptersPerTick }) => {

  // function to change format of values
  const formatNumber = (number) => {
    if (number !== null && number !== 0) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return null;
    }
  };

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
        label: 'Aware Farmers',
        data: awareFarmersPerTick,
        fill: false,
        backgroundColor: '#e06b39',
        borderColor: '#e06b39',
        tension: 0.1,
      },
      {
        label: 'Adopters',
        data: adoptersPerTick,
        fill: false,
        backgroundColor: '#042f66',
        borderColor: '#042f66',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className='table-container'  >
      <h2>Model Results</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div><p>Number of Adopters: {formatNumber(adopters)}</p></div>
        <div><p>Number of Aware Farmers: {formatNumber(awareFarmers + adopters)}</p></div>
        <div><p>Total Costs ($): {formatNumber(totalCost)}</p></div>
      </div>

      {/* Display Line Charts */}
      <div className="line-chart">
          <BasicLineChart data={lineChartData} />
      </div>
      <div className='left'>
        <Button 
            label="Export Results"
            onClick={downloadModelResults}
            title={"Download a CSV file including the results of your optimization runs"}
          />
      </div>
    <div className='explanation-section'>
        <h3>How to interpret the Model Results:</h3>
        <div className='explanation-content'>
          <p> Aware Farmers have heard at least once of the innovation.​ <br></br>
          Adopters are Aware Farmers that have chosen to adopt the innovation.​</p>
        </div>
      </div>
      
    </div>
    
  );
};

export default ResultBox;
