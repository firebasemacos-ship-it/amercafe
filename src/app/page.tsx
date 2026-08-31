"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ChevronDown,
  Bell,
  Search,
  Clock,
  SlidersHorizontal,
  Heart,
  Star,
  Plus,
  Flame,
  Sparkles,
  X,
  Store,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CATEGORIES, FOOD_ITEMS, FoodItem, Category } from "@/data/foods";
import { useApp } from "@/context/AppContext";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function HomePage() {
  const router = useRouter();
  const {
    addToCart,
    toggleFavorite,
    isFavorite,
    setSelectedFoodModal,
    applyCoupon,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchLocal, setSearchLocal] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [deliveryTimeOption, setDeliveryTimeOption] = useState<"now" | "later">("now");

  // Dynamic Data from PostgreSQL
  const [foodsList, setFoodsList] = useState<FoodItem[]>(FOOD_ITEMS);
  const [catsList, setCatsList] = useState<Category[]>(CATEGORIES);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState<number>(0);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  // Secret Triple-Click Admin Trigger
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 700) {
      clickCountRef.current += 1;
      if (clickCountRef.current >= 3) {
        clickCountRef.current = 0;
        showToast("جاري توجيه المدير إلى لوحة التحكم 👑");
        router.push("/admin/login");
        return;
      }
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;
  };

  // Fetch live dynamic data from database
  useEffect(() => {
    async function loadData() {
      try {
        const [foodsRes, catsRes, notifsRes, bannersRes] = await Promise.all([
          fetch("/api/foods"),
          fetch("/api/categories"),
          fetch("/api/notifications"),
          fetch("/api/banners"),
        ]);

        const [foodsData, catsData, notifsData, bannersData] = await Promise.all([
          foodsRes.json(),
          catsRes.json(),
          notifsRes.json(),
          bannersRes.json(),
        ]);

        if (foodsData.success && foodsData.data?.length > 0) setFoodsList(foodsData.data);
        if (catsData.success && catsData.data?.length > 0) setCatsList(catsData.data);
        if (notifsData.success) setNotificationsList(notifsData.data || []);
        if (bannersData.success && bannersData.data?.length > 0) {
          const activeOnly = bannersData.data.filter((b: any) => b.is_active && b.image);
          setBannersList(activeOnly);
        }
      } catch {
        // Fallback to static initial data
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchLocal.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleCategorySelect = (categoryId: string, e?: React.MouseEvent<HTMLElement>) => {
    setActiveCategory(categoryId);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // Filter foods by live search query AND active category
  const filteredFoods = foodsList.filter((food) => {
    const isSearching = searchLocal.trim().length > 0;
    const query = searchLocal.toLowerCase().trim();

    const matchesSearch =
      !isSearching ||
      food.name.toLowerCase().includes(query) ||
      food.description.toLowerCase().includes(query) ||
      food.categoryName.toLowerCase().includes(query) ||
      food.ingredients?.some((ing) => ing.toLowerCase().includes(query));

    const matchesCategory =
      activeCategory === "all"
        ? isSearching
          ? true
          : food.isPopular
        : food.category === activeCategory;

    return matchesCategory && matchesSearch;
  });



  return (
    <div className="flex-1 overflow-y-auto pb-32 bg-transparent scrollbar-hide">
      {/* Main App Top Header */}
      <header className="px-4 sm:px-6 pt-7 sm:pt-10 pb-3 flex items-center justify-between sticky top-0 glass-header z-30 transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Amer Cafe Logo with triple-click secret admin trigger */}
          <div
            onClick={handleLogoClick}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden relative glass-card p-1 cursor-pointer select-none active:scale-95 transition flex-shrink-0"
            title="كافي عامر"
          >
            <Image
              src="/images/logo.png"
              alt="كافي عامر - Amer Cafe"
              fill
              unoptimized
              className="object-contain p-0.5"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-black text-[#0f2b2d] tracking-tight">
                كافي عامر
              </h2>
              <span className="text-[9px] sm:text-[10px] bg-[#f7d6b5] text-[#187a7d] font-bold px-1.5 py-0.5 rounded-md shadow-xs border border-white/40">
                Since 2012
              </span>
            </div>
            <div
              onClick={() => router.push("/about")}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition mt-0.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#187a7d]" />
              <span className="text-[11px] sm:text-xs text-gray-600 font-bold truncate max-w-[130px] sm:max-w-[160px]">
                طبرق ، مفترق رابعة
              </span>
              <ChevronDown className="w-3 h-3 text-[#187a7d]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 relative">
          {/* Notification Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 rounded-2xl glass-card text-[#187a7d] hover:text-[#0b3335] active:scale-95 transition"
            title="الإشعارات"
          >
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {notificationsList.length > 0 && (
              <span className="absolute top-1.5 end-1.5 sm:top-2 sm:end-2 w-2 h-2 bg-[#f7d6b5] border-2 border-[#187a7d] rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-13 sm:top-14 end-0 w-64 sm:w-72 glass-modal rounded-3xl p-4 z-50 text-right animate-in fade-in zoom-in-95 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100/60 mb-2">
                <span className="font-bold text-xs sm:text-sm text-[#0f2b2d]">إشعارات كافي عامر</span>
                {notificationsList.length > 0 && (
                  <span className="text-[10px] bg-[#e4f2f2] text-[#187a7d] px-2 py-0.5 rounded-full font-bold">
                    {notificationsList.length} جديد
                  </span>
                )}
              </div>

              {notificationsList.length === 0 ? (
                <div className="py-4 text-center text-gray-500 space-y-1">
                  <Bell className="w-6 h-6 mx-auto text-[#187a7d]/40 mb-1" />
                  <p className="text-xs font-bold text-[#0f2b2d]">لا توجد إشعارات حالياً</p>
                  <p className="text-[10px] text-gray-400">ستصلك هنا أحدث العروض وأخبار الكافي</p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {notificationsList.map((n: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xs">
                      <p className="font-bold text-[#187a7d]">{n.title}</p>
                      <p className="text-gray-600 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About / Info Button */}
          <button
            onClick={() => router.push("/about")}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl glass-card text-[#187a7d] hover:text-[#0b3335] flex items-center justify-center cursor-pointer active:scale-95 transition"
            title="معلومات كافي عامر"
          >
            <Store className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Search Section - Live Instant Search */}
      <section className="px-4 sm:px-6 py-2.5 sm:py-3 w-full">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 sm:gap-2.5 w-full">
          <div className="flex-1 min-w-0 glass-input rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center focus-within:ring-2 focus-within:ring-[#187a7d]/30 transition">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#187a7d] flex-shrink-0" />
            <input
              type="text"
              placeholder="ابحث عن قهوة، حلويات، برجر..."
              value={searchLocal}
              onChange={(e) => setSearchLocal(e.target.value)}
              className="flex-1 min-w-0 ms-2 sm:ms-2.5 bg-transparent outline-none text-xs placeholder:text-gray-400 text-gray-900 font-medium truncate"
            />

            {/* Clear search button if typing */}
            {searchLocal && (
              <button
                type="button"
                onClick={() => setSearchLocal("")}
                className="w-5 h-5 rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-700 flex items-center justify-center me-1.5 text-xs flex-shrink-0"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delivery Time Option */}
            <button
              type="button"
              onClick={() =>
                setDeliveryTimeOption((prev) => (prev === "now" ? "later" : "now"))
              }
              className="flex items-center gap-1 ps-2 sm:ps-2.5 border-s border-gray-300/60 hover:opacity-75 transition flex-shrink-0"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#187a7d]" />
              <span className="text-[#187a7d] text-[11px] sm:text-xs font-bold">
                {deliveryTimeOption === "now" ? "الآن" : "جدول"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#187a7d]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/search")}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-[#187a7d] to-[#0e4c4e] text-white rounded-2xl sm:rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-[#187a7d]/30 hover:opacity-95 transition active:scale-95 border border-white/30"
            title="صفحة البحث والتصفية"
          >
            <SlidersHorizontal className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#f7d6b5]" />
          </button>
        </form>
      </section>

      {/* Swipable Image Banners Carousel (Linked to Category) */}
      {!searchLocal && bannersList.length > 0 && (
        <section className="px-4 sm:px-6 py-2">
          <div
            ref={bannerScrollRef}
            onScroll={(e) => {
              const target = e.currentTarget;
              const width = target.offsetWidth;
              if (width > 0) {
                const scroll = Math.abs(target.scrollLeft);
                const idx = Math.min(
                  Math.round(scroll / (width - 10)),
                  bannersList.length - 1
                );
                setCurrentBannerIdx(idx);
              }
            }}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-1"
          >
            {bannersList.map((banner, idx) => (
              <div
                key={banner.id || idx}
                onClick={() => {
                  if (banner.category_id && banner.category_id !== "all") {
                    router.push(`/category/${banner.category_id}`);
                  } else {
                    router.push("/search");
                  }
                }}
                className="w-full flex-shrink-0 snap-center aspect-[2.3/1] rounded-[28px] overflow-hidden relative shadow-lg border border-white/80 cursor-pointer hover:opacity-95 transition-all duration-300 active:scale-[0.99] group bg-white/70"
              >
                <Image
                  src={banner.image}
                  alt={banner.title || "بنر كافي عامر"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots (if multiple banners) */}
          {bannersList.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              {bannersList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (bannerScrollRef.current) {
                      const width = bannerScrollRef.current.offsetWidth;
                      bannerScrollRef.current.scrollTo({
                        left: i * (width + 12),
                        behavior: "smooth",
                      });
                      setCurrentBannerIdx(i);
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentBannerIdx === i
                      ? "w-6 bg-[#187a7d] shadow-sm"
                      : "w-1.5 bg-[#187a7d]/30 hover:bg-[#187a7d]/50"
                  }`}
                  aria-label={`بنر ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories Horizontal Slider */}
      <section className="py-3 sm:py-4">
        <div className="px-4 sm:px-6 flex items-center justify-between mb-3">
          <h3 className="font-black text-xs sm:text-sm text-[#0f2b2d]">أقسام كافي عامر</h3>
          <button
            onClick={() => router.push("/search")}
            className="text-xs text-[#187a7d] hover:text-[#0b3335] font-bold transition flex items-center gap-0.5"
          >
            <span>عرض الكل</span>
            <span className="text-sm">←</span>
          </button>
        </div>

        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto px-4 sm:px-6 scrollbar-hide py-1 scroll-smooth">
          {/* "All" Category Pill */}
          <button
            onClick={(e) => {
              setActiveCategory("all");
              e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-shrink-0 transition-all duration-300 active:scale-95 cursor-pointer ${
              activeCategory === "all"
                ? "glass-pill-active scale-[1.02] shadow-md"
                : "glass-pill text-gray-700 hover:text-[#187a7d]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black">الأكثر طلباً</span>
          </button>

          {/* Dynamic Categories */}
          {catsList.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategorySelect(cat.id, e)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl flex-shrink-0 transition-all duration-300 active:scale-95 cursor-pointer ${
                  isSelected
                    ? "glass-pill-active scale-[1.02] shadow-md"
                    : "glass-pill text-gray-700 hover:text-[#187a7d]"
                }`}
              >
                <CategoryIcon icon={cat.icon} name={cat.name} className="w-5 h-5" textClassName="text-lg" />
                <div className="text-right">
                  <span className="text-xs font-black block leading-none">
                    {cat.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu Cards Grid - 2 COLUMNS SIDE-BY-SIDE */}
      <section id="menu-products-section" className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#187a7d] fill-[#187a7d]" />
            <h3 className="font-black text-xs sm:text-sm text-[#0f2b2d] transition-all">
              {searchLocal
                ? `نتائج البحث عن "${searchLocal}" (${filteredFoods.length})`
                : activeCategory === "all"
                ? "الأكثر طلباً في كافي عامر"
                : catsList.find((c) => c.id === activeCategory)?.name || "قائمة الأصناف"}
            </h3>
          </div>
          {searchLocal && (
            <button
              onClick={() => setSearchLocal("")}
              className="text-[11px] text-red-500 font-bold hover:underline"
            >
              إلغاء البحث
            </button>
          )}
        </div>

        {filteredFoods.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center my-4 shadow-sm animate-in fade-in duration-300">
            <Search className="w-10 h-10 mx-auto mb-2 text-[#187a7d]/40" />
            <h4 className="font-bold text-sm text-gray-800">لا توجد نتائج مطابقة</h4>
            <p className="text-xs text-gray-400 mt-1">
              جرب البحث بكلمات أخرى أو اختر قسماً آخر من القائمة
            </p>
            <button
              onClick={() => setSearchLocal("")}
              className="mt-4 bg-[#187a7d] text-white text-xs font-bold px-5 py-2 rounded-xl active:scale-95 transition"
            >
              عرض كل القائمة
            </button>
          </div>
        ) : (
          <div
            key={activeCategory + "-" + searchLocal}
            className="grid grid-cols-2 gap-2.5 sm:gap-3.5 animate-in fade-in zoom-in-[0.98] duration-300"
          >
            {filteredFoods.map((food: FoodItem) => {
              const isFav = isFavorite(food.id);
              return (
                <div
                  key={food.id}
                  onClick={() => setSelectedFoodModal(food)}
                  className="glass-card rounded-[24px] sm:rounded-[28px] p-2 sm:p-2.5 flex flex-col group cursor-pointer active:scale-[0.98]"
                >
                  {/* Square Image 1:1 */}
                  <div className="w-full aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden relative bg-gray-100 mb-2 border border-white/60">
                    <Image
                      src={food.image}
                      alt={food.name}
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
                        toggleFavorite(food.id);
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
                    <div className="absolute bottom-2 end-2 glass-badge-dark text-[11px] px-2.5 py-0.5 rounded-full font-black shadow-sm">
                      {Number(food.price).toFixed(2)} د.ل
                    </div>
                  </div>

                  {/* Title & Info */}
                  <h4 className="font-bold text-[#0f2b2d] text-xs truncate mb-0.5">
                    {food.name}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{food.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-400">
                      <Clock className="w-2.5 h-2.5 text-[#187a7d]" />
                      <span>{food.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(food);
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
