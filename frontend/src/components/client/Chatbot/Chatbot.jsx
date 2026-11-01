import { useState, useRef, useEffect } from 'react';
import { ArrowUp, ArrowUpRight, MessageCircle, Watch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import aiApi from '../../../api/ai.api';
import ChatMessage from './ChatMessage';

const SUGGESTIONS = ['Tư vấn đồng hồ dưới 5 triệu', 'Đồng hồ phù hợp đi làm', 'Chính sách bảo hành'];

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
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
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
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
            {isOpen && (
                <section id="chronos-chat" role="dialog" aria-modal="false" aria-labelledby="chronos-chat-title"
                    className="mb-3 flex h-[min(600px,calc(100dvh-108px))] w-[calc(100vw-32px)] max-w-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-navy sm:h-[min(640px,calc(100dvh-120px))]">
                    <header className="flex shrink-0 items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10">
                            <Watch className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 id="chronos-chat-title" className="text-base font-semibold">Chronos AI</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeChat} aria-label="Đóng trò chuyện"
                            className="shrink-0 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                            <X className="size-5" />
                        </Button>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background p-4">
                        <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Tư vấn cùng Chronos AI</p>
                        <div role="log" aria-label="Nội dung trò chuyện" aria-live="polite" aria-relevant="additions" className="space-y-4">
                            {messages.map((message, index) => <ChatMessage key={index} message={message} />)}
                        </div>
                        {messages.length === 1 && (
                            <div className="ml-9 mt-5 space-y-2">
                                <p className="text-xs text-muted-foreground">Bạn có thể bắt đầu với</p>
                                {SUGGESTIONS.map(question => (
                                    <Button key={question} variant="outline" onClick={() => sendMessage(question)} disabled={isLoading}
                                        className="h-auto w-full justify-between gap-3 px-3 py-2.5 text-left text-xs font-medium normal-case">
                                        {question}<ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                                    </Button>
                                ))}
                            </div>
                        )}
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

                    <footer className="shrink-0 border-t border-border bg-card p-3">
                        <form onSubmit={event => { event.preventDefault(); sendMessage(input); }} className="relative">
                            <Input ref={inputRef} value={input} onChange={event => setInput(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                                        event.preventDefault();
                                        sendMessage(input);
                                    }
                                }}
                                aria-label="Câu hỏi cho Chronos AI" placeholder="Nhập tin nhắn..."
                                className="h-11 bg-background pr-14 text-sm font-normal" />
                            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} aria-label="Gửi câu hỏi" className="absolute right-1.5 top-1.5 size-8">
                                <ArrowUp className="size-4" />
                            </Button>
                        </form>
                        <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground">Trợ lý AI · Thông tin tư vấn chỉ mang tính tham khảo</p>
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
