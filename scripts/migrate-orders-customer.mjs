import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
    `);
    console.log("Migration successful: customer_name, phone, notes added to orders table");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

migrate();
