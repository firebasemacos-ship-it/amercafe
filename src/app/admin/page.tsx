"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  ShoppingBag,
  Layers,
  Bell,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  LogOut,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Upload,
  UploadCloud,
  CheckCircle2,
  Menu,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Store,
  Calendar,
  DollarSign,
  AlertCircle,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";
import { FoodItem, Category, Order } from "@/data/foods";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "foods" | "categories" | "banners" | "notifications" | "orders" | "settings">("overview");
  
  // Data States
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cafeInfo, setCafeInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Upload States
  const [uploadingFoodImg, setUploadingFoodImg] = useState(false);
  const [uploadingBannerImg, setUploadingBannerImg] = useState(false);
  const [uploadingCatIcon, setUploadingCatIcon] = useState(false);
  const foodFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Form States
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    category: "coffee",
    categoryName: "قهوة ومشروبات",
    price: "",
    calories: "250",
    description: "",
    image: "",
    isPopular: false,
    ingredients: "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ id: "", name: "", icon: "☕" });

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    category_id: "hot-drinks",
    image: "",
    is_active: true,
  });

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: "", message: "", type: "promo" });

  const [mounted, setMounted] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [foodCategoryFilter, setFoodCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [todayFormatted, setTodayFormatted] = useState("");

  // Auth Check & Date setup
  useEffect(() => {
    setMounted(true);
    try {
      setTodayFormatted(
        new Date().toLocaleDateString("ar-LY", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } catch {
      setTodayFormatted("اليوم");
    }
    const isAuth = localStorage.getItem("amer_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      fetchAllData();
    }
  }, [router]);

  const notifyAction = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [foodsRes, catsRes, ordersRes, bannersRes, notifsRes, infoRes] = await Promise.all([
        fetch("/api/foods"),
        fetch("/api/categories"),
        fetch("/api/orders"),
        fetch("/api/banners"),
        fetch("/api/notifications"),
        fetch("/api/cafe-info"),
      ]);

      const [foodsData, catsData, ordersData, bannersData, notifsData, infoData] = await Promise.all([
        foodsRes.json(),
        catsRes.json(),
        ordersRes.json(),
        bannersRes.json(),
        notifsRes.json(),
        infoRes.json(),
      ]);

      if (foodsData.success) setFoods(foodsData.data);
      if (catsData.success) setCategories(catsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (bannersData.success) setBanners(bannersData.data);
      if (notifsData.success) setNotifications(notifsData.data);
      if (infoData.success) setCafeInfo(infoData.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("amer_admin_auth");
    document.cookie = "amer_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  // --- IMGBB UPLOAD HANDLER ---
  const handleUploadImage = async (file: File, target: "food" | "banner" | "category") => {
    if (!file) return;

    if (target === "food") setUploadingFoodImg(true);
    if (target === "banner") setUploadingBannerImg(true);
    if (target === "category") setUploadingCatIcon(true);

    try {
      let uploadedUrl: string | null = null;

      // Strategy 1: Direct Browser-to-ImgBB upload (Fastest & uses browser native SSL)
      try {
        const clientFormData = new FormData();
        clientFormData.append("image", file);

        const directRes = await fetch(
          "https://api.imgbb.com/1/upload?key=ecfd2830eec1e538465f3d1083a79b61",
          {
            method: "POST",
            body: clientFormData,
          }
        );

        const directData = await directRes.json();
        if (directData.success && (directData.data?.display_url || directData.data?.url)) {
          uploadedUrl = directData.data.display_url || directData.data.url;
        }
      } catch (clientErr) {
        console.warn("Direct ImgBB upload failed, attempting server proxy...", clientErr);
      }

      // Strategy 2: Server-side proxy fallback (/api/upload)
      if (!uploadedUrl) {
        const serverFormData = new FormData();
        serverFormData.append("image", file);

        const serverRes = await fetch("/api/upload", {
          method: "POST",
          body: serverFormData,
        });

        const serverData = await serverRes.json();
        if (serverData.success && serverData.url) {
          uploadedUrl = serverData.url;
        } else {
          throw new Error(serverData.error || "فشل رفع الصورة");
        }
      }

      if (uploadedUrl) {
        if (target === "food") {
          setFoodForm((prev) => ({ ...prev, image: uploadedUrl! }));
          notifyAction("تم رفع صورة المنتج بنجاح عبر ImgBB! 📸");
        } else if (target === "banner") {
          setBannerForm((prev) => ({ ...prev, image: uploadedUrl! }));
          notifyAction("تم رفع صورة البنر بنجاح عبر ImgBB! 🎨");
        } else if (target === "category") {
          setCategoryForm((prev) => ({ ...prev, icon: uploadedUrl! }));
          notifyAction("تم رفع أيقونة القسم بنجاح عبر ImgBB! 🏷️");
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      notifyAction(err.message || "حدث خطأ أثناء رفع الصورة إلى ImgBB");
    } finally {
      if (target === "food") setUploadingFoodImg(false);
      if (target === "banner") setUploadingBannerImg(false);
      if (target === "category") setUploadingCatIcon(false);
    }
  };

  // --- FOOD CRUD ---
  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.id === foodForm.category);
    const payload = {
      ...foodForm,
      categoryName: catObj ? catObj.name : "عام",
      price: parseFloat(foodForm.price),
      calories: parseInt(foodForm.calories) || 200,
      image: foodForm.image.trim() || "/images/logo.png",
      ingredients: foodForm.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingFood) {
        await fetch("/api/foods", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingFood.id, ...payload }),
        });
        notifyAction("تم تحديث الصنف بنجاح! ✨");
      } else {
        await fetch("/api/foods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        notifyAction("تمت إضافة الصنف الجديد بنجاح! 🎉");
      }
      setShowFoodModal(false);
      setEditingFood(null);
      fetchAllData();
    } catch {
      notifyAction("حدث خطأ أثناء حفظ الصنف");
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف نهائياً من قاعدة البيانات؟")) return;
    try {
      await fetch(`/api/foods?id=${id}`, { method: "DELETE" });
      notifyAction("تم حذف الصنف من قاعدة البيانات");
      fetchAllData();
    } catch {
      notifyAction("فشل حذف الصنف");
    }
  };

  // --- CATEGORY CRUD ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
        notifyAction("تم تحديث القسم بنجاح!");
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
        notifyAction("تمت إضافة القسم الجديد بنجاح!");
      }
      setShowCategoryModal(false);
      setEditingCat(null);
      fetchAllData();
    } catch {
      notifyAction("فشل حفظ القسم");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      notifyAction("تم حذف القسم");
      fetchAllData();
    } catch {
      notifyAction("فشل حذف القسم");
    }
  };

  // --- BANNER CRUD ---
  const handleOpenEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || "",
      category_id: banner.category_id || categories[0]?.id || "hot-drinks",
      image: banner.image || "",
      is_active: banner.is_active ?? true,
    });
    setShowBannerModal(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        const res = await fetch("/api/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bannerForm, id: editingBanner.id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "فشل تحديث البنر");
        notifyAction("تم تحديث وتعديل البنر الإعلاني بنجاح! ✅");
      } else {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerForm),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "فشل إضافة البنر");
        notifyAction("تمت إضافة البنر الإعلاني بنجاح! 🚀");
      }
      setShowBannerModal(false);
      setEditingBanner(null);
      fetchAllData();
    } catch (err: any) {
      notifyAction(err.message || "فشل حفظ البنر");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا البنر؟")) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حذف البنر من قاعدة البيانات");
      }
      setBanners((prev) => prev.filter((b) => b.id !== id));
      notifyAction("تم حذف البنر بنجاح ✅");
      fetchAllData();
    } catch (err: any) {
      console.error("Error deleting banner:", err);
      notifyAction(err.message || "فشل حذف البنر");
    }
  };

  // --- NOTIFICATION CRUD ---
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifForm),
      });
      notifyAction("تم إرسال الإشعار لجميع الزبائن! 🔔");
      setShowNotifModal(false);
      fetchAllData();
    } catch {
      notifyAction("فشل إرسال الإشعار");
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      notifyAction("تم حذف الإشعار");
      fetchAllData();
    } catch {
      notifyAction("فشل حذف الإشعار");
    }
  };

  // --- ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      notifyAction(`تم تحديث حالة الطلب إلى: ${status}`);
      fetchAllData();
    } catch {
      notifyAction("فشل تحديث الطلب");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب من السجل؟")) return;
    try {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حذف الطلب من السيرفر");
      }
      notifyAction("تم حذف الطلب بنجاح ✅");
      fetchAllData();
    } catch (err: any) {
      notifyAction(err.message || "فشل حذف الطلب");
      fetchAllData();
    }
  };

  const handleClearAllOrders = async () => {
    if (!confirm("⚠️ تحذير: هل أنت متأكد من مسح جميع طلبات الزبائن من السجل بالكامل؟")) return;
    try {
      setOrders([]);
      const res = await fetch("/api/orders?all=true", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل مسح الطلبات");
      }
      notifyAction("تم مسح جميع الطلبات من السجل بنجاح ✅");
      fetchAllData();
    } catch (err: any) {
      notifyAction(err.message || "فشل مسح الطلبات");
      fetchAllData();
    }
  };

  // --- CAFE INFO UPDATE ---
  const handleSaveCafeInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/cafe-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafeInfo),
      });
      notifyAction("تم تحديث معلومات كافي عامر بنجاح!");
      fetchAllData();
    } catch {
      notifyAction("فشل حفظ معلومات الكافي");
    }
  };

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== "تم التوصيل").length;

  const filteredFoods = foods.filter((food) => {
    const query = foodSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      food.name?.toLowerCase().includes(query) ||
      food.categoryName?.toLowerCase().includes(query);
    const matchesCategory =
      foodCategoryFilter === "all" || food.category === foodCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === "all") return true;
    return order.status === orderStatusFilter;
  });

  interface NavTabItem {
    id: "overview" | "foods" | "categories" | "banners" | "orders" | "notifications" | "settings";
    label: string;
    icon: any;
    count: number | null;
    alertCount?: number;
    group: string;
  }

  const navTabs: NavTabItem[] = [
    { id: "overview", label: "نظرة عامة", icon: LayoutDashboard, count: null, group: "الرئيسية" },
    { id: "foods", label: "الأصناف والأسعار", icon: Coffee, count: foods.length, group: "المنيو والمحتوى" },
    { id: "categories", label: "الأقسام والتصنيفات", icon: Layers, count: categories.length, group: "المنيو والمحتوى" },
    { id: "banners", label: "البنرات والعروض", icon: ImageIcon, count: banners.length, group: "المنيو والمحتوى" },
    { id: "orders", label: "طلبات الزبائن", icon: ShoppingBag, count: orders.length, alertCount: activeOrdersCount, group: "المبيعات والعملاء" },
    { id: "notifications", label: "إشعارات الزوار", icon: Bell, count: notifications.length, group: "المبيعات والعملاء" },
    { id: "settings", label: "إعدادات الكافي", icon: Settings, count: null, group: "النظام" },
  ];

  const tabTitles: Record<string, { title: string; desc: string }> = {
    overview: {
      title: "نظرة عامة والإحصائيات",
      desc: "لوحة مؤشرات أداء كافي عامر، إجمالي المبيعات، ومتابعة الطلبات المباشرة",
    },
    foods: {
      title: "إدارة الأصناف والأسعار",
      desc: "تحكم بقائمة المشروبات والأطعمة، تعديل الأسعار، ورفع الصور عبر ImgBB",
    },
    categories: {
      title: "الأقسام والتصنيفات",
      desc: "إدارة أقسام المنيو وتعديل الأيقونات وحذف أو إضافة تصنيفات جديدة",
    },
    orders: {
      title: "إدارة الطلبات الحية",
      desc: "متابعة طلبات الزبائن لحظياً وتحديث حالات التوصيل أو حذف الطلبات من السجل",
    },
    banners: {
      title: "البنرات والعروض الترويجية",
      desc: "رفع بنرات العروض عبر ImgBB وربطها بالأقسام المباشرة في واجهة المتجر",
    },
    notifications: {
      title: "الإشعارات الفورية",
      desc: "بث إشعارات ترويجية وتنبيهات مباشرة لجميع زوار موقع كافي عامر",
    },
    settings: {
      title: "إعدادات ومعلومات الكافي",
      desc: "تعديل أوقات العمل، أرقام الهاتف، العناوين وروابط خرائط جوجل",
    },
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-[#f4f8f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#187a7d] animate-spin" />
          <span className="text-xs font-bold text-gray-500">جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[#f1f6f6] text-[#0f2b2d] flex flex-col lg:flex-row font-sans selection:bg-[#187a7d] selection:text-white"
      dir="rtl"
    >
      {/* Action Toast Notification */}
      {actionMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 bg-[#0b3335] text-[#f7d6b5] border-2 border-[#f7d6b5] px-6 py-3 rounded-full font-bold text-xs shadow-2xl z-50 animate-in slide-in-from-top flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f7d6b5]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* MOBILE DRAWER (Slide-over from right) */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-start">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <aside className="relative w-72 max-w-[85vw] bg-[#0b3335] text-white h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-right duration-250">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#187a7d] p-1 border border-[#f7d6b5]/30 overflow-hidden shadow-inner flex-shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="كافي عامر"
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <h2 className="font-black text-sm text-white">كافي عامر</h2>
                    <span className="text-[10px] text-[#7ea9ab]">لوحة الإدارة والتحكم</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Card */}
              <div className="mx-4 my-3 p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#187a7d] text-[#f7d6b5] font-black text-xs flex items-center justify-center">
                    ع
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">المدير العام</p>
                    <p className="text-[10px] text-gray-400">تحكم كامل بالنظام</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  نشط
                </span>
              </div>

              {/* Navigation List grouped */}
              <div className="p-3 space-y-4">
                {["الرئيسية", "المنيو والمحتوى", "المبيعات والعملاء", "النظام"].map((groupName) => {
                  const items = navTabs.filter((t) => t.group === groupName);
                  return (
                    <div key={groupName} className="space-y-1">
                      <p className="px-3 text-[10px] font-bold text-[#7ea9ab]">{groupName}</p>
                      {items.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id as any);
                              setIsMobileDrawerOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                              isActive
                                ? "bg-[#187a7d] text-white shadow-md shadow-[#187a7d]/30 font-black"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                              <span>{tab.label}</span>
                            </div>
                            {tab.alertCount && tab.alertCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black animate-pulse">
                                {tab.alertCount} جديد
                              </span>
                            ) : tab.count !== null ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/80">
                                {tab.count}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold p-3 rounded-2xl flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#f7d6b5]" />
                  <span>عرض المتجر</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold p-2.5 rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Pinned on right side in RTL) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#0b3335] text-white h-screen sticky top-0 border-l border-[#187a7d]/25 z-40 flex-shrink-0 shadow-2xl justify-between overflow-y-auto">
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#187a7d] p-1 border border-[#f7d6b5]/30 overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="كافي عامر"
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-base truncate">كافي عامر</h1>
                <span className="text-[10px] bg-[#f7d6b5] text-[#0b3335] px-2 py-0.5 rounded-full font-black">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-[#7ea9ab] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>طبرق • متصل</span>
              </p>
            </div>
          </div>

          {/* Admin Card */}
          <div className="mx-4 my-4 p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#187a7d] text-[#f7d6b5] font-black text-sm flex items-center justify-center shadow-xs">
                ع
              </div>
              <div>
                <p className="text-xs font-black text-white">المدير العام</p>
                <p className="text-[10px] text-gray-400">لوحة الإدارة والتحكم</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
              نشط
            </span>
          </div>

          {/* Navigation Groups */}
          <div className="px-3 space-y-4">
            {["الرئيسية", "المنيو والمحتوى", "المبيعات والعملاء", "النظام"].map((groupName) => {
              const items = navTabs.filter((t) => t.group === groupName);
              return (
                <div key={groupName} className="space-y-1">
                  <p className="px-3 text-[10px] font-bold text-[#7ea9ab] uppercase tracking-wider">{groupName}</p>
                  {items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? "bg-[#187a7d] text-white shadow-md shadow-[#187a7d]/30 font-black"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.alertCount && tab.alertCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black animate-pulse">
                            {tab.alertCount} جديد
                          </span>
                        ) : tab.count !== null ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/80"}`}>
                            {tab.count}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 mt-auto">
          <Link
            href="/"
            target="_blank"
            className="w-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold p-3 rounded-2xl flex items-center justify-between transition border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#f7d6b5]" />
              <span>عرض المتجر</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold p-2.5 rounded-2xl flex items-center justify-center gap-2 transition border border-white/5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#187a7d] ${loading ? "animate-spin" : ""}`} />
            <span>تحديث البيانات من السيرفر</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold p-2.5 rounded-2xl flex items-center justify-center gap-2 transition border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-gray-400 leading-tight">
              برمجة وتطوير شركة هوية للتسويق الرقمي
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex items-center justify-between bg-white px-8 py-4 border-b border-gray-200/80 sticky top-0 z-30 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-0.5">
              <span>لوحة التحكم</span>
              <ChevronLeft className="w-3 h-3" />
              <span className="text-[#187a7d]">{tabTitles[activeTab]?.title}</span>
            </div>
            <h1 className="text-xl font-black text-[#0f2b2d]">{tabTitles[activeTab]?.title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{tabTitles[activeTab]?.desc}</p>
          </div>

          <div className="flex items-center gap-3">
            {todayFormatted && (
              <div className="hidden xl:flex items-center gap-2 bg-[#f4f8f8] border border-gray-200/70 text-[#0b3335] px-3.5 py-2 rounded-2xl text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#187a7d]" />
                <span>{todayFormatted}</span>
              </div>
            )}

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2.5 bg-[#f4f8f8] hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 text-[#187a7d] ${loading ? "animate-spin" : ""}`} />
              <span className="hidden xl:inline">تحديث</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="bg-[#e4f2f2] hover:bg-[#d5eded] text-[#187a7d] text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition border border-[#187a7d]/20 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>زيارة المتجر</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            <div className="flex items-center gap-2.5 pe-1">
              <div className="w-9 h-9 rounded-2xl bg-[#0b3335] text-[#f7d6b5] font-black text-xs flex items-center justify-center shadow-xs">
                ع
              </div>
              <div className="text-start">
                <p className="text-xs font-black text-[#0f2b2d] leading-tight">المدير العام</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  متصل
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE TOPBAR */}
        <header className="lg:hidden bg-[#0b3335] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white cursor-pointer active:scale-95 transition"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-[#187a7d] p-0.5 border border-[#f7d6b5]/30 overflow-hidden shadow-inner flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="كافي عامر"
                width={36}
                height={36}
                unoptimized
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <div>
              <h1 className="font-black text-sm flex items-center gap-1.5">
                <span>كافي عامر</span>
                <span className="text-[9px] bg-[#f7d6b5] text-[#0b3335] px-1.5 py-0.2 rounded-full font-black">Admin</span>
              </h1>
              <p className="text-[10px] text-[#7ea9ab] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>طبرق • متصل</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              title="معاينة المتجر"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-bold transition"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MOBILE QUICK PILLS BAR (Sticky right under mobile topbar) */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-3 py-2 overflow-x-auto scrollbar-hide flex gap-1.5 sticky top-[57px] z-20 shadow-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-[#187a7d] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-[#187a7d] animate-spin" />
              <p className="text-sm font-bold text-gray-500">جاري تحميل بيانات كافي عامر من قاعدة البيانات...</p>
            </div>
          ) : (
            <>
              {/* 1. OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#187a7d]/15 flex items-center justify-between hover:shadow-md transition">
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي المبيعات</span>
                        <span className="text-2xl font-black text-[#187a7d]">{totalRevenue.toFixed(2)} د.ل</span>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-1">🇱🇾 بالدينار الليبي</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("orders")}
                      className="bg-white p-5 rounded-3xl shadow-sm border border-[#187a7d]/15 flex items-center justify-between hover:shadow-md hover:border-amber-400 transition cursor-pointer"
                    >
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">الطلبات النشطة</span>
                        <span className="text-2xl font-black text-amber-600">{activeOrdersCount}</span>
                        <span className="text-[10px] text-gray-400 block mt-1">من إجمالي {orders.length} طلب</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("foods")}
                      className="bg-white p-5 rounded-3xl shadow-sm border border-[#187a7d]/15 flex items-center justify-between hover:shadow-md hover:border-[#187a7d] transition cursor-pointer"
                    >
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">عدد الأصناف بالمنيو</span>
                        <span className="text-2xl font-black text-[#0b3335]">{foods.length}</span>
                        <span className="text-[10px] text-gray-400 block mt-1">موزعة على {categories.length} أقسام</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#e4f2f2] text-[#187a7d] flex items-center justify-center">
                        <Coffee className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("banners")}
                      className="bg-white p-5 rounded-3xl shadow-sm border border-[#187a7d]/15 flex items-center justify-between hover:border-purple-400 hover:shadow-md transition cursor-pointer group"
                    >
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">البنرات والعروض</span>
                        <span className="text-2xl font-black text-purple-600">{banners.length}</span>
                        <span className="text-[10px] text-purple-700 font-bold block mt-1 flex items-center gap-1">
                          <span>إدارة البنرات</span>
                          <span className="group-hover:translate-x-[-2px] transition">←</span>
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-[#0b3335] to-[#187a7d] text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#f7d6b5]">تحكم سريع في كافي عامر</h3>
                    <p className="text-xs text-white/80 mt-1">يمكنك إضافة أطباق جديدة، رفع صور عبر ImgBB، وتعديل الأسعار والأقسام والبنرات.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setEditingFood(null);
                        setFoodForm({
                          name: "",
                          category: "hot-drinks",
                          categoryName: "المشروبات الساخنة",
                          price: "",
                          calories: "250",
                          description: "",
                          image: "",
                          isPopular: false,
                          ingredients: "",
                        });
                        setShowFoodModal(true);
                      }}
                      className="bg-[#f7d6b5] text-[#0b3335] hover:bg-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة صنف جديد</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingBanner(null);
                        setBannerForm({ title: "", category_id: categories[0]?.id || "hot-drinks", image: "", is_active: true });
                        setShowBannerModal(true);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#f7d6b5]" />
                      <span>إضافة بنر إعلاني</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCat(null);
                        setCategoryForm({ id: "", name: "", icon: "☕" });
                        setShowCategoryModal(true);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>إضافة قسم جديد</span>
                    </button>

                    <button
                      onClick={() => {
                        setNotifForm({ title: "", message: "", type: "promo" });
                        setShowNotifModal(true);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                      <span>إرسال إشعار فوري</span>
                    </button>
                  </div>
                </div>

                {/* Active Banners Section in Overview */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#187a7d]" />
                      <h3 className="font-black text-sm text-[#0f2b2d]">البنرات الإعلانية في الواجهة ({banners.length})</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("banners")}
                      className="text-xs text-[#187a7d] font-bold hover:underline cursor-pointer"
                    >
                      فتح صفحة البنرات الكاملة ←
                    </button>
                  </div>

                  {banners.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-xs bg-[#f4f8f8] rounded-2xl">
                      لا توجد بنرات حالياً في قاعدة البيانات. اضغط على "إضافة بنر إعلاني" لإضافة بنر جديد.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {banners.map((b) => {
                        const linkedCat = categories.find((c) => c.id === b.category_id);
                        return (
                          <div key={b.id} className="p-3 bg-[#f4f8f8] rounded-2xl flex items-center gap-3 border border-gray-100 hover:border-[#187a7d]/30 transition">
                            {b.image ? (
                              <div className="w-24 h-14 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 border border-white">
                                <Image src={b.image} alt={b.title || "بنر"} fill unoptimized className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-24 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                                بدون صورة
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-[#0f2b2d] truncate">{b.title || "بنر إعلاني"}</h4>
                              <span className="text-[10px] text-[#187a7d] font-medium block mt-0.5">🔗 ينقل إلى: {linkedCat?.name || "كل الأقسام"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => handleOpenEditBanner(b)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="تعديل البنر"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(b.id)}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="حذف البنر"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Latest Orders Preview */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-sm text-[#0f2b2d]">أحدث الطلبات الواردة</h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs text-[#187a7d] font-bold hover:underline"
                    >
                      عرض جميع الطلبات ←
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 bg-[#f4f8f8] rounded-2xl border border-gray-100 flex items-center justify-between flex-wrap gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-[#0f2b2d]">{order.id}</span>
                            <span className="text-[10px] bg-[#e4f2f2] text-[#187a7d] px-2 py-0.5 rounded-full font-bold">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{order.address} • {order.date}</p>
                        </div>
                        <div className="text-end">
                          <span className="font-black text-sm text-[#187a7d]">{Number(order.total).toFixed(2)} د.ل</span>
                          <span className="text-[10px] text-gray-400 block">{order.items?.length || 0} عناصر</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. FOODS & PRICES TAB */}
            {activeTab === "foods" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#0f2b2d]">إدارة الأصناف والأسعار ({foods.length})</h2>
                    <p className="text-xs text-gray-500">تحكم بأسعار ومكونات وصور كافة الأطباق والمشروبات في كافي عامر</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingFood(null);
                      setFoodForm({
                        name: "",
                        category: categories[0]?.id || "hot-drinks",
                        categoryName: categories[0]?.name || "المشروبات الساخنة",
                        price: "",
                        calories: "250",
                        description: "",
                        image: "",
                        isPopular: false,
                        ingredients: "",
                      });
                      setShowFoodModal(true);
                    }}
                    className="bg-[#187a7d] hover:bg-[#136265] text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-[#187a7d]/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة صنف جديد</span>
                  </button>
                </div>

                {/* Search and Category Filter Toolbar */}
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={foodSearchQuery}
                        onChange={(e) => setFoodSearchQuery(e.target.value)}
                        placeholder="ابحث باسم الصنف (مثال: اسبريسو، فرابتشينو)..."
                        className="w-full ps-9 pe-9 py-2.5 bg-[#f4f8f8] rounded-2xl border border-gray-200 text-xs font-bold outline-none focus:border-[#187a7d] transition"
                      />
                      {foodSearchQuery && (
                        <button
                          onClick={() => setFoodSearchQuery("")}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-xs font-bold text-gray-500 self-end sm:self-center">
                      عرض <span className="text-[#187a7d] font-black">{filteredFoods.length}</span> من أصل <span className="text-[#0b3335] font-black">{foods.length}</span> صنف
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-gray-100">
                    <button
                      onClick={() => setFoodCategoryFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                        foodCategoryFilter === "all"
                          ? "bg-[#187a7d] text-white shadow-xs font-black"
                          : "bg-[#f4f8f8] text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      الكل ({foods.length})
                    </button>
                    {categories.map((cat) => {
                      const count = foods.filter((f) => f.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setFoodCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                            foodCategoryFilter === cat.id
                              ? "bg-[#187a7d] text-white shadow-xs font-black"
                              : "bg-[#f4f8f8] text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Foods Grid */}
                {filteredFoods.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 space-y-2">
                    <Search className="w-10 h-10 text-gray-300 mx-auto" />
                    <h3 className="font-black text-sm text-[#0f2b2d]">لم يتم العثور على أي صنف مطابق</h3>
                    <p className="text-xs text-gray-400">جرب كتابة اسم مختلف أو اضغط على قسم آخر.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFoods.map((food) => (
                      <div
                        key={food.id}
                        className="bg-white rounded-3xl p-4 shadow-sm border border-[#187a7d]/15 flex flex-col justify-between hover:shadow-md transition"
                      >
                        <div>
                          <div className="w-full h-40 rounded-2xl overflow-hidden relative bg-gray-100 mb-3 border border-gray-100">
                            <Image
                              src={food.image || "/images/logo.png"}
                              alt={food.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute top-2 end-2 bg-[#0b3335]/90 backdrop-blur-md text-[#f7d6b5] text-xs px-2.5 py-1 rounded-xl font-black shadow">
                              {Number(food.price).toFixed(2)} د.ل
                            </div>
                            {food.isPopular && (
                              <span className="absolute top-2 start-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
                                شائع 🔥
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] bg-[#e4f2f2] text-[#187a7d] px-2.5 py-0.5 rounded-full font-bold">
                              {food.categoryName}
                            </span>
                            <span className="text-[10px] text-gray-400">{food.calories} سعرة</span>
                          </div>

                          <h3 className="font-black text-sm text-[#0f2b2d] mb-1 line-clamp-1">{food.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{food.description}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setEditingFood(food);
                              setFoodForm({
                                name: food.name,
                                category: food.category,
                                categoryName: food.categoryName,
                                price: food.price.toString(),
                                calories: food.calories.toString(),
                                description: food.description,
                                image: food.image,
                                isPopular: Boolean(food.isPopular),
                                ingredients: food.ingredients ? food.ingredients.join(", ") : "",
                              });
                              setShowFoodModal(true);
                            }}
                            className="flex-1 bg-[#e4f2f2] hover:bg-[#d5eded] text-[#187a7d] py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل السعر والصورة</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. CATEGORIES TAB */}
            {activeTab === "categories" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#0f2b2d]">إدارة الأقسام والتصنيفات</h2>
                    <p className="text-xs text-gray-500">إضافة وتعديل أقسام المنيو ورفع أيقوناتها عبر ImgBB</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCat(null);
                      setCategoryForm({ id: "", name: "", icon: "☕" });
                      setShowCategoryModal(true);
                    }}
                    className="bg-[#187a7d] hover:bg-[#136265] text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-[#187a7d]/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة قسم جديد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-3xl p-5 shadow-sm border border-[#187a7d]/15 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-[#f4f8f8] rounded-2xl flex items-center justify-center border border-[#187a7d]/15 overflow-hidden p-2">
                          <CategoryIcon icon={cat.icon} name={cat.name} className="w-10 h-10" textClassName="text-3xl" />
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-[#0f2b2d]">{cat.name}</h3>
                          <span className="text-xs text-gray-400">{cat.itemCount} أطباق مرتبطة</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCat(cat);
                            setCategoryForm({ id: cat.id, name: cat.name, icon: cat.icon });
                            setShowCategoryModal(true);
                          }}
                          className="p-2 bg-[#e4f2f2] text-[#187a7d] rounded-xl hover:bg-[#d5eded] transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#0f2b2d]">إدارة الطلبات الحية ({orders.length})</h2>
                    <p className="text-xs text-gray-500">متابعة طلبات الزبائن وتغيير حالات التوصيل في طبرق أو حذفها</p>
                  </div>
                  {orders.length > 0 && (
                    <button
                      onClick={handleClearAllOrders}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 border border-red-200/60 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>مسح جميع الطلبات من السجل</span>
                    </button>
                  )}
                </div>

                {/* Status Filter Tabs */}
                {orders.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      { id: "all", label: "جميع الطلبات", count: orders.length },
                      {
                        id: "جاري التحضير",
                        label: "🟡 جاري التحضير",
                        count: orders.filter((o) => o.status === "جاري التحضير").length,
                      },
                      {
                        id: "في الطريق",
                        label: "🛵 في الطريق",
                        count: orders.filter((o) => o.status === "في الطريق").length,
                      },
                      {
                        id: "تم التوصيل",
                        label: "🟢 تم التوصيل",
                        count: orders.filter((o) => o.status === "تم التوصيل").length,
                      },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setOrderStatusFilter(st.id)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                          orderStatusFilter === st.id
                            ? "bg-[#187a7d] text-white shadow-xs font-black"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span>{st.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            orderStatusFilter === st.id ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-[#187a7d]/30 space-y-2">
                    <ShoppingBag className="w-10 h-10 text-[#187a7d]/40 mx-auto mb-1" />
                    <h3 className="font-black text-sm text-[#0f2b2d]">لا توجد أي طلبات حالياً في السجل</h3>
                    <p className="text-xs text-gray-400">سجل الطلبات فارغ تماماً وتم تنظيفه بنجاح.</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-2">
                    <p className="text-xs font-bold text-gray-500">لا توجد طلبات في قسم الحالة المحدد ({orderStatusFilter})</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl p-5 shadow-sm border border-[#187a7d]/15 space-y-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
                          <div>
                            <span className="font-black text-sm text-[#0f2b2d]">{order.id}</span>
                            <span className="text-xs text-gray-400 ms-2">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-[#e4f2f2] text-[#187a7d] text-xs font-black px-3 py-1.5 rounded-xl border border-[#187a7d]/20 outline-none cursor-pointer"
                            >
                              <option value="جاري التحضير">🟡 جاري التحضير</option>
                              <option value="في الطريق">🛵 في الطريق</option>
                              <option value="تم التوصيل">🟢 تم التوصيل</option>
                            </select>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {order.items?.map(({ item, quantity, notes }: any, i: number) => (
                            <div key={i} className="flex flex-col bg-[#f4f8f8] p-2.5 rounded-xl border border-gray-100/80">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#0f2b2d]">{quantity}× {item?.name}</span>
                                <span className="text-[10px] text-gray-400">{(Number(item?.price) * quantity).toFixed(2)} د.ل</span>
                              </div>
                              {notes && (
                                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 mt-1.5 font-medium">
                                  📝 {notes}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 text-xs border-t border-gray-50">
                          <span className="text-gray-500">📍 العنوان: <strong className="text-[#0f2b2d]">{order.address}</strong></span>
                          <span className="font-black text-base text-[#187a7d]">الإجمالي: {Number(order.total).toFixed(2)} د.ل</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. BANNERS TAB */}
            {activeTab === "banners" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-black text-[#0f2b2d]">إدارة البنرات الإعلانية</h2>
                    <p className="text-xs text-gray-500">ارفع صور البنرات عبر ImgBB واربط كل بنر بالقسم الذي يفتح عند النقر عليه</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBanner(null);
                      setBannerForm({ title: "", category_id: categories[0]?.id || "hot-drinks", image: "", is_active: true });
                      setShowBannerModal(true);
                    }}
                    className="bg-[#187a7d] hover:bg-[#136265] text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-[#187a7d]/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة بنر جديد</span>
                  </button>
                </div>

                {banners.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-[#187a7d]/30 space-y-3">
                    <ImageIcon className="w-12 h-12 text-[#187a7d]/50 mx-auto" />
                    <h3 className="font-black text-sm text-[#0f2b2d]">لا توجد بنرات إعلانية حالياً</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      ارفع صورة البنر المصممة عبر ImgBB واختر القسم المرتبط بها ليتم توجيه الزبون إليه مباشرة عند الضغط.
                    </p>
                    <button
                      onClick={() => {
                        setEditingBanner(null);
                        setBannerForm({ title: "", category_id: categories[0]?.id || "hot-drinks", image: "", is_active: true });
                        setShowBannerModal(true);
                      }}
                      className="bg-[#187a7d] hover:bg-[#136265] text-white text-xs font-black px-4 py-2.5 rounded-2xl inline-flex items-center gap-1.5 shadow-md shadow-[#187a7d]/20 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة أول بنر إعلاني</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map((banner) => {
                      const linkedCat = categories.find((c) => c.id === banner.category_id);
                      return (
                        <div
                          key={banner.id}
                          className="bg-white rounded-3xl p-4 shadow-sm border border-[#187a7d]/15 flex flex-col justify-between hover:shadow-md transition gap-3"
                        >
                          {banner.image ? (
                            <div className="w-full aspect-[2.3/1] relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                              <Image
                                src={banner.image}
                                alt={banner.title || "بنر"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-[2.3/1] bg-[#f4f8f8] rounded-2xl flex items-center justify-center text-gray-400 text-xs font-bold">
                              لا توجد صورة
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                            <div>
                              <h4 className="font-black text-xs text-[#0f2b2d]">{banner.title || "بنر إعلاني"}</h4>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[11px] bg-[#e4f2f2] text-[#187a7d] px-2.5 py-0.5 rounded-xl font-bold flex items-center gap-1">
                                  <span>🔗 ينقل إلى:</span>
                                  <strong>{linkedCat ? `${linkedCat.name}` : "كل الأقسام"}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditBanner(banner)}
                                className="px-3 py-2 bg-[#e4f2f2] hover:bg-[#d0e8e8] text-[#187a7d] rounded-xl transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                                title="تعديل البنر"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                                title="حذف البنر"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 6. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#0f2b2d]">إدارة وإرسال الإشعارات</h2>
                    <p className="text-xs text-gray-500">إرسال إشعارات فورية تظهر لجميع الزوار في جرس الإشعارات</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifForm({ title: "", message: "", type: "promo" });
                      setShowNotifModal(true);
                    }}
                    className="bg-[#187a7d] hover:bg-[#136265] text-white text-xs font-black px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md shadow-[#187a7d]/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إرسال إشعار جديد</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="bg-white rounded-3xl p-4 shadow-sm border border-[#187a7d]/15 flex items-center justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#e4f2f2] text-[#187a7d] flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs text-[#0f2b2d]">{notif.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#187a7d]/15 max-w-2xl">
                <h2 className="text-lg font-black text-[#0f2b2d] mb-1">إعدادات كافي عامر</h2>
                <p className="text-xs text-gray-500 mb-6">تعديل بيانات التواصل والعناوين والروابط الظاهرة في صفحة معلومات الكافي</p>

                <form onSubmit={handleSaveCafeInfo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم الكافي (بالعربي)</label>
                      <input
                        type="text"
                        value={cafeInfo.name || ""}
                        onChange={(e) => setCafeInfo({ ...cafeInfo, name: e.target.value })}
                        className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف للاتصال المباشر</label>
                      <input
                        type="text"
                        value={cafeInfo.phone || ""}
                        onChange={(e) => setCafeInfo({ ...cafeInfo, phone: e.target.value })}
                        className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الفرع</label>
                    <input
                      type="text"
                      value={cafeInfo.address || ""}
                      onChange={(e) => setCafeInfo({ ...cafeInfo, address: e.target.value })}
                      className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">يوزر التيك توك</label>
                      <input
                        type="text"
                        value={cafeInfo.tiktok_handle || ""}
                        onChange={(e) => setCafeInfo({ ...cafeInfo, tiktok_handle: e.target.value })}
                        className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">يوزر إنستغرام</label>
                      <input
                        type="text"
                        value={cafeInfo.instagram_handle || ""}
                        onChange={(e) => setCafeInfo({ ...cafeInfo, instagram_handle: e.target.value })}
                        className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رابط صفحة الفيسبوك</label>
                    <input
                      type="text"
                      value={cafeInfo.facebook_url || ""}
                      onChange={(e) => setCafeInfo({ ...cafeInfo, facebook_url: e.target.value })}
                      className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#187a7d]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#187a7d] hover:bg-[#136265] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-[#187a7d]/20 transition active:scale-[0.98] mt-4"
                  >
                    حفظ التغييرات في قاعدة البيانات
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
      </div>

      {/* --- FOOD EDIT/ADD MODAL WITH IMGBB UPLOAD --- */}
      {showFoodModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-sm text-[#0f2b2d]">
                {editingFood ? "تعديل الصنف والسعر" : "إضافة صنف جديد"}
              </h3>
              <button onClick={() => setShowFoodModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3.5 text-xs">
              {/* Product Image Uploader via ImgBB */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  صورة الصنف (عبر ImgBB أو الرابط)
                </label>
                
                {/* Live Preview & Upload Area */}
                <div className="border-2 border-dashed border-[#187a7d]/30 rounded-2xl p-4 bg-[#f4f8f8] text-center space-y-3">
                  {foodForm.image ? (
                    <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-[#187a7d]/30 group">
                      <Image
                        src={foodForm.image}
                        alt="معاينة الصورة"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFoodForm({ ...foodForm, image: "" })}
                        className="absolute top-1 end-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                        title="إزالة الصورة"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-white/70 border border-gray-200 p-1 relative mb-1.5 shadow-xs">
                        <Image
                          src="/images/logo.png"
                          alt="شعار كافي عامر التلقائي"
                          fill
                          unoptimized
                          className="object-contain p-1"
                        />
                      </div>
                      <p className="text-[11px] text-[#187a7d] font-bold">سيتم اعتماد شعار كافي عامر كصورة للمنتج تلقائياً</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">أو اضغط بالأسفل لرفع صورة خاصة بالصنف</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="file"
                      ref={foodFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, "food");
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingFoodImg}
                      onClick={() => foodFileInputRef.current?.click()}
                      className="bg-[#187a7d] hover:bg-[#136265] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm disabled:opacity-50"
                    >
                      {uploadingFoodImg ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري الرفع إلى ImgBB...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-[#f7d6b5]" />
                          <span>رفع صورة من الجهاز 📸</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct URL Input fallback */}
                <input
                  type="url"
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  placeholder="أو الصق رابط الصورة المباشر هنا (URL)..."
                  className="w-full mt-2 p-2.5 bg-[#f4f8f8] border border-gray-200 rounded-xl font-medium text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">اسم الصنف</label>
                <input
                  type="text"
                  required
                  value={foodForm.name}
                  onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                  placeholder="مثال: كراميل ماكياتو مثلج"
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">القسم</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">السعر (بالدينار الليبي د.ل)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    placeholder="8.50"
                    className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold text-end"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">السعرات الحرارية</label>
                  <input
                    type="number"
                    value={foodForm.calories}
                    onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
                    placeholder="250"
                    className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={foodForm.isPopular}
                    onChange={(e) => setFoodForm({ ...foodForm, isPopular: e.target.checked })}
                    className="w-4 h-4 text-[#187a7d] rounded"
                  />
                  <label htmlFor="isPopular" className="font-bold text-gray-700">تمييز كـ صنف شائع 🔥</label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">المكونات (افصل بينها بفاصلة ,)</label>
                <input
                  type="text"
                  value={foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                  placeholder="إسبريسو، حليب، كراميل، ثلج"
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  placeholder="وصف تفصيلي للطبق أو المشروب..."
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#187a7d] hover:bg-[#136265] text-white py-3 rounded-2xl font-black shadow-lg shadow-[#187a7d]/20 transition"
              >
                {editingFood ? "حفظ التعديلات" : "إضافة الصنف للمنيو"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CATEGORY MODAL WITH IMGBB UPLOAD --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-sm text-[#0f2b2d]">
                {editingCat ? "تعديل القسم والأيقونة" : "إضافة قسم جديد"}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">اسم القسم</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="مثال: عصائر طبيعية"
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>

              {/* Category Icon / Image via ImgBB */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  أيقونة القسم (إيموجي أو صورة عبر ImgBB)
                </label>

                <div className="border-2 border-dashed border-[#187a7d]/30 rounded-2xl p-3.5 bg-[#f4f8f8] text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#187a7d]/20 overflow-hidden p-1.5 text-[#187a7d]">
                    <CategoryIcon icon={categoryForm.icon} name={categoryForm.name} className="w-8 h-8" />
                  </div>

                  <div className="flex items-center justify-center">
                    <input
                      type="file"
                      ref={catFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, "category");
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingCatIcon}
                      onClick={() => catFileInputRef.current?.click()}
                      className="bg-[#187a7d] hover:bg-[#136265] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm disabled:opacity-50"
                    >
                      {uploadingCatIcon ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري الرفع...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-[#f7d6b5]" />
                          <span>رفع أيقونة SVG / صورة 📸</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* SVG Presets */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1.5">اختر أيقونة فيكتور (SVG):</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { label: "قهوة", id: "coffee" },
                      { label: "حلويات", id: "dessert" },
                      { label: "مخبوزات", id: "pastry" },
                      { label: "برجر", id: "burger" },
                      { label: "ساندوتش", id: "sandwich" },
                      { label: "بيتزا", id: "pizza" },
                      { label: "سلطة", id: "salad" },
                      { label: "مشروبات", id: "drink" },
                      { label: "آيس كريم", id: "ice" },
                      { label: "مفضل", id: "sparkle" },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setCategoryForm({ ...categoryForm, icon: preset.id })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                          categoryForm.icon === preset.id
                            ? "bg-[#187a7d] text-white border-[#187a7d]"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <CategoryIcon icon={preset.id} name={preset.label} className="w-4 h-4" />
                        <span className="text-[9px] font-bold">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#187a7d] text-white py-3 rounded-2xl font-black shadow-md transition"
              >
                حفظ القسم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- BANNER MODAL WITH IMGBB UPLOAD & EDITING --- */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-sm text-[#0f2b2d]">
                {editingBanner ? "تعديل البنر الإعلاني" : "إضافة بنر إعلاني جديد"}
              </h3>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3.5 text-xs">
              {/* Banner Image Uploader */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  صورة البنر الإعلاني (عبر ImgBB أو رابط مباشر)
                </label>
                
                <div className="border-2 border-dashed border-[#187a7d]/30 rounded-2xl p-3.5 bg-[#f4f8f8] text-center space-y-2">
                  {bannerForm.image ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm border border-[#187a7d]/30">
                      <Image
                        src={bannerForm.image}
                        alt="معاينة البنر"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, image: "" })}
                        className="absolute top-1.5 end-1.5 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition cursor-pointer"
                        title="إزالة الصورة"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">اختر صورة لتظهر كخلفية أو ملصق للبنر</p>
                  )}

                  <div className="flex flex-col gap-2 items-center justify-center">
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file, "banner");
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingBannerImg}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="bg-[#187a7d] hover:bg-[#136265] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingBannerImg ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري الرفع إلى ImgBB...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-[#f7d6b5]" />
                          <span>رفع صورة البنر عبر ImgBB 🎨</span>
                        </>
                      )}
                    </button>

                    {/* Direct Image URL input */}
                    <input
                      type="text"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      placeholder="أو الصق رابط صورة البنر هنا مباشرة (https://...)"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-medium text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Category Link Selector */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  القسم المرتبط (يفتح تلقائياً عند النقر على البنر) 🔗
                </label>
                <select
                  value={bannerForm.category_id}
                  onChange={(e) => setBannerForm({ ...bannerForm, category_id: e.target.value })}
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold text-gray-800"
                >
                  <option value="all">✨ كل الأقسام (صفحة البحث والتصفية)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Banner Name */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">اسم البنر (مرجع داخلي للمدير)</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="مثال: بنر القهوة المختصة أو بنر الحلويات"
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold text-gray-800"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banner-active-check"
                  checked={bannerForm.is_active}
                  onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#187a7d] focus:ring-[#187a7d]"
                />
                <label htmlFor="banner-active-check" className="font-bold text-gray-700 cursor-pointer text-xs">
                  تفعيل ظهور البنر في الصفحة الرئيسية
                </label>
              </div>

              <button
                type="submit"
                disabled={!bannerForm.image}
                className="w-full bg-[#187a7d] hover:bg-[#136265] text-white py-3 rounded-2xl font-black shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {editingBanner ? "حفظ التعديلات ✅" : "نشر البنر 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION MODAL --- */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-sm text-[#0f2b2d]">إرسال إشعار للزبائن</h3>
              <button onClick={() => setShowNotifModal(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">عنوان الإشعار</label>
                <input
                  type="text"
                  required
                  value={notifForm.title}
                  onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                  placeholder="مثال: وصول كيكة العسل الطازجة! 🍰"
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">نص الرسالة</label>
                <textarea
                  rows={3}
                  required
                  value={notifForm.message}
                  onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                  placeholder="تفاصيل العرض أو التنبيه..."
                  className="w-full p-3 bg-[#f4f8f8] border border-gray-200 rounded-2xl font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#187a7d] text-white py-3 rounded-2xl font-black shadow-md transition"
              >
                إرسال الإشعار فوراً 🔔
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
