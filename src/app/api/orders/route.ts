import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Order } from "@/data/foods";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM orders ORDER BY created_at DESC");
    const orders: Order[] = rows.map((r: any) => ({
      id: r.id,
      items: typeof r.items === "string" ? JSON.parse(r.items) : r.items,
      total: Number(r.total),
      date: r.date_text,
      status: r.status,
      address: r.address,
      customerName: r.customer_name,
      phone: r.phone,
      notes: r.notes,
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Failed to fetch orders from PostgreSQL:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, items, total, date, status, address, customerName, phone, notes } = body;

    const orderId = id || `AMER-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateText = date || "الآن";
    const orderStatus = status || "جاري التحضير";
    const orderAddress = address || "طبرق";

    await query(
      `INSERT INTO orders (id, items, total, date_text, status, address, customer_name, phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        orderId,
        JSON.stringify(items),
        total,
        dateText,
        orderStatus,
        orderAddress,
        customerName || "",
        phone || "",
        notes || "",
      ]
    );

    const createdOrder: Order = {
      id: orderId,
      items,
      total: Number(total),
      date: dateText,
      status: orderStatus,
      address: orderAddress,
    };

    return NextResponse.json({ success: true, data: createdOrder });
  } catch (error) {
    console.error("Failed to save order to PostgreSQL:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

// PUT: Update order status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    await query("UPDATE orders SET status = $2 WHERE id = $1", [id, status]);
    return NextResponse.json({ success: true, message: "تم تحديث حالة الطلب بنجاح" });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث الطلب" }, { status: 500 });
  }
}

// DELETE: Delete order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    await query("DELETE FROM orders WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json({ success: false, error: "فشل حذف الطلب" }, { status: 500 });
  }
}
