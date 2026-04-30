import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.title) {
            alert('Please enter a title first to generate a description.');
            return;
        }
        setIsGenerating(true);
        try {
            const res = await api.post('/ai/generate-description', {
                title: formData.title,
                category: formData.category
            });
            setFormData({ ...formData, description: res.data.description });
        } catch (error) {
            alert('Failed to generate description.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);
        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image: res.data.imageUrl });
        } catch (error) {
            console.error(error);
            alert('Image upload failed. Ensure you selected a valid image and the backend is running.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    const handleCheckIn = async (id) => {
        try {
            await api.put(`/bookings/${id}/check-in`);
            fetchData();
            setSearchId('');
        } catch (error) {
            alert(error.response?.data?.message || 'Error checking in');
        }
    };

    const [searchId, setSearchId] = useState('');

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Admin Panel...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 mb-12 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-black shadow-2xl">
                        A
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-1">Admin Dashboard</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Manage events & gate control</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="w-full md:w-auto bg-gray-900 text-white font-black py-4 px-8 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-900/20 active:scale-95"
                >
                    {showEventForm ? 'CLOSE FORM' : '+ CREATE EVENT'}
                </button>
            </div>

            {/* Quick Check-in Tool */}
            <div className="bg-white rounded-[2rem] shadow-sm p-8 mb-12 border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                    <FaQrcode />
                </div>
                <div className="flex-grow w-full">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Gate Check-in</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verify ticket QR or ID</p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                    <input 
                        type="text" 
                        placeholder="Paste Ticket ID..." 
                        className="flex-grow px-6 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-mono text-sm"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button 
                        onClick={() => handleCheckIn(searchId)}
                        disabled={!searchId}
                        className="bg-purple-600 text-white font-black px-6 py-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50 text-[10px] uppercase tracking-widest"
                    >
                        Check In
                    </button>
                </div>
            </div>

            {/* Admin Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-500">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Revenue</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                    </div>
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-[1.5rem] flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">₹</div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-500">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Paid Attendees</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-500">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending</p>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-[1.5rem] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⏳</div>
                </div>
            </div>

            {showEventForm && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 mb-12 animate-in slide-in-from-top-4 duration-500">
                    <h2 className="text-2xl font-black mb-8 text-gray-900 italic tracking-tighter">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Title</label>
                                <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                                    <input required type="date" className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Seats</label>
                                    <input required type="number" className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                    <input required type="text" className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Price (₹)</label>
                                    <input required type="number" className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Event Visual</label>
                                <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-gray-100 border-dashed rounded-[2rem] cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden group">
                                    {formData.image ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition">
                                                Change Image
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="text-2xl mb-2">☁️</div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Drop or Click'}</p>
                                        </div>
                                    )}
                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-indigo-100 transition">
                                        {isGenerating ? 'AI Writing...' : '✨ Use Gemini AI'}
                                    </button>
                                </div>
                                <textarea required className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:border-gray-900 outline-none transition font-bold h-[120px] resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" className="md:col-span-2 bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-900/20 transform active:scale-95">
                            PUBLISH TO PLATFORM
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Events Section */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter">Platform Events</h2>
                        <span className="bg-gray-100 text-gray-400 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">{events.length} ACTIVE</span>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {events.length === 0 ? <div className="p-10 text-gray-400 text-center font-bold italic">No events created yet.</div> :
                                events.map(event => (
                                    <div key={event._id} className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-gray-50/50 transition border-b border-gray-50 last:border-0 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                                                {event.category.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{event.title}</h4>
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {new Date(event.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats} LEFT</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto bg-white hover:bg-red-50 text-red-400 hover:text-red-600 border border-red-100 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition">
                                            Delete
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter">Registration Log</h2>
                        <span className="bg-yellow-50 text-yellow-600 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">{bookings.length} TOTAL</span>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {bookings.length === 0 ? <div className="p-10 text-gray-400 text-center font-bold italic">No registrations logged.</div> :
                                bookings.map(booking => (
                                    <div key={booking._id} className={`p-8 hover:bg-gray-50/50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-black text-gray-900 text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                                                <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                                                {booking.checkedIn && (
                                                    <span className="px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest bg-purple-100 text-purple-700">Checked In</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50/50 rounded-2xl p-6 mb-6 border border-gray-100 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400">👤</div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-900">{booking.userId?.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{booking.userId?.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                                    <p className={`text-[10px] font-black uppercase ${booking.paymentStatus === 'paid' ? 'text-blue-600' : 'text-gray-400'}`}>{booking.paymentStatus.replace('_', ' ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                                    <p className="text-[10px] font-black text-gray-900">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex gap-3">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 bg-gray-900 hover:bg-black text-white text-[9px] font-black py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-gray-900/10 transition active:scale-95">
                                                    Approve Paid
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="px-6 bg-white hover:bg-red-50 text-red-400 hover:text-red-600 border border-red-100 text-[9px] font-black py-3 rounded-xl uppercase tracking-widest transition active:scale-95">
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === 'confirmed' && !booking.checkedIn && (
                                            <button onClick={() => handleCheckIn(booking._id)} className="w-full bg-purple-100 hover:bg-purple-600 text-purple-700 hover:text-white text-[9px] font-black py-3 rounded-xl uppercase tracking-widest transition active:scale-95">
                                                Mark as Checked-In
                                            </button>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
