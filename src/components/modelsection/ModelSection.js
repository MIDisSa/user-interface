import React from 'react';
import './ModelSection.css';

function ModelSection() {
  return (
    <div className="model-section">
    <h1>Click button to run netlogo model: blbalbla6666</h1>
      <select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        // ... other options
      </select>
      
      <select>
        // ... options
      </select>
      
      <select>
        // ... options
      </select>
      
      <input type="text" placeholder="Type here..." />

      <button className="orange-button">Button 1</button>
      <button className="orange-button">Button 2</button>
    </div>
  );
}

export default ModelSection;
