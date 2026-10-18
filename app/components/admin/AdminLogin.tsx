"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function AdminLogin() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret }) });
    if (res.ok) router.push("/admin/payouts");
    else setError(res.status === 429 ? t("tooMany") : res.status === 503 ? t("notConfigured") : t("invalid"));
    setBusy(false);
  }

  return (
    <section className="play-card glass-strong" style={{ maxWidth: 480 }} aria-labelledby="admin-login-title">
      <p className="play-eyebrow">{t("eyebrow")}</p>
      <h1 id="admin-login-title" className="play-title">
        {t("title")}
      </h1>
      <form onSubmit={submit} noValidate>
        <div className="order-field">
          <label htmlFor="admin-secret">{t("label")}</label>
          <div className={`order-input ${error ? "invalid" : ""}`}>
            <input id="admin-secret" type="password" autoComplete="current-password" value={secret} onChange={(e) => setSecret(e.target.value)} />
          </div>
          <span className="order-error" role="alert">
            {error ?? ""}
          </span>
        </div>
        <div className="play-action">
          <button type="submit" className="btn btn-primary play-primary" disabled={busy || !secret}>
            {busy ? t("signingIn") : t("submit")}
          </button>
        </div>
      </form>
    </section>
  );
}
