import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 text-center mt-auto border-t-4 border-gray-700">
            <div className="container mx-auto px-6">
                <div className="flex justify-center items-center gap-12 mb-8">
                    <a href="/" className="text-gray-400 hover:text-white transition uppercase text-sm font-bold tracking-widest">Home</a>
                    <a href="/contact" className="text-gray-400 hover:text-white transition uppercase text-sm font-bold tracking-widest">Contact Us</a>
                    <a href="/login" className="text-gray-400 hover:text-white transition uppercase text-sm font-bold tracking-widest">Account</a>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-2xl font-black tracking-widest text-white/90">Eventora 🚀</h2>
                    <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
                        A modern and intelligent Event Management Platform seamlessly bridging technology and real-world experiences.
                    </p>
                </div>
                
                <div className="border-t border-gray-800 pt-6">
                    <p className="text-xs text-gray-500 font-medium">
                        Designed & Developed exclusively by <span className="text-white">Siddhesh Pawar</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">© {new Date().getFullYear()} All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
