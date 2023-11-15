import React from 'react';
import './ResultboxOptimizer.css'; 
import Button from '../button/Button';

const ResultboxOptimizer = ({ optimizationResults }) => {

  const downloadOptimizerResults = () => {
    fetch('http://localhost:8080/downloadOptimizerResults')
          .then(response => response.blob())
          .then(blob => {
            // create temporary URL to act as reference to the blob data
            const url = window.URL.createObjectURL(new Blob([blob]));
            // create new anchor element to trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'optimizerResults.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
  };

  return (
    <div className='results-container'>
      <div className='table-container'>
        <h3>Optimization Results</h3>
        <div className='table-scroll'>
        <table className='table-with-lines'>
          <thead>
            <tr>
              <th>Treatment Arm</th>
              <th>Treatment Frequency (days)</th>
              <th>ToT Frequency (days)</th>
              <th>Treatment Arm Coverage (%)</th>
              <th>ToT Coverage (%)</th>
              <th>Best Fitness</th>
              <th>Number of Treatments</th>
              <th>Number of ToTs</th>
              <th>Total Cost</th>
              <th>Optimization Type</th>
            </tr>
            </thead>
            <tbody>
              {optimizationResults.slice().reverse().map((result, index) => (
                <tr key={index} className={index === 0 ? "highlighted-row" : ""}>
                  <td>{result.directAdType}</td>
                  <td>{result.directAdFrequency}</td>
                  <td>{result.trainChiefsFrequency}</td>
                  <td>{result.directAdNrOfVillages}</td>
                  <td>{result.trainChiefsNumber}</td>
                  <td>{result.avgAdopters}</td>
                  <td>{result.nrOfDirectAds}</td>
                  <td>{result.nrOfChiefTrainings}</td>
                  <td>{result.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {optimizationResults.length > 0 && (
        <Button 
          label="Export Results"
          onClick={downloadOptimizerResults}
          title={"Download a CSV file including the results of your optimization runs"}
        />)}
    </div>
  );
};

export default ResultboxOptimizer;
