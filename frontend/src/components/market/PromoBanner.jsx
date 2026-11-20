import { Link } from "react-router-dom";
import { ArrowUpRight, Settings, Gem, Droplets } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import movementImage from "../../assets/dong-ho-co.jpg";

export default function PromoBanner() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card md:grid md:grid-cols-2">
      <div className="group relative min-h-64 overflow-hidden bg-navy-950 md:min-h-80">
        <img src={movementImage} alt="Chi tiết bộ máy cơ và các linh kiện đồng hồ" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
        <span className="absolute bottom-5 left-5 rounded-md border border-white/20 bg-navy-950/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">The art of watchmaking</span>
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Bên trong một tuyệt tác</p>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">Không chỉ xem giờ.<br />Cảm nhận từng chuyển động.</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Từ nhịp đập của bộ máy đến đường nét trên mặt số. Khám phá những chi tiết làm nên dấu ấn riêng của chiếc đồng hồ bạn chọn.</p>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Settings size={15} /> Bộ máy</span>
          <span className="flex items-center gap-1.5"><Gem size={15} /> Mặt kính</span>
          <span className="flex items-center gap-1.5"><Droplets size={15} /> Chống nước</span>
        </div>
        <Link to="/products?movement=Automatic" className={cn(buttonVariants({ variant: "link" }), "mt-4 h-auto justify-start self-start px-0 py-2")}>Khám phá đồng hồ cơ <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  );
}
