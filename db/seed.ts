import { getDb } from "../api/queries/connection";
import { ranks, products, dealers, articles, subscriptionPlans, categories } from "./schema";

async function seed() {
  const db = getDb();

  // Seed Ranks
  await db.insert(ranks).values([
    { name: "Starter", slug: "starter", color: "#01D7D5", minPersonalSales: "0", minTeamSales: "0", minDirectSales: 0, rewardDescription: "Welcome Kit - Starter Pack", orderIdx: 1 },
    { name: "Silver", slug: "silver", color: "#C0C0C0", minPersonalSales: "500000", minTeamSales: "0", minDirectSales: 10, rewardDescription: "Shopping Voucher - DZD 10,000", orderIdx: 2 },
    { name: "Gold", slug: "gold", color: "#FFD700", minPersonalSales: "500000", minTeamSales: "2000000", minDirectSales: 25, rewardDescription: "Premium Smartphone", orderIdx: 3 },
    { name: "Platinum", slug: "platinum", color: "#E5E4E2", minPersonalSales: "500000", minTeamSales: "5000000", minDirectSales: 50, rewardDescription: "Electric Scooter", orderIdx: 4 },
    { name: "Diamond", slug: "diamond", color: "#B9F2FF", minPersonalSales: "500000", minTeamSales: "10000000", minDirectSales: 100, rewardDescription: "Luxury Trip or DZD 500,000 Cash Bonus", orderIdx: 5 },
  ]);

  // Seed Categories
  await db.insert(categories).values([
    { name: "Electric Bikes", slug: "e-bikes", description: "Premium electric bicycles for every terrain" },
    { name: "E-Scooters", slug: "e-scooters", description: "Urban commuter and off-road electric scooters" },
    { name: "Accessories", slug: "accessories", description: "Helmets, locks, chargers, and more" },
    { name: "Parts", slug: "parts", description: "Replacement parts and upgrades" },
  ]);

  // Seed Products
  await db.insert(products).values([
    {
      name: "E-Ride City Pro",
      description: "Premium foldable electric bike designed for urban commuting. Features a powerful 500W motor, 48V 20Ah lithium battery, and hydraulic disc brakes.",
      categoryId: 1,
      price: "185000",
      salePrice: "169000",
      stock: 15,
      specs: JSON.stringify({ motor: "500W", battery: "48V 20Ah", range: "65km", speed: "45km/h", weight: "22kg", charging: "6h" }),
      images: JSON.stringify(["product-ebike-premium"]),
      rating: "4.5",
      reviewCount: 24,
    },
    {
      name: "E-Ride Urban Glide",
      description: "Sleek urban commuter scooter with dual suspension, 10-inch pneumatic tires, and smart app connectivity.",
      categoryId: 2,
      price: "125000",
      stock: 22,
      specs: JSON.stringify({ motor: "350W", battery: "36V 15Ah", range: "45km", speed: "35km/h", weight: "16kg", charging: "5h" }),
      images: JSON.stringify(["product-escooter-city"]),
      rating: "4.3",
      reviewCount: 18,
    },
    {
      name: "E-Ride Trail Blazer",
      description: "Rugged off-road electric scooter built for adventure. Dual 1000W motors, all-terrain tires, and IPX5 water resistance.",
      categoryId: 2,
      price: "285000",
      salePrice: "259000",
      stock: 8,
      specs: JSON.stringify({ motor: "Dual 1000W", battery: "52V 28Ah", range: "80km", speed: "65km/h", weight: "35kg", charging: "8h" }),
      images: JSON.stringify(["product-escooter-offroad"]),
      rating: "4.8",
      reviewCount: 12,
    },
    {
      name: "E-Ride Mountain X",
      description: "Full-suspension electric mountain bike with 750W mid-drive motor. Conquer any trail with 27.5-inch wheels and 5-level pedal assist.",
      categoryId: 1,
      price: "320000",
      stock: 6,
      specs: JSON.stringify({ motor: "750W Mid-Drive", battery: "48V 17.5Ah", range: "90km", speed: "50km/h", weight: "24kg", charging: "7h" }),
      images: JSON.stringify(["product-ebike-mountain"]),
      rating: "4.7",
      reviewCount: 9,
    },
    {
      name: "E-Ride Air Helmet",
      description: "Ultra-lightweight certified helmet with integrated LED taillight and ventilation system.",
      categoryId: 3,
      price: "8500",
      stock: 50,
      specs: JSON.stringify({ weight: "280g", sizes: "M/L/XL", certification: "CE EN1078" }),
      images: JSON.stringify(["product-accessory-helmet"]),
      rating: "4.6",
      reviewCount: 31,
    },
    {
      name: "E-Ride Smart Lock",
      description: "Fingerprint-enabled smart lock with 110dB alarm, GPS tracking, and smartphone app control.",
      categoryId: 3,
      price: "12000",
      stock: 35,
      specs: JSON.stringify({ battery: "6 months", alarm: "110dB", connectivity: "Bluetooth 5.0" }),
      images: JSON.stringify(["product-accessory-lock"]),
      rating: "4.4",
      reviewCount: 22,
    },
  ]);

  // Seed Dealers
  await db.insert(dealers).values([
    { name: "E-Ride Algiers Center", address: "123 Boulevard Mohamed VI, Alger Centre", city: "Algiers", phone: "+213 23 45 67 89", email: "algiers@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "36.7538", longitude: "3.0588" },
    { name: "E-Ride Oran", address: "45 Rue d'Oran, Oran", city: "Oran", phone: "+213 41 23 45 67", email: "oran@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "35.6971", longitude: "-0.6308" },
    { name: "E-Ride Constantine", address: "78 Rue des Freres Bouadou, Constantine", city: "Constantine", phone: "+213 31 45 67 89", email: "constantine@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "36.3650", longitude: "6.6147" },
    { name: "E-Ride Annaba", address: "12 Boulevard de la Republique, Annaba", city: "Annaba", phone: "+213 38 12 34 56", email: "annaba@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "36.9185", longitude: "7.7591" },
    { name: "E-Ride Setif", address: "33 Rue Emir Abdelkader, Setif", city: "Setif", phone: "+213 36 78 90 12", email: "setif@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "36.1898", longitude: "5.4108" },
    { name: "E-Ride Blida", address: "5 Rue de la Gare, Blida", city: "Blida", phone: "+213 25 34 56 78", email: "blida@eride-dz.com", hours: "Sun-Thu: 9AM-6PM", latitude: "36.4739", longitude: "2.8322" },
  ]);

  // Seed Articles
  await db.insert(articles).values([
    { title: "How to Extend Your Battery Life", slug: "extend-battery-life", excerpt: "Learn proven techniques to maximize your e-scooter battery lifespan and get more range per charge.", content: "Your e-scooter's battery is its most valuable component. With proper care, you can extend its lifespan by up to 40%. Here are the key practices: avoid deep discharges, keep charge between 20-80%, store at room temperature, and use the original charger.", category: "Battery Care", featuredImage: "article-battery", status: "published", publishedAt: new Date(), tags: JSON.stringify(["battery", "maintenance", "tips"]) },
    { title: "Best Charging Practices for E-Scooters", slug: "charging-practices", excerpt: "Master the art of charging your electric scooter for optimal performance and longevity.", content: "Charging your e-scooter correctly is crucial. Always use the manufacturer-provided charger, avoid overcharging by unplugging at 100%, charge in a dry environment, and never charge immediately after a ride - let the battery cool down first.", category: "Maintenance", featuredImage: "article-charging", status: "published", publishedAt: new Date(), tags: JSON.stringify(["charging", "battery", "safety"]) },
    { title: "Safety Tips for Riding in Algerian Cities", slug: "safety-tips-cities", excerpt: "Essential safety guidelines for navigating busy Algerian streets on your electric scooter.", content: "Riding safely in Algerian cities requires awareness and preparation. Always wear a helmet, use hand signals, stay visible with reflective gear, follow traffic rules, and be extra cautious at intersections.", category: "Safety", featuredImage: "article-safety", status: "published", publishedAt: new Date(), tags: JSON.stringify(["safety", "riding", "city"]) },
    { title: "Understanding Your E-Bike Motor", slug: "understanding-ebike-motor", excerpt: "A deep dive into e-bike motor types, power ratings, and how to choose the right one.", content: "E-bike motors come in three main types: hub motors (front or rear), mid-drive motors, and all-wheel drive. Mid-drive motors offer better weight distribution and efficiency, while hub motors are more affordable and require less maintenance.", category: "Technology", featuredImage: "article-motor", status: "published", publishedAt: new Date(), tags: JSON.stringify(["motor", "technology", "e-bike"]) },
  ]);

  // Seed Subscription Plans
  await db.insert(subscriptionPlans).values([
    { name: "Basic Maintenance", description: "Essential monthly maintenance to keep your ride in good condition.", price: "500", billingCycle: "monthly", features: JSON.stringify(["Monthly inspection", "10% discount on parts", "Priority scheduling"]) },
    { name: "Premium Maintenance", description: "Comprehensive care package with weekly check-ups and emergency support.", price: "1500", billingCycle: "monthly", features: JSON.stringify(["Weekly check-ups", "25% discount on parts", "Free battery diagnostics", "Emergency roadside assistance", "Free software updates"]) },
    { name: "Extended Warranty", description: "One-year extended warranty coverage for complete peace of mind.", price: "15000", billingCycle: "one_time", features: JSON.stringify(["1 additional year of coverage", "Full parts replacement", "Free labor on repairs", "Transferable to new owner"]) },
  ]);

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
