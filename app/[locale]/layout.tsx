import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/lib/site";
import type { AppLocale } from "@/i18n/locales";
import { LocaleSuggestionBanner } from "@/app/components/LocaleSuggestionBanner";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-italic-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Pre-render the enabled locales at build time (static rendering).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const loc: AppLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  // Default (home / x-default) metadata. Brand name "WelloWork" stays
  // untranslated in the title. Sub-pages override with their own buildMetadata.
  const t = await getTranslations({ locale: loc, namespace: "metadata" });
  return buildMetadata({
    locale: loc,
    path: "/",
    title: t("home.title"),
    description: t("home.description"),
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // URL is the single source of truth — an unknown/disabled locale 404s.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    // data-scroll-behavior lets Next override globals.css `scroll-behavior: smooth`
    // during SPA navigation (Next 16). All current locales are LTR; `dir` can be
    // added per-locale later without refactor.
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${inter.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <div className="locale-banner-dock">
            <LocaleSuggestionBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
