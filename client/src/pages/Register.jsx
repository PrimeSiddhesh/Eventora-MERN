import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            await register(name, email, password); // Re-trigger registration logic to resend OTP
            setError('New OTP sent to your email.');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
                    <FaTicketAlt />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter italic">Join Eventora.</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Create your premium account</p>
            </div>

            {error && <div className={`p-4 rounded-2xl mb-8 text-center text-sm font-bold shadow-sm border ${error.includes('sent') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50/50 font-bold text-gray-900"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50/50 font-bold text-gray-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50/50 font-bold text-gray-900"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-blue-50 text-blue-700 p-6 mb-8 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">i</div>
                            <p className="text-xs font-bold leading-relaxed">
                                A 6-digit verification code was sent to <span className="font-black underline">{email}</span>. Please enter it below to activate your account.
                            </p>
                        </div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Verification Code</label>
                        <input
                            type="text"
                            required
                            placeholder="000000"
                            className="w-full px-6 py-5 rounded-2xl border border-gray-100 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50/50 font-black tracking-[0.5em] text-center text-2xl shadow-inner"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                        <button 
                            type="button" 
                            onClick={handleResendOTP}
                            className="w-full mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition"
                        >
                            Didn't receive it? <span className="underline">Resend OTP</span>
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition shadow-xl shadow-gray-900/20 transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'PROCESSING...' : (showOTP ? 'VERIFY & JOIN' : 'CREATE ACCOUNT')}
                </button>
            </form>

            {!showOTP && (
                <p className="text-center mt-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Already a member? <Link to="/login" className="text-gray-900 hover:underline">Sign in</Link>
                </p>
            )}
        </div>
    );
};

export default Register;
