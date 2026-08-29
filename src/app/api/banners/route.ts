import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM banners WHERE is_active = true ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, image, category_id = "coffee", is_active = true } = body;

    if (!image) {
      return NextResponse.json({ success: false, error: "صورة البنر مطلوبة" }, { status: 400 });
    }

    const rows = await query(
      `INSERT INTO banners (title, image, category_id, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title || "بنر إعلاني", image, category_id, Boolean(is_active)]
    );

    return NextResponse.json({ success: true, message: "تمت إضافة البنر بنجاح", data: rows[0] });
  } catch (error: any) {
    console.error("Failed to add banner:", error);
    return NextResponse.json({ success: false, error: error.message || "فشل حفظ البنر" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, image, category_id, is_active } = body;

    const numericId = parseInt(id, 10);
    await query(
      `UPDATE banners SET
        title = COALESCE($2, title),
        image = COALESCE($3, image),
        category_id = COALESCE($4, category_id),
        is_active = COALESCE($5, is_active)
       WHERE id = $1`,
      [numericId, title, image, category_id, is_active]
    );

    return NextResponse.json({ success: true, message: "تم تحديث البنر بنجاح" });
  } catch (error: any) {
    console.error("Failed to update banner:", error);
    return NextResponse.json({ success: false, error: error.message || "فشل تحديث البنر" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    let id: any = null;

    // 1. Try URL search params
    try {
      const { searchParams } = new URL(request.url);
      id = searchParams.get("id");
    } catch {}

    // 2. Try JSON body
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف البنر مطلوب" }, { status: 400 });
    }

    const numericId = parseInt(id.toString(), 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: "معرف البنر غير صالح" }, { status: 400 });
    }

    await query("DELETE FROM banners WHERE id = $1", [numericId]);
    return NextResponse.json({ success: true, message: "تم حذف البنر بنجاح" });
  } catch (error: any) {
    console.error("Failed to delete banner:", error);
    return NextResponse.json({ success: false, error: error.message || "فشل حذف البنر" }, { status: 500 });
  }
}
