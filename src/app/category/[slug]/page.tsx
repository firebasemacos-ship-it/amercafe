"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Heart,
  Star,
  Plus,
  Clock,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CATEGORIES, FOOD_ITEMS, FoodItem, Category } from "@/data/foods";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const slug = resolvedParams.slug;

  const { addToCart, isFavorite, toggleFavorite, setSelectedFoodModal } = useApp();
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [filterSort, setFilterSort] = useState<"all" | "top" | "price">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [foodsList, setFoodsList] = useState<FoodItem[]>(FOOD_ITEMS);
  const [catsList, setCatsList] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    setCurrentSlug(slug);
  }, [slug]);

  useEffect(() => {
    async function loadData() {
      try {
        const [foodsRes, catsRes] = await Promise.all([
          fetch("/api/foods"),
          fetch("/api/categories"),
        ]);
        const [foodsData, catsData] = await Promise.all([
          foodsRes.json(),
          catsRes.json(),
        ]);
        if (foodsData.success && foodsData.data?.length > 0) setFoodsList(foodsData.data);
        if (catsData.success && catsData.data?.length > 0) setCatsList(catsData.data);
      } catch {}
    }
    loadData();
  }, []);

  const handleCategorySwitch = (newSlug: string, e?: React.MouseEvent<HTMLElement>) => {
    setCurrentSlug(newSlug);
    setSearchTerm("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/category/${newSlug}`);
    }
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const currentCategory = catsList.find((c) => c.id === currentSlug) || catsList[0] || {
    id: currentSlug,
    name: "القسم",
    icon: "coffee",
    itemCount: 0,
  };

  // Get items for this category
  let categoryItems = foodsList.filter((item) => item.category === currentSlug);

  if (searchTerm.trim()) {
    categoryItems = categoryItems.filter(
      (i) =>
        i.name.includes(searchTerm.trim()) ||
        i.description.includes(searchTerm.trim()) ||
        i.ingredients?.some((ing) => ing.includes(searchTerm.trim()))
    );
  }

  if (filterSort === "top") {
    categoryItems = [...categoryItems].sort((a, b) => b.rating - a.rating);
  } else if (filterSort === "price") {
    categoryItems = [...categoryItems].sort((a, b) => Number(a.price) - Number(b.price));
  }

  return (
    <div className="flex-1 bg-transparent overflow-y-auto pb-32 h-full scrollbar-hide flex flex-col">
      {/* Sticky Header */}
      <header className="px-4 sm:px-6 pt-7 sm:pt-10 pb-3 flex items-center justify-between sticky top-0 glass-header z-30 transition-all">
        <Link
          href="/"
          className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-2xl flex items-center justify-center text-[#187a7d] active:scale-95 transition"
          title="رجوع للرئيسية"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h1 className="text-sm sm:text-base font-black text-[#0f2b2d] flex items-center gap-1.5 transition-all">
          <CategoryIcon icon={currentCategory.icon} name={currentCategory.name} className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{currentCategory.name}</span>
          <span className="text-[9px] sm:text-[10px] bg-[#f7d6b5] text-[#0b3335] px-2 py-0.5 rounded-full font-bold shadow-xs border border-white/40">
            كافي عامر
          </span>
        </h1>
        <div className="w-9 sm:w-10"></div>
      </header>

      {/* Category Switcher Horizontal Bar */}
      <section className="px-4 sm:px-6 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 scroll-smooth">
          {catsList.map((cat) => {
            const isCurrent = cat.id === currentSlug;
            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategorySwitch(cat.id, e)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[11px] sm:text-xs font-bold transition-all duration-300 flex-shrink-0 active:scale-95 cursor-pointer ${
                  isCurrent
                    ? "glass-pill-active scale-[1.03] shadow-md ring-1 ring-[#f7d6b5]/40"
                    : "glass-pill text-gray-700 hover:text-[#187a7d]"
                }`}
              >
                <CategoryIcon icon={cat.icon} name={cat.name} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Search inside Category */}
      <section className="px-4 sm:px-6 py-1.5 sm:py-2">
        <div className="glass-input rounded-2xl px-3.5 py-2 sm:py-2.5 flex items-center focus-within:ring-2 focus-within:ring-[#187a7d]/30 transition">
          <Search className="w-4 h-4 text-[#187a7d]" />
          <input
            type="text"
            placeholder={`ابحث داخل ${currentCategory.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 ms-2.5 bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px]"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Sorting Chips */}
      <section className="px-4 sm:px-6 py-1">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
          <button
            onClick={() => setFilterSort("all")}
            className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all font-bold text-[10px] sm:text-[11px] cursor-pointer active:scale-95 ${
              filterSort === "all"
                ? "bg-[#187a7d] text-white shadow-xs"
                : "glass-pill text-gray-600 hover:text-[#187a7d]"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterSort("top")}
            className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all font-bold text-[10px] sm:text-[11px] cursor-pointer active:scale-95 ${
              filterSort === "top"
                ? "bg-[#187a7d] text-white shadow-xs"
                : "glass-pill text-gray-600 hover:text-[#187a7d]"
            }`}
          >
            الأعلى تقييماً ⭐
          </button>
          <button
            onClick={() => setFilterSort("price")}
            className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all font-bold text-[10px] sm:text-[11px] cursor-pointer active:scale-95 ${
              filterSort === "price"
                ? "bg-[#187a7d] text-white shadow-xs"
                : "glass-pill text-gray-600 hover:text-[#187a7d]"
            }`}
          >
            الأقل سعراً 💵
          </button>
        </div>
      </section>

      {/* 2-Columns Side-by-Side Cards */}
      <section className="py-3 px-4 sm:px-6 flex-1">
        {categoryItems.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-6 animate-in fade-in duration-300">
            <Coffee className="w-10 h-10 mx-auto mb-2 text-[#187a7d]/50" />
            <p className="text-gray-600 text-sm font-bold">لا توجد أطباق مطابقة للبحث</p>
            <p className="text-gray-400 text-xs mt-1">جرب كلمات أخرى أو أفرغ شريط البحث</p>
          </div>
        ) : (
          <div
            key={currentSlug + "-" + filterSort + "-" + searchTerm}
            className="grid grid-cols-2 gap-2.5 sm:gap-3.5 animate-in fade-in zoom-in-[0.98] duration-300"
          >
            {categoryItems.map((item) => {
              const isFav = isFavorite(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFoodModal(item)}
                  className="glass-card rounded-[24px] sm:rounded-[28px] p-2 sm:p-2.5 flex flex-col group cursor-pointer active:scale-[0.98]"
                >
                  {/* Square Image 1:1 */}
                  <div className="w-full aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden relative bg-gray-100 mb-2 border border-white/60">
                    <Image
                      src={item.image || "/images/logo.png"}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2 start-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-90 border border-white/60"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFav ? "text-red-500 fill-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Price Tag with Amer Cafe glass badge */}
                    <div className="absolute bottom-2 end-2 glass-badge-dark text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full font-black shadow-sm">
                      {Number(item.price).toFixed(2)} د.ل
                    </div>
                  </div>

                  {/* Title & Info */}
                  <h4 className="font-bold text-[#0f2b2d] text-[11.5px] sm:text-xs truncate mb-0.5">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-400">
                      <Clock className="w-2.5 h-2.5 text-[#187a7d]" />
                      <span>{item.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full bg-[#187a7d]/95 hover:bg-[#187a7d] backdrop-blur-md text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md shadow-[#187a7d]/20 active:scale-95 mt-auto border border-white/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف للسلة</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
