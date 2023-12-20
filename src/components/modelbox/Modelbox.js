
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
    const [trainChiefsCoverage, setTrainChiefsCoverage] = useState('');
    const [directAdCoverage, setDirectAdCoverage] = useState('');
    const [loading, setLoading] = useState(false);

    // state to keep track of combined parameters
    const [extraOptimizationParameters, setExtraOptimizationParameters] = useState({
        frequencyDirectAd: '',
        directAdType: '',
        frequencyChiefTraining: '',
        trainChiefsCoverage: '',
        directAdCoverage: '',
    });

    // useEffect to update extraOptimizationParameters whenever individual parameter changes
    useEffect(() => {
        setExtraOptimizationParameters({
            frequencyDirectAd,
            directAdType,
            frequencyChiefTraining,
            trainChiefsCoverage,
            directAdCoverage,
        });
    }, [frequencyDirectAd, directAdType, frequencyChiefTraining, trainChiefsCoverage, directAdCoverage]);

    const formatNumber = (number) => {
        // Remove existing commas
        let cleanedNumber = number.toString().replace(/,/g, '');
    
        // Split number into whole and decimal parts if it's a float
        let parts = cleanedNumber.split(".");
    
        // Apply regex to the whole part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
        // Reassemble it
        return parts.join(".");
    };
    

    const runModel = async (gui) => {

        setLoading(true);

        const inputData = {
            frequencyDirectAd,
            directAdType,
            frequencyChiefTraining,
            trainChiefsCoverage,
            directAdCoverage
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
        "frequencyDirectAd": "Number of days between treatments​.",
        "frequencyChiefTraining": "Number of days between ToTs.​",
        "trainChiefsCoverage": "Percentage of villages in which ToTs are carried out. Affects how often the variable costs incur.​",
        "directAdCoverage": "Percentage of villages that are part of the treatment. Affects how often the variable costs incur.",
      };


    return (
        <div className="modelBox">
          <div className="numbered-heading">
            <div className="number-circle">1</div>
            <h2>Model</h2>
          </div>
          <div className="description-text">
                Intervention parameters define how often and which type of an intervention (Treatment Arms and Training of Trainers (ToT)) should be carried out.
                All treatments and ToT start on day 0. If the frequency is set to 0 there will be no intervention of this kind.<br></br>
                In general it is recommended to familiarize yourself with this XX section XX first.
                </div>

          <div className="flexContainerModelbox">
              <div className="flexContainerTooltipParameter">
                <TextInput label="Treatment Frequency (days): " value={formatNumber(frequencyDirectAd)} setValue={setFrequencyDirectAd} />
                <span className="tooltip-trigger" data-tooltip-id="frequencyDirectAdTip" data-tooltip-content={TOOLTIP_CONTENT.frequencyDirectAd}>?</span>
                <ReactTooltip id="frequencyDirectAdTip" place="top" effect="solid"/>
              </div>
              <div className="flexContainerTooltipParameter">
                    <Dropdown label="Treatment Arm: " value={directAdType} setValue={setDirectAdType}>
                    <option disabled value="">
                        Please choose a type
                    </option>
                    <option value="Direct Ad">Direct Ad</option>
                    <option value="Direct Ad + Discount">Direct Ad + Discount</option>
                    <option value="Direct Ad + Deferred Payment">Direct Ad + Deferred Payment</option>
                    <option value="Direct Ad + Deferred P. + Discount">Direct Ad + Deferred P. + Discount</option>
                    </Dropdown>
                </div>  
                <div className="flexContainerTooltipParameter">
                <TextInput label="Treatment Coverage (%): " value={formatNumber(directAdCoverage)} setValue={setDirectAdCoverage} />
                <span className="tooltip-trigger" data-tooltip-id="directAdCoverageTip" data-tooltip-content={TOOLTIP_CONTENT.directAdCoverage}>?</span>
                <ReactTooltip id="directAdCoverageTip" place="top" effect="solid"/>
              </div>
            </div>
            <div className="flexContainerModelbox">
                <div className="flexContainerTooltipParameter">
                <TextInput label="ToT Frequency (days): " value={formatNumber(frequencyChiefTraining)} setValue={setFrequencyChiefTraining} />
                <span className="tooltip-trigger" data-tooltip-id="frequencyChiefTraining" data-tooltip-content={TOOLTIP_CONTENT.frequencyChiefTraining}>?</span>
                    <ReactTooltip id="frequencyChiefTraining" place="top" effect="solid"/>
                </div>  
                <div className="flexContainerTooltipParameter">
                <TextInput label="ToT Coverage (%): " value={formatNumber(trainChiefsCoverage)} setValue={setTrainChiefsCoverage} />
                <span className="tooltip-trigger" data-tooltip-id="trainChiefsCoverage" data-tooltip-content={TOOLTIP_CONTENT.trainChiefsCoverage}>?</span>
                    <ReactTooltip id="trainChiefsCoverage" place="top" effect="solid"/>
                </div>  
            </div>
            <div className="flexContainer">
                <Button label="Start Model" onClick={() => runModel(false)} variant="solid-orange"/>
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
            <input type="text" value={value} onChange={e => setValue(e.target.value)}  style={{ width: '70px' }} />
        </div>
    );
};


export default ModelBox;
