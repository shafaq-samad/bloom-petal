import { Product, Occasion, Testimonial, GalleryItem } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "The Meadow",
    price: 85,
    description: "A gentle bouquet of seasonal flowers and greens — great for birthdays or a simple surprise.",
    category: "Signature Bouquets",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=800",
    tags: ["Romantic", "Pastel", "Signature"],
    rating: 4.9,
    isBestseller: true,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  },
  {
    id: "prod-2",
    name: "The Velvet",
    price: 115,
    description: "A bold bouquet with deep tones — a striking choice for special events.",
    category: "Moody Elegance",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800",
    tags: ["Moody", "Elegant", "Bestseller"],
    rating: 5.0,
    isBestseller: true,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  },
  {
    id: "prod-3",
    name: "The Alabaster",
    price: 98,
    description: "A clean, all-white bouquet with soft greenery — timeless and simple.",
    category: "Classic White",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800",
    tags: ["Minimalist", "Classic", "Serene"],
    rating: 4.8,
    isBestseller: true,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  },
  {
    id: "prod-4",
    name: "The Sienna",
    price: 92,
    description: "Earthy colors and textured stems — warm and cozy for home styling.",
    category: "Bohemian Earth",
    image: "https://images.unsplash.com/photo-1508784932200-478f5009c697?auto=format&fit=crop&q=80&w=800",
    tags: ["Warm", "Boho", "Textured"],
    rating: 4.9,
    isBestseller: false,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  },
  {
    id: "prod-5",
    name: "The Spring",
    price: 88,
    description: "A bright, pastel mix of seasonal blooms to bring cheer to any room.",
    category: "Seasonal Bloom",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800",
    tags: ["Vibrant", "Fresh", "Seasonal"],
    rating: 4.7,
    isBestseller: false,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  },
  {
    id: "prod-6",
    name: "The Sunset",
    price: 120,
    description: "Golden, sunny blooms that add warmth — great for special occasions.",
    category: "Signature Bouquets",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=800",
    tags: ["Warm", "Glowing", "Luxury"],
    rating: 5.0,
    isBestseller: false,
    sizeOptions: ["Classic", "Deluxe", "Grandeur"]
  }
];

export const OCCASIONS: Occasion[] = [
  {
    id: "occ-1",
    name: "Weddings & Events",
    slug: "weddings",
    description: "Elegant floral styling for weddings, dinners, and large celebrations that deserve a special touch.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-2",
    name: "Birthdays & Gifting",
    slug: "birthdays",
    description: "Beautiful bouquets and arrangements that make the perfect gift, whatever the occasion.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-3",
    name: "Anniversary & Romance",
    slug: "anniversaries",
    description: "Soft, romantic arrangements that bring extra warmth and charm to your most intimate moments.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-4",
    name: "Sympathy & Condolences",
    slug: "sympathy",
    description: "Calm and thoughtful arrangements designed to bring comfort and quiet beauty in difficult times.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Sarah L.",
    role: "Event Planner",
    quote: "The team at Bloom & Petal doesn't just arrange flowers; they create art. Every installation for our events has been a masterpiece. I can't recommend them enough.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t-2",
    name: "David Chen",
    role: "Office Manager",
    quote: "Our office subscription has completely transformed the space. The unique, natural style of each arrangement is a constant source of joy and inspiration for our team.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t-3",
    name: "Emily R.",
    role: "Happy Customer",
    quote: "I'm always blown away by the quality and artistry. Their bouquets are so different from the usual arrangements you see everywhere else. A truly premium experience!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  }
];

export const INSTAGRAM_GALLERY: GalleryItem[] = [
  {
    id: "ig-1",
    url: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&q=80&w=400",
    caption: "Mornings at the studio, sorting fresh eucalyptus for today's bouquets."
  },
  {
    id: "ig-2",
    url: "https://images.unsplash.com/photo-1507504038482-7621c27decfe?auto=format&fit=crop&q=80&w=400",
    caption: "The delicate perfection of our signature peach English Garden Rose."
  },
  {
    id: "ig-3",
    url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=400",
    caption: "Hand-crafting a custom 'Meadow' bouquet for an afternoon delivery."
  },
  {
    id: "ig-4",
    url: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400",
    caption: "Golden light hitting the assembly table in our cozy workshop."
  },
  {
    id: "ig-5",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
    caption: "Custom tablescapes for a quiet, intimate garden celebration."
  },
  {
    id: "ig-6",
    url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=400",
    caption: "Fresh thistles and ranunculus waiting to find their perfect spot in a new design."
  }
];
