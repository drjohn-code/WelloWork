export function LegalNotice() {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: "rgba(217, 119, 6, 0.08)",
        border: "1px solid rgba(217, 119, 6, 0.28)",
        color: "#92400e",
        fontSize: 13.5,
        lineHeight: 1.5,
        margin: "0 0 24px",
        maxWidth: "70ch",
      }}
    >
      <strong>Template — review with counsel before launch.</strong> This page is a starting
      template based on standard practice for GDPR-resident SaaS in Sweden and the wider EU.
      WelloWork has not yet had it reviewed by legal counsel and it should not be relied upon
      as the final policy in production.
    </div>
  );
}
