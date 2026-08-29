import pg from "pg";

const connectionString = "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("Migrating database for admin features...");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Banners Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        code TEXT DEFAULT 'FIRST40',
        discount TEXT DEFAULT '40%',
        image TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'promo',
        is_unread BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed default banner if empty
    const { rows: bannerRows } = await client.query("SELECT COUNT(*) FROM banners");
    if (parseInt(bannerRows[0].count) === 0) {
      await client.query(`
        INSERT INTO banners (title, subtitle, code, discount, is_active)
        VALUES ('عرض الافتتاح الخاص من كافي عامر ☕', 'احصل على خصم 40% على جميع المشروبات والحلويات', 'FIRST40', '40%', true);
      `);
    }

    // Seed default notification if empty
    const { rows: notifRows } = await client.query("SELECT COUNT(*) FROM notifications");
    if (parseInt(notifRows[0].count) === 0) {
      await client.query(`
        INSERT INTO notifications (title, message, type, is_unread)
        VALUES ('عرض الافتتاح من كافي عامر ☕', 'خصم 40% بكود FIRST40 على القهوة والحلويات!', 'promo', true);
      `);
    }

    await client.query("COMMIT");
    console.log("Admin migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
