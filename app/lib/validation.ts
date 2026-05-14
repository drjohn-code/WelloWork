export const COMPANY_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1000",
  "1000+",
] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const INDUSTRIES = [
  "Software & Technology",
  "Financial services",
  "Healthcare",
  "Manufacturing",
  "Retail & E-commerce",
  "Professional services",
  "Public sector",
  "Education",
  "Energy & Utilities",
  "Other",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

export function isWorkEmail(email: string): boolean {
  if (!EMAIL_RE.test(email)) return false;
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return !FREE_EMAIL_DOMAINS.has(domain);
}

export function isEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export type FormErrors = Record<string, string>;

export type DemoRequestPayload = {
  name: string;
  work_email: string;
  company: string;
  company_size: string | null;
  role: string | null;
  industry: string | null;
  message: string | null;
  consent: boolean;
};

export type ContactPayload = {
  name: string;
  work_email: string;
  company: string | null;
  company_size: string | null;
  role: string | null;
  industry: string | null;
  message: string;
  consent: boolean;
};

const MAX_LEN = 2000;

function clean(v: FormDataEntryValue | null): string {
  if (v == null) return "";
  return String(v).trim().slice(0, MAX_LEN);
}

export function parseDemoRequest(form: FormData): { value: DemoRequestPayload; errors: FormErrors } {
  const value: DemoRequestPayload = {
    name: clean(form.get("name")),
    work_email: clean(form.get("work_email")).toLowerCase(),
    company: clean(form.get("company")),
    company_size: clean(form.get("company_size")) || null,
    role: clean(form.get("role")) || null,
    industry: clean(form.get("industry")) || null,
    message: clean(form.get("message")) || null,
    consent: form.get("consent") === "on" || form.get("consent") === "true",
  };
  const errors: FormErrors = {};
  if (value.name.length < 2) errors.name = "Please enter your full name.";
  if (!isEmail(value.work_email)) errors.work_email = "Please enter a valid email.";
  if (value.company.length < 2) errors.company = "Please enter your company.";
  if (!value.consent) errors.consent = "Please confirm consent to be contacted.";
  return { value, errors };
}

export function parseContact(form: FormData): { value: ContactPayload; errors: FormErrors } {
  const value: ContactPayload = {
    name: clean(form.get("name")),
    work_email: clean(form.get("work_email")).toLowerCase(),
    company: clean(form.get("company")) || null,
    company_size: clean(form.get("company_size")) || null,
    role: clean(form.get("role")) || null,
    industry: clean(form.get("industry")) || null,
    message: clean(form.get("message")),
    consent: form.get("consent") === "on" || form.get("consent") === "true",
  };
  const errors: FormErrors = {};
  if (value.name.length < 2) errors.name = "Please enter your full name.";
  if (!isEmail(value.work_email)) errors.work_email = "Please enter a valid email.";
  if (value.message.length < 4) errors.message = "Please add a short message.";
  if (!value.consent) errors.consent = "Please confirm consent to be contacted.";
  return { value, errors };
}
