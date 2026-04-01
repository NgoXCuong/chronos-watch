import React from 'react';
import {
    Send,
    RefreshCw
} from 'lucide-react';
import { Button } from '../../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '../../ui/dialog';

const ReviewReplyModal = ({
    replyingTo,
    onClose,
    replyText,
    setReplyText,
    submittingReply,
    handleReply
}) => {
    return (
        <Dialog open={!!replyingTo} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 bg-slate-900 text-white">
                    <DialogTitle className="text-xl font-bold font-heading tracking-wide flex items-center gap-3">
                        <Send className="text-amber-500" /> Phản hồi khách hàng
                    </DialogTitle>
                    <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">PHẢN HỒI CHO: <span className="text-amber-400 font-black">{replyingTo?.user?.username?.toUpperCase()}</span></p>
                </DialogHeader>
                <div className="p-8 space-y-5">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">Bình luận gốc</p>
                        <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{replyingTo?.comment}"</p>
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nội dung phản hồi từ Admin</label>
                        <textarea
                            className="w-full p-6 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-300 min-h-[160px] leading-relaxed resize-none shadow-sm"
                            placeholder="Viết phản hồi chu đáo & chuyên nghiệp..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="p-8 pt-0 flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="rounded-2xl h-12 flex-1 font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50">Hủy bỏ</Button>
                    <Button
                        disabled={submittingReply || !replyText.trim()}
                        onClick={handleReply}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-12 flex-1 font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-amber-600/20 gap-2 active:scale-95 transition-all"
                    >
                        {submittingReply ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />} Gửi phản hồi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewReplyModal;
