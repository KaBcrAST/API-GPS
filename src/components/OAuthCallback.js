import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                
                // Stocker les données d'authentification
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('name', user.name);
                localStorage.setItem('isAuthenticated', 'true');

                // Redirection vers la page d'accueil
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error processing OAuth data:', error);
                navigate('/');
            }
        }
    }, [navigate, searchParams]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            Redirection en cours...
        </div>
    );
};

export default OAuthCallback;