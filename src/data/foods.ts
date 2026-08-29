export interface FoodItem {
  id: string;
  name: string;
  category: "coffee" | "dessert" | "burger" | "pastry" | "pizza" | "salad";
  categoryName: string;
  price: number;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  calories: number;
  description: string;
  image: string;
  isPopular?: boolean;
  ingredients: string[];
}

export interface Category {
  id: "coffee" | "dessert" | "burger" | "pastry" | "pizza" | "salad";
  name: string;
  icon: string;
  itemCount: number;
}

export const CATEGORIES: Category[] = [
  { id: "coffee", name: "قهوة ومشروبات", icon: "☕", itemCount: 4 },
  { id: "dessert", name: "حلويات وسويت", icon: "🍰", itemCount: 4 },
  { id: "burger", name: "برجر عامر", icon: "🍔", itemCount: 4 },
  { id: "pastry", name: "فطور ومخبوزات", icon: "🥐", itemCount: 4 },
  { id: "pizza", name: "بيتزا إيطالية", icon: "🍕", itemCount: 4 },
  { id: "salad", name: "سلطات صحية", icon: "🥗", itemCount: 3 },
];

export const FOOD_ITEMS: FoodItem[] = [
  // Coffee & Beverages (Specialty of Amer Cafe)
  {
    id: "coffee-1",
    name: "سبانش لاتيه عامر المثلج",
    category: "coffee",
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
    category: "coffee",
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
    category: "coffee",
    categoryName: "قهوة ومشروبات",
    price: 9.00,
    rating: 4.9,
    reviewsCount: 142,
    deliveryTime: "10-15 دقيقة",
    calories: 15,
    description: "قهوة مقطرة ببطء على البارد لمدة 24 ساعة بطعم غني وإيحاءات الشوكولاتة والكرز.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80",
    ingredients: ["بن كولومبي مختص", "ماء نقي منقوع بارداً"],
  },
  {
    id: "coffee-4",
    name: "ماتشا لاتيه ياباني مثلج",
    category: "coffee",
    categoryName: "قهوة ومشروبات",
    price: 11.00,
    rating: 4.7,
    reviewsCount: 118,
    deliveryTime: "10-15 دقيقة",
    calories: 180,
    description: "شاي ماتشا ياباني أصيل من الدرجة الأولى مع حليب الشوفان الكريمي ولمسة فانيليا.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
    ingredients: ["ماتشا ياباني أصلي", "حليب شوفان", "فانيليا طبيعية"],
  },

  // Desserts
  {
    id: "dessert-1",
    name: "تشيز كيك سان سباستيان عامر",
    category: "dessert",
    categoryName: "حلويات وسويت",
    price: 14.00,
    rating: 4.9,
    reviewsCount: 260,
    deliveryTime: "15-20 دقيقة",
    calories: 420,
    description: "كيكة الجبن الباسكية المخبوزة بطبقة كراميل محروقة وقوام كريمي غني يذوب بالفم مع صوص الشوكولاتة البلجيكية.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["جبنة فيلادلفيا كريمية", "صوص شوكولاتة بلجيكي ساخن", "بيض طازج", "فانيليا مدغشقر"],
  },
  {
    id: "dessert-2",
    name: "فرينش توست البريوش بالكراميل",
    category: "dessert",
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
    category: "dessert",
    categoryName: "حلويات وسويت",
    price: 13.00,
    rating: 4.8,
    reviewsCount: 165,
    deliveryTime: "10-15 دقيقة",
    calories: 380,
    description: "طبقات من بسكويت السافوياردي المنقوع بإسبريسو كافي عامر مع كريمة المسكاربوني وبودرة الكاكاو الفاخرة.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
    ingredients: ["جبنة مسكاربوني", "إسبريسو كافي عامر", "بسكويت أصابع الست", "كاكاو هولندي"],
  },
  {
    id: "dessert-4",
    name: "كوكيز الشوكولاتة البلجيكية المحشوة",
    category: "dessert",
    categoryName: "حلويات وسويت",
    price: 6.00,
    rating: 4.7,
    reviewsCount: 190,
    deliveryTime: "10-15 دقيقة",
    calories: 290,
    description: "كوكيز مخبوزة طازجة يومياً ومحشوة بقلب شوكولاتة نوتيلا السائلة مع رشة ملح البحر الخشن.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80",
    ingredients: ["شوكولاتة بلجيكية", "زبدة طبيعية", "نوتيلا", "ملح بحري"],
  },

  // Breakfast & Pastries
  {
    id: "pastry-1",
    name: "كرواسون الزبدة الفرنسي المحشو بالجبن",
    category: "pastry",
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
    category: "pastry",
    categoryName: "فطور ومخبوزات",
    price: 14.50,
    rating: 4.9,
    reviewsCount: 135,
    deliveryTime: "15-20 دقيقة",
    calories: 390,
    description: "خبز الساوردو المحمص مع مهروس الأفوكادو المتبل، بيضتين مسلوقتين بوشيه، وجبنة الفيتا.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    ingredients: ["خبز ساوردو محمص", "أفوكادو طازج", "بيض بوشيه", "فيتا ورشة رقائق الفلفل"],
  },
  {
    id: "pastry-3",
    name: "دانش التوت الأحمر والكاسترد",
    category: "pastry",
    categoryName: "فطور ومخبوزات",
    price: 8.50,
    rating: 4.7,
    reviewsCount: 94,
    deliveryTime: "10-15 دقيقة",
    calories: 310,
    description: "فطيرة دانش مقرمشة محشوة بكريمة الكاسترد المخملية ومغطاة بحبات التوت الطازجة.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    ingredients: ["عجينة دانش", "كاسترد فانيليا", "توت بري", "سكر بودرة"],
  },
  {
    id: "pastry-4",
    name: "كلوب ساندوتش الديك الرومي والجبن",
    category: "pastry",
    categoryName: "فطور ومخبوزات",
    price: 15.00,
    rating: 4.8,
    reviewsCount: 120,
    deliveryTime: "15-20 دقيقة",
    calories: 480,
    description: "طبقات ثلاثية من التوست المحمص مع شرائح التيركي المدخن، البيض المقلي، الخس وصوص المايونيز بالخردل.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
    ingredients: ["تيركي مدخن", "بيض مقلي", "جبنة شيدر", "خس وطماطم"],
  },

  // Burgers
  {
    id: "burger-1",
    name: "برجر كافي عامر الخاص (ترافل أنغوس)",
    category: "burger",
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
    category: "burger",
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
    category: "burger",
    categoryName: "برجر عامر",
    price: 24.00,
    rating: 4.9,
    reviewsCount: 220,
    deliveryTime: "20-25 دقيقة",
    calories: 790,
    description: "شريحتا لحم سماش مقرمشة الأطراف مع صوص عامر الخاص، مخلل، وبصل مقرمش.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    ingredients: ["شريحتا أنغوس", "شيدر أمريكي ذائب", "صوص عامر المميز", "مخلل خيار"],
  },
  {
    id: "burger-4",
    name: "ساندوتش ستيك فيلي بالجبنة",
    category: "burger",
    categoryName: "برجر عامر",
    price: 21.00,
    rating: 4.7,
    reviewsCount: 110,
    deliveryTime: "15-25 دقيقة",
    calories: 710,
    description: "شرائح لحم ريب آي رقيقة مطهوة مع الفلفل الرومي والبصل وجبنة البروفولون الإيطالية في خبز الباغيت الفرنسي.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    ingredients: ["لحم ريب آي", "جبنة بروفولون", "فلفل رومي وبصل مشوي", "خبز فرنسي"],
  },

  // Pizza
  {
    id: "pizza-1",
    name: "بيتزا مارغريتا كلاسيك نابولية",
    category: "pizza",
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
    category: "pizza",
    categoryName: "بيتزا إيطالية",
    price: 26.00,
    rating: 4.9,
    reviewsCount: 88,
    deliveryTime: "20-30 دقيقة",
    calories: 820,
    description: "مزيج فاخر من جبن البارميزان والموزاريلا مع زيت الكمأة الإيطالي والفطر الطازج.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    ingredients: ["زيت كمأة أبيض", "فطر بري", "بارميزان معتق", "موزاريلا"],
  },

  // Salad
  {
    id: "salad-1",
    name: "سلطة كافي عامر مع جبن الماعز والتوت",
    category: "salad",
    categoryName: "سلطات صحية",
    price: 14.00,
    rating: 4.8,
    reviewsCount: 92,
    deliveryTime: "10-15 دقيقة",
    calories: 320,
    description: "أوراق الجرجير البري والسبانخ مع جبن الماعز المكرمل، عين الجمل المحمص، التوت البري وصوص البلسميك بالعسل.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    ingredients: ["جرجير بري", "جبنة ماعز", "عين جمل محمص", "توت بري", "دريسينج بلسميك بالعسل"],
  },
  {
    id: "salad-2",
    name: "سلطة الكينوا والأفوكادو",
    category: "salad",
    categoryName: "سلطات صحية",
    price: 12.50,
    rating: 4.9,
    reviewsCount: 84,
    deliveryTime: "10-15 دقيقة",
    calories: 360,
    description: "كينوا عضوية مع شرائح الأفوكادو، الرمان، الطماطم الكرزية وصوص الليمون وزيت الزيتون البكر.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    ingredients: ["كينوا", "أفوكادو", "حبوب رمان", "ليمون وزيت زيتون"],
  },
];

export interface Order {
  id: string;
  items: { item: FoodItem; quantity: number }[];
  total: number;
  date: string;
  status: "جاري التحضير" | "في الطريق" | "تم التوصيل";
  address: string;
}

export const INITIAL_ORDERS: Order[] = [];
