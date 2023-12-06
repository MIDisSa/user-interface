import React, { useEffect, useState, useRef } from "react";
import ModelBox from './components/modelbox/Modelbox';
import ResultBox from './components/resultbox/Resultbox';
import ResultboxOptimizer from "./components/resultboxOptimizer/ResultboxOptimizer";
import OptimizerBox from './components/optimizerbox/Optimizerbox';
import Button from "./components/button/Button";
import GlobalParameterbox from "./components/globalParameterBox/GlobalParameterbox";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import ZKSDLogo from './netzwerk-zksd-1.png';
import UZHLogo from './uzh_logo_e_pos_web_main.jpg';


import './App.css'; 

const App = () => {
    const fileInputRef = useRef();
    const [adopters, setAdopters] = useState(null);
    const [awareFarmers, setAwareFarmers] = useState(null);
    const [outputParameters, setOutputParameters] = useState({}); // different, bc its supposed to be an object
    const [totalCost, setTotalCost] = useState(null);
    const [awareFarmersPerTick, setAwareFarmersPerTick] = useState(null);
    const [adoptersPerTick, setAdoptersPerTick] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [formData, setFormData] = useState({}); // thats for the form like data representation
    const [successMessage, setSuccessMessage] = useState(null); // state for displaying success message
    const [reload, setReload] = useState(false); // state for reloading the page after deleting result history
    const [optimizationResults, setOptimizationResults] = useState(() => {
        // initial value from local storage or default to an empty array
        const savedResults = localStorage.getItem('optimizationResults');
        return savedResults ? JSON.parse(savedResults) : [];
    });

    const [extraOptimizationParameters, setExtraOptimizationParameters] = useState({
        frequencyDirectAd: '',
        directAdType: '',
        frequencyChiefTraining: '',
        numberOfTicks: '',
      });
    
      const updateOptimizationParameters = (newParameters) => {
        setExtraOptimizationParameters(newParameters);
        };

    const PARAM_MAPPING = {
        "avgIntraMentionPercentage" : "Mention Probability (%)",
        "percentageNegativeWoM" : "Negative Word-of-Mouth Probability (%)",    
        "baseAdoptionProbability" : "Adoption Probability (%)",
        "nrDefaultFriendsInterVillage": "Number of Friends Inter Village",
        "avgIntraVillageInteractionFrequency" : "Intra Village Interaction Frequency (days)",
        "avgInterVillageInteractionFrequency" : "Inter Village Interaction Frequency (days)",
        "avgChiefFarmerMeetingFrequency": "Farmgroup Meeting Frequency (days)",
        "trainChiefInfluence": "Relative Chief Influence Factor",
    };

    const TOOLTIP_CONTENT = {
        "avgIntraMentionPercentage": "Average probability that the innovation comes up as a topic during an interaction.​",
        "percentageNegativeWoM": "Probability of an interaction being unfavorable in regard to the innovation.​",
        "baseAdoptionProbability": "Base probability of an agent adopting the innovation.",
        "nrDefaultFriendsInterVillage": "Average number of friends an agent has outside the village he lives in.",
        "avgIntraVillageInteractionFrequency": "Average number of days elapsed between intra-village interactions started by an agent.",
        "avgInterVillageInteractionFrequency": "Average number of days elapsed between inter-village interactions started by an agent​.",
        "avgChiefFarmerMeetingFrequency": "Average number of days elapsed between farmgroup meetings.",
        "trainChiefInfluence": "Relative influence of a chief on a regular agent during an interaction. E.g. factor of 2 means a chief has twice the influence of a regular agent. ",
    };

    const initialParameters = Object.keys(PARAM_MAPPING).reduce((obj, key) => {
        obj[key] = '';  // set default value for each parameter
        return obj;
    }, {});
    const [parameters, setParameters] = useState(initialParameters);

    const resetForm = (e) => {
        
        e.preventDefault();

        fetch('http://localhost:8080/resetInput', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',},
        })
        .then(response => response.json()) // Transform the response to JSON
        .then(workingDataInput => {
            setParameters(workingDataInput);
        })
        .catch(error => {
            console.error('Network error when trying to reset:', error);
        });
    };

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
                const errorMessage = await response.json();
                window.alert(errorMessage.message)
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
        
        try {
        if (storedParameters) {
            const parsedParameters = JSON.parse(storedParameters);
            setParameters(parsedParameters);
        } 
        } catch (error) {
                console.error('Error parsing parameters from local storage:', error);
            }
    }, []);

    useEffect(() => {
        // Update local storage when optimizationResults change
        localStorage.setItem('optimizationResults', JSON.stringify(optimizationResults));
    }, [optimizationResults]);

   

     // Update formData when parameters change
     useEffect(() => {
        setFormData(parameters);
    }, [parameters]);

    // to get data from Optimizerbox to Optimizer Resultbox
    const handleNewOptimizationResult = (newResult) => {
        setOptimizationResults(prevResults => [...prevResults, newResult]);
    };
    
    

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
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000', 
            },
            body: JSON.stringify(formData)
        });

        if (response.status === 200) {
            setSuccessMessage("Parameters were successfully set in the model!"); // Display message
        } else {
            const errorMessage = await response.json();
            window.alert(errorMessage.message)
            throw new Error('Failed to update parameters.');
        }

    } catch (error) {
        console.error('Error sending data:', error);
    }
    };

    const handleDeleteHistory = async (e) => {

        try { // call endpoint to delete result history in export CSVs
            const response = await fetch('http://localhost:8080/clearResultCSVs', {
                method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000', 
            },
        });

        if (response.status === 200) {
            setSuccessMessage("Result CSV successfully cleared!"); // Display message
        } else {
            const errorMessage = await response.json();
            window.alert(errorMessage.message)
            throw new Error('Failed to clear result CSV.');
        }

        // reset model results
        setAdopters(null);
        setAwareFarmers(null);
        setTotalCost(null);
        setAwareFarmersPerTick(null);
        setAdoptersPerTick(null);

        // reset optimization results
        setOptimizationResults([]);

        // reload to clear results table
        setReload(!reload);

        } catch (error) {
            console.error('Error sending data:', error);
        }
    };
    
    console.log({ awareFarmersPerTick, adoptersPerTick });

    return (
        <div className="App">
            <div className="sunflowerBackground">
                <div className="App-content">
                    <h1>Agent-based Model for Innovation Diffusion</h1>
                    <div className="ConfigurationBox">
                        <p className="description-text" style={{ textAlign: 'left', paddingLeft: '10%' , paddingRight: '10%' }}> 
                            Before running the model/optimizer, all parameters must be set.​ Either insert parameters manually, use default settings or upload a CSV-File (in the same format as the LED-Project survey) to generate parameters automatically.​ Changes must be saved before running the model/optimizer.​<br></br>
                            The Optimizer works on a model that implements all the parameters entered below. <br></br> Hovering over the <span className="tooltip-trigger">?</span> provides additional information about parameters or functionality.
                        </p>
                        <div className="CSVandGlobalParameterBox" style={{ textAlign: 'left', paddingLeft: '10%' , paddingRight: '10%' }}>
                            <div className="CSVBox">
                                <h2 className="h2-spacing">Empirically Defined Global Parameters</h2>
                                <div className="centeredDataInput"> 
                                <div className="uploadContainer">
                                <input type="file" ref={fileInputRef} />
                                <Button label="Upload CSV"
                                    onClick={handleUploadRawCSV}
                                    title="Upload the CSV file and extract parameters."
                                    style={{ marginLeft: '100px' }} />
                                </div>
                                {/* Form for Parameters in table  */}
                                <form onSubmit={handleSubmit} style={{paddingBottom: '20px'}}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Parameter  </th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(formData)
                                                .filter(([key]) => PARAM_MAPPING[key])
                                                .map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td>
                                                            {PARAM_MAPPING[key]}
                                                            <span className="tooltip-trigger" data-tooltip-id={key} data-tooltip-content={TOOLTIP_CONTENT[key]}>?</span>
                                                            <ReactTooltip id={key} place="top" effect="solid" />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={key}
                                                                value={value}
                                                                onChange={handleInputChange}
                                                                placeholder="Use a dot for decimal values."
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </form>
                                </div>
                                <div className="flexContainerGlobalParameterbox">
                                <Button label="Save Empirical Parameters" type="submit" onClick={handleSubmit} title={"Changes must be saved before running the model/optimizer.​"} />
                                <Button label="Set to Default" variant="outlined-blue" onClick={resetForm} title={"Resets values to a reasonable default that yields a stable result."} style={{padding: '20px'}}/>
                                </div>
                            </div>
                            < GlobalParameterbox> </GlobalParameterbox>
                        </div>

                        {/* we need that here bc this is teh parent container of model and result. The info comes from model but needs to be known in result */}
                    </div>
                    <div className="ModelAndOptimizerBox">
                        <ModelBox
                            setAdopters={setAdopters}
                            setAwareFarmers={setAwareFarmers}
                            setTotalCost={setTotalCost}
                            setAwareFarmersPerTick={setAwareFarmersPerTick}
                            setAdoptersPerTick={setAdoptersPerTick}
                            setExtraOptimizationParameters={setExtraOptimizationParameters}
                            updateOptimizationParameters={updateOptimizationParameters}
                        />
                        <OptimizerBox extraOptimizationParameters={extraOptimizationParameters} setAdopters={setAdopters} setTotalCost={setTotalCost} setAwareFarmers={setAwareFarmers} setOutputParameters={handleNewOptimizationResult} />
                    </div>
                </div>
                <div className="majorResultContainer ">
                    <div className="numbered-heading">
                        <div className="number-circle">3</div>
                        <h2>Results</h2>
                    </div>
                    <div className="result-container" id="results">
                        <div className="result-box">
                            <ResultBox adopters={adopters} awareFarmers={awareFarmers} totalCost={totalCost} awareFarmersPerTick={awareFarmersPerTick} adoptersPerTick={adoptersPerTick} />
                        </div>
                        <div className="result-box">
                            <ResultboxOptimizer optimizationResults={optimizationResults} />
                        </div>
                    </div>
                    <Button variant="large" label="Clear Result History" type="submit" onClick={handleDeleteHistory} title={"Clears all results of previous model and optimizer runs.​"} />
                </div>
                <div class="darkBlueBackground">
                    <div className="footer-text">
                        <p>ABM Tanzania</p>
                    </div>
                    <div className="footer-logo">
                        <img src={UZHLogo} alt="UZH Logo" />
                        <img src={ZKSDLogo} alt="ZKSD Logo" />
                    </div>
                </div>
                <div class="turquoiseBackground">
                    <p>Developed by Joël Inglin, Ann-Kathrin Kübler and Hannah Rohe at University of Zurich, supervised by Prof. Lorenz Hilty and Dr. Matthias Huss. Based on concepts by Marc Zwimpfer. © 2023.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
