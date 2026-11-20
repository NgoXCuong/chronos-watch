import { useState, useRef, useEffect } from 'react';
import { ArrowUp, MessageCircle, Watch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import aiApi from '../../../api/ai.api';
import ChatMessage from './ChatMessage';
import ChatWelcome from './ChatWelcome';
import '../../../styles/chatbot.css';



export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Chào bạn, mình là Chronos AI. Bạn đang tìm một chiếc đồng hồ như thế nào? Hãy chia sẻ phong cách hoặc ngân sách để mình tư vấn nhé.' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const launcherRef = useRef(null);

    useEffect(() => {
        if (messages.length > 1 || isLoading) messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }, [messages, isOpen, isLoading]);

    useEffect(() => {
        if (!isOpen) return;
        inputRef.current?.focus({ preventScroll: true });
        const onEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                launcherRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, [isOpen]);

    const closeChat = () => {
        setIsOpen(false);
        launcherRef.current?.focus();
    };

    const sendMessage = async (text) => {
        const userMessage = text.trim();
        if (!userMessage || isLoading) return;
        const history = messages.length > 1 ? messages.slice(1) : [];
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        try {
            const response = await aiApi.chat(userMessage, history);
            const content = response.data?.data || 'Mình chưa kết nối được với hệ thống. Bạn vui lòng gửi lại câu hỏi sau nhé.';
            setMessages(prev => [...prev, { role: 'assistant', content, products: response.data?.products || [] }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Kết nối đang bị gián đoạn. Bạn vui lòng thử lại sau nhé.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-120 flex flex-col items-end sm:bottom-6 sm:right-6">
            {isOpen && (
                <section id="chronos-chat" role="dialog" aria-modal="false" aria-labelledby="chronos-chat-title"
                    className="chronos-chat">
                    <header className="chat-header">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10">
                            <Watch className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 id="chronos-chat-title" className="text-base font-semibold">Chronos <span className="chat-ai-label">AI</span></h2><p className="mt-1 text-[11px] text-white/65">Trợ lý lựa chọn đồng hồ</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeChat} aria-label="Đóng trò chuyện"
                            className="shrink-0 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                            <X className="size-5" />
                        </Button>
                    </header>

                    <div className="chat-conversation">

                        <div role="log" aria-label="Nội dung trò chuyện" aria-live="polite" aria-relevant="additions" className="space-y-4">
                            {messages.length === 1 ? <ChatWelcome onSelect={sendMessage} /> : messages.slice(1).map((message, index) => <ChatMessage key={index} message={message} />)}
                        </div>
                        {isLoading && (
                            <div role="status" className="ml-9 mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex gap-1" aria-hidden="true">
                                    {[0, 1, 2].map(dot => <span key={dot} className="size-1.5 rounded-full bg-primary/50 motion-safe:animate-pulse" />)}
                                </span>
                                Chronos AI đang soạn trả lời
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <footer className="chat-composer">
                        <form onSubmit={event => { event.preventDefault(); sendMessage(input); }} className="chat-input-shell">
                            <Input ref={inputRef} value={input} onChange={event => setInput(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                                        event.preventDefault();
                                        sendMessage(input);
                                    }
                                }}
                                aria-label="Câu hỏi cho Chronos AI" placeholder="Bạn đang tìm chiếc đồng hồ thế nào?"
                                className="chat-input h-12 pr-14 text-sm font-normal" />
                            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} aria-label="Gửi câu hỏi" className="absolute right-2 top-2 size-8 rounded-lg">
                                <ArrowUp className="size-4" />
                            </Button>
                        </form>
                        <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground">Chronos AI có thể nhầm lẫn · Kiểm tra chi tiết trước khi mua</p>
                    </footer>
                </section>
            )}
            <Button ref={launcherRef} onClick={() => isOpen ? closeChat() : setIsOpen(true)} aria-label={isOpen ? 'Thu gọn trò chuyện' : 'Mở trợ lý tư vấn Chronos AI'}
                aria-expanded={isOpen} aria-controls={isOpen ? 'chronos-chat' : undefined}
                className="h-12 gap-2.5 rounded-full border border-primary-foreground/10 px-4 shadow-hover normal-case sm:h-14 sm:px-5">
                {isOpen ? <X className="size-5" /> : <MessageCircle className="size-5" />}
                <span className="text-sm font-semibold">{isOpen ? 'Thu gọn' : 'Tư vấn đồng hồ'}</span>
            </Button>
        </div>
    );
}
