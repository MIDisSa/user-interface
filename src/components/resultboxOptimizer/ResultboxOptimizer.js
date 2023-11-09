import React from 'react';
import './ResultboxOptimizer.css'; 



const ResultboxOptimizer = ({ optimizationResults }) => {
  return (
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
  );
};

export default ResultboxOptimizer;
