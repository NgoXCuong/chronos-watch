import { ArrowUpRight, BriefcaseBusiness, ShieldCheck, Wallet, Watch } from 'lucide-react';

const suggestions = [
    { icon: Wallet, title: 'Trong tầm ngân sách', detail: 'Tìm đồng hồ dưới 5 triệu', question: 'Tư vấn đồng hồ dưới 5 triệu' },
    { icon: BriefcaseBusiness, title: 'Dấu ấn nơi công sở', detail: 'Thanh lịch, dễ phối mỗi ngày', question: 'Đồng hồ phù hợp đi làm' },
    { icon: ShieldCheck, title: 'An tâm khi lựa chọn', detail: 'Tìm hiểu chính sách bảo hành', question: 'Chính sách bảo hành' },
];

export default function ChatWelcome({ onSelect }) {
    return <div className="chat-welcome">
        <div className="chat-welcome-mark"><Watch size={30} strokeWidth={1.4} /></div>
        <p className="chat-eyebrow">YOUR PERSONAL WATCH GUIDE</p>
        <h3>Chiếc đồng hồ phù hợp.<br /><span>Bắt đầu từ bạn.</span></h3>
        <p className="chat-welcome-description">Chia sẻ ngân sách hoặc phong cách.<br />Chronos AI sẽ cùng bạn tìm lựa chọn phù hợp.</p>
        <div className="chat-suggestions"><p>BẠN MUỐN KHÁM PHÁ ĐIỀU GÌ?</p>{suggestions.map(({ icon: Icon, title, detail, question }) =>
            <button type="button" key={title} onClick={() => onSelect(question)} className="chat-suggestion">
                <span className="chat-suggestion-icon"><Icon size={18} strokeWidth={1.6} /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight size={16} />
            </button>)}</div>
    </div>;
}
