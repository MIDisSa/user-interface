import React, { useEffect, useState, useRef } from "react";
import ModelBox from './components/modelbox/Modelbox';
import ResultBox from './components/resultbox/Resultbox';
import ResultboxOptimizer from "./components/resultboxOptimizer/ResultboxOptimizer";
import OptimizerBox from './components/optimizerbox/Optimizerbox';
import Button from "./components/button/Button";
import GlobalParameterbox from "./components/globalParameterBox/GlobalParameterbox";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import ZKSDLogo from './netzwerk-zksd-1.png';
import UZHLogo from './uzh_logo_d_neg.png';
import MyPDF from './components/ABM_Report-preliminary.pdf';



import './App.css';

const App = () => {
    const fileInputRef = useRef();
    const [adopters, setAdopters] = useState(null);
    const [awareFarmers, setAwareFarmers] = useState(null);
    const [totalCost, setTotalCost] = useState(null);
    const [awareFarmersPerTick, setAwareFarmersPerTick] = useState(null);
    const [adoptersPerTick, setAdoptersPerTick] = useState(null);
    const [formData, setFormData] = useState({}); // thats for the form like data representation
    const [formDataNoComma, setFormDataNoComma] = useState({}); // form data with commas removed
    const [reload, setReload] = useState(false); // state for reloading the page after deleting result history
    const [optimizationResults, setOptimizationResults] = useState(() => {
        // initial value from local storage or default to an empty array
        const savedResults = localStorage.getItem('optimizationResults');
        return savedResults ? JSON.parse(savedResults) : [];
    });

    const [confirmation, setConfirmation] = useState({
        show: false,
        message: ''
    });

    const handleConfirmation = (message) => {
        setConfirmation({ show: true, message: message });
        setTimeout(() => setConfirmation({ show: false, message: '' }), 3000);
    };

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
        "trainChiefInfluence": "ToT Influence",
        "nrDefaultFriendsInterVillage": "Number of Friends Inter-Village",
        "avgIntraVillageInteractionFrequency": "Intra-Village Interaction Frequency (days)",
        "avgInterVillageInteractionFrequency": "Inter-Village Interaction Frequency (days)",
        "avgChiefFarmerMeetingFrequency": "Farmgroup Meeting Frequency (days)",
        "avgIntraMentionPercentage": "Intra-Village Mention Probability (%)",
        "avgInterMentionPercentage": "Inter-Village Mention Probability (%)",
        "percentageNegativeWoM": "Negative Word-of-Mouth Probability (%)",
        "baseAdoptionProbability": "Adoption Probability (%)",
    };

    const TOOLTIP_CONTENT = {
        "avgIntraMentionPercentage": "Average probability for the innovation to come up as a topic during an intra-village interaction.​",
        "avgInterMentionPercentage": "Average probability for the innovation to come up as a topic during an inter-village interaction.​",
        "percentageNegativeWoM": "Probability of an interaction being unfavorable regarding the innovation.​",
        "baseAdoptionProbability": "Base probability of an agent adopting the innovation.",
        "nrDefaultFriendsInterVillage": "Average number of friends an agent has outside the village they live in.",
        "avgIntraVillageInteractionFrequency": "Average number of days between intra-village interactions initiated by an agent.",
        "avgInterVillageInteractionFrequency": "Average number of days between inter-village interactions initiated by an agent​.",
        "avgChiefFarmerMeetingFrequency": "Average number of days between farmgroup meetings.",
        "trainChiefInfluence": "Measures the impact of ToTs (Training of Trainers) on the attitude of Chiefs regarding the innovation. E.g. 1.88 means a chief has a 88% chance to be an adopter after they received a training.",
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
                'Content-Type': 'application/json',
            },
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

    // auto-hiding the pop up
    useEffect(() => {
        if (confirmation.show) {
            const timer = setTimeout(() => {
                setConfirmation(prev => ({ ...prev, show: false }));
            }, 3000); // Adjust time as needed

            return () => clearTimeout(timer);
        }
    }, [confirmation.show]);

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
        setFormDataNoComma(parameters);
    }, [parameters]);

    // to get data from Optimizerbox to Optimizer Resultbox
    const handleNewOptimizationResult = (newResult) => {
        setOptimizationResults(prevResults => [...prevResults, newResult]);
    };

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


    // Handle form field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = formatNumber(value);
        setFormData(prevData => ({
            ...prevData,
            [name]: formattedValue
        }));
        setFormDataNoComma(prevData => ({
            ...prevData,
            [name]: value.replaceAll(",", "")
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
                body: JSON.stringify(formDataNoComma)
            });

            if (response.status === 200) {
                setConfirmation({
                    show: true,
                    message: "Empirical Parameters were successfully set in the model!"
                });
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
                        {confirmation.show && (
                            <div className="confirmation-popup">
                                <p style={{ color: 'green', fontWeight:'bold', fontSize: '40px' }}>
                                    &#10003;
                                </p>
                            {confirmation.message}
                          </div>
                        )}
                        <p className="description-text" style={{ textAlign: 'left', paddingLeft: '10%', paddingRight: '10%' }}>
                            Before running the model/optimizer, all parameters must be set.​ Either insert parameters manually, use default settings or upload a CSV-File in the same format as stated in Table C.5 in <a href={MyPDF} target="_blank" rel="noopener noreferrer">here</a> to generate parameters automatically.​
                            <br></br>
                            Make sure to save your changes before running the model/optimizer. Otherwise default values will be used.​<br></br>
                            <br></br> Hovering over the <span className="tooltip-trigger">?</span> provides short additional information about parameters or functionality. For an extensive description of each parameter consult the accompanying report.
                        </p>
                        <div className="CSVandGlobalParameterBox" style={{ textAlign: 'left', paddingLeft: '10%', paddingRight: '10%' }}>
                            <div className="CSVBox">
                                <h2 className="h2-spacing">Empirically Defined Global Parameters</h2>
                                <div className="centeredDataInput">
                                    <div className="uploadContainer">
                                        <input type="file" ref={fileInputRef} />
                                        <Button label="Upload CSV"
                                            onClick={handleUploadRawCSV}
                                            title="Upload the CSV file to extract parameters."
                                            style={{ marginLeft: '100px' }} />
                                    </div>
                                    {/* Form for Parameters in table  */}
                                    <form onSubmit={handleSubmit} style={{ paddingBottom: '20px' }}>
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
                                    <Button label="Save Empirical Parameters" type="submit" onClick={handleSubmit} />
                                    <Button label="Set to Default" variant="outlined-blue" onClick={resetForm} title={"Resets values to a reasonable default that yields a stable result."} style={{ padding: '20px' }} />
                                </div>
                            </div>
                            < GlobalParameterbox onConfirmation={handleConfirmation} >
                                {confirmation.show && (
                                    <div className="confirmation-popup">
                                        {confirmation.message}
                                    </div>
                                )}
                            </GlobalParameterbox>
                        </div>

                        {/* we need that here bc this is the parent container of model and result. The info comes from model but needs to be known in result */}
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
                        <p>ABM for Innovation Diffusion</p>
                    </div>
                    <div className="footer-logo">
                        <img src={UZHLogo} alt="UZH Logo" />
                        <img src={ZKSDLogo} alt="ZKSD Logo" />
                    </div>
                </div>
                <div class="turquoiseBackground">
                    <p>
                        This work is licensed under&nbsp;
                        <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                            target="_blank"
                            rel="license noopener noreferrer"
                            style={{ display: 'inline-block' }}>
                            CC BY-NC-SA 4.0
                            <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="Creative Commons" />
                            <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="Attribution" />
                            <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                                src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt="Non-Commercial" />
                            <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="Share Alike" />
                        </a>
                    </p>
                    <p>Developed by Joël Inglin, Ann-Kathrin Kübler and Hannah Rohe at University of Zurich, supervised by Prof. Lorenz Hilty and Dr. Matthias Huss. Based on concepts by Marc Zwimpfer. © 2023.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
