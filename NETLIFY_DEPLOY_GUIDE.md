# 🚀 دليل رفع مشروع كافي عامر على Netlify

## 1. المتغيرات البيئية المطلوبة في Netlify (Environment Variables)

عند رفع المشروع على Netlify، توجه إلى:
**Site configuration** > **Environment variables** > **Add a variable** ثم أضف القيم التالية:

| اسم المتغير (Key) | القيمة (Value) |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres` |
| `IMGBB_API_KEY` | `ecfd2830eec1e538465f3d1083a79b61` |
| `NODE_ENV` | `production` |

---

## 2. إعدادات البناء في Netlify (Build Settings)

- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Node Version**: `20` أو أحدث

---

## 3. مميزات النظام المضمنة:
- قاعدة بيانات Supabase PostgreSQL متصلة ومجهزة بالجداول.
- لوحة تحكم الإدارة: `/admin` (كلمة المرور الافتراضية: `amer2024` أو `123456`).
- رفع الصور الفوري عبر ImgBB API.
- تحويل الطلبات تلقائياً إلى واتساب كافي عامر: `0924478000`.
- تصميم زجاجي عصري (Liquid Glassmorphism) مع شريط تنقل عائم وأيقونات فيكتور SVG.
