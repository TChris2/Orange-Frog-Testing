import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
        </div>
    );
}
