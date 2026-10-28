// Bảng "tone" dùng chung cho mọi khối số liệu admin (KPI card, panel, dải chỉ số).
// Navy vẫn là màu thương hiệu; teal/violet chỉ là nhấn lạnh phụ giúp phân biệt chỉ số
// khi nhìn nhanh — không dùng cho nút CTA, không phải palette mới cho từng trang.
export const UI_TONES = {
  navy: {
    block: "bg-navy-50/70 border-navy-200/70 dark:bg-navy-500/10 dark:border-navy-500/25",
    chip: "bg-white text-navy-600 ring-1 ring-navy-200/70 dark:bg-navy-500/20 dark:text-navy-100 dark:ring-navy-400/25",
    value: "text-navy-700 dark:text-navy-50",
    edge: "bg-navy-600 dark:bg-navy-300",
    bar: "bg-navy-600 dark:bg-navy-300",
    barMuted: "bg-navy-200/80 dark:bg-navy-500/30",
  },
  teal: {
    block: "bg-teal-50/80 border-teal-200/70 dark:bg-teal-500/10 dark:border-teal-500/25",
    chip: "bg-white text-teal-600 ring-1 ring-teal-200/70 dark:bg-teal-500/20 dark:text-teal-200 dark:ring-teal-400/25",
    value: "text-teal-700 dark:text-teal-200",
    edge: "bg-teal-600 dark:bg-teal-400",
    bar: "bg-teal-600 dark:bg-teal-400",
    barMuted: "bg-teal-200/80 dark:bg-teal-500/30",
  },
  violet: {
    block: "bg-violet-50/80 border-violet-200/70 dark:bg-violet-500/10 dark:border-violet-500/25",
    chip: "bg-white text-violet-600 ring-1 ring-violet-200/70 dark:bg-violet-500/20 dark:text-violet-200 dark:ring-violet-400/25",
    value: "text-violet-700 dark:text-violet-200",
    edge: "bg-violet-600 dark:bg-violet-400",
    bar: "bg-violet-600 dark:bg-violet-400",
    barMuted: "bg-violet-200/80 dark:bg-violet-500/30",
  },
  success: {
    block: "bg-success-soft/60 border-success/20 dark:bg-success/10 dark:border-success/25",
    chip: "bg-white text-success ring-1 ring-success/25 dark:bg-success/20 dark:text-success-soft",
    value: "text-success dark:text-success-soft",
    edge: "bg-success",
    bar: "bg-success",
    barMuted: "bg-success/25",
  },
  warning: {
    block: "bg-warning-soft/60 border-warning/20 dark:bg-warning/10 dark:border-warning/25",
    chip: "bg-white text-warning ring-1 ring-warning/25 dark:bg-warning/20 dark:text-warning-soft",
    value: "text-warning dark:text-warning-soft",
    edge: "bg-warning",
    bar: "bg-warning",
    barMuted: "bg-warning/25",
  },
  sale: {
    block: "bg-sale-soft/60 border-sale/20 dark:bg-sale/10 dark:border-sale/25",
    chip: "bg-white text-sale ring-1 ring-sale/25 dark:bg-sale/20 dark:text-sale-soft",
    value: "text-sale dark:text-sale-soft",
    edge: "bg-sale",
    bar: "bg-sale",
    barMuted: "bg-sale/25",
  },
};

export const uiTone = (tone) => UI_TONES[tone] || UI_TONES.navy;
