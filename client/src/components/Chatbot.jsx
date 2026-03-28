import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your Eventora AI Assistant. Ask me anything about upcoming events, or ask for recommendations!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            const { data } = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                    <FaCommentDots className="text-2xl" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animation-slideUp">
                    {/* Header */}
                    <div className="bg-black text-white p-4 flex justify-between items-center shrink-0 shadow-md z-10">
                        <div className="flex items-center gap-2">
                            <FaRobot className="text-2xl text-blue-400" />
                            <div>
                                <h3 className="font-bold leading-tight">Eventora AI</h3>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Assistant</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-black text-white rounded-tr-none'}`}>
                                    {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about events..."
                                className="flex-grow bg-gray-100 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-black transition"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 bg-black text-white rounded-full flex flex-shrink-0 items-center justify-center hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <FaPaperPlane className="text-sm shrink-0 -ml-1 mt-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
