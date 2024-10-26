// src/components/home/Profile.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

export default function Profile({ profileData, setProfileData, handleInputChange, message, setMessage }) {
    const [showPopup, setShowPopup] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/update-profile/${profileData.email}`, profileData)
            .then(() => setMessage('Profile updated successfully!'))
            .catch(() => setMessage('Error updating profile. Please try again.'));
    };

    const handlePasswordUpdate = () => {
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match');
            return;
        }
        axios.put(`http://localhost:8000/update-password/${profileData.email}`, { password: newPassword })
            .then(() => {
                setMessage('Password updated successfully!');
                setShowPopup(false);
            })
            .catch(() => setMessage('Error updating password. Please try again.'));
    };

    return (
        <form onSubmit={handleProfileUpdate} className="w-full max-w-4xl grid grid-cols-2 gap-8">
            <div className="col-span-1">
                <label className="block text-white mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    required
                />
            </div>
            <div className="col-span-1">
                <label className="block text-white mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                    disabled
                />
            </div>
            <div className="col-span-1">
                <label className="block text-white mb-2">Address</label>
                <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                />
            </div>
            <div className="col-span-1">
                <label className="block text-white mb-2">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                />
            </div>
            <div className="col-span-2">
                <label className="block text-white mb-2">Allergies</label>
                <input
                    type="text"
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md"
                />
            </div>
            <div className="col-span-1">
                <label className="block text-white mb-2">Password</label>
                <div className="relative">
                    <input
                        type="password"
                        placeholder="Enter new password if you wish to change it"
                        className="w-full p-3 border rounded-md"
                        readOnly
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPopup(true)}>
                        <FaEdit />
                    </span>
                </div>
            </div>
            <div className="col-span-2 flex justify-center mt-4">
                <button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-md">Update Profile</button>
            </div>
            {message && <p className={`col-span-2 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'} mt-4`}>{message}</p>}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-8 rounded-md shadow-md">
                        <h2 className="text-xl mb-4">Update Password</h2>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mb-4 p-3 border rounded-md"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full mb-4 p-3 border rounded-md"
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded-full">Cancel</button>
                            <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
