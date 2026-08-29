import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CATEGORIES, Category } from "@/data/foods";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC");
    const categories: Category[] = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      itemCount: Number(r.item_count),
    }));

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Failed to fetch categories from PostgreSQL, using fallback:", error);
    return NextResponse.json({ success: true, data: CATEGORIES, fallback: true });
  }
}

// POST: Add new Category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, icon } = body;

    const catId = id || `cat-${Date.now().toString().slice(-4)}`;

    await query(
      `INSERT INTO categories (id, name, icon, item_count, sort_order)
       VALUES ($1, $2, $3, 0, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories))
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon`,
      [catId, name, icon || "☕"]
    );

    return NextResponse.json({ success: true, message: "تمت إضافة القسم بنجاح", data: { id: catId, name, icon } });
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ success: false, error: "فشل حفظ القسم" }, { status: 500 });
  }
}

// PUT: Update Category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, icon } = body;

    await query(
      `UPDATE categories SET name = COALESCE($2, name), icon = COALESCE($3, icon) WHERE id = $1`,
      [id, name, icon]
    );

    // Also update category_name in foods
    if (name) {
      await query(`UPDATE foods SET category_name = $1 WHERE category_id = $2`, [name, id]);
    }

    return NextResponse.json({ success: true, message: "تم تحديث القسم بنجاح" });
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث القسم" }, { status: 500 });
  }
}

// DELETE: Delete Category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف القسم مطلوب" }, { status: 400 });
    }

    await query("DELETE FROM categories WHERE id = $1", [id]);

    return NextResponse.json({ success: true, message: "تم حذف القسم بنجاح" });
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ success: false, error: "فشل حذف القسم" }, { status: 500 });
  }
}
