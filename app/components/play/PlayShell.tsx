import { Logo } from "../Logo";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { FloatingObjects } from "./PlayArt";

/** Focused shell for the player-facing game pages: brand + the player's own UI language, no marketing nav. */
export function PlayShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <div className="page-bg" />
      {!wide && <FloatingObjects />}
      <header className="play-top">
        <div className="container play-top-inner">
          <Logo size={28} />
          <LocaleSwitcher />
        </div>
      </header>
      <main id="main" className={`container play-main ${wide ? "admin-wide" : ""}`}>
        {children}
      </main>
    </>
  );
}
