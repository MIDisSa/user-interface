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


    const resetGlobalParameters = async () => {
      setLoading(true);
    
      try {
        const response = await fetch('http://localhost:8080/resetGlobalInput', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 200) {
          const defaultUserInput = await response.json();
    
          // Update state with default parameters
          setNumberOfTicks(defaultUserInput.numberOfTicks);
          setBudget(defaultUserInput.budget);
          setFixedCostsDirectAd(defaultUserInput.fixedCostsDirectAd);
          setFixedCostsTrainChiefs(defaultUserInput.fixedCostsTrainChiefs);
          setVariableCostsDirectAd(defaultUserInput.variableCostsDirectAd);
          setVariableCostsDiscount(defaultUserInput.variableCostsDiscount); 
          setVariableCostsDelayed(defaultUserInput.variableCostsDelayed);
          setVariableCostsDelayedDiscount(defaultUserInput.variableCostsDelayedDiscount);
          setVariableCostsTrainChiefs(defaultUserInput.variableCostsTrainChiefs);
        
          console.log('Global parameters successfully reset to default:', defaultUserInput);
        } else {
          const errorMessage = await response.text(); 
          window.alert(errorMessage);
          console.error('Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fetch Error:', error.message, error.stack);
      } finally {
        setLoading(false);
      }
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

      // Check for a 200 status code
    if (response.status === 200) {
      console.log('Parameters successfully sent and processed by backend.');
    } else {
      const errorMessage = await response.text(); // Assuming error message in plain text
      window.alert(errorMessage);
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
      <span className="tooltip-opt" data-tooltip-id="opt" data-tooltip-content="Fixed costs incur once per treatment. Variable costs incur once per village that is part of the intervention.​">?</span> 
              <ReactTooltip id= "opt"  place="top" effect="solid" />
            <h2 className="h2-spacing">Additional Global Parameters</h2>
    
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
               <Button
                label="Set to Default"
                onClick={resetGlobalParameters}
                variant="outlined-blue"
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