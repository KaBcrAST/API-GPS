import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OAuthRedirect = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        if (token) {
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            localStorage.setItem('name', decoded.name);
            localStorage.setItem('email', decoded.email);
            navigate('/');
        }
    }, [location, navigate]);

    return <div>Redirecting...</div>;
};

export default OAuthRedirect;