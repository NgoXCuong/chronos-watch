import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check, ArrowRight, Clock } from "lucide-react";
import { Button } from "../../ui/button";

const PRESETS = [
  { label: "7 ngày qua", id: "7d" },
  { label: "30 ngày qua", id: "30d" },
  { label: "6 tháng gần nhất", id: "6m" },
  { label: "Tháng này", id: "this_month" },
  { label: "Tháng trước", id: "last_month" },
  { label: "Năm nay", id: "this_year" },
  { label: "Tất cả thời gian", id: "all_time" },
];

const toInputDate = (d) => d.toISOString().split("T")[0];

const presetDates = (id) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  switch (id) {
    case "7d":
      start.setDate(now.getDate() - 7);
      break;
    case "30d":
      start.setDate(now.getDate() - 30);
      break;
    case "6m":
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      break;
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "all_time":
      start = new Date(now.getFullYear() - 1, now.getMonth(), 1); // Mock "all time" as last 1 year
      break;
    default:
      break;
  }

  return { start: toInputDate(start), end: toInputDate(end) };
};

const matchPreset = (start, end) =>
  PRESETS.find((p) => {
    const range = presetDates(p.id);
    return range.start === start && range.end === end;
  })?.id ?? "custom";

const DateRangePicker = ({ onChange, initialStart, initialEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStart || "");
  const [endDate, setEndDate] = useState(initialEnd || "");
  const [activePreset, setActivePreset] = useState(() =>
    initialStart && initialEnd ? matchPreset(initialStart, initialEnd) : "30d",
  );
  const dropdownRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetSelect = (preset) => {
    const { start, end } = presetDates(preset.id);
    setStartDate(start);
    setEndDate(end);
    setActivePreset(preset.id);
    onChange(start, end);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    setActivePreset("custom");
    onChange(startDate, endDate);
    setIsOpen(false);
  };

  const getDisplayRange = () => {
    if (activePreset !== "custom") {
      const p = PRESETS.find((p) => p.id === activePreset);
      return p ? p.label : "Chọn khoảng ngày";
    }
    return `${new Date(startDate).toLocaleDateString("vi-VN")} - ${new Date(endDate).toLocaleDateString("vi-VN")}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 rounded-lg border bg-card px-3.5 py-2 text-[13px] font-semibold text-foreground shadow-card transition-colors ${
          isOpen
            ? "border-navy-600 shadow-[0_0_0_3px_rgba(15,42,74,.18)] dark:border-navy-300"
            : "border-input hover:bg-accent"
        }`}
      >
        <Calendar size={16} className="text-navy-600 dark:text-navy-100" />
        <span className="truncate max-w-37.5 lg:max-w-none">
          {getDisplayRange()}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex min-w-125 overflow-hidden rounded-xl border border-border bg-card shadow-hover animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Left: Presets */}
          <div className="w-48 space-y-0.5 border-r border-border bg-muted/40 p-3">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Khoảng thời gian
            </p>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                  activePreset === p.id
                    ? "bg-navy-600/10 font-semibold text-navy-700 dark:bg-navy-500/15 dark:text-navy-100"
                    : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {p.label}
                {activePreset === p.id && (
                  <Check
                    size={12}
                    className="text-navy-600 dark:text-navy-100"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: Custom Range */}
          <div className="flex-1 space-y-4 p-5">
            <div className="mb-1 flex items-center gap-2">
              <Clock size={14} className="text-navy-600 dark:text-navy-100" />
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Tùy chỉnh ngày
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium text-foreground outline-none transition-shadow focus:border-navy-600 focus:shadow-[0_0_0_3px_rgba(15,42,74,.18)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-medium text-foreground outline-none transition-shadow focus:border-navy-600 focus:shadow-[0_0_0_3px_rgba(15,42,74,.18)]"
                />
              </div>
            </div>

            <Button size="sm" className="w-full" onClick={handleApplyCustom}>
              <ArrowRight size={14} /> Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
