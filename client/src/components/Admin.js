import React, { useState } from 'react';
import BackgroundWrapper from '../BackgroundWrapper';

export default function Admin() {
    const [selectedMenu, setSelectedMenu] = useState('Create New User');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        dob: '',
        allergies: '',
        extraComments: ''
    });
    const [message, setMessage] = useState('');

    const menuOptions = {
        "Create New User": "Fill in the form below to add a new user.",
        "Current User": "Here is the list of current users."
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.status === 200) {
                setMessage('User created successfully and email sent!');
                setFormData({ name: '', email: '', address: '', dob: '', allergies: '', extraComments: '' });
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('Error creating user');
        }
    };

    return (
        <BackgroundWrapper>
            <div className="flex flex-col h-screen md:flex-row p-5">
                {/* Small Menu Card */}
                <div className="w-full h-auto mb-5 md:w-72 md:h-[500px] bg-white/30 backdrop-blur-lg p-5 rounded-xl md:mr-5 flex flex-col md:block justify-start overflow-x-auto md:overflow-visible border border-white/40 shadow-xl">
                    <h3 className="text-white mb-5 font-semibold">Admin Menu:</h3>

                    <ul className="flex md:block space-x-4 md:space-y-2 overflow-x-scroll md:overflow-visible scrollbar-hide">
                        {Object.keys(menuOptions).map(option => (
                            <li
                                key={option}
                                onClick={() => setSelectedMenu(option)}
                                className={`px-4 py-2 md:px-0 rounded-full md:rounded-none bg-black md:bg-transparent text-white md:text-white whitespace-nowrap md:whitespace-normal md:hover:text-white cursor-pointer ${
                                    selectedMenu === option ? 'bg-white text-black md:bg-transparent md:text-white' : ''
                                }`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Large Content Card */}
                <div className="flex-1 h-auto md:h-[650px] bg-white/30 backdrop-blur-lg p-5 rounded-xl flex flex-col justify-center items-center border border-white/40 shadow-xl">
                    <h1 className="text-white text-3xl font-semibold">{selectedMenu}</h1>

                    {selectedMenu === "Create New User" ? (
                        <div className="w-full">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-white text-sm font-bold mb-2">Name:</label>
                                        <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                                            type="text"
                                            name="name"
                                            placeholder="Enter Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-white text-sm font-bold mb-2">Email:</label>
                                        <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Optional Fields */}
                                <div className="flex flex-wrap -mx-3 mb-4">
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-white text-sm font-bold mb-2">Address:</label>
                                        <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                                            type="text"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block text-white text-sm font-bold mb-2">DOB:</label>
                                        <input
                                            className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full" type="submit">
                                    Create User
                                </button>
                            </form>
                            {message && <p className="text-white mt-4">{message}</p>}
                        </div>
                    ) : (
                        <p className="text-white mt-3">{menuOptions[selectedMenu]}</p>
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
