import React, { useState} from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {

    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div>
        <header className="bg-black md:flex md:justify-between md:items-center md:px-4 md:py-0" style={{ height: '80px' }}>
        <div className="flex items-center justify-between px-4 py-1 md:p-0">
          <div className='w-56 ml-20'>
            <Link to={"/"} >

              <img src={require('./images/logo.png')} alt="Logo" className=" w-full cursor-pointer md:mt-1 md:mb-1" />
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              <i className="cursor-pointer ml-3 mr-2 fa-solid fa-bars scale-150"></i>
            </button>
          </div>
        </div>

      </header>

    </div>
  )
}
