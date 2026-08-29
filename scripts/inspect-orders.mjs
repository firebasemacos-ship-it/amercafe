import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function inspectOrders() {
  try {
    const columns = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'orders';
    `);
    console.log("Orders Columns:", columns.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectOrders();
