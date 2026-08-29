import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM cafe_info WHERE id = 'main' LIMIT 1");
    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          name: "كافي عامر",
          english_name: "Amer Cafe",
          phone: "0924478000",
          whatsapp: "218924478000",
          address: "طبرق ، مفترق رابعة",
          google_maps_url: "https://maps.app.goo.gl/cjMCijpL2f2PR1xZ8",
          tiktok_handle: "@kaf_e1",
          tiktok_url: "https://www.tiktok.com/@kaf_e1",
          facebook_handle: "كافي عامر - Amer Cafe",
          facebook_url: "https://www.facebook.com/share/14vTdfJRa9R/",
          instagram_handle: "@amerc.afe",
          instagram_url: "https://www.instagram.com/amerc.afe",
          working_hours: "من 7:00 صباحاً حتى 12:00 منتصف الليل",
          since_year: 2012,
        },
      });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Failed to fetch cafe info from PostgreSQL:", error);
    return NextResponse.json({
      success: true,
      data: {
        name: "كافي عامر",
        english_name: "Amer Cafe",
        phone: "0924478000",
        whatsapp: "218924478000",
        address: "طبرق ، مفترق رابعة",
        google_maps_url: "https://maps.app.goo.gl/cjMCijpL2f2PR1xZ8",
        tiktok_handle: "@kaf_e1",
        tiktok_url: "https://www.tiktok.com/@kaf_e1",
        facebook_handle: "كافي عامر - Amer Cafe",
        facebook_url: "https://www.facebook.com/share/14vTdfJRa9R/",
        instagram_handle: "@amerc.afe",
        instagram_url: "https://www.instagram.com/amerc.afe",
        working_hours: "من 7:00 صباحاً حتى 12:00 منتصف الليل",
        since_year: 2012,
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      whatsapp,
      address,
      google_maps_url,
      tiktok_handle,
      tiktok_url,
      facebook_handle,
      facebook_url,
      instagram_handle,
      instagram_url,
      working_hours,
    } = body;

    await query(
      `UPDATE cafe_info SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        whatsapp = COALESCE($3, whatsapp),
        address = COALESCE($4, address),
        google_maps_url = COALESCE($5, google_maps_url),
        tiktok_handle = COALESCE($6, tiktok_handle),
        tiktok_url = COALESCE($7, tiktok_url),
        facebook_handle = COALESCE($8, facebook_handle),
        facebook_url = COALESCE($9, facebook_url),
        instagram_handle = COALESCE($10, instagram_handle),
        instagram_url = COALESCE($11, instagram_url),
        working_hours = COALESCE($12, working_hours)
       WHERE id = 'main'`,
      [
        name,
        phone,
        whatsapp,
        address,
        google_maps_url,
        tiktok_handle,
        tiktok_url,
        facebook_handle,
        facebook_url,
        instagram_handle,
        instagram_url,
        working_hours,
      ]
    );

    return NextResponse.json({ success: true, message: "تم تحديث معلومات الكافي بنجاح" });
  } catch (error) {
    console.error("Failed to update cafe info:", error);
    return NextResponse.json({ success: false, error: "فشل حفظ معلومات الكافي" }, { status: 500 });
  }
}
