import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import categoryApi from "../../api/category.api";
import donghoquandoi from "../../assets/dong-ho-quan-doi.jpg";
import donghopin from "../../assets/dong-ho-pin.avif";
import donghothethao from "../../assets/dong-ho-the-thao.jpg";
import donghonam from "../../assets/dong-ho-nam.jpg";
import donghonu from "../../assets/dong-ho-nu.jpg";
import donghoco from "../../assets/dong-ho-co.jpg";
import donghominhhoa from "../../assets/anh-minh-hoa.jpg";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.5; // Scroll width by 50%
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.data || [];
        setCategories(items.filter((c) => c.isActive !== false));
      })
      .catch(() => {});
  }, []);

  const categoryImages = {
    nam: donghonam,
    nu: donghonu,
    co: donghoco,
    donghothethao: donghothethao,
    donghoipin: donghopin,
    donghoquandoi: donghoquandoi,
  };

  const fallbackImages = [
    donghonam,
    donghonu,
    donghothethao,
    donghopin,
    donghoquandoi,
  ];

  const displayCategories =
    categories.length > 0
      ? categories.map((c, index) => {
          const slug = c.slug?.toLowerCase() || "";
          const name = c.name?.toLowerCase() || "";

          // Tìm ảnh phù hợp theo slug hoặc name
          let assignedImage = c.imageUrl || c.image_url || c.image;

          if (!assignedImage) {
            if (slug.includes("nam") || name.includes("nam"))
              assignedImage = categoryImages["nam"];
            else if (slug.includes("nu") || name.includes("nữ"))
              assignedImage = categoryImages["nu"];
            else if (slug.includes("co") || name.includes("cơ"))
              assignedImage = categoryImages["co"];
            else if (
              slug.includes("dong-ho-the-thao") ||
              name.includes("dồng hồ thể thao")
            )
              assignedImage = categoryImages["donghothethao"];
            else if (slug.includes("pin") || name.includes("pin"))
              assignedImage = categoryImages["donghoipin"];
            else if (slug.includes("quandoi") || name.includes("quân đội"))
              assignedImage = categoryImages["donghoquandoi"];
            else assignedImage = fallbackImages[index % fallbackImages.length];
          }

          return {
            ...c,
            desc: c.description || "Khám phá bộ sưu tập",
            imageUrl: assignedImage,
          };
        })
      : [];

  if (displayCategories.length === 0) return null; // Hide if no real data in DB

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-base text-amber-500 uppercase mb-2">Danh Mục</p>
          <h2
            className={`text-3xl md:text-4xl font-bold transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Bộ Sưu Tập
          </h2>
        </div>
        <Link
          to="/products"
          className={`hidden sm:flex items-center gap-2 text-[11px] uppercase font-semibold transition-colors group ${isDark ? "text-zinc-700 hover:text-amber-600" : "text-zinc-500 hover:text-amber-700"}`}
        >
          Xem tất cả
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Scroll Buttons - Hiển thị trên md khi hover */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden md:flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border ${isDark ? "bg-black/60 text-white border-white/10 hover:bg-amber-600 hover:border-amber-600 backdrop-blur-md" : "bg-white/90 text-zinc-900 border-zinc-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 backdrop-blur-md"}`}
        >
          <ChevronLeft className="w-6 h-6 -ml-0.5" />
        </button>

        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 hidden md:flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border ${isDark ? "bg-black/60 text-white border-white/10 hover:bg-amber-600 hover:border-amber-600 backdrop-blur-md" : "bg-white/90 text-zinc-900 border-zinc-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 backdrop-blur-md"}`}
        >
          <ChevronRight className="w-6 h-6 -mr-0.5" />
        </button>

        {/* Khối trượt ngang */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 md:gap-4 pb-2 snap-x snap-mandatory scrollbar-hide select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayCategories.map((cat, i) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug || cat._id}`}
              className="group relative overflow-hidden bg-zinc-200 dark:bg-zinc-900 shrink-0 snap-start w-[calc(50%-6px)] lg:w-[calc(25%-12px)] cursor-pointer"
              style={{ aspectRatio: "3/4" }}
              draggable="false"
            >
              <img
                src={cat.imageUrl || donghominhhoa}
                alt={cat.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 pointer-events-none group-hover:scale-110 ${
                  isDark
                    ? "brightness-[0.6] group-hover:brightness-[0.3]"
                    : "brightness-[0.7] group-hover:brightness-[0.4]"
                }`}
              />

              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"></div>

              <div className="absolute top-4 left-5 text-base text-white/50 group-hover:text-white font-mono z-20 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10">
                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mb-2 transition-all duration-500 ease-in-out">
                  <p className="text-[11px] sm:text-xs text-amber-400 line-clamp-4 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <h3 className="text-white text-base sm:text-lg font-bold uppercase truncate transition-transform duration-500">
                  {cat.name}
                </h3>

                <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-xs text-white/70 group-hover:text-amber-400 transition-colors duration-300 uppercase font-semibold">
                  Khám phá{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `,
          }}
        />
      </div>
    </section>
  );
};

export default CategorySection;
