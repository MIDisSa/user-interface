
import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import React, { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import './Modelbox.css';


const ModelBox = props => {

    const [frequencyDirectAd, setFrequencyDirectAd] = useState(''); //TODO: update default values?
    const [directAdType, setDirectAdType] = useState('');
    const [frequencyChiefTraining, setFrequencyChiefTraining] = useState('');
    const [numberOfTicks, setNumberOfTicks] = useState('');
    const [loading, setLoading] = useState(false);

    // state to keep track of combined parameters
    const [extraOptimizationParameters, setExtraOptimizationParameters] = useState({
        frequencyDirectAd: '',
        directAdType: '',
        frequencyChiefTraining: '',
        numberOfTicks: '',
    });

    // useEffect to update extraOptimizationParameters whenever individual parameter changes
    useEffect(() => {
        setExtraOptimizationParameters({
            frequencyDirectAd,
            directAdType,
            frequencyChiefTraining,
            numberOfTicks,
        });
    }, [frequencyDirectAd, directAdType, frequencyChiefTraining, numberOfTicks]);



    const runModel = async (gui) => {

        setLoading(true);

        const inputData = {
            frequencyDirectAd,
            directAdType,
            frequencyChiefTraining,
            numberOfTicks,
        };
    
        console.log('Sending data to backend:', inputData);
    
        try {
            // Sending POST request 
            const response = await fetch('http://localhost:8080/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputData)
            });
    
            if (response.ok) {
                const jsonResponse = await response.json(); 
    
                console.log('Data from backend:', jsonResponse);
    
                // Update state in App - wie aktualisieren
                props.setAwareFarmers(parseFloat(jsonResponse.awareFarmers));
                props.setAdopters(parseFloat(jsonResponse.adopters));
                props.setTotalCost(parseFloat(jsonResponse.totalCost));
                props.setAwareFarmersPerTick(jsonResponse.awareFarmersPerTick.map(Number));
                props.setAdoptersPerTick(jsonResponse.adoptersPerTick.map(Number));
                props.setExtraOptimizationParameters(extraOptimizationParameters);
            } else {
                const errorMessage = await response.json();
                window.alert(errorMessage.message)
                console.error('Error with response:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch Error:', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const TOOLTIP_CONTENT = {
        "frequencyDirectAd": "Number of days between the Direct Ad interventions​.",
        "directAdType": "Type of the Direct Ad Intervention​.",
        "frequencyChiefTraining": "Number of days between Chief Trainings​",
        "numberOfTicks": "Number of days the model is run​. This also applies to the optimizer)​"
      };


    return (
        <div className="modelBox">
          <div className="numbered-heading">
            <div className="number-circle">1</div>
            <h2>Model</h2>
          </div>

          <div className="flexContainerModelbox">
              <div className="flexContainerTooltipParameter">
                <TextInput label="Treatment Frequency:" value={frequencyDirectAd} setValue={setFrequencyDirectAd} />
                <span className="tooltip-trigger" data-tooltip-id="frequencyDirectAdTip" data-tooltip-content={TOOLTIP_CONTENT.frequencyDirectAd}>?</span>
                <ReactTooltip id="frequencyDirectAdTip" place="top" effect="solid"/>
              </div>
              <div className="flexContainerTooltipParameter">
                    <Dropdown label="Treatment Arm:" value={directAdType} setValue={setDirectAdType}>
                    <option disabled value="">
                        Please choose a type
                    </option>
                    <option value="Direct Ad">Direct Ad</option>
                    <option value="Direct Ad + Discount">Direct Ad + Discount</option>
                    <option value="Direct Ad + Deferred Payment">Direct Ad + Deferred Payment</option>
                    <option value="Direct Ad + Deferred P. + Discount">Direct Ad + Deferred P. + Discount</option>
                    </Dropdown>
                    <span className="tooltip-trigger" data-tooltip-id="directAdType" data-tooltip-content={TOOLTIP_CONTENT.directAdType}>?</span>
                    <ReactTooltip id="directAdType" place="top" effect="solid"/>
                </div>  
            </div>
            <div className="flexContainerModelbox">-
                <div className="flexContainerTooltipParameter">
                <TextInput label="ToT Frequency:" value={frequencyChiefTraining} setValue={setFrequencyChiefTraining} />
                <span className="tooltip-trigg  er" data-tooltip-id="frequencyChiefTraining" data-tooltip-content={TOOLTIP_CONTENT.frequencyChiefTraining}>?</span>
                    <ReactTooltip id="frequencyChiefTraining" place="top" effect="solid"/>
                </div>  
                <div className="flexContainerTooltipParameter">
                <TextInput label="Number of Days:" value={numberOfTicks} setValue={setNumberOfTicks} />
                <span className="tooltip-trigger" data-tooltip-id="numberOfTicks" data-tooltip-content={TOOLTIP_CONTENT.numberOfTicks}>?</span>
                    <ReactTooltip id="numberOfTicks" place="top" effect="solid"/>
                </div>  
            </div>
            <div className="flexContainer">
                <Button label="Start Model without NetLogo GUI" onClick={() => runModel(false)} variant="solid-orange"/>
                {/* <Button label="Start Model with NetLogo GUI" onClick={() => runModel(true)} variant="solid-orange"/> */}
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


export default ModelBox;
