import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === "admin" && password === "0920064400") {
      const response = NextResponse.json({
        success: true,
        message: "تم تسجيل الدخول بنجاح كمدير كافي عامر",
      });

      // Set cookie for authentication session
      response.cookies.set("amer_admin_token", "authenticated-amer-2012", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "خطأ في معالجة الطلب" },
      { status: 500 }
    );
  }
}
