import pg from "pg";

const connectionString = "postgresql://postgres.rbgohyvmjefowkvnjmha:Gz6dnlh3920064400@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const client = await pool.connect();
  console.log("Connected successfully! Creating schema...");

  try {
    await client.query("BEGIN");

    // 1. Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        item_count INT DEFAULT 0,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Foods Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS foods (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
        category_name TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        rating NUMERIC(3, 1) DEFAULT 4.9,
        reviews_count INT DEFAULT 100,
        delivery_time TEXT DEFAULT '15-20 دقيقة',
        calories INT DEFAULT 300,
        description TEXT,
        image TEXT NOT NULL,
        is_popular BOOLEAN DEFAULT false,
        ingredients JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        items JSONB NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        date_text TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'جاري التحضير',
        address TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Cafe Info Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cafe_info (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        english_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        address TEXT NOT NULL,
        tiktok_handle TEXT,
        tiktok_url TEXT,
        facebook_handle TEXT,
        facebook_url TEXT,
        instagram_handle TEXT,
        instagram_url TEXT,
        working_hours TEXT,
        since_year INT DEFAULT 2012
      );
    `);

    console.log("Tables created successfully. Seeding initial data...");

    // Seed Categories
    const categories = [
      { id: "coffee", name: "قهوة ومشروبات", icon: "☕", itemCount: 4, sortOrder: 1 },
      { id: "dessert", name: "حلويات وسويت", icon: "🍰", itemCount: 4, sortOrder: 2 },
      { id: "burger", name: "برجر عامر", icon: "🍔", itemCount: 4, sortOrder: 3 },
      { id: "pastry", name: "فطور ومخبوزات", icon: "🥐", itemCount: 4, sortOrder: 4 },
      { id: "pizza", name: "بيتزا إيطالية", icon: "🍕", itemCount: 4, sortOrder: 5 },
      { id: "salad", name: "سلطات صحية", icon: "🥗", itemCount: 3, sortOrder: 6 },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (id, name, icon, item_count, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          icon = EXCLUDED.icon,
          item_count = EXCLUDED.item_count,
          sort_order = EXCLUDED.sort_order;
      `, [cat.id, cat.name, cat.icon, cat.itemCount, cat.sortOrder]);
    }

    // Seed Foods
    const foods = [
      // Coffee
      {
        id: "coffee-1",
        name: "سبانش لاتيه عامر المثلج",
        categoryId: "coffee",
        categoryName: "قهوة ومشروبات",
        price: 8.50,
        rating: 4.9,
        reviewsCount: 310,
        deliveryTime: "10-15 دقيقة",
        calories: 220,
        description: "إسبريسو فاخر من حبوب البن المختصة مع الحليب المكثف المحلى ورغوة الحليب الباردة.",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["إسبريسو مختص", "حليب مكثف محلى", "حليب طازج", "ثلج"],
      },
      {
        id: "coffee-2",
        name: "فلات وايت كلاسيك",
        categoryId: "coffee",
        categoryName: "قهوة ومشروبات",
        price: 6.50,
        rating: 4.8,
        reviewsCount: 195,
        deliveryTime: "10-15 دقيقة",
        calories: 140,
        description: "جرعة مزدوجة من الإسبريسو الإثيوبي مع حليب مبخر ناعم بطبقة مخملية دقيقة.",
        image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["دبل إسبريسو", "حليب مبخر مخملي", "بن إثيوبي فاخر"],
      },
      {
        id: "coffee-3",
        name: "كولد برو منقوع 24 ساعة",
        categoryId: "coffee",
        categoryName: "قهوة ومشروبات",
        price: 9.00,
        rating: 4.9,
        reviewsCount: 142,
        deliveryTime: "10-15 دقيقة",
        calories: 15,
        description: "قهوة مقطرة ببطء على البارد لمدة 24 ساعة بطعم غني وإيحاءات الشوكولاتة والكرز.",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["بن كولومبي مختص", "ماء نقي منقوع بارداً"],
      },
      {
        id: "coffee-4",
        name: "ماتشا لاتيه ياباني مثلج",
        categoryId: "coffee",
        categoryName: "قهوة ومشروبات",
        price: 11.00,
        rating: 4.7,
        reviewsCount: 118,
        deliveryTime: "10-15 دقيقة",
        calories: 180,
        description: "شاي ماتشا ياباني أصيل من الدرجة الأولى مع حليب الشوفان الكريمي ولمسة فانيليا.",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["ماتشا ياباني أصلي", "حليب شوفان", "فانيليا طبيعية"],
      },

      // Desserts
      {
        id: "dessert-1",
        name: "تشيز كيك سان سباستيان عامر",
        categoryId: "dessert",
        categoryName: "حلويات وسويت",
        price: 14.00,
        rating: 4.9,
        reviewsCount: 260,
        deliveryTime: "15-20 دقيقة",
        calories: 420,
        description: "كيكة الجبن الباسكية المخبوزة بطبقة كراميل محروقة وقوام كريمي غني يذوب بالفم مع صصوص الشوكولاتة البلجيكية.",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["جبنة فيلادلفيا كريمية", "صوص شوكولاتة بلجيكي ساخن", "بيض طازج", "فانيليا مدغشقر"],
      },
      {
        id: "dessert-2",
        name: "فرينش توست البريوش بالكراميل",
        categoryId: "dessert",
        categoryName: "حلويات وسويت",
        price: 16.00,
        rating: 4.9,
        reviewsCount: 215,
        deliveryTime: "15-25 دقيقة",
        calories: 520,
        description: "خبز بريوش طازج ومقرمش من الخارج وطري من الداخل مع آيس كريم الفانيليا والتوت وصوص الكراميل المملح.",
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["خبز بريوش بالزبدة", "صوص سولتيد كراميل", "آيس كريم فانيليا", "توت طازج"],
      },
      {
        id: "dessert-3",
        name: "تيراميسو إيطالي كلاسيك",
        categoryId: "dessert",
        categoryName: "حلويات وسويت",
        price: 13.00,
        rating: 4.8,
        reviewsCount: 165,
        deliveryTime: "10-15 دقيقة",
        calories: 380,
        description: "طبقات من بسكويت السافوياردي المنقوع بإسبريسو كافي عامر مع كريمة المسكاربوني وبودرة الكاكاو الفاخرة.",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["جبنة مسكاربوني", "إسبريسو كافي عامر", "بسكويت أصابع الست", "كاكاو هولندي"],
      },
      {
        id: "dessert-4",
        name: "كوكيز الشوكولاتة البلجيكية المحشوة",
        categoryId: "dessert",
        categoryName: "حلويات وسويت",
        price: 6.00,
        rating: 4.7,
        reviewsCount: 190,
        deliveryTime: "10-15 دقيقة",
        calories: 290,
        description: "كوكيز مخبوزة طازجة يومياً ومحشوة بقلب شوكولاتة نوتيلا السائلة مع رشة ملح البحر الخشن.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["شوكولاتة بلجيكية", "زبدة طبيعية", "نوتيلا", "ملح بحري"],
      },

      // Pastries
      {
        id: "pastry-1",
        name: "كرواسون الزبدة الفرنسي المحشو بالجبن",
        categoryId: "pastry",
        categoryName: "فطور ومخبوزات",
        price: 7.50,
        rating: 4.8,
        reviewsCount: 180,
        deliveryTime: "10-15 دقيقة",
        calories: 340,
        description: "كرواسون فرنسي مورق ومخبوز بالزبدة الطبيعية محشو بجبن الإيمنتال والزعتر البري.",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["عجينة مورقة فرنسية", "زبدة طبيعية", "جبنة إيمنتال", "زعتر"],
      },
      {
        id: "pastry-2",
        name: "توست الأفوكادو والبيض البوشيه",
        categoryId: "pastry",
        categoryName: "فطور ومخبوزات",
        price: 14.50,
        rating: 4.9,
        reviewsCount: 135,
        deliveryTime: "15-20 دقيقة",
        calories: 390,
        description: "خبز الساوردو المحمص مع مهروس الأفوكادو المتبل، بيضتين مسلوقتين بوشيه، وجبنة الفيتا.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["خبز ساوردو محمص", "أفوكادو طازج", "بيض بوشيه", "فيتا ورشة رقائق الفلفل"],
      },
      {
        id: "pastry-3",
        name: "دانش التوت الأحمر والكاسترد",
        categoryId: "pastry",
        categoryName: "فطور ومخبوزات",
        price: 8.50,
        rating: 4.7,
        reviewsCount: 94,
        deliveryTime: "10-15 دقيقة",
        calories: 310,
        description: "فطيرة دانش مقرمشة محشوة بكريمة الكاسترد المخملية ومغطاة بحبات التوت الطازجة.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["عجينة دانش", "كاسترد فانيليا", "توت بري", "سكر بودرة"],
      },
      {
        id: "pastry-4",
        name: "كلوب ساندوتش الديك الرومي والجبن",
        categoryId: "pastry",
        categoryName: "فطور ومخبوزات",
        price: 15.00,
        rating: 4.8,
        reviewsCount: 120,
        deliveryTime: "15-20 دقيقة",
        calories: 480,
        description: "طبقات ثلاثية من التوست المحمص مع شرائح التيركي المدخن، البيض المقلي، الخس وصوص المايونيز بالخردل.",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["تيركي مدخن", "بيض مقلي", "جبنة شيدر", "خس وطماطم"],
      },

      // Burgers
      {
        id: "burger-1",
        name: "برجر كافي عامر الخاص (ترافل أنغوس)",
        categoryId: "burger",
        categoryName: "برجر عامر",
        price: 22.00,
        rating: 4.9,
        reviewsCount: 340,
        deliveryTime: "15-25 دقيقة",
        calories: 680,
        description: "شريحة لحم أنغوس بقري 100% مشوية على اللهب مع مايونيز الترافل الأسود، شيدر بريطاني معتق، وبصل مكرمل في خبز البريوش الذهبي.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["لحم أنغوس بقري", "مايونيز الكمأة الأسود", "جبن شيدر معتق", "بصل مكرمل", "خبز بريوش كافي عامر"],
      },
      {
        id: "burger-2",
        name: "برجر كرسبي دجاج ترياكي",
        categoryId: "burger",
        categoryName: "برجر عامر",
        price: 18.50,
        rating: 4.8,
        reviewsCount: 195,
        deliveryTime: "15-20 دقيقة",
        calories: 620,
        description: "صدر دجاج مقرمش ذهبي مغطى بصلصة الترياكي اليابانية وسلطة الملفوف الآسيوية المنعشة.",
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["دجاج كرسبي مقرمش", "صوص ترياكي كافي عامر", "سلطة كولسلو آسيوية", "شيدر سويسري"],
      },
      {
        id: "burger-3",
        name: "سماش برجر دبل تشيز",
        categoryId: "burger",
        categoryName: "برجر عامر",
        price: 24.00,
        rating: 4.9,
        reviewsCount: 220,
        deliveryTime: "20-25 دقيقة",
        calories: 790,
        description: "شريحتا لحم سماش مقرمشة الأطراف مع صوص عامر الخاص، مخلل، وبصل مقرمش.",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["شريحتا أنغوس", "شيدر أمريكي ذائب", "صوص عامر المميز", "مخلل خيار"],
      },
      {
        id: "burger-4",
        name: "ساندوتش ستيك فيلي بالجبنة",
        categoryId: "burger",
        categoryName: "برجر عامر",
        price: 21.00,
        rating: 4.7,
        reviewsCount: 110,
        deliveryTime: "15-25 دقيقة",
        calories: 710,
        description: "شرائح لحم ريب آي رقيقة مطهوة مع الفلفل الرومي والبصل وجبنة البروفولون الإيطالية في خبز الباغيت الفرنسي.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["لحم ريب آي", "جبنة بروفولون", "فلفل رومي وبصل مشوي", "خبز فرنسي"],
      },

      // Pizza
      {
        id: "pizza-1",
        name: "بيتزا مارغريتا كلاسيك نابولية",
        categoryId: "pizza",
        categoryName: "بيتزا إيطالية",
        price: 18.00,
        rating: 4.9,
        reviewsCount: 145,
        deliveryTime: "20-30 دقيقة",
        calories: 680,
        description: "جبنة موزاريلا إيطالية طازجة مع صلصة الطماطم الغنية بالريحان وزيت الزيتون البكر.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["موزاريلا طازجة", "صلصة طماطم سان مارزانو", "ريحان طازج", "عجينة ساوردو"],
      },
      {
        id: "pizza-2",
        name: "بيتزا الترافل والأجبان الإيطالية",
        categoryId: "pizza",
        categoryName: "بيتزا إيطالية",
        price: 26.00,
        rating: 4.9,
        reviewsCount: 88,
        deliveryTime: "20-30 دقيقة",
        calories: 820,
        description: "مزيج فاخر من جبن البارميزان والموزاريلا مع زيت الكمأة الإيطالي والفطر الطازج.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["زيت كمأة أبيض", "فطر بري", "بارميزان معتق", "موزاريلا"],
      },

      // Salad
      {
        id: "salad-1",
        name: "سلطة كافي عامر مع جبن الماعز والتوت",
        categoryId: "salad",
        categoryName: "سلطات صحية",
        price: 14.00,
        rating: 4.8,
        reviewsCount: 92,
        deliveryTime: "10-15 دقيقة",
        calories: 320,
        description: "أوراق الجرجير البري والسبانخ مع جبن الماعز المكرمل، عين الجمل المحمص، التوت البري وصوص البلسميك بالعسل.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
        isPopular: true,
        ingredients: ["جرجير بري", "جبنة ماعز", "عين جمل محمص", "توت بري", "دريسينج بلسميك بالعسل"],
      },
      {
        id: "salad-2",
        name: "سلطة الكينوا والأفوكادو",
        categoryId: "salad",
        categoryName: "سلطات صحية",
        price: 12.50,
        rating: 4.9,
        reviewsCount: 84,
        deliveryTime: "10-15 دقيقة",
        calories: 360,
        description: "كينوا عضوية مع شرائح الأفوكادو، الرمان، الطماطم الكرزية وصوص الليمون وزيت الزيتون البكر.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        isPopular: false,
        ingredients: ["كينوا", "أفوكادو", "حبوب رمان", "ليمون وزيت زيتون"],
      },
    ];

    for (const food of foods) {
      await client.query(`
        INSERT INTO foods (
          id, name, category_id, category_name, price, rating,
          reviews_count, delivery_time, calories, description, image,
          is_popular, ingredients
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category_id = EXCLUDED.category_id,
          category_name = EXCLUDED.category_name,
          price = EXCLUDED.price,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          delivery_time = EXCLUDED.delivery_time,
          calories = EXCLUDED.calories,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          is_popular = EXCLUDED.is_popular,
          ingredients = EXCLUDED.ingredients;
      `, [
        food.id,
        food.name,
        food.categoryId,
        food.categoryName,
        food.price,
        food.rating,
        food.reviewsCount,
        food.deliveryTime,
        food.calories,
        food.description,
        food.image,
        food.isPopular,
        JSON.stringify(food.ingredients),
      ]);
    }

    // Seed Orders
    const initialOrders = [
      {
        id: "AMER-9482",
        items: [
          { item: foods[0], quantity: 1 },
          { item: foods[4], quantity: 1 },
        ],
        total: 22.50,
        dateText: "اليوم، 11:30 ص",
        status: "في الطريق",
        address: "طبرق ، مفترق رابعة",
      },
      {
        id: "AMER-7391",
        items: [
          { item: foods[12], quantity: 2 },
        ],
        total: 44.00,
        dateText: "أمس، 08:15 م",
        status: "تم التوصيل",
        address: "طبرق ، مفترق رابعة",
      },
    ];

    for (const ord of initialOrders) {
      await client.query(`
        INSERT INTO orders (id, items, total, date_text, status, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          items = EXCLUDED.items,
          total = EXCLUDED.total,
          date_text = EXCLUDED.date_text,
          status = EXCLUDED.status,
          address = EXCLUDED.address;
      `, [
        ord.id,
        JSON.stringify(ord.items),
        ord.total,
        ord.dateText,
        ord.status,
        ord.address,
      ]);
    }

    // Seed Cafe Info
    await client.query(`
      INSERT INTO cafe_info (
        id, name, english_name, phone, whatsapp, address,
        tiktok_handle, tiktok_url, facebook_handle, facebook_url,
        instagram_handle, instagram_url, working_hours, since_year
      )
      VALUES (
        'main', 'كافي عامر', 'Amer Cafe', '0924478000', '218924478000', 'طبرق ، مفترق رابعة',
        '@kaf_e1', 'https://www.tiktok.com/@kaf_e1',
        'كافي عامر - Amer Cafe', 'https://www.facebook.com/share/14vTdfJRa9R/',
        '@amerc.afe', 'https://www.instagram.com/amerc.afe',
        'من 7:00 صباحاً حتى 12:00 منتصف الليل', 2012
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        tiktok_handle = EXCLUDED.tiktok_handle,
        facebook_url = EXCLUDED.facebook_url,
        instagram_handle = EXCLUDED.instagram_handle;
    `);

    await client.query("COMMIT");
    console.log("Database initialized and seeded successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database initialization error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
