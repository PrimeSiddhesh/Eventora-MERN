import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const ContactUs = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-24">
                <span className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block border border-gray-200 shadow-sm">Available for work</span>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-none italic">Let's Connect.</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                    Interested in discussing elite engineering, MERN stack architecture, or future opportunities? Reach out directly.
                </p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row transform transition-all duration-700 hover:shadow-2xl">
                
                {/* Left Side: Professional Branding */}
                <div className="bg-gray-900 p-16 md:w-5/12 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black mb-4 tracking-tighter italic">Siddhesh Pawar</h2>
                        <h3 className="text-blue-400 font-black tracking-[0.2em] uppercase mb-12 text-[10px] border-b border-white/10 pb-6">Lead Architect / Full Stack</h3>
                        
                        <p className="text-gray-400 text-lg leading-relaxed font-medium italic mb-12 opacity-80">
                            "Eventora represents the intersection of robust backend architecture and premium frontend aesthetics. I build systems that don't just work, but inspire."
                        </p>
                        
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"><FaGlobe /></div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 rounded-full bg-indigo-600 opacity-20 blur-[100px]"></div>
                </div>

                {/* Right Side: Contact Information */}
                <div className="p-16 md:w-7/12 flex flex-col justify-center bg-gray-50/50">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-gray-200"></span> Contact Details
                    </h3>
                    
                    <div className="space-y-12">
                        <div className="flex items-center group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-500 shadow-sm flex-shrink-0 group-hover:rotate-6">
                                <FaEnvelope size={24} />
                            </div>
                            <div className="ml-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Mail</p>
                                <a href="mailto:siddheshpawarwork@gmail.com" className="text-xl font-black text-gray-900 hover:text-blue-600 transition tracking-tight">
                                    siddheshpawarwork@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-500 shadow-sm flex-shrink-0 group-hover:-rotate-6">
                                <FaPhoneAlt size={24} />
                            </div>
                            <div className="ml-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Line</p>
                                <a href="tel:+919518777538" className="text-xl font-black text-gray-900 hover:text-blue-600 transition tracking-tight">
                                    +91 9518777538
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-500 shadow-sm flex-shrink-0 group-hover:rotate-6">
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <div className="ml-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight">
                                    Maharashtra, India
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
