"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  Phone,
  User,
  MapPin,
  FileText,
  AlertCircle,
  X,
  ShoppingBag,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { WhatsAppIcon } from "@/components/SocialIcons";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useApp();

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setFormError("");
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError("يرجى إدخال اسم العميل");
      return;
    }
    if (!phone.trim()) {
      setFormError("يرجى إدخال رقم هاتف الاستلام");
      return;
    }
    if (!address.trim()) {
      setFormError("يرجى إدخال العنوان بالتفصيل في طبرق");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Build the Itemized summary before cart is cleared
      const itemsListText = cart
        .map(
          (c) =>
            `• ${c.quantity}× ${c.item.name}${c.notes ? ` (ملاحظة: ${c.notes})` : ""} (${(c.item.price * c.quantity).toFixed(2)} د.ل)`
        )
        .join("\n");

      // 2. Save order in DB and state
      const order = await placeOrder({
        customerName,
        phone,
        address,
        notes,
      });

      if (order) {
        setShowCheckoutModal(false);

        // 3. Construct the formatted WhatsApp message
        const whatsappMessage = `*☕ طلب جديد من منيو كافي عامر الإلكتروني*
---------------------------------
📋 *رقم الطلب:* #${order.id}
👤 *اسم العميل:* ${customerName.trim()}
📞 *رقم الهاتف:* ${phone.trim()}
📍 *العنوان:* ${address.trim()}
${notes.trim() ? `📝 *ملاحظات:* ${notes.trim()}\n` : ""}---------------------------------
🛒 *قائمة الطلبات:*
${itemsListText}
---------------------------------
💰 *المجموع المطلوب:* ${cartTotal.toFixed(2)} د.ل
🛵 *سعر التوصيل:* سيتم تحديده حسب العنوان فور التجهيز.
---------------------------------
شكراً لطلبكم من كافي عامر ✨`;

        // 4. Redirect to Amer Cafe WhatsApp (0924478000 -> 218924478000)
        const cafeWhatsAppNumber = "218924478000";
        const whatsappUrl = `https://wa.me/${cafeWhatsAppNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, "_blank");

        // Navigate to orders view
        router.push("/orders");
      }
    } catch (err) {
      setFormError("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً");
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-sm sm:text-base font-black text-[#0f2b2d] flex items-center gap-1.5">
          <span>سلة كافي عامر</span>
          <span className="text-[11px] sm:text-xs bg-[#e4f2f2] text-[#187a7d] px-2.5 py-0.5 rounded-full font-black border border-[#187a7d]/20">
            {cart.length}
          </span>
        </h1>
        {cart.length > 0 ? (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            تفريغ السلة
          </button>
        ) : (
          <div className="w-9 sm:w-10"></div>
        )}
      </header>

      {cart.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 glass-card rounded-full flex items-center justify-center mb-4 text-[#187a7d]">
            <Coffee className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#0f2b2d] mb-2">سلتك فارغة في كافي عامر</h2>
          <p className="text-gray-500 text-xs max-w-xs mb-6 leading-relaxed">
            لم تقم بإضافة أي طلب إلى سلتك بعد. استكشف قائمة القهوة المختصة والحلويات الفاخرة!
          </p>
          <Link
            href="/"
            className="bg-[#187a7d] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#187a7d]/30 hover:bg-[#136265] transition active:scale-95 text-xs"
          >
            تصفح منيو كافي عامر
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Cart Items List */}
          <div className="space-y-3">
            {cart.map(({ item, quantity, notes }) => (
              <div
                key={item.id + (notes || "")}
                className="glass-card rounded-3xl p-3.5 flex items-center gap-3.5"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-100 border border-white/60">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-[#0f2b2d] text-xs truncate">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] text-gray-400 block mb-1">
                    {item.price.toFixed(2)} د.ل للعنصر
                  </span>

                  {notes && (
                    <span className="text-[10px] text-[#187a7d] bg-[#187a7d]/10 px-2 py-0.5 rounded-md inline-block mb-1.5 font-medium">
                      📝 {notes}
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#187a7d] text-base">
                      {(item.price * quantity).toFixed(2)} د.ل
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/80 shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-xs active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-[#0f2b2d] w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-[#187a7d] text-white flex items-center justify-center shadow-xs active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Notice Alert Banner */}
          <div className="glass-pill p-3.5 rounded-2xl flex items-start gap-2.5 text-[#0b3335]">
            <AlertCircle className="w-4 h-4 text-[#187a7d] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="block font-black text-[#187a7d] mb-0.5">خدمة التوصيل في طبرق:</strong>
              سيتم تحديد وحساب سعر التوصيل بدقة حسب موقع العنوان فور تجهيز الطلب والاتصال بكم.
            </div>
          </div>

          {/* Bill Summary */}
          <div className="glass-card rounded-3xl p-5 space-y-3 text-sm">
            <h4 className="font-black text-[#0f2b2d] mb-2 text-sm">ملخص الحساب</h4>

            <div className="flex justify-between text-gray-600 text-xs">
              <span>إجمالي قيمة الأصناف</span>
              <span className="font-bold text-[#0f2b2d]">
                {cartTotal.toFixed(2)} د.ل
              </span>
            </div>

            <div className="flex justify-between text-gray-600 text-xs items-center">
              <span>سعر التوصيل 🛵</span>
              <span className="font-bold text-[#187a7d] text-[11px] bg-[#e4f2f2] px-2.5 py-0.5 rounded-lg border border-[#187a7d]/20">
                يُحدد حسب العنوان عند التجهيز
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200/60 flex justify-between items-center">
              <div>
                <span className="font-black text-[#0f2b2d] text-sm">المجموع المطلوب</span>
                <p className="text-[10px] text-gray-400">+ سعر التوصيل يُدفع للمندوب</p>
              </div>
              <span className="text-2xl font-black text-[#187a7d]">
                {cartTotal.toFixed(2)} د.ل
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleOpenCheckout}
            className="w-full bg-[#187a7d] hover:bg-[#136265] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xl shadow-[#187a7d]/30 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#f7d6b5]" />
            <span>إتمام الطلب من كافي عامر</span>
            <span className="opacity-80">•</span>
            <span>{cartTotal.toFixed(2)} د.ل</span>
          </button>
        </div>
      )}

      {/* --- CHECKOUT DETAILS MODAL --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-[32px] p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#e4f2f2] text-[#187a7d] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0f2b2d]">بيانات استلام الطلب</h3>
                  <p className="text-[10px] text-gray-400">كافي عامر • طبرق</p>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-red-50/90 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl text-center">
                {formError}
              </div>
            )}

            {/* Delivery Price Notice */}
            <div className="glass-card p-3.5 rounded-2xl text-xs text-gray-700 space-y-1">
              <div className="flex items-center gap-1.5 text-[#187a7d] font-black text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>ملاحظة هامة بشأن التوصيل:</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                سيتم <strong>تحديد وحساب سعر التوصيل حسب موقع العنوان</strong> في طبرق فور الانتهاء من تجهيز الطلب وإعلامكم بالاتصال.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-3 text-xs">
              {/* Customer Name */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">الاسم الكريم</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: محمد علي"
                    className="w-full ps-10 pe-3.5 py-2.5 glass-input rounded-2xl font-bold text-[#0f2b2d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Receiver Phone */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">رقم هاتف الاستلام</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 0924478000"
                    dir="ltr"
                    className="w-full ps-10 pe-3.5 py-2.5 glass-input rounded-2xl font-bold text-[#0f2b2d] text-end focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Address in Tobruk */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">العنوان بالتفصيل في طبرق</label>
                <div className="relative">
                  <div className="absolute top-3 start-3.5 pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="المنطقة، الشارع، علامة مميزة (مثال: مفترق رابعة، بجانب صيدلية...)"
                    className="w-full ps-10 pe-3.5 py-2.5 glass-input rounded-2xl font-bold text-[#0f2b2d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Notes (Optional) */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  ملاحظات على الطلب <span className="text-gray-400 font-normal">(اختياري)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 start-3.5 pointer-events-none text-gray-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: بدون سكر، حليب شوفان، تسخين الكرواسون..."
                    className="w-full ps-10 pe-3.5 py-2.5 glass-input rounded-2xl font-medium text-[#0f2b2d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 glass-card rounded-2xl flex items-center justify-between text-xs font-black">
                <span className="text-gray-600">إجمالي الطلبات:</span>
                <span className="text-[#187a7d] text-sm">{cartTotal.toFixed(2)} د.ل</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-[#25D366]/30 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>جاري إرسال الطلب...</span>
                ) : (
                  <>
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>تأكيد وإرسال عبر واتساب</span>
                    <span>•</span>
                    <span>{cartTotal.toFixed(2)} د.ل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
