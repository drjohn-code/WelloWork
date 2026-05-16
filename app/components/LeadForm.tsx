"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "./Icons";
import { COMPANY_SIZES, INDUSTRIES } from "../lib/validation";

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
      setGlobalError("Network error. Please try again.");
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
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" required autoComplete="name" />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="work_email">Work email</label>
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
          <label htmlFor="company">Company {companyRequired ? "" : "(optional)"}</label>
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
          <label htmlFor="company_size">Company size</label>
          <select id="company_size" name="company_size" defaultValue="">
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
          <label htmlFor="role">Your role</label>
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
          <select id="industry" name="industry" defaultValue="">
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
          <label htmlFor="message">
            Message {messageRequired ? "" : "(optional)"}
          </label>
          <textarea
            id="message"
            name="message"
            required={messageRequired}
            placeholder="Tell us about your pilot plans, headcount, and what you'd like to see in the demo."
          />
          {errors.message && <span className="err">{errors.message}</span>}
        </div>

        {/* Honeypot — must remain empty */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field col-2">
          <label className="checkbox-row" htmlFor="consent">
            <input id="consent" name="consent" type="checkbox" required />
            <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
              I agree that WelloWork may contact me about this enquiry and store these
              details under its{" "}
              <a href="/legal#privacy" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                privacy policy
              </a>
              .
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
          {status === "submitting" ? "Sending…" : submitLabel} <ArrowRight size={14} />
        </button>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          Your details are stored in the EU. No marketing without opt-in.
        </span>
      </div>
    </form>
  );
}
