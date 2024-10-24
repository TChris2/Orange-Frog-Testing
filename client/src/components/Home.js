import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackgroundWrapper from '../BackgroundWrapper';
import { FaEye, FaEyeSlash, FaEdit } from 'react-icons/fa'; // Icons for eye and edit

export default function Home() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState('Chat Room');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        address: '',
        dob: '',
        allergies: '',
        password: '',  // No need to fetch the password from the database
    });
    const [message, setMessage] = useState(''); // For showing success or error messages
    const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password
    const [showPopup, setShowPopup] = useState(false); // Toggle for the password update popup
    const [newPassword, setNewPassword] = useState(''); // For the new password input
    const [confirmNewPassword, setConfirmNewPassword] = useState(''); // For the confirm password input

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const email = localStorage.getItem('email'); // Get email from localStorage for authenticated user

        if (!isAuthenticated) {
            navigate('/');
        } else if (selectedMenu === "Profile") {
            // Fetch user data when the Profile section is selected
            axios.get(`http://localhost:8000/user-profile/${email}`)
                .then(response => {
                    const { name, email, address, dob, allergies } = response.data;

                    // Ensure DOB is in the format YYYY-MM-DD
                    const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : '';

                    setProfileData({ 
                        name, 
                        email, 
                        address, 
                        dob: formattedDob,  // Set formatted DOB
                        allergies
                    });
                })
                .catch(error => console.error('Error fetching profile data:', error));
        }
    }, [navigate, selectedMenu]);

    const menuOptions = {
        "Chat Room": "This is the chat room section.",
        "Job Book": "Here is the job book with your tasks.",
        "My Jobs": "These are the jobs you are assigned.",
        "Profile": "Update your profile information here.",
        "Time Card": "Fill in your time card here.",
        "Incident Report": "Report incidents here."
    };

    // Handle input change for the profile form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    // Handle profile update submission
    const handleProfileUpdate = (e) => {
        e.preventDefault();

        const updatedData = { ...profileData };

        axios.put(`http://localhost:8000/update-profile/${profileData.email}`, updatedData)
            .then(response => {
                setMessage('Profile updated successfully!');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                setMessage('Error updating profile. Please try again.');
            });
    };

    // Handle password popup submission
    const handlePasswordUpdate = () => {
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match');
            return;
        }

        axios.put(`http://localhost:8000/update-password/${profileData.email}`, { password: newPassword })
            .then(response => {
                setMessage('Password updated successfully!');
                setShowPopup(false); // Close popup after saving
            })
            .catch(error => {
                console.error('Error updating password:', error);
                setMessage('Error updating password. Please try again.');
            });
    };

    return (
        <BackgroundWrapper>
            <div className="flex flex-col h-screen md:flex-row p-5">
                {/* Small Menu Card */}
                <div className="w-full h-auto mb-5 md:w-72 md:h-[500px] bg-gray-400/40 backdrop-blur-md p-5 rounded-xl md:mr-5 flex flex-col justify-start border border-white/40 shadow-xl">
                    <h3 className="text-white mb-5 font-semibold">My Stuff:</h3>

                    <ul className="flex md:block overflow-x-scroll md:overflow-visible scrollbar-hide">
                        {Object.keys(menuOptions).map(option => (
                            <li
                                key={option}
                                onClick={() => setSelectedMenu(option)}
                                className={`px-4 py-2 rounded-full text-white whitespace-nowrap cursor-pointer 
                                    ${selectedMenu === option ? 'bg-white/10' : ''} 
                                    hover:bg-white/10 transition duration-300`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Large Content Card */}
                <div className="flex-1 h-auto md:h-[650px] bg-gray-400/40 backdrop-blur-md p-5 rounded-xl flex flex-col items-center border border-white/40 shadow-xl">
                    <h1 className="text-white text-3xl font-semibold mb-6">{selectedMenu}</h1>

                    {selectedMenu === "Profile" ? (
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
                               value={profileData.dob}  // Prefill with the formatted DOB
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
                                <span
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPopup(true)}
                                >
                                    <FaEdit />
                                </span>
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-center mt-4">
                            <button
                                type="submit"
                                className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-md"
                            >
                                Update Profile
                            </button>
                        </div>
                        {message && (
                            <p className={`col-span-2 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'} mt-4`}>
                                {message}
                            </p>
                        )}
                   </form>
                    ) : (
                        <p className="text-white mt-3">{menuOptions[selectedMenu]}</p>
                    )}

                    {/* Password Update Popup */}
                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                            <div className="bg-white p-8 rounded-md shadow-md">
                                <h2 className="text-xl mb-4">Update Password</h2>

                                {message && <p className="text-red-500 mb-4">{message}</p>}

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
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded-full"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePasswordUpdate}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
