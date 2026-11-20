import { Link } from "react-router-dom";
import { Phone, ArrowUpRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function HomeSupport() {
  return <section className="border-t border-border bg-muted/40" aria-labelledby="home-support-title">
    <div className="grid gap-6 px-4 py-8 sm:px-8 md:px-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-24">
      <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Hỗ trợ khách hàng</p>
        <h2 id="home-support-title" className="text-xl font-semibold text-foreground">Tư vấn lựa chọn & hỗ trợ sau mua</h2>
        <p className="mt-2 text-sm text-muted-foreground">Liên hệ Chronos để chọn sản phẩm phù hợp hoặc tra cứu phiếu bảo hành của bạn.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href="tel:1900888866" className={cn(buttonVariants(), "text-xs")}><Phone size={16} />1900 8888 66</a>
        <Link to="/warranties" className={cn(buttonVariants({ variant: "outline" }), "text-xs")}><ShieldCheck size={16} />Tra cứu bảo hành <ArrowUpRight size={14} /></Link>
      </div>
    </div>
  </section>;
}
