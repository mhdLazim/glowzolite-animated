import oil from "@/assets/oil-cut-700.webp.asset.json";
import oilSmall from "@/assets/oil-cut-360.webp.asset.json";
import serum from "@/assets/serum-cut-700.webp.asset.json";
import serumSmall from "@/assets/serum-cut-360.webp.asset.json";
import pack from "@/assets/pack-cut-700.webp.asset.json";
import packSmall from "@/assets/pack-cut-360.webp.asset.json";

export const BRAND = "GLOWZO";
export const WHATSAPP = "918075981789";

export const SHIPPING = 50;

export const products = [
  {
    slug: "brightening-oil",
    name: "Ayurvedic Brightening Oil",
    line: "Glowzo Lite",
    size: "30 ml",
    price: 499,
    img: oil.url,
    smallImg: oilSmall.url,
    ingredients: "Kumkuma, Manjishtha, Kumari, Yashtimadhu, Madhuka, Agnimantha, Patala",
    use: "Apply a few drops 25 minutes before bath, or 3 drops before sleep and wash in the morning.",
    description: "A lightweight Ayurvedic face oil that brightens and evens skin tone. Saffron (Kumkuma) and Manjishtha work with soothing Kumari and Yashtimadhu to bring out a natural, healthy glow.",
    benefits: ["Brighter-looking skin", "A more even-looking skin tone", "Lightweight nourishment with a natural glow"],
    highlights: ["Ayurvedic face oil", "Saffron & Manjishtha", "30 ml dropper bottle"],
  },
  {
    slug: "hair-growth-serum",
    name: "Hair Growth Serum",
    line: "Glowzolite",
    size: "30 ml",
    price: 499,
    img: serum.url,
    smallImg: serumSmall.url,
    ingredients: "Amla, Bhringraj, Rosemary, Castor Oil, Olive Oil, Onion Seed Oil, Vitamin E, Tea Tree Oil",
    use: "Paraben & sulphate free. No added colours or artificial fragrance.",
    description: "A nourishing hair serum built on Amla and Bhringraj, blended with Rosemary, Castor and Onion Seed oils to support stronger, fuller-looking hair from root to tip.",
    benefits: ["Supports stronger-looking hair", "Promotes a fuller-looking appearance", "Nourishing care from root to tip"],
    highlights: ["Paraben & sulphate free", "No added colours", "No artificial fragrance"],
  },
  {
    slug: "skin-brightening-pack",
    name: "Ayurvedic Skin Brightening Pack",
    line: "Glowzo Lite",
    size: "100 g",
    price: 380,
    img: pack.url,
    smallImg: packSmall.url,
    ingredients: "Njawara, Manjishta, Rose petal powder, Yashtimadhu, Lodhra, Chandana, Laksha, Kurunthotti, Ushira, Agnimantha",
    use: "Mix with water into a smooth paste, apply on face and neck for 15–20 minutes, then rinse.",
    description: "A traditional herbal face pack with Njawara, Manjishta and Chandana that gently cleanses, brightens and refreshes dull, tired skin.",
    benefits: ["Gently cleanses skin", "Brightens the appearance of dull skin", "Leaves skin feeling refreshed"],
    highlights: ["Traditional herbal face pack", "Njawara, Manjishta & Chandana", "100 g"],
  },
];

export type Product = (typeof products)[number];

