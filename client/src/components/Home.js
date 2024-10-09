import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState('Chat Room');

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    const menuOptions = {
        "Chat Room": "This is the chat room section.",
        "Job Book": "Here is the job book with your tasks.",
        "My Jobs": "These are the jobs you are assigned.",
        "Profile": "Update your profile information here.",
        "Time Card": "Fill in your time card here.",
        "Incident Report": "Report incidents here."
    };

    return (
        <div className="flex flex-col h-screen md:flex-row bg-black p-5">
            {/* Small Menu Card */}
            <div className="w-full h-auto mb-5 md:w-72 md:h-[500px] bg-[#D2714A] p-5 rounded-xl md:mr-5 flex flex-col md:block justify-start overflow-x-auto md:overflow-visible">
                <h3 className="hidden md:block text-black mb-5 font-semibold">My Stuff:</h3>

                <ul className="flex md:block space-x-4 md:space-y-2 overflow-x-scroll md:overflow-visible scrollbar-hide">
                    {Object.keys(menuOptions).map(option => (
                        <li
                            key={option}
                            onClick={() => setSelectedMenu(option)}
                            className={`px-4 py-2 md:px-0 rounded-full md:rounded-none bg-black md:bg-transparent text-white md:text-black whitespace-nowrap md:whitespace-normal md:hover:text-white cursor-pointer ${
                                selectedMenu === option ? 'bg-white text-black md:bg-transparent md:text-white' : ''
                            }`}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Large Content Card */}
            <div className="flex-1 h-auto md:h-[500px] bg-[#D2714A] p-5 rounded-xl flex flex-col justify-center items-center">
                <h1 className="text-black text-3xl font-semibold">{selectedMenu}</h1>
                <p className="text-black mt-3">{menuOptions[selectedMenu]}</p>
            </div>
        </div>
    );
}
