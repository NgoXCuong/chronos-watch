import { Badge } from "../../ui/badge";
import { formatDate } from "../../../utils/formatCurrency";
import { parseBannerTitle } from "../../../utils/bannerForm";
import { getBannerSchedule } from "../../../utils/bannerSchedule";
import { BANNER_DEFAULT_LINK } from "../../../constants/bannerForm";

// banner: ảnh 16:9 + title (nhiều dòng " | ") + eyebrow — dòng chính không được tràn ô
export const BannerInfoCell = ({ banner }) => {
  const { titleLines } = parseBannerTitle(banner.title);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative h-12 w-[86px] shrink-0 overflow-hidden rounded-lg border border-border bg-navy-50 dark:bg-navy-500/10">
        <img
          src={banner.image_url}
          alt={titleLines.join(" ") || "Ảnh banner"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-bold text-foreground">
          {titleLines.join(" · ") || banner.title || "—"}
        </span>
        <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.02em] text-navy-600 dark:text-navy-200">
          {banner.eyebrow || "Không nhãn"}
        </span>
      </span>
    </div>
  );
};

// link_url là đường dẫn nội bộ nên trình bày mono để đối chiếu với router
export const BannerLinkCell = ({ value }) => (
  <span className="block truncate font-mono text-[11px] text-muted-foreground">
    {value || BANNER_DEFAULT_LINK}
  </span>
);

export const BannerOrderCell = ({ value }) => (
  <span className="text-[13px] font-extrabold tabular-nums text-navy-700 dark:text-navy-100">
    {Number(value) || 0}
  </span>
);

// Banner bị tắt thì không hiện trên trang chủ — badge lịch chuyển về muted để
// không hiểu nhầm là "đang chạy"
export const BannerScheduleCell = ({ banner, now }) => {
  const schedule = getBannerSchedule(banner, now);
  const isActive = banner.is_active !== false;
  const { start_date: start, end_date: end } = banner;
  return (
    <div className="min-w-0 space-y-1">
      <Badge variant={isActive ? schedule.variant : "muted"}>
        {schedule.label}
      </Badge>
      <p className="whitespace-nowrap text-[11px] tabular-nums text-muted-foreground">
        {start || end
          ? `${start ? formatDate(start) : "—"} → ${end ? formatDate(end) : "—"}`
          : "Không hẹn giờ"}
      </p>
    </div>
  );
};

export const BannerStatusBadge = ({ isActive }) => (
  <Badge variant={isActive ? "brand" : "muted"}>
    {isActive ? "Đang bật" : "Đang tắt"}
  </Badge>
);
