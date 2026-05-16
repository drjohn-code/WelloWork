import Link from "next/link";
import { ORG_EMAIL } from "../lib/site";

/* ---------- Hero: floating "intro email" card mock-up ---------- */

export function IntroCard() {
  return (
    <div className="careers-intro-card glass">
      <span className="careers-intro-read" aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Read
      </span>

      <div className="careers-intro-header">
        <div className="careers-intro-avatar" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="3.2" stroke="white" strokeWidth="1.6" />
            <path
              d="M5 20c0-3 3-5 7-5s7 2 7 5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="careers-intro-name">Lena K.</div>
          <div className="careers-intro-role">Product Designer</div>
        </div>
      </div>

      <div className="careers-intro-meta" aria-hidden="true">
        <span className="careers-intro-meta-key">Subject</span>
        <span className="careers-intro-meta-val">Hello from Berlin — would love to introduce myself</span>
      </div>

      <div className="careers-intro-body">
        <p>
          <em>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. I've been
            following WelloWork's methodology notes for a while and wanted to
            send a short hello.
          </em>
        </p>
        <p>
          <em>
            Sed do eiusmod tempor incididunt ut labore — happy to share work
            samples and walk through how I'd approach a pilot onboarding flow.
          </em>
        </p>
      </div>

      <div className="careers-intro-tags">
        <span className="careers-intro-tag">
          Portfolio <span aria-hidden="true">↗</span>
        </span>
        <span className="careers-intro-tag">
          GitHub <span aria-hidden="true">↗</span>
        </span>
        <span className="careers-intro-tag">
          Case study <span aria-hidden="true">↗</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Role cards (2×2 grid) ---------- */

function RoleIcon({ name }: { name: "engineer" | "designer" | "researcher" | "sales" }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  if (name === "engineer") {
    // Terminal prompt
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.7" />
        <path
          d="M7 10l3 2-3 2M12 14h5"
          stroke="var(--accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "designer") {
    // Type specimen / grid + letter
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M3.5 9h17M9 3.5v17" stroke="var(--accent)" strokeWidth="1.2" opacity="0.5" />
        <path
          d="M12.5 18V12.5h3M12.5 15.2h2.4"
          stroke="var(--primary)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "researcher") {
    // Bell curve
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M3 19h18"
          stroke="var(--ink-3)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M3 19 C 7 19 8 6 12 6 C 16 6 17 19 21 19"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="12" cy="6" r="1.6" fill="var(--accent)" />
      </svg>
    );
  }
  // sales — handshake / two arrows meeting
  return (
    <svg {...common} aria-hidden="true">
      <path
        d="M3 10l4-4 4 4 -3 3 5 5 3-3 4 4"
        stroke="var(--accent)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 13l2-2M14 16l2-2"
        stroke="var(--primary)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RoleCards() {
  const cards: Array<{
    icon: "engineer" | "designer" | "researcher" | "sales";
    label: string;
    desc: string;
  }> = [
    {
      icon: "engineer",
      label: "Engineers",
      desc: "Shipped product, not only frameworks.",
    },
    {
      icon: "designer",
      label: "Designers",
      desc: "Evidence-based product with opinions on type and motion.",
    },
    {
      icon: "researcher",
      label: "Researchers",
      desc: "Cognitive science or quantitative psychology — methodology notes that hold up.",
    },
    {
      icon: "sales",
      label: "Sales & CS",
      desc: "Ran pilots end-to-end at small, careful B2B companies.",
    },
  ];
  return (
    <div className="careers-role-grid">
      {cards.map((c) => (
        <div key={c.label} className="careers-role-card">
          <div className="careers-role-icon">
            <RoleIcon name={c.icon} />
          </div>
          <div className="careers-role-label">{c.label}</div>
          <div className="careers-role-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Hiring process step-flow ---------- */

function StepIcon({ name }: { name: "mail" | "chat" | "clipboard" | "team" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  const stroke = "white";
  if (name === "mail") {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="13" rx="2" stroke={stroke} strokeWidth="1.8" />
        <path d="M4 7l8 6 8-6" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "chat") {
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M4 5h16v11H9l-5 4V5z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="10.5" r="1" fill={stroke} />
        <circle cx="13" cy="10.5" r="1" fill={stroke} />
        <circle cx="17" cy="10.5" r="1" fill={stroke} />
      </svg>
    );
  }
  if (name === "clipboard") {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="5" y="5" width="14" height="16" rx="2" stroke={stroke} strokeWidth="1.8" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={stroke} strokeWidth="1.8" />
        <path d="M8 12h8M8 16h5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  // team
  return (
    <svg {...common} aria-hidden="true">
      <circle cx="8" cy="9" r="2.6" stroke={stroke} strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2.6" stroke={stroke} strokeWidth="1.8" />
      <path
        d="M3 19c0-2.5 2-4 5-4s5 1.5 5 4M11 19c0-2.5 2-4 5-4s5 1.5 5 4"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HiringFlow() {
  const steps: Array<{
    icon: "mail" | "chat" | "clipboard" | "team";
    label: string;
    note: string;
  }> = [
    { icon: "mail", label: "Intro email", note: "Low bar — no CV needed" },
    { icon: "chat", label: "Conversation", note: "~30 min, no prep" },
    { icon: "clipboard", label: "Work sample", note: "Tied to the actual role" },
    { icon: "team", label: "Paid trial day", note: "You meet the whole team" },
  ];
  return (
    <div className="careers-flow">
      <div className="careers-flow-line" aria-hidden="true" />
      <ol className="careers-flow-steps">
        {steps.map((s, i) => (
          <li key={s.label} className="careers-flow-step">
            <div className="careers-flow-dot">
              <StepIcon name={s.icon} />
            </div>
            <div className="careers-flow-stage">Stage {i + 1}</div>
            <div className="careers-flow-label">{s.label}</div>
            <div className="careers-flow-note">{s.note}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Working norms — three-item row ---------- */

function NormIcon({ name }: { name: "write" | "remote" | "public" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
  } as const;
  if (name === "write") {
    return (
      <svg {...common} aria-hidden="true">
        <path
          d="M4 20h4l11-11-4-4L4 16v4z"
          stroke="var(--accent)"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M14 6l4 4" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "remote") {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="var(--accent)" strokeWidth="1.7" />
        <path
          d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  // public
  return (
    <svg {...common} aria-hidden="true">
      <path
        d="M4 5h12a3 3 0 013 3v11H7a3 3 0 01-3-3V5z"
        stroke="var(--accent)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M7 9h8M7 13h6" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function WorkingNorms() {
  const items: Array<{
    icon: "write" | "remote" | "public";
    label: string;
    note: string;
  }> = [
    {
      icon: "write",
      label: "Written-first",
      note: "We default to writing things down before we talk them out.",
    },
    {
      icon: "remote",
      label: "Remote-friendly EU/UK",
      note: "Uppsala-anchored, distributed across the EU and UK.",
    },
    {
      icon: "public",
      label: "Public methodology",
      note: "We publish our methods — which keeps us honest.",
    },
  ];
  return (
    <div className="careers-norms-grid">
      {items.map((n) => (
        <div key={n.label} className="careers-norm-card">
          <div className="careers-norm-icon">
            <NormIcon name={n.icon} />
          </div>
          <div className="careers-norm-label">{n.label}</div>
          <div className="careers-norm-note">{n.note}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Reach-out CTA tiles ---------- */

export function ReachOutTiles() {
  return (
    <div className="careers-reach-grid">
      <a className="careers-reach-tile" href={`mailto:${ORG_EMAIL}`}>
        <div className="careers-reach-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3.5" y="6" width="17" height="13" rx="2" stroke="var(--accent)" strokeWidth="1.7" />
            <path d="M4 7l8 6 8-6" stroke="var(--accent)" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="careers-reach-label">Email us</div>
        <div className="careers-reach-chip">
          <span>{ORG_EMAIL}</span>
          <span className="careers-reach-chip-copy" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
        </div>
      </a>

      <Link className="careers-reach-tile" href="/contact">
        <div className="careers-reach-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5h12a3 3 0 013 3v11H7a3 3 0 01-3-3V5z"
              stroke="var(--accent)"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path d="M7 9h8M7 13h5" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
        <div className="careers-reach-label">
          Use the contact form{" "}
          <span aria-hidden="true" className="careers-reach-arrow">→</span>
        </div>
        <div className="careers-reach-sub">
          No CV needed — a paragraph is enough at the intro stage.
        </div>
      </Link>
    </div>
  );
}
