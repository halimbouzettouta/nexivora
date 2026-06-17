import { getDb } from "../api/queries/connection";

async function main() {
  const db = getDb();
  console.log("Dropping existing tables...");

  await db.execute("SET FOREIGN_KEY_CHECKS = 0");

  const tables = [
    "rewards", "auditLog", "notifications", "loyaltyTransactions",
    "maintenanceRequests", "subscriptionPlans", "subscriptions",
    "withdrawals", "commissions", "orderItems", "cartItems",
    "orders", "articles", "dealers", "products", "categories",
    "ranks", "users"
  ];

  for (const table of tables) {
    try {
      await db.execute(`DROP TABLE IF EXISTS \`${table}\``);
      console.log(`  Dropped ${table}`);
    } catch (e) {
      console.log(`  ${table} did not exist (ok)`);
    }
  }

  await db.execute("SET FOREIGN_KEY_CHECKS = 1");
  console.log("All tables dropped. Ready for schema push.");
}

main().catch(console.error);
