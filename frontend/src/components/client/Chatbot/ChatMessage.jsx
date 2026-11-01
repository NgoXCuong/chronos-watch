import { Watch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ChatProducts from './ChatProducts';

function MessageLink({ href, children }) {
    return href?.startsWith('/') && !href.startsWith('//')
        ? <Link to={href}>{children}</Link>
        : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function MessageImage({ src, alt }) {
    return <img src={src} alt={alt || 'Đồng hồ Chronos'} loading="lazy" className="my-3 max-h-48 w-full rounded-lg border border-border object-contain bg-card" />;
}

export default function ChatMessage({ message }) {
    const isUser = message.role === 'user';
    return (
        <div className={cn('flex items-start gap-2', isUser && 'justify-end')}>
            {!isUser && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary" aria-hidden="true">
                    <Watch className="size-4" />
                </div>
            )}
            <div className={cn(
                'min-w-0 max-w-[86%] break-words rounded-xl px-3.5 py-3 text-sm leading-relaxed',
                isUser ? 'rounded-tr-sm bg-primary text-primary-foreground' : 'rounded-tl-sm border border-border bg-card text-card-foreground shadow-card',
            )}>
                {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : (
                    <div className="space-y-2 [&_p]:whitespace-pre-wrap [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-2 [&_strong]:font-semibold">
                        <ReactMarkdown components={{ a: MessageLink, img: MessageImage }}>{message.content}</ReactMarkdown>
                    </div>
                )}
                {!isUser && <ChatProducts products={message.products} />}
            </div>
        </div>
    );
}
