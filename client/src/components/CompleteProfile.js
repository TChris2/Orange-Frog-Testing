import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import the cookies library

function CompleteProfile() {
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [allergies, setAllergies] = useState('');
  const [error, setError] = useState('');
  const [isDobFocused, setDobFocused] = useState(false);
  const navigate = useNavigate();

  const email = Cookies.get('email'); // Retrieve the email from cookies

  const handleProfileCompletion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/complete-profile', { email, address, dob, allergies });
      navigate('/home'); // After profile completion, navigate to home page
    } catch (error) {
      setError('Error completing profile');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('your-background-url')" }}>
      <div className="bg-white/30 backdrop-blur-md p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-white mb-8">Complete Your Profile</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleProfileCompletion}>
          <div className="relative mb-6">
            <label className="block text-white mb-2">Address</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <ion-icon name="location-outline"></ion-icon>
              </span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="w-full pl-8 py-2 border border-gray-300 rounded-md bg-transparent text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="relative mb-6">
            <label className="block text-white mb-2">Date of Birth</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <ion-icon name="calendar-outline"></ion-icon>
              </span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-8 py-2 border border-gray-300 rounded-md bg-transparent text-white placeholder-gray-400"
                onFocus={() => setDobFocused(true)}
                onBlur={() => setDobFocused(dob !== '')}
                required
              />
            </div>
          </div>

          <div className="relative mb-6">
            <label className="block text-white mb-2">Allergies (if any)</label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <ion-icon name="medkit-outline"></ion-icon>
              </span>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Allergies (if any)"
                className="w-full pl-8 py-2 border border-gray-300 rounded-md bg-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-2 mx-5 bg-white text-black font-semibold rounded-full hover:bg-gray-200">
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
