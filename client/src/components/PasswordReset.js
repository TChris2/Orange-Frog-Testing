import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordReset({ email, onPasswordReset }) {
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('New passwords do not match');
            return;
        }

        const response = await fetch('http://localhost:8000/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tempPassword, newPassword })
        });

        const data = await response.json();

        if (response.status === 200) {
            onPasswordReset(); 
        } else {
            setErrorMessage(data.message);
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleReset}>
                <input 
                    type="password" 
                    placeholder="Enter Temporary Password" 
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Enter New Password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required 
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
