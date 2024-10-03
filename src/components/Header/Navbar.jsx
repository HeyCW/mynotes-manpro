import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css';
import Cookies from 'js-cookie';
import useAuth from "../../hooks/useAuth";

const NavbarHome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {logout} = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    logout();
  }

  return (
    <nav className="bg-white text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">
          <Link to="/user/home" className="text-black">MyNotes</Link>
        </div>
        
        <div className="block lg:hidden relative">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <ul className="hidden lg:flex lg:items-center lg:space-x-4">
        <li>
            <NavLink 
              to="/home" 
              className="hover:bg-blue-500 hover:text-white text-black px-3 py-2 rounded-md transition duration-300"
              activeClassName="bg-blue-500 text-white"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className="hover:bg-blue-500 hover:text-white text-black px-3 py-2 rounded-md transition duration-300"
              activeClassName="bg-blue-500 text-white"
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className="hover:bg-blue-500 hover:text-white text-black px-3 py-2 rounded-md transition duration-300"
              activeClassName="bg-blue-500 text-white"
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/login" 
              className="hover:bg-blue-500 hover:text-white text-black px-3 py-2 rounded-md transition duration-300"
              activeClassName="bg-blue-500 text-white" onClick={handleLogout}  
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </div>

      <ul className={`w-full  ${isOpen ? 'block' : 'hidden'}`}>
          <li>
              <NavLink 
                to="/home"
                className="hover:bg-blue-500 hover:text-white text-black block text-center px-3 py-2 rounded-md transition duration-300"
                activeClassName="bg-blue-500 text-white"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className="hover:bg-blue-500 hover:text-white text-black block text-center px-3 py-2 rounded-md transition duration-300"
                activeClassName="bg-blue-500 text-white"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className="hover:bg-blue-500 hover:text-white text-black block text-center px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                activeClassName="bg-blue-500 text-white"
              >
                Contact
              </NavLink>
            </li>
          </ul>

      
    </nav>
  );
};

export default NavbarHome;
