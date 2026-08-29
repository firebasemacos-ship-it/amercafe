import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM notifications ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, type = "promo" } = body;

    const rows = await query(
      `INSERT INTO notifications (title, message, type, is_unread)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [title, message, type]
    );

    return NextResponse.json({ success: true, message: "تم إرسال الإشعار بنجاح", data: rows[0] });
  } catch (error) {
    console.error("Failed to send notification:", error);
    return NextResponse.json({ success: false, error: "فشل إرسال الإشعار" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الإشعار مطلوب" }, { status: 400 });
    }

    await query("DELETE FROM notifications WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: "تم حذف الإشعار بنجاح" });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return NextResponse.json({ success: false, error: "فشل حذف الإشعار" }, { status: 500 });
  }
}
