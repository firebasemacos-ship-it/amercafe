import { NextResponse } from "next/server";
import https from "https";
import querystring from "querystring";

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "ecfd2830eec1e538465f3d1083a79b61";

function uploadToImgbb(base64Image: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      image: base64Image,
    });

    const options = {
      hostname: "api.imgbb.com",
      port: 443,
      path: `/1/upload?key=${IMGBB_API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
      rejectUnauthorized: false, // Bypass local SSL issuer issues in dev
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error("Invalid response from ImgBB: " + data));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار أي ملف صورة" },
        { status: 400 }
      );
    }

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const data = await uploadToImgbb(base64Image);

    if (data.success && data.data?.url) {
      return NextResponse.json({
        success: true,
        url: data.data.display_url || data.data.url,
        thumb: data.data.thumb?.url || data.data.url,
        delete_url: data.data.delete_url,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data.error?.message || "فشل رفع الصورة إلى ImgBB",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("ImgBB upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ أثناء معالجة رفع الصورة" },
      { status: 500 }
    );
  }
}
