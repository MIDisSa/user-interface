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
  const [nrOfVillages, setNrOfVillages] = useState('');
  const [nrOfNeighborhoods, setNrOfNeighborhoods] = useState('');
  const [farmersPerVillage, setFarmersPerVillage] = useState('');
  const [percentageOfFarmersInFarmgroup, setPercentageOfFarmersInFarmgroup] = useState('');
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
        setNrOfVillages(defaultUserInput.nrOfVillages);
        setNrOfNeighborhoods(defaultUserInput.nrOfNeighborhoods);
        setFarmersPerVillage(defaultUserInput.farmersPerVillage);
        setPercentageOfFarmersInFarmgroup(defaultUserInput.percentageOfFarmersInFarmgroup);

        console.log('Global parameters successfully reset to default:', defaultUserInput);
      } else {
        const errorMessage = await response.json();
        window.alert(errorMessage.message);
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
      nrOfVillages,
      nrOfNeighborhoods,
      farmersPerVillage,
      percentageOfFarmersInFarmgroup,
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
        const errorMessage = await response.json(); // Assuming error message in plain text
        window.alert(errorMessage.message);
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
      <ReactTooltip id="opt" place="top" effect="solid" />
      <h2 className="h2-spacing">Additional Global Parameters</h2>
    <p/>
      <div className='columns'>

        <div className='column'>
          <div className="inputGroup">
            <div className="label">Days</div>
            <TextInput value={numberOfTicks} setValue={setNumberOfTicks} />
          </div>
          <div className="inputGroup">
            <div className="label">Number of Villages</div>
            <TextInput value={nrOfVillages} setValue={setNrOfVillages} />
          </div>
          <div className="inputGroup">
            <div className="label">
              Number of Neighborhoods
              <span className="tooltip-trigger" data-tooltip-id={"nghbrhd"} data-tooltip-content={"test"}>?</span>
            </div>
            <TextInput value={nrOfNeighborhoods} setValue={setNrOfNeighborhoods} />
            <ReactTooltip id={"nghbrhd"} place="top" effect="solid" />
          </div>
          <div className="inputGroup">
            <div className="label">Average Number of Farmers per Village</div>
            <TextInput value={farmersPerVillage} setValue={setFarmersPerVillage} />
          </div>
          <div className="inputGroup" style={{ paddingBottom: '25px' }}>
            <div className="label">Percentage of Farmers in Farmgroup (%) </div>
            <TextInput value={percentageOfFarmersInFarmgroup} setValue={setPercentageOfFarmersInFarmgroup} />
          </div>
        </div>

        <div className='column'>
          <div className="inputGroup">
            <div className="label">Budget ($)</div>
            <TextInput value={budget} setValue={setBudget} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Fixed Costs for Direct Ad ($)</div>
            <TextInput value={fixedCostsDirectAd} setValue={setFixedCostsDirectAd} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Fixed Costs for Training of Chiefs ($)</div>
            <TextInput value={fixedCostsTrainChiefs} setValue={setFixedCostsTrainChiefs} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Variable Costs for Direct Ad ($)</div>
            <TextInput value={variableCostsDirectAd} setValue={setVariableCostsDirectAd} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Variable Costs for Direct Ad + Discount ($)</div>
            <TextInput value={variableCostsDiscount} setValue={setVariableCostsDiscount} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Variable Costs for Direct Ad + Deferred Payment ($)</div>
            <TextInput value={variableCostsDelayed} setValue={setVariableCostsDelayed} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup">
            <div className="label">Variable Costs for Direct Ad + Deferred Payment + Discount ($)</div>
            <TextInput value={variableCostsDelayedDiscount} setValue={setVariableCostsDelayedDiscount} placeholder="Use a dot for decimal values." />
          </div>
          <div className="inputGroup" style={{ paddingBottom: '25px' }}>
            <div className="label">Variable Costs for Training of Chiefs ($)</div>
            <TextInput value={variableCostsTrainChiefs} setValue={setVariableCostsTrainChiefs} placeholder="Use a dot for decimal values." />
          </div>
        </div>

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
          <FadeLoader color={'#FFA62B'} loading={loading} />
        </div>
      )}
    </div>
  );
};

const TextInput = ({ label, value, setValue, placeholder }) => {
  return (
    <div>
      <label>{label}</label>
      <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} />
    </div>
  );
};

export default GlobalParameterbox;