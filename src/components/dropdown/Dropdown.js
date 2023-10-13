import React from "react";
const Dropdown = ({ label, options, value, setValue }) => {
    return (
        <div>
            <label>{label}</label>
            <select value={value} onChange={e => setValue(e.target.value)}>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;