import React, { useEffect, useState, useRef } from "react";
import ModelBox from './components/modelbox/Modelbox';
import ResultBox from './components/resultbox/Resultbox';
import OptimizerBox from './components/optimizerbox/Optimizerbox';
import Button from "./components/button/Button";
import Papa from 'papaparse';
import axios from 'axios';
import './App.css'; 

const App = () => {
    const fileInputRef = useRef();
    const [adopters, setAdopters] = useState(null);
    const [awareFarmers, setAwareFarmers] = useState(null);
    const [csvData, setCsvData] = useState([]);
    //const [parameters, setParameters] = useState([]);
    const [formData, setFormData] = useState({}); // thats for the form like data representation
    const [successMessage, setSuccessMessage] = useState(null); // state for displaying success message

    const PARAM_MAPPING = {
        "trainChiefInfluence": "Training Chief Influence",
        "avgIntraMentionPercentage" : "Average Mention Percentage",//TODO: probably rename/change parameter  
        "percentageNegativeWoM" : "Negative Word-of-Mouth in percentage",
        "baseAdoptionProbability" : "Base Adoption Probability",
        "nrDefaultFriendsInterVillage": "Number of Default Friends (Inter-Village)",
        "avgIntraVillageInteractionFrequency" : "Average Intra Village Interaction Frequency",
        "avgInterVillageInteractionFrequency" : "Average Inter Village Interaction Frequency",
        "avgChiefFarmerMeetingFrequency": "Average Chief Farmer Meeting Frequency",
    };

    const initialParameters = Object.keys(PARAM_MAPPING).reduce((obj, key) => {
        obj[key] = '';  // set default value for each parameter
        return obj;
    }, {});
    const [parameters, setParameters] = useState(initialParameters);

    const handleUploadRawCSV = async () => {
        try {
            const file = fileInputRef.current.files[0];
            const formData = new FormData();
            formData.append("file", file);
    
            const response = await fetch('http://localhost:8080/uploadRawCSV', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
    
            const parameters = await response.json(); //
            setParameters(parameters);
        } catch (error) {
            console.error('File Upload Error:', error);
        }
    };

    
    // Use stored parameters when initializing state
    useEffect(() => {
        const storedParameters = localStorage.getItem('parameters');
        
        if (storedParameters) {
            setParameters(JSON.parse(storedParameters));
        }
    }, []);

     // Update formData when parameters change
     useEffect(() => {
        setFormData(parameters);
    }, [parameters]);

    // Handle form field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); //prevents the form from refreshing

        try {
            const response = await fetch('http://localhost:8080/updateInput', {
                method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.status === 200) {
            setSuccessMessage("Parameters were successfully set in the model!"); // Display message
        } else {
            throw new Error('Failed to update parameters.');
        }

    } catch (error) {
        console.error('Error sending data:', error);
    }
    };
    

    // Change parameter name in nicer strings
    const formatKeyName = (key) => {
        // Split camelCase with space
        let result = key.replace(/([A-Z])/g, ' $1');
    
        // Make the first letter of the result uppercase
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    };

    return (
        <div className="App">
            <div className="App-content">
                <h1>Agent-based Model Tanzania</h1>

                <div className="ConfigurationBox">

                    <div className="CSVBox">
                    
                        <p className="description-text"> 
                        Start with setting your parameters. <br></br>
                        Either you use our prepared data pre-processing script or you fill the table manually by yourself.
                        </p>
                        <input type="file" ref={fileInputRef} />
                        <Button label="upload raw csv" onClick={handleUploadRawCSV} />

                        {/* {csvData && csvData.length > 0 &&
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(csvData[0]).map(key => <th key={key}>{key}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.map((row, index) => (
                                        <tr key={index}>
                                            {Object.values(row).map((cell, idx) => <td key={idx}>{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        } */}
                        <p className="description-text"> 
                        Your final set parameters: 
                        </p>


                        {/* Form for Parameters in table  */}
                        <form onSubmit={handleSubmit} >
                        <table>
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.entries(formData)
                                        .filter(([key]) => PARAM_MAPPING[key])  // Only include keys which mention in PARAM_MAPPING
                                        .map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{PARAM_MAPPING[key]}</td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    name={key} 
                                                    value={value} 
                                                    onChange={handleInputChange} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <Button label="set parameters" type="submit" />
                        </form>

                        <p className="description-text"> 
                        Please note: The Model can be run without the Optimizer. When you run the Optimizer, it will take into account the settings within the Model selection below. 
                        </p>
                    </div>
                    { <div className="OptimizerBox">
                        <OptimizerBox setAdopters={setAdopters} setAwareFarmers={setAwareFarmers} />
                        </div> }

                {/* we need that here bc this is teh parent container of model and result. The info comes from model but needs to be known in result */}
                </div>
                <ModelBox setAdopters={setAdopters} setAwareFarmers={setAwareFarmers} /> 

                <div className="ResultBox">
                    <ResultBox adopters={adopters} awareFarmers={awareFarmers} />
                </div>
            </div>
        </div>
    );
};

export default App;
