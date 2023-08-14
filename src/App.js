import React, { useState } from "react";
import backgroundImage from './sunflower.png';

const App = () => {
  const [adopters, setAdopters] = useState(null);
  const [awareFarmers, setAwareFarmers] = useState(null);

  return (
      <div style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Agent-based Model Tanzania</h1>
          <ModelBox setAdopters={setAdopters} setAwareFarmers={setAwareFarmers} />
          <ResultBox adopters={adopters} awareFarmers={awareFarmers} />
      </div>
  );
};


const ModelBox = ({ setAdopters, setAwareFarmers }) => {
  const [isHoveredBtn1, setIsHoveredBtn1] = useState(false); // For the first button
  const [isHoveredBtn2, setIsHoveredBtn2] = useState(false); // For the second button
  const runModel = async (gui) => {
      try {
          const response = await fetch("http://localhost:8080/results");
          const data = await response.json();
          setAdopters(data["adopters"]);
          setAwareFarmers(data["awareFarmers"]);
      } catch (error) {
          console.error("Error fetching data from NetLogo model:", error);
      }
  };

  return (
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '70%', maxWidth: '800px', margin: '10px 0', textAlign: 'center'  }}>
          <h2>The Model</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                  <label>Frequency Direct Ad:</label>
                  <select>
                      <option value="">Select...</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                  </select>
              </div>
              <div>
                  <label>Type Direct Ad:</label>
                  <select>
                      <option value="">Select...</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                  </select>
              </div>
              <div>
                  <label>Frequency Chief Training:</label>
                  <select>
                      <option value="">Select...</option>
                      <option value="Option1">Option1</option>
                      <option value="Option2">Option2</option>
                  </select>
              </div>
              <div>
                  <label>Number of Ticks:</label>
                  <input type="text" />
              </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button 
                    style={{
                        backgroundColor: isHoveredBtn1 ? '#e56d00' : 'orange', 
                        color: 'white', 
                        padding: '10px', 
                        border: 'none', 
                        borderRadius: '5px'
                    }} 
                    onMouseOver={() => setIsHoveredBtn1(true)} 
                    onMouseOut={() => setIsHoveredBtn1(false)}
                    onClick={() => runModel(false)}>
                        Start Model without NetLogo GUI
                </button>
                <button 
                    style={{
                        backgroundColor: isHoveredBtn2 ? '#e56d00' : 'orange', 
                        color: 'white', 
                        padding: '10px', 
                        border: 'none', 
                        borderRadius: '5px'
                    }} 
                    onMouseOver={() => setIsHoveredBtn2(true)} 
                    onMouseOut={() => setIsHoveredBtn2(false)}
                    onClick={() => runModel(true)}>
                        Start Model with NetLogo GUI
                </button>
            </div>
      </div>
  );
};


const ResultBox = ({ adopters, awareFarmers }) => {
  return (
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '70%', maxWidth: '800px', margin: '10px 0', textAlign: 'center'  }}>
          <h2>The Result</h2>
          <p>Number of adopters: {adopters}</p>
          <p>Number of aware farmers: {awareFarmers}</p>
      </div>
  );
};


export default App;
