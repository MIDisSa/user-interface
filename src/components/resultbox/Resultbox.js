import React from 'react';
import './Resultbox.css';


const ResultBox = ({ adopters, awareFarmers }) => {
  return (
      <div className="result-box">
          <h2>The Result</h2>
          <p>Number of adopters: {adopters !== null ? adopters : 'Loading...'}</p>
          <p>Number of aware farmers: {awareFarmers !== null ? awareFarmers : 'Loading...'}</p>
      </div>
  );
};


export default ResultBox;
