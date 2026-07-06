import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { connectDB } from "./server/db";
import {
  User,
  Product,
  Order,
  DiscountCode,
  Review,
  Cms,
  BlogPost
} from "./server/models";

// Import mock data to seed if db is empty
import { PRODUCTS } from "./src/data";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "bloom_petal_secret_key_123";

app.use(cors());
app.use(express.json());

// Extend express Request types to include authenticated user details
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "customer" | "admin";
    email: string;
  };
}

// Connect Database
connectDB().then(() => {
  seedDatabase();
});

// --- Middleware: Authentication ---
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };
    next();
  });
};

// --- Middleware: Admin Only ---
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Administrative privilege required" });
    return;
  }
  next();
};

// --- Database Auto-Seeder ---
async function seedDatabase() {
  try {
    // 1. Seed Admin
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "System Administrator",
        email: "admin@bloom.com",
        passwordHash,
        role: "admin",
        savedAddresses: ["100 Botanical Blvd, Suite A, New York, NY"],
        savedRecipients: []
      });
      console.log("Seeded default admin account (admin@bloom.com / admin123)");
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsWithStock = PRODUCTS.map(p => ({
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.image,
        tags: p.tags,
        rating: p.rating,
        isBestseller: p.isBestseller,
        sizeOptions: p.sizeOptions || ["Classic", "Deluxe", "Grandeur"],
        stock: Math.floor(Math.random() * 25) + 3, // Random stock between 3 and 27
        lowStockThreshold: 5
      }));
      await Product.insertMany(productsWithStock);
      console.log(`Seeded ${productsWithStock.length} default product compositions.`);
    }

    // 3. Seed Promotional Codes
    const promoCount = await DiscountCode.countDocuments();
    if (promoCount === 0) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      await DiscountCode.insertMany([
        { code: "VALENTINE20", discountType: "percentage", discountValue: 20, active: true, expiresAt: futureDate },
        { code: "MOTHERSDAY", discountType: "percentage", discountValue: 15, active: true, expiresAt: futureDate },
        { code: "SPRING10", discountType: "fixed", discountValue: 10, active: true, expiresAt: futureDate }
      ]);
      console.log("Seeded default promo codes.");
    }

    // 4. Seed Botanical Journal / Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        {
          title: "How We Make Natural Arrangements",
          slug: "simple-floral-design",
          excerpt: "We let flowers keep their natural shape so arrangements feel relaxed and fresh.",
          content: `We let flowers keep their natural shape and use a few key blooms to make arrangements feel fresh and easy to enjoy.

Here are a few simple ideas we follow:

1. Start with a few bigger flowers to set the look.
2. Add lighter stems for movement and interest.
3. Leave small spaces so each flower can be seen.
`,
          author: "Bloom & Petal",
          image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=800",
          publishedAt: new Date()
        },
        {
          title: "Keeping Flowers Fresh: Our Simple Promise",
          slug: "freshness-promise",
          excerpt: "We keep flowers cool and take care during delivery so they arrive looking good.",
          content: `Fresh flowers start to change as soon as they are cut. We keep them cool and hydrated so they last longer on your table.

Flower care tips:
* Trim the stems by about an inch before placing them in water.
* Use clean water and change it every couple of days.
* Keep flowers away from direct heat and fruit.
`,
          author: "Bloom & Petal Team",
          image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800",
          publishedAt: new Date()
        }
      ]);
      console.log("Seeded default botanical journals.");
    }

    // 5. Seed CMS content
    const cmsCount = await Cms.countDocuments();
    if (cmsCount === 0) {
      await Cms.create({
        key: "homepage",
        value: {
          heroTitle: "Fresh flowers for your home and special days.",
          heroSubtitle: "Lovely bouquets and easy-to-order gifts for any occasion.",
          heroImage: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=1600",
          seasonalAlert: "Mother's Day coming up — order early for best delivery times.",
          aboutText: "Bloom & Petal makes simple, beautiful bouquets for homes and gifts. We use seasonal flowers and put care into each arrangement so they feel personal and easy to enjoy."
        }
      });
      console.log("Seeded homepage CMS settings.");
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// ==========================================
// --- API ROUTING SECTION ---
// ==========================================

// --- 1. AUTHENTICATION ENDPOINTS ---
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
       res.status(400).json({ message: "Name, email and password parameters required" });
       return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "Email is already registered" });
       return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: "customer"
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        savedAddresses: newUser.savedAddresses,
        savedRecipients: newUser.savedRecipients
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
       res.status(400).json({ message: "Email and password parameters required" });
       return;
    }

    const user = await User.findOne({ email });
    if (!user) {
       res.status(400).json({ message: "Invalid email or password credentials" });
       return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
       res.status(400).json({ message: "Invalid email or password credentials" });
       return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedAddresses: user.savedAddresses,
        savedRecipients: user.savedRecipients
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-passwordHash");
    if (!user) {
       res.status(404).json({ message: "User account not found" });
       return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/auth/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { savedAddresses, savedRecipients } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) {
       res.status(404).json({ message: "User account not found" });
       return;
    }

    if (savedAddresses !== undefined) user.savedAddresses = savedAddresses;
    if (savedRecipients !== undefined) user.savedRecipients = savedRecipients;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedAddresses: user.savedAddresses,
      savedRecipients: user.savedRecipients
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 2. PRODUCT ENDPOINTS ---
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
       res.status(404).json({ message: "Composition not found" });
       return;
    }
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
       res.status(404).json({ message: "Composition not found" });
       return;
    }
    res.json({ message: "Composition successfully removed from catalogue" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 3. PROMO CODE ENDPOINTS ---
app.post("/api/discounts/validate", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
       res.status(400).json({ message: "Promo code parameter required" });
       return;
    }

    const discount = await DiscountCode.findOne({
      code: code.toUpperCase().trim(),
      active: true,
      expiresAt: { $gt: new Date() }
    });

    if (!discount) {
       res.status(400).json({ message: "Invalid or expired promotional code" });
       return;
    }

    res.json(discount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/discounts", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const codes = await DiscountCode.find({});
    res.json(codes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/discounts", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const newCode = await DiscountCode.create(req.body);
    res.status(201).json(newCode);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/discounts/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const updatedCode = await DiscountCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCode) {
       res.status(404).json({ message: "Promo code not found" });
       return;
    }
    res.json(updatedCode);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/discounts/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const deletedCode = await DiscountCode.findByIdAndDelete(req.params.id);
    if (!deletedCode) {
       res.status(404).json({ message: "Promo code not found" });
       return;
    }
    res.json({ message: "Promo code deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 4. ORDER ENDPOINTS ---
app.post("/api/orders", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      items, // array of { id, quantity, selectedSize }
      recipientName,
      deliveryDate,
      deliverySlot,
      deliveryAddress,
      deliveryNote,
      discountCode
    } = req.body;

    if (!items || items.length === 0 || !recipientName || !deliveryDate || !deliverySlot || !deliveryAddress) {
       res.status(400).json({ message: "Missing required order parameters" });
       return;
    }

    // Process and validate items, check stock levels
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
         res.status(404).json({ message: `Product ${item.id} not found` });
         return;
      }

      if (product.stock < item.quantity) {
         res.status(400).json({ message: `Insufficient stock for composition '${product.name}'` });
         return;
      }

      // Calculate price based on size modifier
      let priceModifier = 0;
      if (item.selectedSize === "Deluxe") priceModifier = 30;
      if (item.selectedSize === "Grandeur") priceModifier = 65;
      const actualPrice = product.price + priceModifier;

      subtotal += actualPrice * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Validate discount code if provided
    let totalAmount = subtotal;
    if (discountCode) {
      const promo = await DiscountCode.findOne({
        code: discountCode.toUpperCase().trim(),
        active: true,
        expiresAt: { $gt: new Date() }
      });

      if (promo) {
        if (promo.discountType === "percentage") {
          totalAmount = subtotal - (subtotal * promo.discountValue) / 100;
        } else {
          totalAmount = Math.max(0, subtotal - promo.discountValue);
        }
      }
    }

    const order = await Order.create({
      user: req.user?.id,
      items: orderItems,
      recipientName,
      senderEmail: req.user?.email,
      deliveryDate,
      deliverySlot,
      deliveryAddress,
      deliveryNote,
      status: "received",
      subtotal,
      discountCode,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/orders", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role === "admin") {
      // Admin sees all orders populated with product and user details
      const orders = await Order.find({})
        .populate("items.product")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
       res.json(orders);
       return;
    } else {
      // Customer sees only own order history
      const orders = await Order.find({ user: req.user?.id })
        .populate("items.product")
        .sort({ createdAt: -1 });
       res.json(orders);
       return;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/orders/:id/status", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["received", "processing", "out for delivery", "delivered"].includes(status)) {
       res.status(400).json({ message: "Invalid order status value" });
       return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.product").populate("user", "name email");

    if (!order) {
       res.status(404).json({ message: "Order dossier not found" });
       return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 5. CUSTOMER REVIEWS ENDPOINTS ---
app.get("/api/reviews/:productId", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, approved: true })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/reviews", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({})
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/reviews", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
       res.status(400).json({ message: "Missing review feedback parameters" });
       return;
    }

    const newReview = await Review.create({
      product: productId,
      userName: req.user?.email.split("@")[0] || "Acquirer",
      userEmail: req.user?.email,
      rating,
      comment,
      approved: false // Requires Admin Moderation
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/reviews/:id/approve", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { approved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );

    if (!review) {
       res.status(404).json({ message: "Review not found" });
       return;
    }

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 6. CMS SYSTEM ENDPOINTS ---
app.get("/api/cms/:key", async (req: Request, res: Response) => {
  try {
    const config = await Cms.findOne({ key: req.params.key });
    if (!config) {
       res.status(404).json({ message: "CMS Key Configuration not found" });
       return;
    }
    res.json(config.value);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/cms/:key", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const updatedCms = await Cms.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body },
      { new: true, upsert: true }
    );
    res.json(updatedCms.value);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 7. BOTANICAL JOURNAL / BLOG ENDPOINTS ---
app.get("/api/blog", async (req: Request, res: Response) => {
  try {
    const posts = await BlogPost.find({}).sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/blog/:slug", async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
       res.status(404).json({ message: "Journal entry not found" });
       return;
    }
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/blog", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, image, author } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const newPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      image,
      author: author || "Bloom & Petal Editorial"
    });
    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/blog/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
       res.status(404).json({ message: "Journal entry not found" });
       return;
    }
    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/blog/:id", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
       res.status(404).json({ message: "Journal entry not found" });
       return;
    }
    res.json({ message: "Journal entry deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// --- 8. BUSINESS INTELLIGENCE & ANALYTICS ---
app.get("/api/analytics", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate("items.product");
    const users = await User.find({ role: "customer" });

    // Math aggregations
    let totalRevenue = 0;
    const categorySales: Record<string, number> = {};
    const itemQuantity: Record<string, { name: string; quantity: number }> = {};
    
    let repeatAcquirers = 0;
    const customerOrderCount: Record<string, number> = {};

    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      
      // Track buyer orders count for repeat purchase rates
      const userId = order.user.toString();
      customerOrderCount[userId] = (customerOrderCount[userId] || 0) + 1;

      order.items.forEach((item: any) => {
        if (item.product) {
          const qty = item.quantity;
          const prodName = item.product.name;
          const prodCat = item.product.category || "Signature Bouquets";

          categorySales[prodCat] = (categorySales[prodCat] || 0) + (item.product.price * qty);
          
          if (!itemQuantity[item.product._id.toString()]) {
            itemQuantity[item.product._id.toString()] = { name: prodName, quantity: 0 };
          }
          itemQuantity[item.product._id.toString()].quantity += qty;
        }
      });
    });

    // Repeat purchase rate
    Object.values(customerOrderCount).forEach((cnt) => {
      if (cnt > 1) repeatAcquirers++;
    });

    const customerCount = users.length;
    const repeatPurchaseRate = customerCount > 0 
      ? Math.round((repeatAcquirers / customerCount) * 100) 
      : 0;

    const averageOrderValue = orders.length > 0 
      ? Math.round(totalRevenue / orders.length) 
      : 0;

    const bestSellers = Object.values(itemQuantity)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    res.json({
      totalRevenue,
      averageOrderValue,
      totalOrders: orders.length,
      customerCount,
      repeatPurchaseRate,
      categorySales,
      bestSellers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// --- FRONTEND STATIC DELIVERY (PRODUCTION) ---
// ==========================================
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
