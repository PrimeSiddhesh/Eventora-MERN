import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaQrcode, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';

const TicketModal = ({ booking, onClose }) => {
    const ticketRef = useRef(null);
    if (!booking) return null;

    const handleDownload = async () => {
        if (ticketRef.current === null) return;
        const dataUrl = await toPng(ticketRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = `ticket-${booking._id}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div ref={ticketRef} className="bg-white p-8 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaTicketAlt />
                        </div>
                        <span className="text-xl font-black tracking-tighter italic">Eventora.</span>
                    </div>

                    <div className="w-full bg-gray-50 rounded-[2rem] p-6 mb-8 border border-gray-100 flex flex-col items-center text-center">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <QRCodeCanvas value={booking._id} size={160} level="H" includeMargin={true} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{booking.eventId.title}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{booking.eventId.location}</p>
                        
                        <div className="w-full border-t border-dashed border-gray-200 pt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Admit One</span>
                                <span className="text-gray-900">{booking.userId.name}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Date</span>
                                <span className="text-gray-900">{new Date(booking.eventId.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Booking ID</div>
                    <div className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full mb-4">{booking._id}</div>
                </div>

                <div className="p-6 bg-gray-50 flex gap-4">
                    <button onClick={handleDownload} className="flex-1 bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-gray-900/20 active:scale-95">
                        <FaDownload /> Download
                    </button>
                    <button onClick={onClose} className="px-6 py-4 rounded-2xl bg-white border border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-black transition active:scale-95">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <TicketModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
            
            {/* Header Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 mb-12 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8 hover:shadow-xl transition-all duration-500">
                <div className="w-24 h-24 bg-gray-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black uppercase tracking-tighter shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">Hello, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Member Dashboard
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                    <FaTicketAlt className="text-gray-900" /> My Bookings
                </h2>
                <div className="bg-gray-100 text-gray-400 px-5 py-2 rounded-full font-black text-[10px] tracking-widest uppercase border border-gray-200">
                    {bookings.length} TOTAL
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-[3rem] shadow-sm p-20 text-center border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaTicketAlt className="text-gray-200 text-4xl" />
                    </div>
                    <p className="text-2xl text-gray-400 mb-10 font-bold tracking-tight">You haven't discovered any events yet.</p>
                    <Link to="/" className="inline-block bg-gray-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl transition shadow-xl hover:-translate-y-1 active:scale-95">
                        EXPLORE EVENTS
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col hover:-translate-y-1">
                            <div className="p-10 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{booking.eventId.title}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {booking.status}
                                            </span>
                                            {booking.status !== 'cancelled' && (
                                                <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest ${
                                                    booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {booking.paymentStatus.replace('_', ' ')}
                                                </span>
                                            )}
                                            {booking.checkedIn && (
                                                <span className="px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest bg-purple-100 text-purple-700 flex items-center gap-1">
                                                    <FaCheckCircle /> Checked In
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-4 text-sm font-bold text-gray-500 uppercase tracking-tight">
                                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                                <span>Event Date</span>
                                                <span className="text-gray-900">{new Date(booking.eventId.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                                <span>Price</span>
                                                <span className="text-gray-900">{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-500 italic font-bold text-sm">Archived Event Data</p>
                                )}
                            </div>
                            <div className="p-8 bg-gray-50 flex justify-between items-center shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        {booking.status === 'confirmed' ? (
                                            <button 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="text-gray-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition active:scale-95"
                                            >
                                                <FaQrcode /> View Ticket
                                            </button>
                                        ) : (
                                            <Link to={`/events/${booking.eventId._id}`} className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-black transition">Details</Link>
                                        )}
                                        {booking.status !== 'confirmed' && (
                                            <button
                                                onClick={() => cancelBooking(booking._id)}
                                                className="text-red-400 font-black text-xs uppercase tracking-widest hover:text-red-600 transition flex items-center gap-2"
                                            >
                                                <FaTimesCircle /> Cancel
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Closed</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
