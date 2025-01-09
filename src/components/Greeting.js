import React from 'react';
import './Greeting.css';

const Greeting = ({ name }) => {
    return (
        <div className="greeting-container">
            <h1>Hello {name}</h1>
        </div>
    );
};

export default Greeting;