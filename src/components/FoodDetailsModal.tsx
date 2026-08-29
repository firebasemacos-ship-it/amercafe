"use client";

import { useApp } from "@/context/AppContext";
import { X, Heart, Star, Clock, Flame, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function FoodDetailsModal() {
  const { selectedFoodModal, setSelectedFoodModal, addToCart, isFavorite, toggleFavorite } = useApp();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedFoodModal) {
      setQuantity(1);
    }
  }, [selectedFoodModal]);

  if (!selectedFoodModal) return null;

  const item = selectedFoodModal;
  const isFav = isFavorite(item.id);

  const handleAdd = () => {
    addToCart(item, quantity);
    setSelectedFoodModal(null);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Card */}
      <div 
        className="w-full max-w-md glass-modal rounded-t-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl max-h-[88dvh] sm:max-h-[90dvh] flex flex-col relative animate-in slide-in-from-bottom duration-300 border-t sm:border border-white/80"
        dir="rtl"
      >
        {/* Top Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-100 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

          {/* Close & Favorite buttons */}
          <div className="absolute top-3 sm:top-4 start-3 sm:start-4 end-3 sm:end-4 flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedFoodModal(null)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 transition active:scale-95 border border-white/60"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleFavorite(item.id)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition active:scale-95 border border-white/60"
            >
              <Heart
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-colors ${
                  isFav ? "text-red-500 fill-red-500 scale-110" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Bottom Banner Title */}
          <div className="absolute bottom-3 sm:bottom-4 start-4 sm:start-6 end-4 sm:end-6 text-white">
            <span className="bg-[#187a7d]/90 text-[#f7d6b5] text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md mb-1.5 inline-block border border-[#f7d6b5]/40 shadow-sm">
              {item.categoryName}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">{item.name}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4 bg-[#f4f8f8]/60 backdrop-blur-sm">
          {/* Quick Metrics in Frosted Glass Card */}
          <div className="flex items-center justify-between glass-card p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
              <span>{item.rating}</span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-normal">({item.reviewsCount}+)</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#0f2b2d] font-medium">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#187a7d]" />
              <span>{item.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#187a7d] font-medium">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{item.calories} سعرة</span>
            </div>
          </div>

          {/* Description Glass Card */}
          <div className="glass-card p-3.5 sm:p-4 rounded-2xl">
            <h4 className="font-bold text-[#0f2b2d] mb-1 text-xs sm:text-sm">عن الوجبة والمكونات</h4>
            <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
          </div>

          {/* Ingredients Tags */}
          <div>
            <h4 className="font-bold text-[#0f2b2d] mb-1.5 text-xs">المكونات الأساسية:</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {item.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="glass-pill text-[#0f2b2d] text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
            <div>
              <span className="text-[11px] sm:text-xs text-gray-500 block font-medium">السعر الإجمالي</span>
              <span className="text-xl sm:text-2xl font-black text-[#187a7d]">
                {(item.price * quantity).toFixed(2)} د.ل
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2.5 sm:gap-3 glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-sm active:scale-95 border border-gray-100"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="font-black text-[#0f2b2d] w-4 text-center text-xs sm:text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#187a7d] text-white flex items-center justify-center shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3.5 sm:p-4 bg-white/80 backdrop-blur-md border-t border-white/60 flex gap-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#187a7d] hover:bg-[#136265] text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#187a7d]/30 active:scale-[0.98] transition text-xs sm:text-sm"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7d6b5]" />
            <span>إضافة إلى سلة كافي عامر • {(item.price * quantity).toFixed(2)} د.ل</span>
          </button>
        </div>
      </div>
    </div>
  );
}
