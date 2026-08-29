import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function updateCafeInfo() {
  try {
    await pool.query(`
      ALTER TABLE cafe_info ADD COLUMN IF NOT EXISTS google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/cjMCijpL2f2PR1xZ8';
      UPDATE cafe_info SET google_maps_url = 'https://maps.app.goo.gl/cjMCijpL2f2PR1xZ8' WHERE id = 'main';
    `);
    console.log("Updated cafe_info table with Google Maps URL!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

updateCafeInfo();
