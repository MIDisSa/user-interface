import React from 'react';
import './Button.css'; 

const Button = ({ label, onClick, variant, title}) => {
    let buttonClass = '';

    switch (variant) {
        case 'solid-orange':
            buttonClass = 'button-solid-orange';
            break;
        case 'solid-blue':
            buttonClass = 'button-solid-blue';
            break;
        case 'outlined-blue':
            buttonClass = 'button-outlined-blue';
            break;
        case 'large':
            buttonClass = 'button-large';
            break;
        default:
            buttonClass = 'button-solid-blue';  // Default style
            break;
    }

    return (
        <button onClick={onClick} className={`button ${buttonClass}`} title={title}>
            {label}
        </button>
    );
};

export default Button;

