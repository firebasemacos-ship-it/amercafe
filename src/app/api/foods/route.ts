import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { FOOD_ITEMS, FoodItem } from "@/data/foods";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM foods WHERE 1=1";
    const params: any[] = [];

    if (category && category !== "all") {
      params.push(category);
      sql += ` AND category_id = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(category_name) LIKE $${params.length})`;
    }

    sql += " ORDER BY is_popular DESC, created_at ASC";

    const rows = await query(sql, params);

    const foods: FoodItem[] = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category_id,
      categoryName: r.category_name,
      price: Number(r.price),
      rating: Number(r.rating),
      reviewsCount: Number(r.reviews_count),
      deliveryTime: r.delivery_time,
      calories: Number(r.calories),
      description: r.description,
      image: r.image,
      isPopular: Boolean(r.is_popular),
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients
        : typeof r.ingredients === "string"
        ? JSON.parse(r.ingredients)
        : [],
    }));

    return NextResponse.json({ success: true, data: foods });
  } catch (error: any) {
    console.error("Failed to fetch foods from PostgreSQL, using fallback:", error);
    return NextResponse.json({ success: true, data: FOOD_ITEMS, fallback: true });
  }
}

// POST: Add new food item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      categoryName,
      price,
      rating = 4.9,
      reviewsCount = 100,
      deliveryTime = "15-20 دقيقة",
      calories = 300,
      description = "",
      image,
      isPopular = false,
      ingredients = [],
    } = body;

    const id = `${category || "food"}-${Date.now().toString().slice(-4)}`;

    await query(
      `INSERT INTO foods (
        id, name, category_id, category_name, price, rating,
        reviews_count, delivery_time, calories, description, image,
        is_popular, ingredients
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        name,
        category,
        categoryName || "عام",
        Number(price),
        Number(rating),
        Number(reviewsCount),
        deliveryTime,
        Number(calories),
        description,
        image && String(image).trim() !== "" ? String(image).trim() : "/images/logo.png",
        Boolean(isPopular),
        JSON.stringify(ingredients),
      ]
    );

    // Update category item_count
    await query(
      `UPDATE categories SET item_count = (SELECT COUNT(*) FROM foods WHERE category_id = $1) WHERE id = $1`,
      [category]
    );

    return NextResponse.json({ success: true, message: "تمت إضافة الصنف بنجاح", data: { id, ...body } });
  } catch (error: any) {
    console.error("Failed to insert food:", error);
    return NextResponse.json({ success: false, error: "فشل حفظ الصنف في قاعدة البيانات" }, { status: 500 });
  }
}

// PUT: Update existing food item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      category,
      categoryName,
      price,
      calories,
      description,
      image,
      isPopular,
      ingredients,
    } = body;

    await query(
      `UPDATE foods SET
        name = COALESCE($2, name),
        category_id = COALESCE($3, category_id),
        category_name = COALESCE($4, category_name),
        price = COALESCE($5, price),
        calories = COALESCE($6, calories),
        description = COALESCE($7, description),
        image = COALESCE($8, image),
        is_popular = COALESCE($9, is_popular),
        ingredients = COALESCE($10, ingredients)
      WHERE id = $1`,
      [
        id,
        name,
        category,
        categoryName,
        price !== undefined ? Number(price) : null,
        calories !== undefined ? Number(calories) : null,
        description,
        image !== undefined ? (image && String(image).trim() !== "" ? String(image).trim() : "/images/logo.png") : null,
        isPopular !== undefined ? Boolean(isPopular) : null,
        ingredients ? JSON.stringify(ingredients) : null,
      ]
    );

    return NextResponse.json({ success: true, message: "تم تحديث الصنف بنجاح" });
  } catch (error: any) {
    console.error("Failed to update food:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث الصنف" }, { status: 500 });
  }
}

// DELETE: Delete a food item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الصنف مطلوب" }, { status: 400 });
    }

    const rows = await query("DELETE FROM foods WHERE id = $1 RETURNING category_id", [id]);
    
    if (rows.length > 0) {
      await query(
        `UPDATE categories SET item_count = (SELECT COUNT(*) FROM foods WHERE category_id = $1) WHERE id = $1`,
        [rows[0].category_id]
      );
    }

    return NextResponse.json({ success: true, message: "تم حذف الصنف بنجاح" });
  } catch (error: any) {
    console.error("Failed to delete food:", error);
    return NextResponse.json({ success: false, error: "فشل حذف الصنف" }, { status: 500 });
  }
}
