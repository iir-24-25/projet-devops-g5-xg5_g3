// src/routing/ProtectedAdminRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin';

const ProtectedAdminRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(adminAuth, (user) => {
            if (user) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (isAdmin === null) return <div>Chargement...</div>;

    return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;