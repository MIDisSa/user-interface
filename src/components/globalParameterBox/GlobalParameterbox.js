import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import './GlobalParameterbox.css';
import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const GlobalParameterbox = ({ setOutputParameters, extraOptimizationParameters }) => { 
    const [numberOfTicks, setNumberOfTicks] = useState();
    const [budget, setBudget] = useState(''); 
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
        numberOfTicks: 360,
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
        setNumberOfTicks(DEFAULT_VALUES.numberOfTicks);
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


    const runGlobalParameter = async () => {

      setLoading(true);

      const globalParameter = {
        numberOfTicks,
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
    console.log('Sending global parameter to backend:', globalParameter);

    try {
      // POST request
      const response = await fetch('http://localhost:8080/updateGlobalInput', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(globalParameter),
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
    <div className="globalParameterBox">
            <h2>Global Parameters</h2>
        <div className="inputGroup">
          <div className="label">Days</div>
            <TextInput value={numberOfTicks} setValue={setNumberOfTicks} />
        </div>
        <div className="inputGroup">
          <div className="label">Budget ($)</div>
              <TextInput value={budget} setValue={setBudget} />
          </div>
          <div className="inputGroup">
            <div className="label">Fixed Costs for Direct Ad</div>
            <TextInput value={fixedCostsDirectAd} setValue={setFixedCostsDirectAd} />
          </div>
          <div className="inputGroup">
              <div className="label">Fixed Costs for Training of Chiefs</div>
              <TextInput value={fixedCostsTrainChiefs} setValue={setFixedCostsTrainChiefs} />
          </div>
          <div className="inputGroup">
              <div className="label">Variable Costs for Direct Ad</div>
              <TextInput value={variableCostsDirectAd} setValue={setVariableCostsDirectAd} />
          </div>
          <div className="inputGroup">
              <div className="label">Variable Costs for Direct Ad + Discount</div>
              <TextInput value={variableCostsDiscount} setValue={setVariableCostsDiscount} />
          </div>
          <div className="inputGroup">
              <div className="label">Variable Costs for Direct Ad + Deferred Payment</div>
              <TextInput value={variableCostsDelayed} setValue={setVariableCostsDelayed} />
          </div>
          <div className="inputGroup">
              <div className="label">Variable Costs for Direct Ad + Deferred Payment + Discount</div>
              <TextInput value={variableCostsDelayedDiscount} setValue={setVariableCostsDelayedDiscount} />
          </div>
          <div className="inputGroup">
              <div className="label">Variable Costs for Training of Chiefs</div>
              <TextInput value={variableCostsTrainChiefs} setValue={setVariableCostsTrainChiefs} />
          </div>
     
          <div className="flexContainerGlobalParameterbox">
              <Button
                label="Save Global Parameters"
                onClick={runGlobalParameter}
                variant="solid-blue"
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

export default GlobalParameterbox;