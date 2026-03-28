import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const ContactUs = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Get in Touch</h1>
                <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                    Interested in discussing opportunities, tech projects, or hiring? I would love to connect with you.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row transform transition hover:shadow-2xl">
                
                {/* Left Side: Gradient Design & Motivation */}
                <div className="bg-gray-900 p-10 md:w-5/12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Siddhesh Pawar</h2>
                        <h3 className="text-gray-300 font-medium tracking-widest uppercase mb-8 text-sm border-b border-gray-700 pb-4">Full Stack Developer</h3>
                        
                        <p className="text-gray-400 leading-relaxed italic mb-8">
                            "Building scalable digital products and architecting efficient systems. Eventora is a demonstration of my ability to build robust MERN stack applications with industry-standard payment processing and AI integrations."
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
                </div>

                {/* Right Side: Contact Information */}
                <div className="p-10 md:w-7/12 flex flex-col justify-center bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-gray-900 pl-4">Contact Information</h3>
                    
                    <div className="space-y-8">
                        <div className="flex items-center group">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition cursor-pointer flex-shrink-0">
                                <FaEnvelope size={20} />
                            </div>
                            <div className="ml-6">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                                <a href="mailto:siddheshpawarwork@gmail.com" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition">
                                    siddheshpawarwork@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition cursor-pointer flex-shrink-0">
                                <FaPhoneAlt size={20} />
                            </div>
                            <div className="ml-6">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                                <a href="tel:+919518777538" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition">
                                    +91 9518777538
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition cursor-pointer flex-shrink-0">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div className="ml-6">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                                <p className="text-lg font-bold text-gray-800">
                                    India
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
