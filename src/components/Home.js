import React, { useEffect, useState } from 'react';
import Map from './Map';

const Home = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <div>
            <h1>Hello {name}</h1>
            <Map />
        </div>
    );
};

export default Home;