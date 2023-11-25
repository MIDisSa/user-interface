import React from 'react';
import './ResultboxOptimizer.css'; 
import Button from '../button/Button';

const ResultboxOptimizer = ({ optimizationResults }) => {

  const downloadOptimizerResults = async () => {
    try {
      const result = await fetch('http://localhost:8080/downloadOptimizerResultsCSV')

      if (!result.ok) {
        const errorMessage = await result.json();
        window.alert(errorMessage.message)
        throw new Error('Network response was not ok' + result.statusText);
      }

      const blob = await result.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'optimizer_results.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='results-container'>
      <div className='table-container'>
        <h2>Optimization Results</h2>
        <table className='table-with-lines'>
          <thead>
            <tr>
              <th>Optimization Type</th>
              <th>Treatment Arm</th>
              <th>Treatment Frequency (days)</th>
              <th>ToT Frequency (days)</th>
              <th>Treatment Arm Coverage (%)</th>
              <th>ToT Coverage (%)</th>
              <th>Best Fitness</th>
              <th>Number of Treatments</th>
              <th>Number of ToTs</th>
              <th>Total Cost</th>
            </tr>
            </thead>
            <tbody>
              {optimizationResults.slice().reverse().map((result, index) => (
                <tr key={index} className={index === 0 ? "highlighted-row" : ""}>
                  <td>{result.optimizationType}</td>
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
      {optimizationResults.length > 0 && (
        <div className='left'>
        <Button 
          label="Export Results"
          onClick={downloadOptimizerResults}
          title={"Download a CSV file including the results of your optimization runs"}
        />
        </div>)}
    </div>
  );
};

export default ResultboxOptimizer;
