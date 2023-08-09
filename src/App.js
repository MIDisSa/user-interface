import './App.css';

import React, { useState } from 'react';

export default function MyApp() {

  const [adopters, setAdopters] = useState(null);
  const [awareFarmers, setAwareFarmers] = useState(null);

  const handleClick = async () => {
    try {
      console.log("start fetching")
      const response = await fetch("http://localhost:8080/results");
      const data = await response.json();
      console.log("fetched data")
      setAdopters(data["adopters"]);
      setAwareFarmers(data["awareFarmers"])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Click button to run netlogo model:</h1>
      <button onClick={handleClick}>
        Button
      </button>
      <p> number of adopters: {adopters} </p>
      <p> number of aware farmers: {awareFarmers} </p>
    </div>
  );
}

