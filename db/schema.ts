import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  json,
  decimal,
  // boolean,
  // index,
  // uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─── Users ─────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "marketer", "admin", "superadmin"]).default("user").notNull(),
  rankId: bigint("rankId", { mode: "number", unsigned: true }).default(1),
  referralCode: varchar("referralCode", { length: 50 }).unique(),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["active", "frozen", "pending"]).default("active").notNull(),
  language: mysqlEnum("language", ["en", "ar"]).default("en").notNull(),
  loyaltyPoints: int("loyaltyPoints").default(0),
  loyaltyTier: mysqlEnum("loyaltyTier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Categories ────────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;

// ─── Products ──────────────────────────────────────────────────────
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal("salePrice", { precision: 12, scale: 2 }),
  cost: decimal("cost", { precision: 12, scale: 2 }),
  stock: int("stock").default(0),
  lowStockThreshold: int("lowStockThreshold").default(5),
  specs: json("specs"),
  images: json("images"),
  videoUrl: text("videoUrl"),
  variants: json("variants"),
  status: mysqlEnum("status", ["active", "draft", "archived"]).default("active").notNull(),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;

// ─── Orders ────────────────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "canceled", "refunded"]).default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("DZD").notNull(),
  shippingAddress: json("shippingAddress"),
  paymentMethod: mysqlEnum("paymentMethod", ["card", "cod", "baridimob"]).default("cod").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  referrerId: bigint("referrerId", { mode: "number", unsigned: true }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Order = typeof orders.$inferSelect;

// ─── Order Items ───────────────────────────────────────────────────
export const orderItems = mysqlTable("orderItems", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  variant: json("variant"),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

// ─── Ranks ─────────────────────────────────────────────────────────
export const ranks = mysqlTable("ranks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }).notNull(),
  minPersonalSales: decimal("minPersonalSales", { precision: 14, scale: 2 }).default("0"),
  minTeamSales: decimal("minTeamSales", { precision: 14, scale: 2 }).default("0"),
  minDirectSales: int("minDirectSales").default(0),
  rewardDescription: text("rewardDescription"),
  rewardImage: text("rewardImage"),
  orderIdx: int("orderIdx").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Rank = typeof ranks.$inferSelect;

// ─── Commissions ───────────────────────────────────────────────────
export const commissions = mysqlTable("commissions", {
  id: serial("id").primaryKey(),
  marketerId: bigint("marketerId", { mode: "number", unsigned: true }).notNull(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["direct", "team"]).default("direct").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "paid"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Commission = typeof commissions.$inferSelect;

// ─── Withdrawals ───────────────────────────────────────────────────
export const withdrawals = mysqlTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["bank", "ccp", "baridimob"]).default("bank").notNull(),
  paymentDetails: json("paymentDetails"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Withdrawal = typeof withdrawals.$inferSelect;

// ─── Subscription Plans ────────────────────────────────────────────
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "yearly", "one_time"]).default("monthly").notNull(),
  features: json("features"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// ─── Subscriptions ─────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  planId: bigint("planId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["active", "pending", "canceled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  nextBillingDate: timestamp("nextBillingDate"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;

// ─── Maintenance Requests ──────────────────────────────────────────
export const maintenanceRequests = mysqlTable("maintenanceRequests", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  subscriptionId: bigint("subscriptionId", { mode: "number", unsigned: true }),
  productId: bigint("productId", { mode: "number", unsigned: true }),
  issueDescription: text("issueDescription"),
  status: mysqlEnum("status", ["pending", "scheduled", "in_progress", "completed"]).default("pending").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  completedAt: timestamp("completedAt"),
  dealerId: bigint("dealerId", { mode: "number", unsigned: true }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;

// ─── Dealers ───────────────────────────────────────────────────────
export const dealers = mysqlTable("dealers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  hours: varchar("hours", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  managerName: varchar("managerName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Dealer = typeof dealers.$inferSelect;

// ─── Articles ──────────────────────────────────────────────────────
export const articles = mysqlTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: varchar("category", { length: 100 }).notNull(),
  featuredImage: text("featuredImage"),
  authorId: bigint("authorId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["published", "draft"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  tags: json("tags"),
  views: int("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Article = typeof articles.$inferSelect;

// ─── Loyalty Transactions ──────────────────────────────────────────
export const loyaltyTransactions = mysqlTable("loyaltyTransactions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  points: int("points").notNull(),
  type: mysqlEnum("type", ["earned", "redeemed"]).notNull(),
  source: mysqlEnum("source", ["purchase", "referral", "review", "redemption", "promotion"]).notNull(),
  description: text("description"),
  orderId: bigint("orderId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;

// ─── Notifications ─────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  recipientType: mysqlEnum("recipientType", ["user", "marketer", "customer", "all"]).notNull(),
  recipientId: bigint("recipientId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["in_app", "email", "sms"]).default("in_app").notNull(),
  status: mysqlEnum("status", ["sent", "delivered", "read"]).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// ─── Audit Log ─────────────────────────────────────────────────────
export const auditLog = mysqlTable("auditLog", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("targetType", { length: 100 }),
  targetId: bigint("targetId", { mode: "number", unsigned: true }),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;

// ─── Rewards ───────────────────────────────────────────────────────
export const rewards = mysqlTable("rewards", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  rankId: bigint("rankId", { mode: "number", unsigned: true }).notNull(),
  status: mysqlEnum("status", ["pending", "claimed", "shipped", "delivered"]).default("pending").notNull(),
  claimedAt: timestamp("claimedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reward = typeof rewards.$inferSelect;

// ─── Cart Items ────────────────────────────────────────────────────
export const cartItems = mysqlTable("cartItems", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  sessionId: varchar("sessionId", { length: 255 }),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  variant: json("variant"),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type CartItem = typeof cartItems.$inferSelect;
