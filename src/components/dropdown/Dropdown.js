import React from "react";
const Dropdown = ({ label, value, setValue, children }) => {
    return (
      <div>
        <label>{label}</label>
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          {children}
        </select>
      </div>
    );
  };

export default Dropdown;