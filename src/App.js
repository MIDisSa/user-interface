import React, { useEffect, useState, useRef } from "react";
import ModelBox from './components/modelbox/Modelbox';
import ResultBox from './components/resultbox/Resultbox';
import ResultboxOptimizer from "./components/resultboxOptimizer/ResultboxOptimizer";
import OptimizerBox from './components/optimizerbox/Optimizerbox';
import Button from "./components/button/Button";
import { Tooltip as ReactTooltip } from 'react-tooltip';



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
        "avgIntraMentionPercentage" : "Average Mention Percentage",//TODO: probably rename/change parameter 
        "percentageNegativeWoM" : "Negative Word-of-Mouth in percentage",    
        "baseAdoptionProbability" : "Base Adoption Probability",
        "nrDefaultFriendsInterVillage": "Number of Default Friends (Inter-Village)",
        "avgIntraVillageInteractionFrequency" : "Average Intra Village Interaction Frequency",
        "avgInterVillageInteractionFrequency" : "Average Inter Village Interaction Frequency",
        "avgChiefFarmerMeetingFrequency": "Average Chief Farmer Meeting Frequency",
        "trainChiefInfluence": "Training Chief Influence",
    };

    const TOOLTIP_CONTENT = {
        "avgIntraMentionPercentage": "This represents the average percentage of conversations within a community in which the new agricultural technique is mentioned.",
        "percentageNegativeWoM": "This is the percentage of word-of-mouth communication that is negative towards the new technique, potentially discouraging adoption.",
        "baseAdoptionProbability": "This base probability affects how likely an individual is to adopt the new technique after hearing about it.",
        "nrDefaultFriendsInterVillage": "The default number of friends an individual has in other villages, which can influence the spread of information.",
        "avgIntraVillageInteractionFrequency": "The average frequency at which individuals within the same village interact with each other.",
        "avgInterVillageInteractionFrequency": "The average frequency of interaction between individuals from different villages.",
        "avgChiefFarmerMeetingFrequency": "How often the village chief meets with farmers, which can be a strong influence on their decisions.",
        "trainChiefInfluence": "The influence rating of trained village chiefs, which could lead to faster adoption of the technique through their endorsement.",
    };

    const initialParameters = Object.keys(PARAM_MAPPING).reduce((obj, key) => {
        obj[key] = '';  // set default value for each parameter
        return obj;
    }, {});
    const [parameters, setParameters] = useState(initialParameters);

    const resetForm = () => {
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
      

    console.log({ awareFarmersPerTick, adoptersPerTick });

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
                        <Button  label="Upload raw csv"  onClick={handleUploadRawCSV} title="Click to upload the raw CSV file" />
                        <p className="description-text"> 
                        Your final parameters: 
                        </p>


                        {/* Form for Parameters in table  */}
                        <form onSubmit={handleSubmit} >
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
                                                <ReactTooltip id={key}  place="top" effect="solid" />
                                                </td>
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
                        <Button label="Set parameters again to run model/optimizer" type="submit" onClick={handleSubmit} />
                        <Button label="Set parameters back to default" variant="outlined-blue" onClick={resetForm} />
                        </form>

                        <p className="description-text"> 
                        Please note: The Model can be run without the Optimizer. When you run the Optimizer, it will take into account the settings within the Model selection below. 
                        </p>
                    </div>
                    <div className="OptimizerBox">
                        <OptimizerBox extraOptimizationParameters={extraOptimizationParameters} setAdopters={setAdopters} setTotalCost={setTotalCost} setAwareFarmers={setAwareFarmers} setOutputParameters={handleNewOptimizationResult} />
                    </div> 

                {/* we need that here bc this is teh parent container of model and result. The info comes from model but needs to be known in result */}
                </div>
                <ModelBox 
                    setAdopters={setAdopters} 
                    setAwareFarmers={setAwareFarmers} 
                    setTotalCost={setTotalCost}
                    setAwareFarmersPerTick={setAwareFarmersPerTick}
                    setAdoptersPerTick={setAdoptersPerTick} 
                    setExtraOptimizationParameters={setExtraOptimizationParameters} 
                    updateOptimizationParameters={updateOptimizationParameters}
                />

                <div className ="majorResultContainer">
                <div className="numbered-heading">
                        <div className="number-circle">3</div>
                        <h2>The Results</h2>
                    </div>
                <div className="result-container">
                    <div className="result-box">
                        <ResultBox adopters={adopters} awareFarmers={awareFarmers} totalCost={totalCost} awareFarmersPerTick={awareFarmersPerTick} adoptersPerTick={adoptersPerTick}/>
                    </div>
                    <div className="result-box">
                        <ResultboxOptimizer optimizationResults={optimizationResults} />
                    </div>
                </div>
                </div>
            </div>    
        </div>
    );
};

export default App;
