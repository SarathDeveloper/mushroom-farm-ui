export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "Oyster" | "Milky" | "Button" | "Shiitake" | "Value-Added";
  price: number;
  compareAtPrice?: number;
  weight: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  tag?: string;
  stock: number;
  description: string;
  highlights: string[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "premium-oyster-mushroom",
    name: "Premium Oyster Mushroom",
    category: "Oyster",
    price: 150,
    compareAtPrice: 180,
    weight: "250g",
    image:
      "https://images.unsplash.com/photo-1590740924976-15ff4eb430d8?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1590740924976-15ff4eb430d8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 124,
    tag: "Bestseller",
    stock: 42,
    description:
      "Delicate, fan-shaped oyster mushrooms hand-picked at the peak of freshness. Prized for their subtle, savory flavor and tender texture, perfect for stir-fries, soups, and grilling.",
    highlights: ["Rich in protein & fiber", "Zero pesticides", "Harvested same-day", "Great meat substitute"],
  },
  {
    id: "2",
    slug: "fresh-milky-mushroom",
    name: "Fresh Milky Mushroom",
    category: "Milky",
    price: 180,
    weight: "250g",
    image:
      "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 98,
    tag: "Farmer's Pick",
    stock: 30,
    description:
      "Milky mushrooms with a firm, meaty bite that holds up beautifully in curries and biryanis. A South Indian favorite, cultivated in our climate-controlled beds for consistent quality.",
    highlights: ["High in Vitamin D", "Firm, meaty texture", "Locally cultivated", "Ideal for curries"],
  },
  {
    id: "3",
    slug: "organic-button-mushroom",
    name: "Organic Button Mushroom",
    category: "Button",
    price: 120,
    weight: "200g",
    image:
      "https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 210,
    stock: 65,
    description:
      "Classic white button mushrooms with a mild, earthy flavor that works in nearly every dish. A pantry staple, delivered fresh from farm to doorstep within hours of harvest.",
    highlights: ["Everyday essential", "Mild, versatile flavor", "Low calorie", "Kid-friendly"],
  },
  {
    id: "4",
    slug: "shiitake-exotic",
    name: "Shiitake Exotic",
    category: "Shiitake",
    price: 250,
    compareAtPrice: 290,
    weight: "200g",
    image:
      "https://images.unsplash.com/photo-1516069670183-5c8e3100be05?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516069670183-5c8e3100be05?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 5.0,
    reviewCount: 76,
    tag: "Chef's Choice",
    stock: 18,
    description:
      "Rich, umami-packed shiitake mushrooms with a deep smoky aroma. A restaurant favorite, this exotic variety elevates ramen, risottos, and Asian stir-fries.",
    highlights: ["Umami-rich flavor", "Boosts immunity", "Restaurant grade", "Limited harvest"],
  },
  {
    id: "5",
    slug: "grey-oyster-mushroom",
    name: "Grey Oyster Mushroom",
    category: "Oyster",
    price: 160,
    weight: "250g",
    image:
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590740924976-15ff4eb430d8?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 54,
    stock: 27,
    description:
      "A slightly firmer cousin of the classic oyster mushroom, with a deeper flavor profile. Excellent when pan-seared with garlic and butter.",
    highlights: ["Firm texture", "Deep savory notes", "Great for searing", "Freshly harvested"],
  },
  {
    id: "6",
    slug: "mushroom-pickle",
    name: "Mushroom Pickle",
    category: "Value-Added",
    price: 220,
    weight: "200g Jar",
    image:
      "https://images.unsplash.com/photo-1552825896-01c6f4d0d2c1?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1552825896-01c6f4d0d2c1?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 39,
    tag: "New",
    stock: 50,
    description:
      "A tangy, spiced mushroom pickle made in small batches using traditional South Indian recipes. No preservatives, just farm-fresh mushrooms and cold-pressed oil.",
    highlights: ["Traditional recipe", "No preservatives", "6-month shelf life", "Spicy & tangy"],
  },
  {
    id: "7",
    slug: "dried-shiitake",
    name: "Dried Shiitake Slices",
    category: "Value-Added",
    price: 320,
    weight: "100g",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 21,
    stock: 40,
    description:
      "Sun-dried shiitake slices with an intensified, concentrated flavor. Rehydrate for soups and broths, or grind into a natural umami seasoning powder.",
    highlights: ["Long shelf life", "Concentrated flavor", "Great for broths", "Zero additives"],
  },
  {
    id: "8",
    slug: "mixed-mushroom-combo",
    name: "Mixed Mushroom Combo Pack",
    category: "Value-Added",
    price: 450,
    compareAtPrice: 520,
    weight: "4 x 200g",
    image:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 63,
    tag: "Best Value",
    stock: 15,
    description:
      "Can't decide? Get a taste of everything with our combo pack featuring oyster, milky, button, and shiitake mushrooms — the perfect way to explore our full harvest.",
    highlights: ["4 varieties in one pack", "Best value per gram", "Perfect for gifting", "Free shipping"],
  },
];

export const categories = ["All", "Oyster", "Milky", "Button", "Shiitake", "Value-Added"] as const;

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export interface Testimonial {
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Priya Subramaniam",
    role: "Home Chef",
    review: "The freshness is unbelievable. These mushrooms have elevated my cooking completely.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rahul Menon",
    role: "Restaurant Owner",
    review: "Consistent quality and reliable delivery. Vellimalai Farms is our trusted partner.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Anita Krishnan",
    role: "Fitness Enthusiast",
    review: "Organic, clean, and incredibly tasty. I order my weekly batch every Monday!",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export const stats: StatItem[] = [
  { label: "Happy Customers", value: 12000, suffix: "+" },
  { label: "Kg Harvested Monthly", value: 8500, suffix: "kg" },
  { label: "Restaurant Partners", value: 320, suffix: "+" },
  { label: "Years of Experience", value: 9, suffix: "" },
];

export interface TrainingProgram {
  id: string;
  slug: string;
  title: string;
  duration: string;
  fee: number;
  trainer: string;
  startDate: string;
  seatsLeft: number;
  image: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  modules: string[];
  description: string;
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: "t1",
    slug: "oyster-mushroom-crash-course",
    title: "Oyster Mushroom Crash Course",
    duration: "1 Day",
    fee: 1500,
    trainer: "Murugan Selvam",
    startDate: "2026-07-18",
    seatsLeft: 6,
    level: "Beginner",
    image:
      "https://images.unsplash.com/photo-1574316071802-0d684efa7ea5?q=80&w=1000&auto=format&fit=crop",
    modules: ["Spawn selection", "Substrate preparation", "Bag cultivation", "Harvesting basics"],
    description:
      "A hands-on, single-day introduction to oyster mushroom farming — perfect for beginners looking to start a small home setup.",
  },
  {
    id: "t2",
    slug: "commercial-mushroom-cultivation",
    title: "Commercial Mushroom Cultivation",
    duration: "2 Weeks",
    fee: 8500,
    trainer: "Dr. Kavitha Raman",
    startDate: "2026-08-03",
    seatsLeft: 12,
    level: "Intermediate",
    image:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop",
    modules: ["Farm setup & climate control", "Multi-variety cultivation", "Pest & disease management", "Market linkages"],
    description:
      "Our flagship comprehensive program covering everything needed to start and scale a commercial mushroom farming business.",
  },
  {
    id: "t3",
    slug: "value-added-products-workshop",
    title: "Value-Added Products Workshop",
    duration: "3 Days",
    fee: 3200,
    trainer: "Lakshmi Narayanan",
    startDate: "2026-07-28",
    seatsLeft: 9,
    level: "Advanced",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop",
    modules: ["Pickling & preservation", "Dehydration techniques", "Packaging & branding", "Selling online"],
    description:
      "Learn to turn fresh harvest into shelf-stable, sellable products like pickles, powders, and dried mushrooms.",
  },
];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "5-health-benefits-of-oyster-mushrooms",
    title: "5 Surprising Health Benefits of Oyster Mushrooms",
    excerpt:
      "From immunity support to heart health, discover why oyster mushrooms deserve a regular spot on your plate.",
    content: [
      "Oyster mushrooms are more than just a delicious, versatile ingredient — they're a nutritional powerhouse that's been used in traditional medicine for centuries.",
      "Rich in beta-glucans, oyster mushrooms support immune function by helping activate white blood cells that fight off infection.",
      "They're also naturally low in calories and sodium while being a good source of plant-based protein, potassium, and B vitamins, making them a smart addition to a heart-healthy diet.",
      "Studies suggest compounds found in oyster mushrooms may help support healthy cholesterol levels already within a normal range.",
      "At Vellimalai Farms, our oyster mushrooms are grown without any synthetic pesticides, harvested daily, and delivered fresh — so you get the full nutritional benefit in every bite.",
    ],
    image:
      "https://images.unsplash.com/photo-1590740924976-15ff4eb430d8?q=80&w=1200&auto=format&fit=crop",
    author: "Dr. Kavitha Raman",
    authorAvatar: "https://i.pravatar.cc/150?img=32",
    date: "2026-06-02",
    readTime: "4 min read",
    tags: ["Health", "Oyster Mushrooms"],
  },
  {
    id: "b2",
    slug: "how-we-grow-organic-mushrooms",
    title: "Inside Our Farm: How We Grow 100% Organic Mushrooms",
    excerpt:
      "A behind-the-scenes look at our sustainable cultivation process in the Kalvarayan Hills.",
    content: [
      "Nestled in the pristine climate of the Kalvarayan Hills, our farm relies on natural humidity, clean spring water, and carefully controlled temperatures to grow mushrooms without any synthetic inputs.",
      "Our cultivation process begins with high-quality spawn, sourced and tested for purity, which is then introduced to a substrate made from agricultural waste — turning what would otherwise be discarded into nutrient-rich growing media.",
      "We monitor humidity and temperature multiple times a day, ensuring optimal conditions for each variety, from delicate oysters to firm milky mushrooms.",
      "Every batch is hand-harvested early in the morning at peak ripeness, then immediately packed in breathable, temperature-controlled packaging to preserve freshness on its journey to your kitchen.",
    ],
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200&auto=format&fit=crop",
    author: "Murugan Selvam",
    authorAvatar: "https://i.pravatar.cc/150?img=12",
    date: "2026-05-14",
    readTime: "6 min read",
    tags: ["Farming", "Sustainability"],
  },
  {
    id: "b3",
    slug: "mushroom-recipes-for-beginners",
    title: "3 Easy Mushroom Recipes for Beginners",
    excerpt:
      "New to cooking with mushrooms? Start with these simple, flavor-packed recipes anyone can master.",
    content: [
      "Mushrooms are one of the most forgiving ingredients to cook with — they're quick to prepare and absorb flavor beautifully.",
      "1. Garlic Butter Oyster Mushrooms: Sear torn oyster mushrooms in butter until golden, then finish with minced garlic, a splash of soy sauce, and fresh parsley.",
      "2. Milky Mushroom Curry: Simmer milky mushrooms in a base of onions, tomatoes, and warming spices for a hearty, protein-rich curry that pairs perfectly with rice or roti.",
      "3. Button Mushroom Soup: Blend sautéed button mushrooms with vegetable stock and a touch of cream for a comforting, restaurant-style soup in under 30 minutes.",
    ],
    image:
      "https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1200&auto=format&fit=crop",
    author: "Lakshmi Narayanan",
    authorAvatar: "https://i.pravatar.cc/150?img=47",
    date: "2026-04-22",
    readTime: "3 min read",
    tags: ["Recipes"],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getTrainingBySlug(slug: string) {
  return trainingPrograms.find((t) => t.slug === slug);
}

export const certifications = [
  { name: "FSSAI Certified", icon: "ShieldCheck" },
  { name: "India Organic", icon: "Leaf" },
  { name: "ISO 22000", icon: "BadgeCheck" },
  { name: "Pesticide-Free Tested", icon: "FlaskConical" },
];
