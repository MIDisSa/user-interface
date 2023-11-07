import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import './Optimizerbox.css';
import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const OptimizerBox = ({ setOutputParameters, extraOptimizationParameters }) => { 
    const [budget, setBudget] = useState(''); 
    const [optimizationType, setOptimizationType] = useState(''); 
    const [fixedCostsDirectAd, setFixedCostsDirectAd] = useState(''); 
    const [fixedCostsTrainChiefs, setFixedCostsTrainChiefs] = useState(''); 
    const [variableCostsDirectAd, setVariableCostsDirectAd] = useState(''); 
    const [variableCostsDiscount, setVariableCostsDiscount] = useState(''); 
    const [variableCostsDelayed, setVariableCostsDelayed] = useState(''); 
    const [variableCostsDelayedDiscount, setVariableCostsDelayedDiscount] = useState(''); 
    const [variableCostsTrainChiefs, setVariableCostsTrainChiefs] = useState(''); 
    const [loading, setLoading] = useState(false);
  
    // new state to store all optimization results in an array
    const [optimizationResults, setOptimizationResults] = useState(() => {
        // initial value we get from local storage or default to empty array
        const savedResults = localStorage.getItem('optimizationResults');
        return savedResults ? JSON.parse(savedResults) : [];
    });

    const DEFAULT_VALUES = {
        budget: "100000",
        fixedCostsDirectAd: "6000",
        fixedCostsTrainChiefs: "5000",
        variableCostsDirectAd: "400",
        variableCostsDiscount: "500",
        variableCostsDelayed: "700",
        variableCostsDelayedDiscount: "800",
        variableCostsTrainChiefs: "400",
    };
  

    const setDefaultValues = () => {
        setBudget(DEFAULT_VALUES.budget);
        setFixedCostsDirectAd(DEFAULT_VALUES.fixedCostsDirectAd);
        setFixedCostsTrainChiefs(DEFAULT_VALUES.fixedCostsTrainChiefs);
        setVariableCostsDirectAd(DEFAULT_VALUES.variableCostsDirectAd);
        setVariableCostsDiscount(DEFAULT_VALUES.variableCostsDiscount);
        setVariableCostsDelayed(DEFAULT_VALUES.variableCostsDelayed);
        setVariableCostsDelayedDiscount(DEFAULT_VALUES.variableCostsDelayedDiscount);
        setVariableCostsTrainChiefs(DEFAULT_VALUES.variableCostsTrainChiefs);
    };
  

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
        budget,
        fixedCostsDirectAd,
        fixedCostsTrainChiefs,
        variableCostsDirectAd,
        variableCostsDiscount,
        variableCostsDelayed,
        variableCostsDelayedDiscount,
        variableCostsTrainChiefs,
        extraOptimizationParameters, 
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
      <div className="flexContainer">
        <div className="inputGroup">
          <Dropdown label= "Optimization Type " value={optimizationType} setValue={setOptimizationType}>
            <option disabled value="">
                Please choose a type
              </option>
            <option value="maxAdopters">Max Adopters</option>
            <option value="maxKnowledge">Max Knowledge</option>
            <option value="minCost">Min Costs</option>

            </Dropdown>
        </div>
        <label>Additional Constraints:</label>
        <div className="inputGroup">
          <TextInput label= "Budget " value={budget} setValue={setBudget} />
          <TextInput label= "Fixed Costs for Direct Ad " value={fixedCostsDirectAd} setValue={setFixedCostsDirectAd} />
          <TextInput label= "Fixed Costs for Training of Chiefs " value={fixedCostsTrainChiefs} setValue={setFixedCostsTrainChiefs} />
          <TextInput label= "Variable Costs for Direct Ad " value={variableCostsDirectAd} setValue={setVariableCostsDirectAd} />
          <TextInput label= "Variable Costs for Direct Ad + Discount​ " value={variableCostsDiscount} setValue={setVariableCostsDiscount} />
          <TextInput label= "Variable Costs for Direct Ad + Deferred Payment " value={variableCostsDelayed} setValue={setVariableCostsDelayed} />
          <TextInput label= "Variable Costs for Direct Ad + Deferred Payment + Discount " value={variableCostsDelayedDiscount} setValue={setVariableCostsDelayedDiscount} />
          <TextInput label= "Variable Costs for Training of Chiefs " value={variableCostsTrainChiefs} setValue={setVariableCostsTrainChiefs} />
        </div>
      </div>
      <div className="flexContainer">
        <Button
          label="Start Optimizer"
          onClick={runOptimizer}
          variant="solid-orange"
        />
        <Button
            label="Set to Default"
            onClick={setDefaultValues}
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