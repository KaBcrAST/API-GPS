import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './Login.css';

const API_URL = 'https://react-gpsapi.vercel.app';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    // Gérer le retour OAuth
    useEffect(() => {
        const handleOAuthReturn = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const userStr = params.get('user');
            const error = params.get('error');

            if (error) {
                setError('Échec de l\'authentification Google');
                return;
            }

            if (token && userStr) {
                try {
                    const user = JSON.parse(decodeURIComponent(userStr));
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/');
                } catch (err) {
                    console.error('Parse error:', err);
                    setError('Erreur lors de la connexion');
                }
            }
        };

        handleOAuthReturn();
    }, [navigate]);

    // Hash du mot de passe en SHA256 (comme dans l'API)
    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Préparer les données sécurisées
            const secureFormData = {
                email: formData.email.toLowerCase().trim(),
                password: hashPassword(formData.password),
                ...(isLogin ? {} : { name: formData.name.trim() })
            };

            // Appel à l'API (login ou register selon le cas)
            const endpoint = isLogin ? 'login' : 'register';
            const response = await axios.post(`${API_URL}/api/auth/${endpoint}`, secureFormData);

            if (response.data.success) {
                // Stocker les données d'authentification
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAuthenticated', 'true');

                // Afficher le message de succès
                setSuccess(true);

                // Attendre un peu puis rediriger
                setTimeout(() => {
                    window.location.href = '/'; // Force page reload
                }, 1500);
            } else {
                setError(response.data.message || (isLogin ? 'Erreur de connexion' : 'Erreur lors de l\'inscription'));
            }
        } catch (err) {
            console.error(isLogin ? 'Login error:' : 'Register error:', err);
            setError(err.response?.data?.message || (isLogin ? 'Erreur de connexion' : 'Erreur lors de l\'inscription'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setError(null);
        window.location.href = `${API_URL}/api/auth/google/web`;
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {success && (
                    <div className="success-message">
                        Connexion réussie ! ✨
                    </div>
                )}
                <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
                
                <button 
                    className="google-login-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <img 
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="google-icon"
                    />
                    {loading ? 'Connexion...' : (isLogin ? 'Se connecter avec Google' : 'S\'inscrire avec Google')}
                </button>

                <div className="divider">
                    <span>ou</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
                    </button>
                </form>

                <div className="switch-form">
                    <p>
                        {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                        <button 
                            className="switch-button"
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={loading}
                        >
                            {isLogin ? 'S\'inscrire' : 'Se connecter'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;