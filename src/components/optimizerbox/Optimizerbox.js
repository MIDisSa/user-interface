import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import './Optimizerbox.css';
import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const OptimizerBox = ({ setOutputParameters, extraOptimizationParameters }) => { 
    const [optimizationType, setOptimizationType] = useState(''); 
    const [loading, setLoading] = useState(false);
  
    // new state to store all optimization results in an array
    const [optimizationResults, setOptimizationResults] = useState(() => {
        // initial value we get from local storage or default to empty array
        const savedResults = localStorage.getItem('optimizationResults');
        return savedResults ? JSON.parse(savedResults) : [];
    });
  

    useEffect(() => {
        // when optimizationResults change, we update local storage
        localStorage.setItem('optimizationResults', JSON.stringify(optimizationResults));
    }, [optimizationResults]);

    // add new results to state and local storage
    const addOptimizationResult = (newResult) => {
        setOptimizationResults(prevResults => [...prevResults, newResult]);
    };


    const runOptimizer = async () => {

      setLoading(true);

      const optimizerData = {
        optimizationType,
      };

    // Log
    console.log('Sending data to optimizer:', optimizerData);

    try {
      // POST request
      const response = await fetch('http://localhost:8080/optimization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optimizerData),
      });

      if (response.ok) {
        const data = await response.json();

        // Add new result
        addOptimizationResult(data);

        // Store output
        setOutputParameters({
          optimizationType: data.optimizationType,
          directAdType: data.directAdType,
          directAdFrequency: data.directAdFrequency,
          trainChiefsFrequency: data.trainChiefsFrequency,
          directAdNrOfVillages: data.directAdNrOfVillages,
          trainChiefsNumber: data.trainChiefsNumber,
          avgAdopters: data.avgAdopters,
          bestFitness: data.bestFitness,
          nrOfDirectAds: data.nrOfDirectAds,
          nrOfChiefTrainings: data.nrOfChiefTrainings,
          totalCost: data.totalCost,
        });
      } else {
        const errorMessage = await response.json();
        window.alert(errorMessage.message)
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message, error.stack);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="optimizerBox">
       <span className="tooltip-opti" data-tooltip-id="opti" data-tooltip-content="This is the Optimizer. In general, fixed costs incur once per intervention.​
            Variable costs incur once per village that is part of the intervention.​​">?</span> 
              <ReactTooltip id= "opti"  place="top" effect="solid" />
       <div className="numbered-heading">
            <div className="number-circle">2</div>   
            <h2>Optimizer</h2>
        </div>
        <div className="description-text">
        The optimizer looks for the values in <span className="number-circle-inline">2</span> <br></br> which on average yield the best result for the here defined goal. <br></br>
Warning: Optimization process may take 15-30 minutes to finish, <br></br> depending on the number of days defined in the settings above.
                </div> 
      <div className="flexContainer">
        <div className="inputGroup">
          <Dropdown label= "Optimization Type " value={optimizationType} setValue={setOptimizationType}>
            <option disabled value="">
                Please choose a type
              </option>
            <option value="maxAdopters">Max Adopters</option>
            <option value="maxKnowledge">Max Knowledge</option>
            <option value="minCost">Min Costs</option>
            <option value="test">Test</option>
            </Dropdown>
        </div>
        
      </div>
      <div className="flexContainer">
        <Button
          label="Start Optimizer"
          onClick={runOptimizer}
          variant="solid-orange"
        />

      </div>
      {loading && (
            <div className="overlay">
                <FadeLoader color={'#FFA62B'} loading={loading}/>
            </div>
            )}
    </div>
  );
};

const TextInput = ({ label, value, setValue }) => {
  return (
      <div>
          <label>{label}</label>
          <input type="text" value={value} onChange={e => setValue(e.target.value)} />
      </div>
  );
};

export default OptimizerBox;