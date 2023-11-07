import React from 'react';
import './ResultboxOptimizer.css'; 



const ResultboxOptimizer = ({ optimizationResults }) => {
  return (
    <div className='table-container'>
      <h3>Optimization Results</h3>
      <table className='table-with-lines'>
        <thead>
          <tr>
            <th>Direct Ad Type</th>
            <th>Direct Ad Frequency</th>
            <th>Training Chiefs Frequency</th>
            <th>Direct Ad Number of Villages</th>
            <th>Number of trained Chiefs</th>
            <th>Avg Adopters</th>
            <th>Number of direct Ads</th>
            <th>Number of Chief Trainings</th>
            <th>Total Costs</th>
            
          </tr>
        </thead>
        <tbody>
          {optimizationResults.reverse().map((result, index) => (
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
  );
};

export default ResultboxOptimizer;
