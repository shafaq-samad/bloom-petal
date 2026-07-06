import mongoose, { Schema, Document } from "mongoose";

// --- USER ---
export interface IUserRecipient {
  name: string;
  address: string;
  deliveryNote?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "admin";
  savedAddresses: string[];
  savedRecipients: IUserRecipient[];
}

const UserRecipientSchema = new Schema<IUserRecipient>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  deliveryNote: { type: String }
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  savedAddresses: { type: [String], default: [] },
  savedRecipients: { type: [UserRecipientSchema], default: [] }
});

// --- PRODUCT ---
export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  tags: string[];
  rating: number;
  isBestseller: boolean;
  sizeOptions: string[];
  stock: number;
  lowStockThreshold: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: [String], default: [] },
  rating: { type: Number, default: 5 },
  isBestseller: { type: Boolean, default: false },
  sizeOptions: { type: [String], default: ["Classic", "Deluxe", "Grandeur"] },
  stock: { type: Number, required: true, default: 20 },
  lowStockThreshold: { type: Number, default: 5 }
});

// --- ORDER ---
export interface IOrderItem {
  product: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  selectedSize: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | IUser;
  items: IOrderItem[];
  recipientName: string;
  senderEmail: string;
  deliveryDate: string; // YYYY-MM-DD
  deliverySlot: "morning" | "afternoon";
  deliveryAddress: string;
  deliveryNote?: string;
  status: "received" | "processing" | "out for delivery" | "delivered";
  subtotal: number;
  discountCode?: string;
  totalAmount: number;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, required: true, default: "Classic" }
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true },
  recipientName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  deliverySlot: { type: String, enum: ["morning", "afternoon"], required: true },
  deliveryAddress: { type: String, required: true },
  deliveryNote: { type: String },
  status: {
    type: String,
    enum: ["received", "processing", "out for delivery", "delivered"],
    default: "received"
  },
  subtotal: { type: Number, required: true },
  discountCode: { type: String },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// --- DISCOUNT CODE ---
export interface IDiscountCode extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
  expiresAt: Date;
}

const DiscountCodeSchema = new Schema<IDiscountCode>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
});

// --- REVIEW ---
export interface IReview extends Document {
  product: mongoose.Types.ObjectId | IProduct;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// --- CMS ---
export interface ICms extends Document {
  key: string;
  value: any;
}

const CmsSchema = new Schema<ICms>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }
});

// --- BLOG POST ---
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt: Date;
  createdAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: "Bloom & Petal Editorial" },
  image: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>("User", UserSchema);
export const Product = mongoose.model<IProduct>("Product", ProductSchema);
export const Order = mongoose.model<IOrder>("Order", OrderSchema);
export const DiscountCode = mongoose.model<IDiscountCode>("DiscountCode", DiscountCodeSchema);
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
export const Cms = mongoose.model<ICms>("Cms", CmsSchema);
export const BlogPost = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
