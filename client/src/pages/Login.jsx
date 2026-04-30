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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500">Sign in to your Eventora account</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-red-100">{error}</div>}
            {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-center shadow-inner border border-green-100">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {!isOTPLogin ? (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 italic text-center">
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
