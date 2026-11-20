import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import menImage from "../../assets/dong-ho-nam.jpg";
import womenImage from "../../assets/dong-ho-nu.jpg";
import mechanicalImage from "../../assets/dong-ho-co.jpg";

const COLLECTIONS = [
  { title: "Dành cho quý ông", subtitle: "Bản lĩnh trong từng chi tiết", image: menImage, slug: "dong-ho-nam", number: "01" },
  { title: "Dành cho quý cô", subtitle: "Thanh lịch theo cách của bạn", image: womenImage, slug: "dong-ho-nu", number: "02" },
  { title: "Nhịp đập cơ khí", subtitle: "Nghệ thuật của những chuyển động", image: mechanicalImage, slug: "dong-ho-co", number: "03" },
];

export default function CollectionGallery({ categories = [] }) {
  return (
    <section id="collections" className="scroll-mt-44">
      <div className="home-section-heading">
        <div><p className="home-eyebrow">FIND YOUR SIGNATURE</p><h2>Một thế giới. Nhiều dấu ấn.</h2></div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Từ thanh lịch thường ngày đến những khoảnh khắc đặc biệt. Luôn có một thiết kế dành cho bạn.</p>
      </div>
      <div className="collection-grid">
        {COLLECTIONS.map((item) => {
          const category = categories.find((c) => c.slug === item.slug);
          return <Link key={item.slug} to={`/products?category=${category?.slug || item.slug}`} className="collection-tile group">
            <div className="collection-image"><img src={item.image} alt={item.title} loading="lazy" /><span>{item.number} / CHRONOS COLLECTION</span></div>
            <div className="collection-label"><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><ArrowUpRight size={22} className="transition-transform motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1" /></div>
          </Link>;
        })}
      </div>
    </section>
  );
}
