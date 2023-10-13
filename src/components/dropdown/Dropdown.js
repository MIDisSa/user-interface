import React from "react";

const Dropdown = ({ label, options }) => {
    return (
        <div>
            <label>{label}</label>
            <select>
                <option value="">Select...</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
