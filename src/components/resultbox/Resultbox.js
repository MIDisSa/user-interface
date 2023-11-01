import React from 'react';
import './Resultbox.css';
import LineChart from '../linechart/Linechart';

const ResultBox = ({ adopters, awareFarmers, totalCost, awareFarmersPerTick, adoptersPerTick }) => {
  // Parse awareFarmersPerTick and adoptersPerTick strings into arrays
  const parsedAwareFarmersPerTick = awareFarmersPerTick ? JSON.parse(awareFarmersPerTick) : [];
  const parsedAdoptersPerTick = adoptersPerTick ? JSON.parse(adoptersPerTick) : [];

  return (
    <div className="result-box">
      <h2>The Result</h2>
      <p>Number of adopters: {adopters !== null ? adopters : 'Loading...'}</p>
      <p>Number of aware farmers: {awareFarmers !== null ? awareFarmers : 'Loading...'}</p>
      <p>Total Costs: {totalCost !== null ? totalCost : 'Loading...'}</p>

      {/* Display Line Charts */}
      <div className="line-charts">
        {/* Display Aware Farmers Per Tick Chart */}
        {parsedAwareFarmersPerTick.length > 0 && (
          <div className="line-chart">
            <h3>Aware Farmers Per Tick</h3>
            <LineChart
              data={{
                labels: Array.from({ length: parsedAwareFarmersPerTick.length }, (_, i) => (i + 1).toString()),
                awareFarmersPerTick: parsedAwareFarmersPerTick,
                adoptersPerTick: parsedAdoptersPerTick
              }}
            />

          </div>
        )}

        {/* Display Adopters Per Tick Chart */}
        {parsedAdoptersPerTick.length > 0 && (
          <div className="line-chart">
            <h3>Adopters Per Tick</h3>
            <LineChart
              data={parsedAdoptersPerTick}
              labels={Array.from({ length: parsedAdoptersPerTick.length }, (_, i) => (i + 1).toString())}
              title="Adopters Per Tick"
              yAxisLabel="Number of Adopters"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultBox;
