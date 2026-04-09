import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check, ArrowRight, Clock } from "lucide-react";

const PRESETS = [
  { label: "7 ngày qua", id: "7d", days: 7 },
  { label: "30 ngày qua", id: "30d", days: 30 },
  { label: "Tháng này", id: "this_month" },
  { label: "Tháng trước", id: "last_month" },
  { label: "Năm nay", id: "this_year" },
  { label: "Tất cả thời gian", id: "all_time" },
];

const toInputDate = (d) => d.toISOString().split("T")[0];

const DateRangePicker = ({ onChange, initialStart, initialEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("all_time");
  const [startDate, setStartDate] = useState(initialStart || "");
  const [endDate, setEndDate] = useState(initialEnd || "");
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

  const calculatePresetDates = (id) => {
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

  const handlePresetSelect = (preset) => {
    const { start, end } = calculatePresetDates(preset.id);
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
    <div className="relative font-roboto" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 bg-white border ${isOpen ? "border-amber-500 shadow-md ring-4 ring-amber-500/5" : "border-slate-200 hover:border-slate-300 shadow-sm"} rounded-2xl transition-all duration-300 text-sm font-bold text-slate-700`}
      >
        <div className="p-1.5 bg-amber-50 rounded-lg">
          <Calendar size={14} className="text-amber-600" />
        </div>
        <span className="truncate max-w-37.5 lg:max-w-none">
          {getDisplayRange()}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 flex overflow-hidden min-w-125 animate-in fade-in zoom-in duration-200 origin-top-right">
          {/* Left: Presets */}
          <div className="w-48 bg-slate-50/50 border-r border-slate-100 p-4 space-y-1">
            <p className="text-[12px] font-black text-slate-400 uppercase mb-3 px-2">
              Khoảng thời gian
            </p>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
                  activePreset === p.id
                    ? "bg-amber-100/50 text-amber-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <span
                  className={`text-xs font-bold ${activePreset === p.id ? "font-black" : ""}`}
                >
                  {p.label}
                </span>
                {activePreset === p.id && (
                  <Check size={12} className="text-amber-600" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Custom Range */}
          <div className="flex-1 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-amber-500" />
              <p className="text-[12px] font-black text-slate-400 uppercase ">
                Tùy chỉnh ngày
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-400 uppercase ml-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-400 uppercase ml-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleApplyCustom}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase  transition-all active:scale-95 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                <ArrowRight size={14} /> Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
