import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE banners ADD COLUMN IF NOT EXISTS category_id TEXT DEFAULT 'coffee';
    `);
    console.log("Migration successful: category_id column added to banners table");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

migrate();
