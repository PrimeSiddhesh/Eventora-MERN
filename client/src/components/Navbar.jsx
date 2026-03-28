import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                        <FaTicketAlt /> Eventora
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-gray-300 hover:text-white font-medium transition cursor-pointer">Events</Link>
                            <Link to="/contact" className="text-gray-300 hover:text-white font-medium transition cursor-pointer">Contact</Link>
                        </div>
                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-700">
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-300 hover:text-white font-medium transition">Dashboard</Link>
                                <button onClick={handleLogout} className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg font-semibold transition border border-gray-700">Logout</button>
                            </div>
                        ) : (
                            <div className="flex gap-4 items-center pl-4 border-l border-gray-700">
                                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">Login</Link>
                                <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-5 py-2 rounded-lg font-bold shadow-md transition transform hover:-translate-y-0.5">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
