export type GalleryCategory = "all" | "farm" | "products" | "media" | "recognition";

export type GallerySpan = "large" | "tall" | "wide" | "normal";

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  description: string;
  category: Exclude<GalleryCategory, "all">;
  span?: GallerySpan;
}

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "farm", label: "Farm & Facility" },
  { value: "products", label: "Products" },
  { value: "media", label: "Media Coverage" },
  { value: "recognition", label: "Recognition" },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "farm-oyster-growing",
    src: "/gallery/farm/oyster-mushroom-growing.png",
    title: "Fresh Oyster Mushrooms",
    description: "Pleurotus ostreatus fruiting beautifully on paddy straw substrate in our climate-controlled growing unit.",
    category: "farm",
    span: "large",
  },
  {
    id: "farm-growing-shed",
    src: "/gallery/farm/growing-shed-interior.png",
    title: "Growing Shed Interior",
    description: "Inside our traditional thatched-roof mushroom growing shed with hundreds of spawn bags hanging from bamboo rafters.",
    category: "farm",
    span: "tall",
  },
  {
    id: "product-oyster-label",
    src: "/gallery/products/oyster-mushroom-label.png",
    title: "FSSAI Certified Oyster Mushroom",
    description: "Our FSSAI licensed (LIC NO: 22424356000315) oyster mushroom packaging — 200g packs at Rs. 70, complete with nutritional information.",
    category: "products",
  },
  {
    id: "product-health-mix",
    src: "/gallery/products/mushroom-health-mix-powder.png",
    title: "Mushroom Health Mix Powder",
    description: "Our value-added Mushroom Health Mix Powder — a nutritious supplement made from premium dried mushrooms, available in 150g jars.",
    category: "products",
  },
  {
    id: "product-dried-packs",
    src: "/gallery/products/dried-mushroom-packs.png",
    title: "Dried Mushroom Packs",
    description: "Sun-dried oyster mushrooms hygienically packed and ready for shipping — retains nutrients with extended shelf life.",
    category: "products",
  },
  {
    id: "media-daily-thanthi",
    src: "/gallery/media/daily-thanthi-article.png",
    title: "Daily Thanthi Coverage",
    description: "Featured in Daily Thanthi (March 2025) — 'Young man from Kalvarayanmalai excelling in mushroom production.'",
    category: "media",
    span: "wide",
  },
  {
    id: "media-makkal-velicham",
    src: "/gallery/media/makkal-velicham-article.png",
    title: "Makkal Velicham Article",
    description: "Makkal Velicham reports on Kallakkurichi District Collector's inspection of our mushroom farm and government agriculture initiatives.",
    category: "media",
  },
  {
    id: "media-dinamalar",
    src: "/gallery/media/dinamalar-article.png",
    title: "Dinamalar Press Coverage",
    description: "Dinamalar newspaper covering the District Collector's visit to our mushroom growing centre near Kalvarayanmalai.",
    category: "media",
  },
  {
    id: "recognition-collector-visit",
    src: "/gallery/recognition/collector-farm-visit.png",
    title: "District Collector's Visit",
    description: "Kallakkurichi District Collector Mr. M.S. Prasanth, IAS, inspecting our mushroom growing facility on 14.08.2024, reviewing cultivation methods.",
    category: "recognition",
    span: "large",
  },
  {
    id: "recognition-officials-walking",
    src: "/gallery/recognition/officials-walking.png",
    title: "Officials Visit to Vellimalai",
    description: "District officials and the farm owner walking through the Kalvarayanmalai hills area during the official farm inspection visit.",
    category: "recognition",
  },
  {
    id: "recognition-community",
    src: "/gallery/recognition/community-meeting.png",
    title: "Community Engagement",
    description: "District Collector and government officials interacting with local community members and discussing agricultural development initiatives.",
    category: "recognition",
  },
  {
    id: "recognition-award",
    src: "/gallery/recognition/government-award.png",
    title: "Government Recognition",
    description: "Farm owner receiving recognition at a Special Development Programme for tribal welfare under the Horticulture Department's mushroom cultivation initiative.",
    category: "recognition",
  },
  {
    id: "promo-tamil-banner",
    src: "/gallery/promotional/tamil-farm-banner.png",
    title: "Sri Amman Oyster Mushroom Farm",
    description: "Our promotional banner showcasing both button mushrooms (Agaricus) and oyster mushrooms (Pleurotus), along with training programs offered.",
    category: "products",
    span: "wide",
  },
  {
    id: "promo-recipes-list",
    src: "/gallery/promotional/mushroom-recipes-list.png",
    title: "21 Mushroom Recipes",
    description: "Value-added mushroom food varieties we teach — from mushroom soup and biryani to cutlets, chips, and paneer masala.",
    category: "products",
  },
];
