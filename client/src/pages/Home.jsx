import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';
import Chatbot from '../components/Chatbot';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1540575861501-7ce0e220beff?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="relative p-10 md:p-24 text-center flex flex-col items-center z-10">
                    <span className="bg-white/10 text-white backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-white/20 shadow-xl">
                        AI-Powered Event Hub
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter">
                        Experience <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Everything.</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
                        The premium platform to discover curated tech summits, exclusive music festivals, and elite workshops near you.
                    </p>

                    <div className="w-full max-w-3xl mx-auto relative flex items-center shadow-2xl group">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 -z-10 group-focus-within:bg-white/20 transition-all duration-500"></div>
                        <FaSearch className="absolute left-8 text-white/50 text-2xl group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Find an event by name, city or category..."
                            className="w-full pl-20 pr-8 py-6 rounded-full text-xl text-white bg-transparent border-none focus:outline-none placeholder-white/40 font-medium tracking-tight"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-2">
                    <div className="w-20 h-20 bg-gray-900 group-hover:bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-xl transition-colors duration-500">
                        <FaRegClock />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Express Booking</h3>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">Book your tickets in under 60 seconds with our optimized cloud infrastructure.</p>
                </div>
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl hover:border-purple-100 transition-all duration-500 hover:-translate-y-2">
                    <div className="w-20 h-20 bg-gray-900 group-hover:bg-purple-600 text-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-xl transition-colors duration-500">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Digital Pass</h3>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">Instantly access QR-enabled tickets from your secure personal dashboard anywhere.</p>
                </div>
                <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl hover:border-green-100 transition-all duration-500 hover:-translate-y-2">
                    <div className="w-20 h-20 bg-gray-900 group-hover:bg-green-600 text-white rounded-3xl flex items-center justify-center text-3xl mb-8 shadow-xl transition-colors duration-500">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Secure 2FA</h3>
                    <p className="text-gray-500 text-base leading-relaxed font-medium">Enhanced protection with real-time OTP verification powered by Brevo API.</p>
                </div>
            </div>

            <div className="flex items-end justify-between mb-12 px-4">
                <div>
                    <h2 className="text-5xl font-black text-gray-900 mb-2">Happening Soon</h2>
                    <p className="text-gray-500 font-bold tracking-tight uppercase text-sm">Discover the most anticipated events</p>
                </div>
                <div className="bg-gray-100 text-gray-900 px-6 py-2 rounded-full font-black text-sm shadow-inner border border-gray-200">
                    {events.length} EVENTS
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Searching for events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <FaSearch className="text-gray-200 text-7xl mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 font-medium">Try searching for a different keyword or category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map(event => (
                        <div key={event._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:border-gray-200 hover:-translate-y-1">
                            <div className="h-64 bg-gray-200 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/10 font-black text-5xl uppercase italic tracking-tighter">
                                        {event.category}
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black shadow-xl flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {event.ticketPrice === 0 ? <span className="text-green-600">FREE ENTRY</span> : <span className="text-gray-900">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest">{event.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{event.title}</h2>
                                <div className="flex flex-col gap-3 mb-8 text-gray-500 font-semibold text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-grow bg-gray-100 rounded-full h-1.5 mr-4">
                                            <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{event.availableSeats} LEFT</span>
                                    </div>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-900 text-white font-black py-4 rounded-2xl transition hover:bg-black shadow-lg hover:shadow-xl transform active:scale-95">
                                        BOOK NOW
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-32 pt-20 pb-12 border-t border-gray-100 text-center">
                <div className="flex justify-center items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-gray-900/20">
                        <FaTicketAlt />
                    </div>
                    <span className="text-3xl font-black text-gray-900 tracking-tighter italic">Eventora.</span>
                </div>
                <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                    Designed for the dreamers, the builders, and the explorers. The elite way to manage and discover premium events worldwide.
                </p>
                <div className="flex justify-center gap-8 mb-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <Link to="/" className="hover:text-black transition">Events</Link>
                    <Link to="/contact" className="hover:text-black transition">Support</Link>
                    <a href="#" className="hover:text-black transition">Privacy</a>
                </div>
                <div className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} Eventora Platform Inc. / Built for Excellence.
                </div>
            </footer>
            
            {/* AI Assistant Chatbot */}
            <Chatbot />
        </div>
    );
};

export default Home;
