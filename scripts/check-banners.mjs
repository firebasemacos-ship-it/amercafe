import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function checkBanners() {
  try {
    const res = await pool.query("SELECT * FROM banners;");
    console.log("Banners in DB:", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkBanners();
