import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function initCouponsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT DEFAULT 'percentage',
        discount_value NUMERIC NOT NULL,
        min_order NUMERIC DEFAULT 0,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Insert standard initial coupons if not existing
    await pool.query(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order, description, is_active)
      VALUES 
        ('FIRST40', 'percentage', 40, 0, 'خصم الافتتاح 40% على جميع الطلبات', true),
        ('AMER10', 'fixed', 10, 30, 'خصم 10 د.ل للطلبات فوق 30 د.ل', true),
        ('WELCOME20', 'percentage', 20, 0, 'خصم ترحيبي 20%', true)
      ON CONFLICT (code) DO NOTHING;
    `);

    console.log("Coupons table created and seeded successfully");
  } catch (err) {
    console.error("Error creating coupons table:", err);
  } finally {
    await pool.end();
  }
}

initCouponsTable();
