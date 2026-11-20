import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import usePublicVouchers from '../../hooks/usePublicVouchers';
import VoucherCollection from '../vouchers/VoucherCollection';
import '../../styles/vouchers.css';

export default function HomeVouchers() {
    const catalog = usePublicVouchers();
    return <section className="home-voucher-showcase" aria-labelledby="home-vouchers-title">
        <div className="home-voucher-intro"><p className="home-eyebrow">CHRONOS / SPECIAL OFFERS</p><h2 id="home-vouchers-title">Thêm ưu đãi.<br />Trọn dấu ấn.</h2><p>Chọn chiếc đồng hồ yêu thích, đừng quên ưu đãi dành cho bạn.</p><Link to="/vouchers" className="inline-flex items-center gap-2 text-xs font-semibold">Khám phá voucher <ArrowUpRight size={16} /></Link></div>
        <div className="home-voucher-list"><VoucherCollection {...catalog} limit={3} /></div>
    </section>;
}
