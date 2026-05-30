"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "./Icons";
import { COMPANY_SIZES, INDUSTRIES } from "../lib/validation";

const INDUSTRY_KEYS = {
  "Software & Technology": "softwareTech",
  "Financial services": "financial",
  Healthcare: "healthcare",
  Manufacturing: "manufacturing",
  "Retail & E-commerce": "retail",
  "Professional services": "professional",
  "Public sector": "publicSector",
  Education: "education",
  "Energy & Utilities": "energy",
  Other: "other",
} as const satisfies Record<(typeof INDUSTRIES)[number], string>;

type LeadFormProps = {
  endpoint: "/api/demo-requests" | "/api/contact-messages";
  submitLabel: string;
  successTitle: string;
  successBody: string;
  messageRequired?: boolean;
  companyRequired?: boolean;
};

type ServerErrors = Record<string, string>;

export function LeadForm({
  endpoint,
  submitLabel,
  successTitle,
  successBody,
  messageRequired = false,
  companyRequired = true,
}: LeadFormProps) {
  const t = useTranslations("forms");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<ServerErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    setGlobalError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: ServerErrors;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (data.errors) setErrors(data.errors);
      if (data.error) setGlobalError(data.error);
      setStatus("error");
    } catch {
      setGlobalError(t("error.network"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className="glass-strong"
        style={{ padding: "28px 28px", background: "rgba(255,255,255,0.85)" }}
      >
        <h2
          className="h-card"
          style={{ fontSize: 22, margin: "0 0 8px", color: "var(--ink-1)" }}
        >
          {successTitle}
        </h2>
        <p className="body" style={{ margin: 0 }}>{successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass-strong"
      style={{ padding: "28px 28px", background: "rgba(255,255,255,0.78)" }}
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{t("label.fullName")}</label>
          <input id="name" name="name" type="text" required autoComplete="name" />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="work_email">{t("label.workEmail")}</label>
          <input
            id="work_email"
            name="work_email"
            type="email"
            required
            autoComplete="email"
          />
          {errors.work_email && <span className="err">{errors.work_email}</span>}
        </div>
        <div className="field">
          <label htmlFor="company">
            {t("label.company")} {companyRequired ? "" : t("label.optionalSuffix")}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required={companyRequired}
            autoComplete="organization"
          />
          {errors.company && <span className="err">{errors.company}</span>}
        </div>
        <div className="field">
          <label htmlFor="company_size">{t("label.companySize")}</label>
          <select id="company_size" name="company_size" defaultValue="">
            <option value="" disabled>
              {t("select.teamSizePlaceholder")}
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {t("option.companySize", { size: s })}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="role">{t("label.role")}</label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder={t("placeholder.role")}
            autoComplete="organization-title"
          />
        </div>
        <div className="field">
          <label htmlFor="industry">{t("label.industry")}</label>
          <select id="industry" name="industry" defaultValue="">
            <option value="" disabled>
              {t("select.industryPlaceholder")}
            </option>
            {INDUSTRIES.map((s) => (
              <option key={s} value={s}>
                {t(`option.industry.${INDUSTRY_KEYS[s]}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="field col-2">
          <label htmlFor="message">
            {t("label.message")} {messageRequired ? "" : t("label.optionalSuffix")}
          </label>
          <textarea
            id="message"
            name="message"
            required={messageRequired}
            placeholder={t("placeholder.leadMessage")}
          />
          {errors.message && <span className="err">{errors.message}</span>}
        </div>

        {/* Honeypot — must remain empty */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">{t("label.websiteHoneypot")}</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field col-2">
          <label className="checkbox-row" htmlFor="consent">
            <input id="consent" name="consent" type="checkbox" required />
            <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
              {t.rich("consent.leadForm", {
                privacyLink: (chunks) => (
                  <Link
                    href="/legal#privacy"
                    style={{ color: "var(--primary)", textDecoration: "underline" }}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
          {errors.consent && <span className="err">{errors.consent}</span>}
        </div>
      </div>

      {globalError && (
        <p style={{ marginTop: 14, fontSize: 13.5, color: "#b91c1c" }}>{globalError}</p>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "submitting"}
          style={{ opacity: status === "submitting" ? 0.7 : 1, cursor: "pointer" }}
        >
          {status === "submitting" ? t("submit.sending") : submitLabel} <ArrowRight size={14} />
        </button>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          {t("footnote.dataStored")}
        </span>
      </div>
    </form>
  );
}
