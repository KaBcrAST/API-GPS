import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './Login.css'; // Réutilisation du même style

// Utiliser uniquement la variable d'environnement
const API_URL = process.env.REACT_APP_API_URL;

// Vérifier si la variable d'environnement existe
if (!API_URL) {
  console.error('REACT_APP_API_URL environment variable is not defined!');
}

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    // Hash du mot de passe en SHA256 (comme dans l'API)
    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString();
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            if (!API_URL) {
                throw new Error('URL de l\'API non configurée');
            }

            // Préparer les données sécurisées
            const secureFormData = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashPassword(password)
            };

            const response = await axios.post(`${API_URL}/api/auth/register`, secureFormData);
            
            if (response.data.success) {
                // Stocker les données d'authentification
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAuthenticated', 'true');
                
                // Afficher le message de succès
                setSuccess(true);
                
                // Attendre un peu puis rediriger
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(response.data.message || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            console.error('Register error:', err);
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (!API_URL) {
            setError('URL de l\'API non configurée');
            return;
        }
        setLoading(true);
        setError(null);
        window.location.href = `${API_URL}/api/auth/google/web`;
    };

    return (
        <div className="login-container">
            <div className="login-box">
                {success && (
                    <div className="success-message">
                        Inscription réussie ! ✨
                    </div>
                )}
                <h2>Inscription</h2>
                
                <button 
                    className="google-login-button"
                    onClick={handleGoogleLogin}
                    disabled={loading || !API_URL}
                >
                    <img 
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google" 
                        className="google-icon"
                    />
                    {loading ? 'Connexion...' : 'S\'inscrire avec Google'}
                </button>

                <div className="divider">
                    <span>ou</span>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Nom</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={name} 
                            onChange={onChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={email} 
                            onChange={onChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={onChange} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading || !API_URL}
                    >
                        {loading ? 'Chargement...' : 'S\'inscrire'}
                    </button>
                </form>

                <div className="switch-form">
                    <p>
                        Déjà un compte ?
                        <button 
                            className="switch-button"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                        >
                            Se connecter
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;