import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => setShowMenu(!showMenu);
    const navigate = useNavigate();
    const location = useLocation();  

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated'); 
        navigate('/'); 
    };

    return (
        <div>
            <header className="bg-black md:flex md:justify-between md:items-center md:px-4 md:py-0" style={{ height: '80px' }}>
                <div className="flex items-center justify-between px-4 py-1 md:p-0">
                   
                    <div className='w-36 md:w-56 ml-5 md:ml-20'>
                        <Link to={"/"}>
                            <img src={require('./images/logo.png')} alt="Logo" className="w-full cursor-pointer md:mt-1 md:mb-1" />
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white bg-black">
                            <i className="fa-solid fa-bars scale-150"></i>
                        </button>
                    </div>
                </div>

                {isAuthenticated && location.pathname !== '/' && (
                    <div className="hidden md:block absolute top-4 right-4">
                        <button 
                            onClick={handleLogout} 
                            className="text-black bg-white py-2 px-4 rounded-full">
                            Logout
                        </button>
                    </div>
                )}

                <div className={`fixed top-0 right-0 h-full w-64 bg-black text-white z-50 transform ${showMenu ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-lg font-bold">Menu</h2>
                        <button onClick={toggleMenu} className="text-white bg-black ml-40">
                            <i className="fa-solid fa-times scale-150"></i> 
                        </button>
                    </div>
                    <div className="flex flex-col p-4 space-y-4">
                        {isAuthenticated && location.pathname !== '/' && (
                            <button 
                                onClick={handleLogout} 
                                className="text-black bg-white py-2 px-4 rounded-full">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {showMenu && (
                <div onClick={toggleMenu} className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}
        </div>
    );
}
