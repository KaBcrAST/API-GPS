import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OAuthRedirect from './components/OAuthRedirect';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/oauth-redirect" element={<OAuthRedirect />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;