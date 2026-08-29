import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function inspectOrders() {
  try {
    const rows = await pool.query("SELECT id, date_text, status, customer_name, total FROM orders;");
    console.log("Current DB Orders:", rows.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectOrders();
