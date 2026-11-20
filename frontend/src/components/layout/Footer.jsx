import { Link } from "react-router-dom";
import { Watch, MapPin, Mail, Clock } from "lucide-react";

const SHOPPING = [
  ["Tất cả đồng hồ", "/products"], ["Đồng hồ nam", "/products?category=dong-ho-nam"],
  ["Đồng hồ nữ", "/products?category=dong-ho-nu"], ["Thương hiệu", "/brands"],
];
const ACCOUNT = [
  ["Theo dõi đơn hàng", "/orders"], ["Phiếu bảo hành", "/warranties"],
  ["Danh sách yêu thích", "/wishlist"], ["Tài khoản của tôi", "/profile"],
];
function FooterLinks({ title, links }) {
  return <div><h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-foreground">{title}</h3>
    <ul className="space-y-3 text-sm">{links.map(([label, to]) => <li key={to}><Link to={to} className="hover:text-primary hover:underline hover:underline-offset-4">{label}</Link></li>)}</ul>
  </div>;
}
export default function Footer() {
  return <footer className="border-t border-border bg-card text-muted-foreground">
    <div className="px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="grid gap-8 py-9 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1.3fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 text-foreground"><Watch size={24} /><span className="text-xl font-extrabold uppercase tracking-[0.15em]">Chronos</span></Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">Đồng hồ chính hãng, thông tin minh bạch và dịch vụ đồng hành sau mua.</p>
          <Link to="/about" className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">Về Chronos</Link>
        </div>
        <FooterLinks title="Mua sắm" links={SHOPPING} />
        <FooterLinks title="Dành cho khách hàng" links={ACCOUNT} />
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-foreground">Thông tin liên hệ</h3>
          <ul className="space-y-3 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0" />Phan Tây Nhạc, Xuân Phương, Nam Từ Liêm, Hà Nội</li>
            <li><a href="mailto:contact@chronos.com" className="flex items-center gap-2.5 hover:text-primary"><Mail size={16} />contact@chronos.com</a></li>
            <li className="flex items-center gap-2.5"><Clock size={16} />Thứ 2 – Chủ nhật: 9:00 – 21:00</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-5 text-xs">
        <p>© {new Date().getFullYear()} Chronos Watch.</p><p>Thanh toán: COD · Chuyển khoản · VietQR</p>
      </div>
    </div>
  </footer>;
}
