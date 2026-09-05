"use client";

import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, RotateCcw, Truck, MapPin, ClipboardList, Trash2 } from "lucide-react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { orders, addToCart, showToast, deleteOrder, clearAllOrders } = useApp();
  const router = useRouter();

  const handleReorder = (orderItems: typeof orders[0]["items"]) => {
    orderItems.forEach((orderItem) => {
      const item = (orderItem as any).item || orderItem;
      const quantity = orderItem.quantity || 1;
      addToCart(item, quantity);
    });
    showToast("تمت إضافة عناصر الطلب إلى سلة كافي عامر");
    router.push("/cart");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "جاري التحضير":
        return (
          <span className="bg-[#e4f2f2]/90 text-[#187a7d] border border-[#187a7d]/20 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-xs">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>جاري التحضير</span>
          </span>
        );
      case "في الطريق":
        return (
          <span className="bg-amber-50/90 text-amber-800 border border-amber-200 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-xs">
            <Truck className="w-3.5 h-3.5" />
            <span>في الطريق 🛵</span>
          </span>
        );
      default:
        return (
          <span className="bg-emerald-50/90 text-emerald-700 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تم الاستلام</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-transparent overflow-y-auto pb-32 h-full scrollbar-hide">
      {/* Header */}
      <header className="px-4 sm:px-6 pt-7 sm:pt-10 pb-3 flex items-center justify-between sticky top-0 glass-header z-30">
        <Link
          href="/"
          className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-2xl flex items-center justify-center text-[#187a7d] active:scale-95 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h1 className="text-sm sm:text-base font-black text-[#0f2b2d]">طلبات كافي عامر</h1>
        {orders.length > 0 ? (
          <button
            onClick={() => {
              if (confirm("هل أنت متأكد من مسح جميع طلباتك من السجل؟")) {
                clearAllOrders();
              }
            }}
            className="text-[11px] text-red-500 hover:text-red-600 font-bold px-2 py-1 rounded-xl hover:bg-red-50/80 transition cursor-pointer"
          >
            مسح الكل
          </button>
        ) : (
          <div className="w-9 sm:w-10"></div>
        )}
      </header>

      <div className="p-4 sm:p-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl p-6">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-3 text-[#187a7d]">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#0f2b2d] text-base mb-1">لا توجد طلبات سابقة</h3>
            <p className="text-gray-500 text-xs mb-4">عندما تطلب قهوتك أو وجبتك، ستظهر تفاصيلها هنا</p>
            <Link
              href="/"
              className="inline-block bg-[#187a7d] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-[#136265] transition active:scale-95"
            >
              ابدأ طلبك الآن
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="glass-card rounded-3xl p-4 space-y-3.5"
            >
              {/* Top Row: ID & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                <div>
                  <span className="font-black text-[#0f2b2d] text-xs block">
                    {order.id}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{order.date}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items Thumbnails & Names */}
              <div className="space-y-2">
                {order.items?.map((itemObj: any, idx: number) => {
                  const foodItem = itemObj.item || itemObj;
                  const qty = itemObj.quantity || 1;
                  const image = foodItem?.image || "/images/logo.png";
                  const name = foodItem?.name || itemObj.name || "صنف من كافي عامر";
                  const price = foodItem?.price || itemObj.price || 0;

                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100 border border-white/60">
                        <Image
                          src={image}
                          alt={name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0f2b2d] truncate">
                          {name}
                        </h4>
                        <span className="text-[11px] text-gray-500">
                          {qty} × {Number(price).toFixed(2)} د.ل
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address & Receiver Info */}
              {order.address && (
                <div className="text-[11px] text-gray-600 bg-white/60 backdrop-blur-sm p-2.5 rounded-xl border border-white/70 flex items-start gap-1.5 shadow-xs">
                  <span className="text-[#187a7d] font-bold flex-shrink-0">📍 الاستلام:</span>
                  <span className="leading-relaxed">{order.address}</span>
                </div>
              )}

              {/* Bottom Row: Total & Action Buttons */}
              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">الإجمالي</span>
                  <span className="font-black text-[#187a7d] text-base">
                    {Number(order.total).toFixed(2)} د.ل
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`هل تريد حذف الطلب ${order.id} من سجلك؟`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition active:scale-95 border border-red-200/60 shadow-xs cursor-pointer"
                    title="حذف هذا الطلب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>

                  <button
                    onClick={() => handleReorder(order.items)}
                    className="bg-[#e4f2f2] hover:bg-[#d5eded] text-[#187a7d] text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 border border-[#187a7d]/15 shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#187a7d]" />
                    <span>إعادة الطلب</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
