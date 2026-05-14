import { Reveal } from "./Reveal";
import { Breadcrumbs } from "./Breadcrumbs";
import type { Crumb } from "../lib/site";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, lede, crumbs, children }: PageHeroProps) {
  return (
    <section style={{ paddingTop: 48, paddingBottom: 24 }}>
      <div className="container">
        <Reveal>
          <Breadcrumbs items={crumbs} />
        </Reveal>
        <Reveal delay={1}>
          <div style={{ marginTop: 18 }}>
            <span className="eyebrow">{eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h1
            className="h-section"
            style={{ margin: "10px 0 18px", maxWidth: "22ch", fontSize: "clamp(34px, 5vw, 58px)" }}
          >
            {title}
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="lede" style={{ margin: 0 }}>
            {lede}
          </p>
        </Reveal>
        {children && (
          <Reveal delay={3}>
            <div style={{ marginTop: 28 }}>{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
