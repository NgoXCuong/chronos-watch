import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) setSubmitted(true);
    };

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-800">
            <div className="relative mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 md:py-16">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Eyebrow */}
                    <div className="mb-3 inline-flex items-center gap-3">
                        <div className="h-px w-6 bg-navy-300/60"></div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-100">Thành Viên VIP</p>
                        <div className="h-px w-6 bg-navy-300/60"></div>
                    </div>

                    <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-[40px]">
                        Gia Nhập Giới<br /><span className="text-navy-300">Tinh Hoa</span>
                    </h2>
                    <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-navy-100 md:text-base">
                        Đăng ký để nhận thông tin về bộ sưu tập mới, ưu đãi độc quyền và những câu chuyện đằng sau từng tuyệt tác đồng hồ.
                    </p>

                    {submitted ? (
                        <div className="flex flex-col items-center gap-3 py-3">
                            <div className="mb-2 flex size-12 items-center justify-center rounded-full border border-navy-300/50">
                                <Check size={20} strokeWidth={2} className="text-white" aria-hidden="true" />
                            </div>
                            <p className="font-semibold text-white">Cảm ơn bạn đã đăng ký!</p>
                            <p className="text-sm text-navy-100">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    icon={Mail}
                                    placeholder="Nhập địa chỉ email..."
                                    aria-label="Email nhận bản tin"
                                    required
                                    className="border-navy-300/30 bg-navy-950/40 text-white placeholder:text-navy-300 focus-visible:border-navy-300"
                                />
                            </div>
                            <Button type="submit" variant="buy" className="border-white bg-white text-navy-800 hover:bg-navy-600 hover:border-navy-600 hover:text-white whitespace-nowrap">
                                Đăng Ký
                            </Button>
                        </form>
                    )}

                    <p className="mt-6 text-[11px] uppercase tracking-[0.05em] text-navy-300">
                        Không spam · Hủy bất kỳ lúc nào · Dữ liệu bảo mật
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
