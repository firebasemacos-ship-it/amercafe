import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function inspectBannersTable() {
  try {
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'banners';
    `);
    console.log("Banners Table Columns:", columns.rows);

    const rows = await pool.query("SELECT * FROM banners;");
    console.log("Current Banners in DB:", rows.rows);
  } catch (err) {
    console.error("Error inspecting banners:", err);
  } finally {
    await pool.end();
  }
}

inspectBannersTable();
