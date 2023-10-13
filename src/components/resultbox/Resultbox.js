import React from 'react';
import './Resultbox.css';

const ResultBox = ({ adopters, awareFarmers }) => {
  return (
    <div className="result-box">
        <h2>The Result</h2>
        <p>Number of adopters: {adopters}</p>
        <p>Number of aware farmers: {awareFarmers}</p>
    </div>
  );
};

export default ResultBox;
