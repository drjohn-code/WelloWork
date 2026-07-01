export function formatEur(amount: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `€${amount.toFixed(2)}`;
  }
}
