import React, { useState } from "react";
import ModelBox from './components/modelbox/Modelbox';
import ResultBox from './components/resultbox/Resultbox';
import OptimizerBox from './components/optimizerbox/Optimizerbox';
import Button from "./components/button/Button";
import Papa from 'papaparse';
import axios from 'axios';
import './App.css'; 

const App = () => {
    const [adopters, setAdopters] = useState(null);
    const [awareFarmers, setAwareFarmers] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [parameters, setParameters] = useState([
        {name: 'Param 1', value: 0},
        {name: 'Param 2', value: 0},
        {name: 'Param 3', value: 0},
        {name: 'Param 4', value: 0},
    ]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                setCsvData(results.data);
                handleSendToBackend(results.data);
            }
        });
    };

    const handleSendToBackend = async (data) => {
        try {
            const response = await axios.post('YOUR_BACKEND_ENDPOINT', { data });
            console.log(response.data);
            // need response.data.parameters to give me array of parameters from backend oder so ähnlich 
            setParameters(response.data.parameters || []); // update parameters state
        } catch (error) {
            console.error("An error occurred while sending data", error);
        }
    };
    

    return (
        <div className="App">
            <div className="App-content">
                <h1>Agent-based Model Tanzania</h1>

                <div className="ConfigurationBox">

                    <div className="CSVBox">
                    
                        <p className="description-text"> 
                        Start with setting your parameters. Either you use our prepared data pre-processing script or you fill the final clean csv manually by yourself. Keep in mind to stick with the given format of the final csv.
                        </p>

                        <input type="file" accept=".csv" onChange={handleFileUpload} />

                        <Button label="upload raw csv" onClick={() => {}} />
                        <Button label="upload final csv" onClick={() => {}} />
                        <Button label="download empty final csv" onClick={() => {}} variant="outlined-blue" />

                        {csvData && csvData.length > 0 &&
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
                        }
                        <p className="description-text"> 
                        Your final set parameters: 
                        </p>

                        {/* Shw Parameters */}
                        <table>
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parameters.map((param, index) => (
                                    <tr key={index}>
                                        <td>{param.name}</td>
                                        <td>{param.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <p className="description-text"> 
                        Please note: The Model can be run without the Optimizer. When you run the Optimizer, it will take into account the settings within the Model selection below. 
                        </p>
                    </div>
                    { <div className="OptimizerBox">
                        <OptimizerBox setAdopters={setAdopters} setAwareFarmers={setAwareFarmers} />
                        </div> }

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
