import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

async function inspectNotifs() {
  try {
    const rows = await pool.query("SELECT * FROM notifications;");
    console.log("Current DB Notifications:", rows.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspectNotifs();
