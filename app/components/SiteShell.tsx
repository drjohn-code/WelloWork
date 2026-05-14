import { Header } from "./Header";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-bg" />
      <Header />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
