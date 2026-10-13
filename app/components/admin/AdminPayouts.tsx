"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { formatEurShort } from "@/app/lib/format";
import type { AdminPayoutRow } from "@/app/lib/game/payouts";

type Filter = "ready" | "awaiting_details" | "paid" | "all";

export function AdminPayouts({ rows, purged }: { rows: AdminPayoutRow[]; purged: number }) {
  const t = useTranslations("admin.payouts");
  const locale = useLocale();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("ready");
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [refs, setRefs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eur = (n: number) => formatEurShort(n, locale);
  const date = (iso: string | null) => (iso ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso)) : "—");
  const visible = rows.filter((r) => filter === "all" || r.status === filter);
  const totals = { ready: rows.filter((r) => r.status === "ready").reduce((a, r) => a + r.amountEur, 0), count: rows.filter((r) => r.status === "ready").length };

  async function reveal(id: string) {
    setBusy(id);
    setError(null);
    const res = await fetch(`/api/admin/payouts/${id}/reveal`, { method: "POST" });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; iban?: string };
    if (data.ok && data.iban) setRevealed((r) => ({ ...r, [id]: data.iban! }));
    else setError(t("error"));
    setBusy(null);
  }
  async function paid(id: string) {
    if (!window.confirm(t("confirmPaid"))) return;
    setBusy(id);
    setError(null);
    const res = await fetch(`/api/admin/payouts/${id}/paid`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: refs[id] ?? "" }) });
    if (res.ok) router.refresh();
    else setError(t("error"));
    setBusy(null);
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="play-stack admin">
      <section className="play-card glass-strong">
        <div className="admin-head">
          <div>
            <p className="play-eyebrow">{t("eyebrow")}</p>
            <h1 className="play-title">{t("title")}</h1>
            <p className="play-intro">{t("summary", { count: totals.count, total: eur(totals.ready) })}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            {t("logout")}
          </button>
        </div>
        <div className="admin-filters" role="tablist" aria-label={t("filterLabel")}>
          {(["ready", "awaiting_details", "paid", "all"] as Filter[]).map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} className={`admin-filter ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {t(`filters.${f}`)} <span className="admin-count">{f === "all" ? rows.length : rows.filter((r) => r.status === f).length}</span>
            </button>
          ))}
        </div>
        {purged > 0 && <p className="play-small">{t("purged", { n: purged })}</p>}
        {error && (
          <p className="play-error" role="alert">
            {error}
          </p>
        )}
        {visible.length === 0 ? (
          <p className="play-intro" style={{ marginTop: 16 }}>
            {t("empty")}
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t("cols.player")}</th>
                  <th>{t("cols.company")}</th>
                  <th>{t("cols.amount")}</th>
                  <th>{t("cols.account")}</th>
                  <th>{t("cols.status")}</th>
                  <th>{t("cols.action")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.playerName}</strong>
                      <br />
                      <span className="admin-muted">{r.playerEmail}</span>
                    </td>
                    <td>
                      {r.companyName}
                      <br />
                      <span className="admin-muted">{date(r.gameEndedAt)}</span>
                    </td>
                    <td className="admin-amount">{eur(r.amountEur)}</td>
                    <td>
                      {r.status === "awaiting_details" ? (
                        <span className="admin-muted">{t("noDetails")}</span>
                      ) : (
                        <>
                          {r.holderName}
                          <br />
                          <span className="admin-iban">{revealed[r.id] ?? `•••• ${r.last4 ?? "????"}`}</span> <span className="admin-muted">{r.country}</span>
                          {!revealed[r.id] && r.status !== "paid" && (
                            <>
                              <br />
                              <button type="button" className="order-link-btn" onClick={() => reveal(r.id)} disabled={busy === r.id}>
                                {t("reveal")}
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      <span className={`admin-status ${r.status}`}>{t(`status.${r.status}`)}</span>
                      {r.status === "paid" && (
                        <>
                          <br />
                          <span className="admin-muted">
                            {date(r.paidAt)}
                            {r.reference ? ` · ${r.reference}` : ""}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      {r.status === "ready" && (
                        <div className="admin-pay">
                          <input type="text" className="admin-ref" placeholder={t("referencePlaceholder")} value={refs[r.id] ?? ""} onChange={(e) => setRefs((x) => ({ ...x, [r.id]: e.target.value }))} />
                          <button type="button" className="btn btn-primary admin-btn" onClick={() => paid(r.id)} disabled={busy === r.id}>
                            {t("markPaid")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
