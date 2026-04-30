import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [isOTPLogin, setIsOTPLogin] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP, requestLoginOTP, loginWithOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) {
            setError('Please enter your email first.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await requestLoginOTP(email);
            setShowOTP(true);
            setMessage('A login OTP has been sent to your email.');
        } catch (err) {
            setError(err.message || err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            let data;
            if (isOTPLogin) {
                data = await loginWithOTP(email, otp);
            } else if (showOTP) {
                data = await verifyOTP(email, otp);
            } else {
                data = await login(email, password);
            }
            
            if (data.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setIsOTPLogin(false);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        try {
            if (useOTP && !showOTPField) {
                await requestLoginOTP(email);
                setShowOTPField(true);
            } else {
                let data;
                if (useOTP) {
                    data = await loginWithOTP(email, otp);
                } else {
                    data = await login(email, password);
                }
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || err);
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
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter italic">Welcome Back.</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Access your premium dashboard</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-center text-sm font-bold shadow-sm border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!useOTP ? (
                    <>
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
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email for OTP</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-gray-900 focus:ring-0 transition-all bg-gray-50/50 font-bold text-gray-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={showOTPField}
                            />
                        </div>
                        {showOTPField && (
                            <div className="mt-6">
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
                            </div>
                                You will receive a code on your email to sign in.
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code (OTP)</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}

                {isOTPLogin && !showOTP ? (
                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
                    >
                        {loading ? 'Sending...' : 'Get Login OTP'}
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify & Sign In' : 'Sign In')}
                    </button>
                )}
            </form>

            <div className="mt-6 text-center">
                <button 
                    type="button"
                    onClick={() => {
                        setIsOTPLogin(!isOTPLogin);
                        setShowOTP(false);
                        setError('');
                        setMessage('');
                    }}
                    className="text-sm text-indigo-600 font-semibold hover:underline"
                >
                    {isOTPLogin ? 'Sign in with Password instead' : 'Log in using OTP instead'}
                </button>
            </div>

            <p className="text-center mt-8 text-gray-600">
                Don't have an account? <Link to="/register" className="text-gray-900 font-bold hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
