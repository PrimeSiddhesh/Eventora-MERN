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
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="text-gray-900 text-3xl font-black flex items-center gap-3 tracking-tighter italic group">
                        <div className="w-10 h-10 bg-gray-900 group-hover:bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl transition-colors duration-500 shadow-lg shadow-gray-900/10">
                            <FaTicketAlt />
                        </div>
                        Eventora.
                    </Link>
                    <div className="hidden md:flex items-center gap-10">
                        <div className="flex items-center gap-8 border-r border-gray-100 pr-10">
                            <Link to="/" className="text-gray-500 hover:text-black font-bold text-xs uppercase tracking-widest transition">Explore</Link>
                            <Link to="/contact" className="text-gray-500 hover:text-black font-bold text-xs uppercase tracking-widest transition">Contact</Link>
                        </div>
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-500 hover:text-black font-bold text-xs uppercase tracking-widest transition">Dashboard</Link>
                                <button onClick={handleLogout} className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-xl shadow-gray-900/10 active:scale-95">Logout</button>
                            </div>
                        ) : (
                            <div className="flex gap-6 items-center">
                                <Link to="/login" className="text-gray-500 hover:text-black font-bold text-xs uppercase tracking-widest transition">Login</Link>
                                <Link to="/register" className="bg-gray-900 text-white hover:bg-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-xl shadow-gray-900/10 active:scale-95">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
