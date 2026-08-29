"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Star,
  Clock,
  Heart,
  Plus,
  Flame,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES, FOOD_ITEMS, FoodItem, Category } from "@/data/foods";
import { useApp } from "@/context/AppContext";
import { CategoryIcon } from "@/components/CategoryIcon";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [foodsList, setFoodsList] = useState<FoodItem[]>(FOOD_ITEMS);
  const [catsList, setCatsList] = useState<Category[]>(CATEGORIES);

  const { addToCart, isFavorite, toggleFavorite, setSelectedFoodModal } = useApp();

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

  // Dynamically extract real item suggestions from current active menu items
  const dynamicSuggestions = Array.from(
    new Set(
      foodsList
        .filter((f) => f.isPopular || Number(f.rating) >= 4.7)
        .map((f) => f.name)
        .concat(foodsList.map((f) => f.name))
    )
  ).slice(0, 10);

  const filteredFoods = foodsList.filter((food) => {
    const matchesCat = selectedCat === "all" || food.category === selectedCat;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      food.name.toLowerCase().includes(q) ||
      food.description.toLowerCase().includes(q) ||
      food.categoryName.toLowerCase().includes(q) ||
      food.ingredients?.some((ing) => ing.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-1 bg-transparent overflow-y-auto pb-32 h-full scrollbar-hide flex flex-col">
      {/* Sticky Header with Glass Search Input */}
      <header className="px-6 pt-10 pb-3 sticky top-0 glass-header z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 glass-card rounded-2xl flex items-center justify-center text-[#187a7d] active:scale-95 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>

          <div className="flex-1 glass-input rounded-full px-4 py-2.5 flex items-center focus-within:ring-2 focus-within:ring-[#187a7d]/30 transition">
            <Search className="w-4 h-4 text-[#187a7d]" />
            <input
              type="text"
              autoFocus
              placeholder="ابحث عن قهوة، برجر، حلويات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ms-2.5 bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Suggested Real Items Fast Tags */}
      {dynamicSuggestions.length > 0 && (
        <section className="px-6 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            <span className="text-[11px] text-[#187a7d] font-black flex-shrink-0 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              أصناف مقترحة:
            </span>
            {dynamicSuggestions.map((itemTitle, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(itemTitle)}
                className={`glass-pill px-3 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 transition active:scale-95 ${
                  query.trim() === itemTitle
                    ? "glass-pill-active"
                    : "text-gray-700 hover:text-[#187a7d]"
                }`}
              >
                {itemTitle}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Category Pills Filter */}
      <section className="px-6 py-1">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedCat === "all"
                ? "glass-pill-active"
                : "glass-pill text-gray-700"
            }`}
          >
            كل الأقسام ✨
          </button>
          {catsList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 ${
                selectedCat === cat.id
                  ? "glass-pill-active"
                  : "glass-pill text-gray-700"
              }`}
            >
              <CategoryIcon icon={cat.icon} name={cat.name} className="w-4 h-4" textClassName="text-xs" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Search Results Count */}
      <section className="px-6 py-2 flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>نتائج البحث ({filteredFoods.length} خيار)</span>
      </section>

      {/* 2-Columns Side-by-Side Results Grid */}
      <section className="px-6 py-2 flex-1">
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-6">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="font-bold text-gray-800 text-base mb-1">لم يتم العثور على أطباق</h3>
            <p className="text-gray-500 text-xs">جرب البحث بكلمات أخرى أو تصفح القائمة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredFoods.map((item) => {
              const isFav = isFavorite(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFoodModal(item)}
                  className="glass-card rounded-[28px] p-2.5 flex flex-col group cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-full aspect-square rounded-[22px] overflow-hidden relative bg-gray-100 mb-2 border border-white/60">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2 start-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/60"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? "text-red-500 fill-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-2 end-2 glass-badge-dark text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                      {Number(item.price).toFixed(2)} د.ل
                    </div>
                  </div>

                  <h4 className="font-bold text-[#0f2b2d] text-xs truncate mb-0.5">
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

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full bg-[#187a7d]/95 hover:bg-[#187a7d] backdrop-blur-md text-white py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 mt-auto border border-white/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>أضف</span>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-transparent flex items-center justify-center">
          <span className="text-sm font-bold text-gray-400">جاري تحميل البحث...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
