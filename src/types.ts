export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  tags: string[];
  rating: number;
  isBestseller: boolean;
  sizeOptions: string[];
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}
