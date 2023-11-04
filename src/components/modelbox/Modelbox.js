
import Button from '../button/Button';
import Dropdown from '../dropdown/Dropdown';
import React, { useState } from 'react';

import './Modelbox.css';


const ModelBox = props => {

    const [frequencyDirectAd, setFrequencyDirectAd] = useState(''); //TODO: update default values?
    const [directAdType, setDirectAdType] = useState('');
    const [frequencyChiefTraining, setFrequencyChiefTraining] = useState('');
    const [numberOfTicks, setNumberOfTicks] = useState('');



    const runModel = async (gui) => {
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
    
                // Update state in App
                props.setAwareFarmers(parseFloat(jsonResponse.awareFarmers));
                props.setAdopters(parseFloat(jsonResponse.adopters));
                props.setTotalCost(parseFloat(jsonResponse.totalCost));
                props.setAwareFarmersPerTick(jsonResponse.awareFarmersPerTick.map(Number));
                props.setAdoptersPerTick(jsonResponse.adoptersPerTick.map(Number));
            } else {
                console.error('Error with response:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch Error:', error.message);
        }
    };
    


    return (
        <div className="modelBox">
          <h2>The Model</h2>
          <div className="flexContainer">
            <TextInput label="Frequency Direct Ad:" value={frequencyDirectAd} setValue={setFrequencyDirectAd} />
            <Dropdown label="Type Direct Ad:" value={directAdType} setValue={setDirectAdType}>
              <option disabled value="">
                Please choose a type
              </option>
              <option value="Direct Ad">Direct Ad</option>
              <option value="Direct Ad + Discount">Direct Ad + Discount</option>
              <option value="Direct Ad + Delayed Payment">Direct Ad + Delayed Payment</option>
              <option value="Direct Ad + Delayed P. + Discount">Direct Ad + Delayed P. + Discount</option>
            </Dropdown>

            <TextInput label="Frequency Chief Training:" value={frequencyChiefTraining} setValue={setFrequencyChiefTraining} />
            <TextInput label="Number of Ticks:" value={numberOfTicks} setValue={setNumberOfTicks} />
          </div>
          
          <div className="flexContainer">
            <Button label="Start Model without NetLogo GUI" onClick={() => runModel(false)} variant="solid-orange"/>
            <Button label="Start Model with NetLogo GUI" onClick={() => runModel(true)} variant="solid-orange"/>
          </div>
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
