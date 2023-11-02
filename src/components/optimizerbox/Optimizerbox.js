import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import './Optimizerbox.css';
import React, { useState } from 'react';

const OptimizerBox = ({setAwareFarmers, setOutputParameters }) => { //TODO: delete aware Faremers?
    const [constraints, setConstraints] = useState(''); //TODO: any other constraints?
    const [optimizationType, setOptimizationType] = useState(''); 
  


const TextInput = ({ label, value, setValue }) => {
    return (
        <div>
            <label>{label}</label>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
};

const runOptimizer = async () => {
    const optimizerData = {
      constraints, //for more constrains
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

        // Update state with received data
        setAwareFarmers(data.awareFarmers);

        // Store output
        setOutputParameters({
          directAdType: data.directAdType,
          directAdFrequency: data.directAdFrequency,
          trainChiefsFrequency: data.trainChiefsFrequency,
          directAdNrOfVillages: data.directAdNrOfVillages,
          trainChiefsNumber: data.trainChiefsNumber,
          avgAdopters: data.avgAdopters,
          nrOfDirectAds: data.nrOfDirectAds,
          nrOfChiefTrainings: data.nrOfChiefTrainings,
          totalCost: data.totalCost,
        });
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message, error.stack);
    }
  };

  return (
    <div className="optimizerBox">
      <h2>The Optimizer</h2>
      <div className="flexContainer">
        <div className="inputGroup">
          <Dropdown label= "Optimization Type" value={optimizationType} setValue={setOptimizationType}>
            <option disabled value="">
                Please choose a type
              </option>
            <option value="maxAdopters">Max Adopters</option>
            <option value="maxKnowledge">Max Knowledge</option>
            <option value="minCost">Min Costs</option>
            <option value="test">Test</option>
            </Dropdown>
        </div>
        <div className="inputGroup">
          <label>Additional Constraints:</label>
          <TextInput value={constraints} setValue={setConstraints} />
        </div>
      </div>
      <div className="flexContainer">
        <Button
          label="Start Optimizer"
          onClick={runOptimizer}
          variant="solid-orange"
        />
      </div>
    </div>
  );
};

export default OptimizerBox;