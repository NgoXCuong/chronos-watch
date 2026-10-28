import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const FacebookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0C1D33" />
  </svg>
);

const TwitterXIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PRODUCT_LINKS = [
  { label: "Đồng hồ nam", to: "/products?category=nam" },
  { label: "Đồng hồ nữ", to: "/products?category=nu" },
  { label: "Automatic", to: "/products?category=automatic" },
  { label: "Smartwatch", to: "/products?category=smartwatch" },
  { label: "Limited Edition", to: "/products?limited=true" },
];

const SUPPORT_LINKS = [
  { label: "Về chúng tôi", to: "/about" },
  { label: "Thương hiệu", to: "/brands" },
  { label: "Đơn hàng của tôi", to: "/orders" },
  { label: "Giỏ hàng", to: "/cart" },
  { label: "Yêu thích", to: "/wishlist" },
];

const CONTACT = [
  { icon: MapPin, text: "Phan Tây Nhạc, Xuân Phương, Nam Từ Liêm, Hà Nội" },
  { icon: Phone, text: "Hotline: 1900 8888 66" },
  { icon: Mail, text: "Email: contact@chronos.com" },
  { icon: Clock, text: "T2–CN: 9:00 – 21:00" },
];

const SOCIALS = [
  { id: "fb", icon: <FacebookIcon />, url: "#" },
  { id: "ig", icon: <InstagramIcon />, url: "#" },
  { id: "yt", icon: <YoutubeIcon />, url: "#" },
  { id: "tw", icon: <TwitterXIcon />, url: "#" },
];

const ColHead = ({ children }) => (
  <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white">
    {children}
  </h3>
);

const LinkCol = ({ title, links }) => (
  <div>
    <ColHead>{title}</ColHead>
    <ul className="space-y-2.5 text-sm">
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link to={to} className="transition-colors hover:text-white">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/** Footer 4 cột nền navy-900 theo khung sàn TMĐT. */
const Footer = () => (
  <footer className="bg-navy-900 text-navy-100">
    <div className="mx-auto w-full px-12 md:px-16 lg:px-24">
      <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="mb-4 inline-block">
            <span className="text-xl font-extrabold uppercase tracking-[0.14em] text-white">
              Chronos
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-navy-300">
              Timepieces
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-navy-100/80">
            Thương hiệu đồng hồ chính hãng hàng đầu. Mỗi chiếc đồng hồ là một
            câu chuyện về thời gian và sự hoàn hảo.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chronos trên ${s.id}`}
                className="flex size-8 items-center justify-center rounded-lg border border-navy-700 text-navy-100 transition-colors hover:border-navy-300 hover:bg-navy-800 hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <LinkCol title="Sản phẩm" links={PRODUCT_LINKS} />
        <LinkCol title="Hỗ trợ" links={SUPPORT_LINKS} />

        <div>
          <ColHead>Liên hệ</ColHead>
          <ul className="space-y-3 text-sm">
            {CONTACT.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <Icon
                  size={15}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-navy-300"
                  aria-hidden="true"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-navy-800 py-5 text-xs md:flex-row">
        <p className="uppercase tracking-wide text-navy-300">
          © {new Date().getFullYear()} Chronos Watch. All rights reserved.
        </p>
        <div className="flex items-center gap-6 uppercase text-navy-300">
          <a href="#" className="transition-colors hover:text-white">
            Chính sách bảo mật
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Điều khoản
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Cookie
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
