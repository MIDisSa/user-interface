import React from 'react';
import './ResultboxOptimizer.css'; 
import Button from '../button/Button';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ResultboxOptimizer = ({ optimizationResults }) => {

  const downloadOptimizerResults = async () => {
    try {
      const result = await fetch('http://localhost:8080/downloadOptimizationResultsCSV')

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
        <h3>Optimization Results</h3>
        <table className='table-with-lines'>
          <thead>
            <tr>
              <th>
                Optimization Type
              </th>
              <th>
                Treatment Arm
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Treatment arm that reached best results (except trainng of trainers)"}>?</span>
              </th>
              <th>
                Treatment Frequency (days)
              </th>
              <th>
                ToT Frequency (days)
              </th>
              <th>
                Treatment Arm Coverage (%)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Percentage of farmers that were affected by the treatment"}>?</span>
              </th>
              <th>
                ToT Coverage (%)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Percentage of farmgroup chief that were affected by the ToT treatment"}>?</span>
              </th>
              <th>
                Best Fitness
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"best fitness???"}>?</span>
              </th>
              <th>
                Number of Treatments
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Number of treatments carried out during the number of days specified"}>?</span>
                </th>
              <th>
                Number of ToTs
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Number of ToT treatments carried out during the number of days specified"}>?</span>
              </th>
              <th>
                Total Cost ($)
                </th>
            </tr>
            <ReactTooltip id="optimizerResult" place="top" effect="solid"/>
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
        <Button 
          label="Export Results"
          onClick={downloadOptimizerResults}
          title={"Download a CSV file including the results of your optimization runs"}
        />)}
      <div className='explanation-section'>
        <h3>How to interpret your optimization results:</h3>
        <div className='explanation-content'>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </div>
      </div>
    </div>
  );
};

export default ResultboxOptimizer;
