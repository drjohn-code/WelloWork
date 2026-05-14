import { Reveal } from "./Reveal";

export function ProseSection({
  answer,
  children,
  sidebar,
}: {
  answer?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 24 }}>
      <div className="container">
        {answer && (
          <Reveal>
            <div className="answer-block" style={{ maxWidth: "70ch" }}>
              {answer}
            </div>
          </Reveal>
        )}
        <div
          style={{
            marginTop: answer ? 48 : 0,
            display: "grid",
            gridTemplateColumns: sidebar ? "1.1fr 1fr" : "minmax(0, 70ch)",
            gap: 48,
            alignItems: "start",
          }}
          className="hero-grid"
        >
          <div className="prose">{children}</div>
          {sidebar && <Reveal delay={1}><div>{sidebar}</div></Reveal>}
        </div>
      </div>
    </section>
  );
}
