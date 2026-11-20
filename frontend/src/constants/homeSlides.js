import banner1 from "../assets/banner1.avif";
import banner2 from "../assets/banner2.avif";
import banner3 from "../assets/banner3.avif";

export const defaultSlides = [
  {
    id: 1,
    image: banner1,
    eyebrow: "Bộ Sưu Tập Mới 2026",
    titleLines: ["NGHỆ", "THUẬT", "CỦA THỜI", "GIAN"],
    accentLines: [false, true, false, false],
    subtitle:
      "Từng chiếc đồng hồ là một tác phẩm nghệ thuật tỉ mỉ, được chế tác bởi những nghệ nhân tài ba với hơn 150 năm kinh nghiệm.",
  },
  {
    id: 2,
    image: banner2,
    eyebrow: "Di Sản Thụy Sĩ",
    titleLines: ["KỶ", "NGUYÊN", "MỚI CỦA", "ĐẲNG CẤP"],
    accentLines: [false, true, false, false],
    subtitle:
      "Sự hoàn hảo được đo đếm bằng từng mili-giây. Di sản Thụy Sĩ hơn thế kỷ trong từng chi tiết được trau chuốt kỹ lưỡng.",
  },
  {
    id: 3,
    image: banner3,
    eyebrow: "Phiên bản giới hạn",
    titleLines: ["TINH", "TẾ", "VÀ", "ĐỘC BẢN"],
    accentLines: [false, false, false, true],
    subtitle:
      "Chỉ dành cho những ai trân quý sự hoàn hảo. Các Phiên bản giới hạn được đánh số thủ công và đi kèm chứng nhận độc quyền.",
  },
].map((slide) => ({ ...slide, alt: slide.titleLines.join(" ") }));

