export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  weight: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  tag?: string | null;
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
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
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
    image: "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    gallery: [
      "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
      "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
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
      "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
    gallery: [
      "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
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
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
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
    image: "/gallery/products/mushroom-pickle.jpg",
    gallery: ["/gallery/products/mushroom-pickle.jpg"],
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
    image: "/gallery/products/dried-shiitake.jpg",
    gallery: [
      "/gallery/products/dried-shiitake.jpg",
      "/gallery/products/shiitake-mushrooms-BMfvtmoS.jpg",
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
    image: "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    gallery: [
      "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
      "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
      "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
    ],
    rating: 4.9,
    reviewCount: 63,
    tag: "Best Value",
    stock: 15,
    description:
      "Can't decide? Get a taste of everything with our combo pack featuring oyster, milky, button, and shiitake mushrooms — the perfect way to explore our full harvest.",
    highlights: ["4 varieties in one pack", "Best value per gram", "Perfect for gifting", "Free shipping"],
  },
  {
    id: "9",
    slug: "pink-oyster-mushroom",
    name: "Pink Oyster Mushroom",
    category: "Oyster",
    price: 190,
    compareAtPrice: 220,
    weight: "200g",
    image: "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
    gallery: [
      "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 47,
    tag: "New",
    stock: 22,
    description:
      "Vibrant pink oyster mushrooms with a mild, seafood-like flavor that fades to cream when cooked. A colorful addition to salads, tacos, and quick sautés.",
    highlights: ["Eye-catching color", "Mild seafood notes", "Cooks in minutes", "Harvested same-day"],
  },
  {
    id: "10",
    slug: "king-oyster-mushroom",
    name: "King Oyster Mushroom",
    category: "Oyster",
    price: 210,
    weight: "250g",
    image: "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
    gallery: [
      "/gallery/products/oyster-mushrooms-DUuUKbNY.jpg",
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 88,
    tag: "Chef's Choice",
    stock: 28,
    description:
      "Thick-stemmed king oysters with a meaty bite that holds up to grilling, roasting, and shredding. A favorite for vegan steaks and mushroom 'scallops'.",
    highlights: ["Meaty texture", "Grill-friendly", "Excellent meat substitute", "Restaurant grade"],
  },
  {
    id: "11",
    slug: "brown-button-mushroom",
    name: "Brown Button Mushroom",
    category: "Button",
    price: 140,
    weight: "200g",
    image: "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
    gallery: [
      "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 132,
    stock: 55,
    description:
      "Cremini-style brown buttons with a deeper, earthier flavor than white buttons. Ideal for pastas, omelettes, and everyday Indian cooking.",
    highlights: ["Richer flavor", "Everyday versatile", "Farm-fresh", "Low calorie"],
  },
  {
    id: "12",
    slug: "jumbo-button-mushroom",
    name: "Jumbo Button Mushroom",
    category: "Button",
    price: 160,
    weight: "300g",
    image: "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
    gallery: [
      "/gallery/products/button-mushrooms-Dj92oXDo.jpg",
      "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 64,
    tag: "Farmer's Pick",
    stock: 35,
    description:
      "Oversized white button mushrooms perfect for stuffing, grilling, or slicing into thick steaks. Grown larger for fuller flavor and fewer prep cuts.",
    highlights: ["Stuffing size", "Thick slices", "Great for grilling", "Family pack weight"],
  },
  {
    id: "13",
    slug: "milky-mushroom-family-pack",
    name: "Milky Mushroom Family Pack",
    category: "Milky",
    price: 320,
    compareAtPrice: 360,
    weight: "500g",
    image: "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
    gallery: [
      "/gallery/products/mixed-mushrooms-CNX65Zqk.jpg",
      "https://images.unsplash.com/photo-1508216127116-43b98c56cc19?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 41,
    tag: "Best Value",
    stock: 20,
    description:
      "A half-kilo pack of firm milky mushrooms for weekly cooking — curries, pepper fries, and weekend biryanis. Better value than smaller packs.",
    highlights: ["500g value pack", "Ideal for families", "Holds up in curries", "Same-day harvest"],
  },
  {
    id: "14",
    slug: "fresh-shiitake-caps",
    name: "Fresh Shiitake Caps",
    category: "Shiitake",
    price: 280,
    weight: "200g",
    image: "/gallery/products/shiitake-mushrooms-BMfvtmoS.jpg",
    gallery: [
      "/gallery/products/shiitake-mushrooms-BMfvtmoS.jpg",
      "https://images.unsplash.com/photo-1516069670183-5c8e3100be05?q=80&w=1000&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 52,
    stock: 16,
    description:
      "Hand-selected shiitake caps with stems trimmed — ready for soups, ramen, and high-heat stir-fries. Deep aroma and tender chew.",
    highlights: ["Caps only", "Ready to cook", "Intense aroma", "Limited harvest"],
  },
  {
    id: "15",
    slug: "mushroom-masala-powder",
    name: "Mushroom Masala Powder",
    category: "Value-Added",
    price: 180,
    weight: "100g Pack",
    image: "/gallery/products/mushroom-masala-powder.jpg",
    gallery: ["/gallery/products/mushroom-masala-powder.jpg"],
    rating: 4.6,
    reviewCount: 73,
    tag: "New",
    stock: 60,
    description:
      "A savory blend of dried mushroom powder and South Indian spices. Sprinkle into gravies, dosa fillings, and egg dishes for instant umami.",
    highlights: ["Instant umami", "No preservatives", "Long shelf life", "Kitchen staple"],
  },
  {
    id: "16",
    slug: "mushroom-soup-mix",
    name: "Creamy Mushroom Soup Mix",
    category: "Value-Added",
    price: 150,
    weight: "50g Pack",
    image: "/gallery/products/creamy-mushroom-soup.jpg",
    gallery: ["/gallery/products/creamy-mushroom-soup.jpg"],
    rating: 4.5,
    reviewCount: 29,
    stock: 45,
    description:
      "A ready-to-cook soup base made from our dried oyster and button mushrooms. Just add milk or coconut milk and simmer for a cozy bowl.",
    highlights: ["Ready in 10 mins", "Farm-sourced base", "Comfort food", "Vegetarian"],
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
    review: "Consistent quality and reliable delivery. Sri Amman Mushroom Farms is our trusted partner.",
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
    trainer: "Mathesh",
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

export function getTrainingBySlug(slug: string) {
  return trainingPrograms.find((t) => t.slug === slug);
}

export const certifications = [
  { name: "FSSAI Certified", icon: "ShieldCheck" },
  { name: "India Organic", icon: "Leaf" },
  { name: "ISO 22000", icon: "BadgeCheck" },
  { name: "Pesticide-Free Tested", icon: "FlaskConical" },
];
