import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// Inline SVG social icons (lucide-react removed brand icons)
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const TwitterXIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tạo mảng chứa thông tin mạng xã hội sử dụng inline SVG icons
  const socialLinks = [
    { id: "fb", icon: <FacebookIcon size={16} />, url: "#" },
    { id: "ig", icon: <InstagramIcon size={16} />, url: "#" },
    { id: "yt", icon: <YoutubeIcon size={16} />, url: "#" },
    { id: "tw", icon: <TwitterXIcon size={16} />, url: "#" },
  ];

  return (
    <footer
      className={`transition-all duration-500 border-t ${isDark ? "bg-[#050505] border-white/5 text-zinc-500" : "bg-stone-50 border-stone-200 text-stone-600"}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 py-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span
                className={`text-xl font-bold uppercase ${isDark ? "text-white" : "text-stone-900"}`}
                style={{ fontFamily: "Georgia, serif" }}
              >
                CHRONOS
              </span>
              <div className="h-px bg-gradient-to-r from-amber-500/60 to-transparent mt-0.5"></div>
              <span
                className={`text-[10px] uppercase block mt-0.5 ${isDark ? "text-zinc-600" : "text-stone-400"}`}
              >
                TIMEPIECES
              </span>
            </Link>
            <p
              className={`text-sm leading-relaxed max-w-xs mt-4 ${isDark ? "text-zinc-600" : "text-stone-500"}`}
            >
              Thương hiệu đồng hồ cao cấp hàng đầu. Mỗi chiếc đồng hồ là một câu
              chuyện về thời gian và sự hoàn hảo.
            </p>

            {/* Social Icons Updated Here */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/10 text-zinc-600 hover:text-amber-500 hover:border-amber-500/40" : "border-stone-200 text-stone-400 hover:text-amber-600 hover:border-amber-500/40"}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className={`text-lg uppercase mb-5 font-semibold ${isDark ? "text-white/60" : "text-stone-900/60"}`}
            >
              Sản Phẩm
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Đồng hồ nam", to: "/products?category=nam" },
                { label: "Đồng hồ nữ", to: "/products?category=nu" },
                { label: "Automatic", to: "/products?category=automatic" },
                { label: "Smartwatch", to: "/products?category=smartwatch" },
                { label: "Limited Edition", to: "/products?limited=true" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`transition-colors duration-300 ${isDark ? "hover:text-amber-500" : "hover:text-amber-600"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className={`text-lg uppercase mb-5 font-semibold ${isDark ? "text-white/60" : "text-stone-900/60"}`}
            >
              Hỗ Trợ
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Bảo hành & Sửa chữa",
                "Chính sách đổi trả",
                "Hướng dẫn sử dụng",
                "Câu hỏi thường gặp",
                "Liên hệ chúng tôi",
              ].map((item) => (
                <li key={item}>
                  <span
                    className={`transition-colors duration-300 cursor-pointer ${isDark ? "hover:text-amber-500" : "hover:text-amber-600"}`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className={`text-lg uppercase mb-5 font-semibold ${isDark ? "text-white/60" : "text-stone-900/60"}`}
            >
              Liên Hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${isDark ? "text-amber-500/60" : "text-amber-600/60"}`}
                >
                  ✦
                </span>
                <span>
                  Phan Tây Nhạc, Xuân Phương, Quận Nam Từ Liêm, Hà Nội
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${isDark ? "text-amber-500/60" : "text-amber-600/60"}`}
                >
                  ✦
                </span>
                <span>Hotline: 1900 8888 66</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${isDark ? "text-amber-500/60" : "text-amber-600/60"}`}
                >
                  ✦
                </span>
                <span>Email: contact@chronos.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${isDark ? "text-amber-500/60" : "text-amber-600/60"}`}
                >
                  ✦
                </span>
                <span>T2–CN: 9:00 AM – 21:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`border-t py-2 flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? "border-white/5" : "border-stone-200"}`}
        >
          <p
            className={`text-[10px] uppercase ${isDark ? "text-zinc-700" : "text-stone-400"}`}
          >
            © {new Date().getFullYear()} Chronos Watch. All rights reserved.
          </p>
          <div
            className={`flex items-center gap-6 text-[10px] uppercase ${isDark ? "text-zinc-700" : "text-stone-400"}`}
          >
            <a href="#" className="hover:text-amber-600 transition-colors">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="hover:text-amber-600 transition-colors">
              Điều Khoản
            </a>
            <a href="#" className="hover:text-amber-600 transition-colors">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
