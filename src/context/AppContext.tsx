"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FoodItem, FOOD_ITEMS, Order, INITIAL_ORDERS } from "@/data/foods";

export interface CartItem {
  item: FoodItem;
  quantity: number;
  notes?: string;
}

interface AppContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  discount: number;
  appliedCoupon: string | null;
  finalTotal: number;
  addToCart: (item: FoodItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  orders: Order[];
  placeOrder: (orderDetails?: {
    customerName?: string;
    phone?: string;
    address?: string;
    notes?: string;
  } | string) => Promise<Order | null>;

  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedFoodModal: FoodItem | null;
  setSelectedFoodModal: (food: FoodItem | null) => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>(["coffee-1", "dessert-1"]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFoodModal, setSelectedFoodModal] = useState<FoodItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load initial orders from customer's local cache
  useEffect(() => {
    async function loadData() {
      try {
        const savedCart = localStorage.getItem("amer_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedFavs = localStorage.getItem("amer_favs");
        if (savedFavs) setFavorites(JSON.parse(savedFavs));

        const savedOrders = localStorage.getItem("amer_orders");
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed)) {
            // Filter out any legacy dummy IDs
            const realOnly = parsed.filter(
              (o: Order) => o.id !== "AMER-9482" && o.id !== "AMER-7391"
            );
            setOrders(realOnly);
          }
        }
      } catch {
        // use initial empty state
      }
    }
    loadData();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("amer_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("amer_favs", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("amer_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const addToCart = (item: FoodItem, quantity = 1, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id && c.notes === notes);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id && c.notes === notes ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { item, quantity, notes }];
    });
    showToast(`تمت إضافة "${item.name}" إلى السلة 🛒`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
    showToast("تم حذف العنصر من السلة");
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "FIRST40") {
      setAppliedCoupon("FIRST40");
      setDiscountPercent(0.40); // 40%
      showToast("تم تفعيل خصم 40% بنجاح! 🎉");
      return { success: true, message: "تم تطبيق كود الخصم (40%-) بنجاح!" };
    }
    return { success: false, message: "كود الخصم غير صالح أو منتهي الصلاحية" };
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const updated = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      showToast(exists ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة ❤️");
      return updated;
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const cartCount = cart.reduce((total, c) => total + c.quantity, 0);
  const cartTotal = cart.reduce((total, c) => total + c.item.price * c.quantity, 0);
  const discount = cartTotal * discountPercent;
  const deliveryFee = 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const placeOrder = async (
    orderDetails?:
      | {
          customerName?: string;
          phone?: string;
          address?: string;
          notes?: string;
        }
      | string
  ) => {
    if (cart.length === 0) return null;

    let name = "عميل كافي عامر";
    let phone = "";
    let addr = "طبرق ، مفترق رابعة";
    let notes = "";

    if (typeof orderDetails === "string") {
      addr = orderDetails;
    } else if (orderDetails) {
      name = orderDetails.customerName?.trim() || "عميل كافي عامر";
      phone = orderDetails.phone?.trim() || "";
      addr = orderDetails.address?.trim() || "طبرق";
      notes = orderDetails.notes?.trim() || "";
    }

    const displayAddress = `${name}${phone ? ` (${phone})` : ""} - ${addr}${
      notes ? ` • ملاحظات: ${notes}` : ""
    }`;

    const newOrder: Order = {
      id: `AMER-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total: Number(finalTotal.toFixed(2)),
      date: "الآن",
      status: "جاري التحضير",
      address: displayAddress,
    };

    // Save to local state
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist directly to PostgreSQL database
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newOrder,
          customerName: name,
          phone,
          notes,
        }),
      });
    } catch (err) {
      console.error("Failed to save order to PostgreSQL:", err);
    }

    showToast("تم استلام طلبك في كافي عامر بنجاح وبدأ التحضير!");
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        discount,
        appliedCoupon,
        finalTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        favorites,
        toggleFavorite,
        isFavorite,
        orders,
        placeOrder,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedFoodModal,
        setSelectedFoodModal,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
