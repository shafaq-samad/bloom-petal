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
    image: "https://i.pinimg.com/736x/d0/b8/ef/d0b8efca5fa51c2927e4ff3b41bf97df.jpg?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-2",
    name: "Birthdays & Gifting",
    slug: "birthdays",
    description: "Beautiful bouquets and arrangements that make the perfect gift, whatever the occasion.",
    image: "https://perfectgiftadda.com/wp-content/uploads/2025/12/IMG_4426-scaled.jpeg?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-3",
    name: "Anniversary & Romance",
    slug: "anniversaries",
    description: "Soft, romantic arrangements that bring extra warmth and charm to your most intimate moments.",
    image: "https://cdn.bloomsflora.com/uploads/product/bloomsflora/FEB2026/13566-1770097070554.webp?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "occ-4",
    name: "Sympathy & Condolences",
    slug: "sympathy",
    description: "Calm and thoughtful arrangements designed to bring comfort and quiet beauty in difficult times.",
    image: "https://www.florismdeart.com.my/cdn/shop/files/IMG_4941_1.jpg?v=1684985445&width=1946?auto=format&fit=crop&q=80&w=600"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Sarah",
    role: "Event Planner",
    quote: "The team at Bloom & Petal doesn't just arrange flowers; they create art. Every installation for our events has been a masterpiece. I can't recommend them enough.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAma_6oCxRdvCD8lS29e1X0lySv1pfr2B-rkiif-1E8J6LlA3_SB90wvo&s=10?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t-2",
    name: "David",
    role: "Office Manager",
    quote: "Our office subscription has completely transformed the space. The unique, natural style of each arrangement is a constant source of joy and inspiration for our team.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkatwW9_oN0_5Fd5IkFdB5SAG3lYfkyrsO5EdMtOrnh2jEGdbZsswqq4U&s=10?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t-3",
    name: "Emily",
    role: "Happy Customer",
    quote: "I'm always blown away by the quality and artistry. Their bouquets are so different from the usual arrangements you see everywhere else. A truly premium experience!",
    rating: 5,
    image: "https://cdn-icons-png.flaticon.com/512/16783/16783119.png?auto=format&fit=crop&q=80&w=150"
  }
];

export const INSTAGRAM_GALLERY: GalleryItem[] = [
  {
    id: "ig-1",
    url: "https://substackcdn.com/image/fetch/$s_!5DOX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa84b3988-fda0-4729-aed4-b09e85e99fa7_1152x2048.jpeg?auto=format&fit=crop&q=80&w=400",
    caption: "Mornings at the studio, sorting fresh eucalyptus for today's bouquets."
  },
  {
    id: "ig-2",
    url: "https://susanrushton.net/wp-content/uploads/2015/09/a-shropshire-lad.jpg?auto=format&fit=crop&q=80&w=400",
    caption: "The delicate perfection of our signature peach English Garden Rose."
  },
  {
    id: "ig-3",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9fvDFMnTvC3Yv51WabIJBQAgdm0gRXAkI5w27f1deknVFWqzEDVCTHcU&s=10?auto=format&fit=crop&q=80&w=400",
    caption: "Hand-crafting a custom 'Meadow' bouquet for an afternoon delivery."
  },
  {
    id: "ig-4",
    url: "https://img.freepik.com/premium-photo/flower-shop-interior-with-wooden-counter-decorated-with-small-pumpkins-vases-plants-background-shows-floral-arrangements-bouquets-baskets-filled-with-colorful-flowers-soft-sunlight_206268-13841.jpg?auto=format&fit=crop&q=80&w=400",
    caption: "Golden light hitting the assembly table in our cozy workshop."
  },
  {
    id: "ig-5",
    url: "https://i.pinimg.com/736x/9d/8a/c3/9d8ac3ae9939ffcebe1fa676bf6e516e.jpg?auto=format&fit=crop&q=80&w=400",
    caption: "Custom tablescapes for a quiet, intimate garden celebration."
  },
  {
    id: "ig-6",
    url: "https://www.kukkaflowers.com/cdn/shop/products/Twilight_Blue_Flowers_Corsage.jpg?v=1640804369?auto=format&fit=crop&q=80&w=400",
    caption: "Fresh thistles and ranunculus waiting to find their perfect spot in a new design."
  }
];
