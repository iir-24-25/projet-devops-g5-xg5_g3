// src/pages/LoginAdmin.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(adminAuth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError("Erreur de connexion");
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '50px' }}>
            <h2>Connexion Admin</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <button onClick={handleLogin} style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none'
            }}>
                Se connecter
            </button>
        </div>
    );
};

export default LoginAdmin;