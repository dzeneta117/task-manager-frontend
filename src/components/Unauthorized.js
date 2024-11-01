// src/components/Unauthorized.js
import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '70px', marginLeft:'300px' }}>
            <h1 style={{ color: 'white' }}>Neautorizovan pristup</h1>
            <p style={{ color: 'white' }}>Nemate dozvolu za pristup ovoj stranici.</p>
        </div>
    );
};

export default Unauthorized;
