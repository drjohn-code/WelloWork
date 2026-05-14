"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "./Icons";
import { COMPANY_SIZES, INDUSTRIES } from "../lib/validation";

type ServerErrors = Record<string, string>;

const TIMEFRAMES = [
  "This week",
  "Next week",
  "In the next 2–4 weeks",
  "Just exploring",
] as const;

export function DemoFallbackForm() {
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
      const res = await fetch("/api/demo-requests", { method: "POST", body: fd });
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
      setGlobalError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className="glass-strong"
        role="status"
        aria-live="polite"
        style={{ padding: "28px 28px", background: "rgba(255,255,255,0.85)" }}
      >
        <h2 className="h-card" style={{ fontSize: 22, margin: "0 0 8px", color: "var(--ink-1)" }}>
          Thanks — request received.
        </h2>
        <p className="body" style={{ margin: 0 }}>
          A product specialist will reach out within one working day to confirm a demo time. Check
          your work inbox (and spam, just in case) for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Request a demo time"
      className="glass-strong"
      style={{ padding: "28px 28px", background: "rgba(255,255,255,0.78)" }}
    >
      <h2 className="h-card" style={{ fontSize: 22, margin: "0 0 6px" }}>
        Request a demo time
      </h2>
      <p className="small" style={{ margin: "0 0 18px" }}>
        Scheduling isn’t live in this environment — leave your details and we’ll confirm a slot by
        email within one working day.
      </p>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required autoComplete="name" aria-required="true" />
          {errors.name && <span className="err" role="alert">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="work_email">Work email</label>
          <input
            id="work_email"
            name="work_email"
            type="email"
            required
            autoComplete="email"
            aria-required="true"
          />
          {errors.work_email && <span className="err" role="alert">{errors.work_email}</span>}
        </div>
        <div className="field">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            aria-required="true"
          />
          {errors.company && <span className="err" role="alert">{errors.company}</span>}
        </div>
        <div className="field">
          <label htmlFor="company_size">Company size</label>
          <select id="company_size" name="company_size" defaultValue="" aria-label="Company size">
            <option value="" disabled>
              Select team size
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="role">Your role / title</label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="HR, Operations, L&D, Founder…"
            autoComplete="organization-title"
          />
        </div>
        <div className="field">
          <label htmlFor="industry">Industry</label>
          <select id="industry" name="industry" defaultValue="" aria-label="Industry">
            <option value="" disabled>
              Select industry
            </option>
            {INDUSTRIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="field col-2">
          <label htmlFor="preferred_timeframe">Preferred timeframe</label>
          <select
            id="preferred_timeframe"
            name="preferred_timeframe"
            defaultValue=""
            aria-label="Preferred timeframe"
          >
            <option value="" disabled>
              When would you like to meet?
            </option>
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="field col-2">
          <label htmlFor="message">What you’d like to see (optional)</label>
          <textarea
            id="message"
            name="message"
            placeholder="Team size, what you’d like the demo to focus on, any pilot timing."
          />
          {errors.message && <span className="err" role="alert">{errors.message}</span>}
        </div>

        {/* Honeypot — must remain empty */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field col-2">
          <label className="checkbox-row" htmlFor="consent">
            <input id="consent" name="consent" type="checkbox" required aria-required="true" />
            <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
              I agree that WelloWork may contact me to schedule this demo and store these details
              under its{" "}
              <a href="/legal/privacy" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                privacy policy
              </a>
              . (GDPR)
            </span>
          </label>
          {errors.consent && <span className="err" role="alert">{errors.consent}</span>}
        </div>
      </div>

      {globalError && (
        <p role="alert" style={{ marginTop: 14, fontSize: 13.5, color: "#b91c1c" }}>
          {globalError}
        </p>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "submitting"}
          aria-disabled={status === "submitting"}
          style={{ opacity: status === "submitting" ? 0.7 : 1, cursor: "pointer" }}
        >
          {status === "submitting" ? "Sending…" : "Request a demo time"} <ArrowRight size={14} />
        </button>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          Your details are stored in the EU. No marketing without opt-in.
        </span>
      </div>
    </form>
  );
}
