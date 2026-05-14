"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getCalApi } from "@calcom/embed-react";

const Cal = dynamic(() => import("@calcom/embed-react"), {
  ssr: false,
  loading: () => <CalSkeleton label="Loading calendar…" />,
});

const NAMESPACE = "wellowork-demo";

type CalcomEmbedProps = {
  calLink: string;
};

export function CalcomEmbed({ calLink }: CalcomEmbedProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

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

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (cancelled) return;
        cal("ui", {
          hideEventTypeDetails: false,
          theme: "light",
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#162B5C",
              "cal-bg": "#ffffff",
              "cal-bg-emphasis": "#E3EEF9",
              "cal-bg-muted": "#F4F7FE",
              "cal-bg-info": "#E3EEF9",
              "cal-text": "#1a1024",
              "cal-text-emphasis": "#162B5C",
              "cal-text-muted": "#6a5d77",
              "cal-border-emphasis": "#162B5C",
              "cal-border": "rgba(15,29,69,0.14)",
              "cal-border-subtle": "rgba(15,29,69,0.08)",
              "cal-border-booker": "rgba(15,29,69,0.08)",
            },
            dark: {
              "cal-brand": "#5C73FB",
              "cal-bg": "#0E1D45",
              "cal-bg-emphasis": "#162B5C",
              "cal-text": "#ffffff",
              "cal-text-emphasis": "#ffffff",
            },
          },
          styles: {
            branding: { brandColor: "#162B5C" },
          },
        });
      } catch (err) {
        // Surface to console only — page still works via the fallback render.
        console.warn("[calcom-embed] init failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <div
      ref={wrapperRef}
      className="calcom-frame"
      role="region"
      aria-label="Demo scheduler"
    >
      {inView ? (
        <Cal
          namespace={NAMESPACE}
          calLink={calLink}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{
            layout: "month_view",
            theme: "light",
          }}
        />
      ) : (
        <CalSkeleton label="Loading scheduler…" />
      )}
    </div>
  );
}

function CalSkeleton({ label }: { label: string }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        minHeight: 620,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: "rgba(255,255,255,0.7)",
        borderRadius: 24,
        border: "1px solid rgba(15,29,69,0.08)",
        color: "var(--ink-3)",
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
}
