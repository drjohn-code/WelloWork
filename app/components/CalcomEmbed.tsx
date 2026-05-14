"use client";

import { useEffect, useRef, useState } from "react";

const CAL_BASE_URL = "https://cal.eu";

type CalcomEmbedProps = {
  calLink: string;
};

function buildSrc(calLink: string): string {
  const trimmed = calLink.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${CAL_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
}

export function CalcomEmbed({ calLink }: CalcomEmbedProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = buildSrc(calLink);

  return (
    <div
      ref={wrapperRef}
      className="calcom-frame"
      role="region"
      aria-label="Demo scheduler"
    >
      {inView && (
        <iframe
          src={src}
          title="Schedule a WelloWork demo"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allow="camera; microphone; autoplay; encrypted-media; fullscreen; clipboard-write"
          style={{
            display: "block",
            width: "100%",
            minHeight: 600,
            height: 760,
            border: 0,
            background: "transparent",
            opacity: loaded ? 1 : 0,
            transition: "opacity .25s ease",
          }}
        />
      )}
      {!loaded && <CalSkeleton />}
    </div>
  );
}

function CalSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="cal-skeleton"
    >
      <div className="cal-skeleton-head">
        <div className="cal-skeleton-bar" style={{ width: "45%" }} />
        <div className="cal-skeleton-bar" style={{ width: "30%", opacity: 0.7 }} />
      </div>
      <div className="cal-skeleton-grid" aria-hidden="true">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="cal-skeleton-cell" />
        ))}
      </div>
      <div className="cal-skeleton-slots" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="cal-skeleton-slot" />
        ))}
      </div>
      <span className="sr-only">Loading scheduler…</span>
    </div>
  );
}
