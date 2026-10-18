#!/usr/bin/env node
/**
 * Local-network playtest of Cognitive Rewards, with no money involved.
 *
 * Builds and serves the site from this machine with mock payment on and the
 * site address set to this machine's network address, so:
 *   - the real order page works, and checkout skips Stripe (order = mock_paid),
 *   - the real invitation emails go out, with links that open on this machine,
 *   - colleagues on the same Wi-Fi join from their own phones or laptops,
 *   - test games never ask for bank details and create no payouts.
 *
 * Nothing on Vercel or Stripe changes; .env.local is not modified (the two
 * settings are passed to this process only). Clean up afterwards with
 * `npm run playtest:cleanup`.
 *
 * Usage: npm run playtest            (port 3000)
 *        PORT=4000 npm run playtest
 */
import { spawn, spawnSync } from "node:child_process";
import os from "node:os";

const port = process.env.PORT || "3000";

function networkAddress() {
  const all = Object.entries(os.networkInterfaces()).flatMap(([name, addrs]) => (addrs ?? []).map((a) => ({ name, ...a })));
  const v4 = all.filter((a) => a.family === "IPv4" && !a.internal);
  // Prefer Wi-Fi / Ethernet (en*), skip VPN and virtual interfaces where possible.
  return (v4.find((a) => /^en\d/.test(a.name)) ?? v4.find((a) => !/^(utun|bridge|vmnet|docker|veth)/.test(a.name)) ?? v4[0])?.address;
}

const ip = networkAddress();
if (!ip) {
  console.error("No network address found. Connect this machine to the same Wi-Fi as the players and try again.");
  process.exit(1);
}
const url = `http://${ip}:${port}`;
const env = { ...process.env, NEXT_PUBLIC_SITE_URL: url, PAYMENT_MOCK_MODE: "true" };

console.log(`
Cognitive Rewards playtest (no money: mock payment, no payouts)
  Address for everyone on this Wi-Fi: ${url}
  Order a test game here:             ${url}/cognitive-rewards/order
  Invitation links will point to this address, so players must be on the same network.
  If macOS asks whether "node" may accept incoming connections, click Allow.
Building…
`);

const build = spawnSync("npx", ["next", "build"], { stdio: "inherit", env });
if (build.status !== 0) process.exit(build.status ?? 1);

console.log(`\nServing on ${url} (Ctrl+C to stop). Afterwards: npm run playtest:cleanup\n`);
const server = spawn("npx", ["next", "start", "-H", "0.0.0.0", "-p", port], { stdio: "inherit", env });
server.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => server.kill(sig));
