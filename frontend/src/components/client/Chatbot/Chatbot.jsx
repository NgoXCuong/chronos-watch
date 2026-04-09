import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Watch, Loader2, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import aiApi from '../../../api/ai.api';
import { useTheme } from '../../../context/ThemeContext';
import logo from '../../../assets/logo.jpg'

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Xin chào! Tôi là Chronos AI, trợ lý tư vấn đồng hồ cao cấp. Tôi có thể giúp gì cho Quý khách hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Get history (excluding the greeting to save tokens, or just send all)
            const history = messages.length > 1 ? messages.slice(1) : [];
            const response = await aiApi.chat(userMessage, history);

            if (response.data && response.data.data) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.data }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi đang gặp trục trặc khi kết nối với hệ thống. Quý khách vui lòng thử lại sau.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, hệ thống của tôi đang tạm thời bị gián đoạn. Quý khách vui lòng thử lại sau.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={`mb-4 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>

                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-5 bg-black text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center relative">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500 ring-2 ring-black"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm ">Chronos AI</h3>
                                <p className="text-[10px] text-white/60 uppercase ">Trợ lý tư vấn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-zinc-950/50' : 'bg-zinc-50'}`}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 group`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-black flex items-center justify-center mt-1 overflow-hidden">
                                        <img
                                            src={logo}
                                            alt="Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                    ? 'bg-amber-600 text-white rounded-tr-sm'
                                    : `${isDark ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-white text-zinc-700 border border-zinc-200 shadow-sm'} rounded-tl-sm`
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <p>{msg.content}</p>
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-[13.5px] leading-relaxed
                                            prose-a:text-amber-600 dark:prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                                            prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0 prose-strong:text-amber-700 dark:prose-strong:text-amber-400">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => <Link to={props.href} {...props} onClick={(e) => {
                                                        // Fallback for external links or handle internally
                                                        if (!props.href.startsWith('/')) {
                                                            e.preventDefault();
                                                            window.open(props.href, '_blank');
                                                        }
                                                    }} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-amber-100 flex items-center justify-center mt-1">
                                        <User className="w-4 h-4 text-amber-700" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start gap-2">
                                <div className="w-6 h-6 shrink-0 rounded-full bg-black flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                </div>
                                <div className={`max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                                    <div className="flex space-x-1.5 h-5 items-center">
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 ${isDark ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-white border-t border-zinc-200'}`}>
                        <form onSubmit={handleSend} className="relative flex items-end gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi tại đây..."
                                className={`flex-1 max-h-32 min-h-[44px] resize-none rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${isDark ? 'bg-zinc-950 text-white placeholder-zinc-500' : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400'}`}
                                rows={1}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 bottom-1.5 p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <p className={`text-[10px] text-center mt-3 font-medium ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            Trợ lý AI có thể cung cấp thông tin chưa chính xác.
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-zinc-800 rotate-90 scale-0 opacity-0' : 'bg-black opacity-100'}`}
                style={{ position: isOpen ? 'absolute' : 'relative' }}
            >
                <div className="absolute inset-0 rounded-full border border-amber-500/30"></div>
                <MessageCircle className="w-6 h-6 text-amber-500 relative z-10" />

                {/* Notification Badge */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-black rounded-full z-20"></span>
            </button>
        </div>
    );
};

export default Chatbot;
