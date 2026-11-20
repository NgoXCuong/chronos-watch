import { Link } from "react-router-dom";
import { ArrowUpRight, Watch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function Newsletter() {
  return (
    <section className="border-t border-border bg-muted/50">
      <div className="mx-auto grid items-center gap-6 px-4 py-10 sm:px-8 md:px-16 lg:px-24 md:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <span className="hidden size-14 shrink-0 items-center justify-center rounded-full border border-border text-primary sm:flex"><Watch size={26} /></span>
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your next chapter</p>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Chiếc đồng hồ tiếp theo, câu chuyện của bạn.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Tạo tài khoản để lưu những thiết kế yêu thích, theo dõi đơn hàng và quản lý bảo hành cùng Chronos.</p>
          </div>
        </div>
        <Link to="/register" className={cn(buttonVariants({ size: "lg" }), "w-fit")}>Gia nhập Chronos <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  );
}
