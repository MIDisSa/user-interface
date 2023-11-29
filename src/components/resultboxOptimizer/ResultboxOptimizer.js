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
        <h2>Optimization Results</h2>
        <table className='table-with-lines'>
          <thead>
            <tr>
              <th>
                Optimization Type
              </th>
              <th>
                Treatment Arm
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Treatment arm that yielded the best result, employing direct advertisement."}>?</span>
              </th>
              <th>
                Treatment Frequency (days)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Interval between treatments employing direct advertisement. If frequency is 0, there is no direct advertisement."}>?</span>
              </th>
              <th>
                ToT Frequency (days)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Interval between treatments employing training of trainers (ToT). If frequency is 0, there are no trainings."}>?</span>
              </th>
              <th>
                Treatment Coverage (%)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Percentage of villages that were part of the Direct Ad treatment."}>?</span>
              </th>
              <th>
                ToT Coverage (%)
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Percentage of villages in which training of trainers (ToT) was carried out."}>?</span>
              </th>
              <th>
                Best Fitness
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Best result the optimization yielded, depending on the above specified Optimization Type: Adopters, Aware Agents or Cost per Adopter."}>?</span>
              </th>
              <th>
                Number of Treatments
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Number of treatments carried out, employing direct advertisement."}>?</span>
                </th>
              <th>
                Number of ToTs
                <span className="tooltip-trigger" data-tooltip-id="optimizerResult" style={{ marginLeft: '5px' }} data-tooltip-content={"Number of treatments carried out, employing training of trainers (ToT)."}>?</span>
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
                  <td>{result.bestFitness}</td>
                  <td>{result.nrOfDirectAds}</td>
                  <td>{result.nrOfChiefTrainings}</td>
                  <td>{result.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      {optimizationResults.length > 0 && (
        /*<div className='left'>*/
        <Button 
          label="Export Results"
          onClick={downloadOptimizerResults}
          title={"Download a CSV file including the results of your optimization runs"}
        />)}
      <div className='explanation-section'>
        <h3>How to interpret the optimization results:</h3>
        <div className='explanation-content'>
          Column 1: Optimization Type selected in <span className="number-circle-inline">2</span>.<br></br>
          Columns 2-6: Optimal Intervention Parameters which on average yield the best results when put into <span className="number-circle-inline">1</span>.<br></br>
          Column 7: Best average result achieved with optimal Intervention Parameters stated in columns 2-6.<br></br>
          If Optimization Type is Max Adopters then Best Fitness denotes the number of Adopters out of 1000 agents.<br></br>
          If Optimization Type is Max Knowledge then Best Fitness denotes the number of Aware Agents + Adopters out of 1000 agents.<br></br>
          If Optimization Type is Min Costs then Best Fitness denotes the average Cost per Adopter.<br></br>
          Column 8-10: Number of Treatments and Trainings actually carried out, taking into account the specified budget.
        </div>
      </div>
    </div>
  );
  };

export default ResultboxOptimizer;
