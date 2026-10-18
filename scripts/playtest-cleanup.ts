/**
 * Lists, and with --yes deletes, test orders (status "mock_paid") and
 * everything hanging off them: players, games, rounds, scores, events.
 * Real orders ("paid") are never touched.
 *
 * Usage: npm run playtest:cleanup          (dry run: shows what would go)
 *        npm run playtest:cleanup -- --yes (deletes)
 */
import { getSupabaseServerClient } from "../app/lib/supabase";

async function main() {
  const db = getSupabaseServerClient();
  if (!db) throw new Error("Supabase is not configured (.env.local).");
  const { data: orders, error } = await db
    .from("cognitive_rewards_orders")
    .select("id, created_at, company_name, buyer_name, team_size, status")
    .eq("status", "mock_paid")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  if (!orders?.length) return console.log("No test orders found.");

  for (const o of orders) console.log(`${o.created_at.slice(0, 16).replace("T", " ")}  ${o.team_size} players  ${o.company_name} (${o.buyer_name})  ${o.id}`);
  if (!process.argv.includes("--yes")) return console.log(`\n${orders.length} test order(s). Nothing deleted. Run again with -- --yes to delete them.`);

  const { error: delError } = await db.from("cognitive_rewards_orders").delete().eq("status", "mock_paid").in("id", orders.map((o) => o.id));
  if (delError) throw new Error(delError.message);
  console.log(`\nDeleted ${orders.length} test order(s) and their games.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
