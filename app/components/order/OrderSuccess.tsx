import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Icon } from "../Icons";
import { getStripeClient } from "@/app/lib/stripe";
import { getSupabaseServerClient } from "@/app/lib/supabase";
import { formatEur } from "@/app/lib/format";

/**
 * Renders the post-Checkout confirmation. This is DISPLAY ONLY: fulfillment
 * (marking the order `paid`, calling onOrderPaid) happens exclusively in
 * app/api/stripe/webhook/route.ts. This component may be rendered before that
 * webhook lands, so it treats Stripe's own `payment_status` on the retrieved
 * Checkout Session as the source of truth for what to show — never writes
 * anything to the database.
 */
export async function OrderSuccess({
  sessionId,
  mockOrderId,
  locale,
}: {
  sessionId: string | undefined;
  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
  mockOrderId: string | undefined;
  locale: string;
}) {
  const t = await getTranslations("cognitiveRewardsOrder.success");

  const card = (children: React.ReactNode) => (
    <div
      className="glass-strong"
      style={{ padding: "32px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}
    >
      {children}
    </div>
  );

  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
  // Display-only, same as the Stripe path below: looks up an order already
  // marked 'mock_paid' by app/api/orders/[orderId]/checkout/route.ts. Never
  // writes to the database, never touches Stripe.
  if (mockOrderId) {
    const supabase = getSupabaseServerClient();
    const order = supabase
      ? (await supabase.from("cognitive_rewards_orders").select("*").eq("id", mockOrderId).maybeSingle()).data
      : null;

    if (!order || order.payment_provider !== "mock" || order.status !== "mock_paid") {
      return card(<MissingState t={t} />);
    }

    return card(
      <PaidState
        t={t}
        orderRef={order.mock_reference}
        teamSize={order.team_size}
        gameFee={Number(order.game_fee)}
        rewardPool={Number(order.reward_pool)}
        tax={Number(order.vat_amount)}
        total={Number(order.total)}
        locale={locale}
      />
    );
  }

  if (!sessionId) {
    return card(<MissingState t={t} />);
  }

  const stripe = getStripeClient();
  if (!stripe) {
    console.error("[order-success] Stripe not configured — cannot retrieve session", sessionId);
    return card(<ProcessingState t={t} sessionId={sessionId} />);
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("[order-success] failed to retrieve checkout session", sessionId, err);
    return card(<MissingState t={t} />);
  }

  const orderId = session.metadata?.orderId ?? null;
  const paid = session.payment_status === "paid";

  const supabase = getSupabaseServerClient();
  const order =
    orderId && supabase
      ? (await supabase.from("cognitive_rewards_orders").select("*").eq("id", orderId).maybeSingle()).data
      : null;

  if (!paid) {
    return card(<ProcessingState t={t} orderId={orderId} sessionId={sessionId} />);
  }

  const taxCents = session.total_details?.amount_tax ?? 0;
  const totalCents = session.amount_total ?? 0;
  const gameFee = order?.game_fee != null ? Number(order.game_fee) : null;
  const rewardPool = order?.reward_pool != null ? Number(order.reward_pool) : null;
  const teamSize = order?.team_size ?? null;

  return card(
    <PaidState
      t={t}
      orderRef={orderId}
      teamSize={teamSize}
      gameFee={gameFee}
      rewardPool={rewardPool}
      tax={taxCents / 100}
      total={totalCents / 100}
      locale={locale}
    />
  );
}

type T = Awaited<ReturnType<typeof getTranslations>>;

function PaidState({
  t,
  orderRef,
  teamSize,
  gameFee,
  rewardPool,
  tax,
  total,
  locale,
}: {
  t: T;
  orderRef: string | null;
  teamSize: number | null;
  gameFee: number | null;
  rewardPool: number | null;
  tax: number;
  total: number;
  locale: string;
}) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="check" size={22} />
        <h2 className="h-card" style={{ margin: 0, fontSize: 20 }}>
          {t("paidHeading")}
        </h2>
      </div>
      <p className="body" style={{ margin: 0 }}>
        {t("paidBody")}
      </p>

      {orderRef && (
        <div>
          <span className="small">{t("orderReference")}</span>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, color: "var(--ink-2)" }}>
            {orderRef}
          </div>
        </div>
      )}

      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(15,29,69,0.08)",
        }}
      >
        <h3 className="h-card" style={{ margin: "0 0 12px", fontSize: 16 }}>
          {t("summaryHeading")}
        </h3>
        {gameFee != null && (
          <div className="order-summary-row">
            <span>{teamSize ? t("summary.gameFee", { size: teamSize }) : t("summary.gameFeeGeneric")}</span>
            <span>{formatEur(gameFee, locale)}</span>
          </div>
        )}
        {rewardPool != null && (
          <div className="order-summary-row">
            <span>{t("summary.rewardPool")}</span>
            <span>{formatEur(rewardPool, locale)}</span>
          </div>
        )}
        <div className="order-summary-row">
          <span>{t("summary.tax")}</span>
          <span>{formatEur(tax, locale)}</span>
        </div>
        <div className="order-summary-row total">
          <span>{t("summary.total")}</span>
          <span>{formatEur(total, locale)}</span>
        </div>
      </div>

      <Link href="/cognitive-rewards" className="btn btn-glass" style={{ alignSelf: "flex-start" }}>
        {t("backHome")} <ArrowRight size={14} />
      </Link>
    </>
  );
}

function MissingState({ t }: { t: T }) {
  return (
    <>
      <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 20 }}>
        {t("missingHeading")}
      </h2>
      <p className="body" style={{ margin: "0 0 20px" }}>
        {t("missingBody")}
      </p>
      <Link href="/cognitive-rewards/order" className="btn btn-primary" style={{ background: "var(--navy)" }}>
        {t("startNew")} <ArrowRight size={14} />
      </Link>
    </>
  );
}

function ProcessingState({ t, orderId, sessionId }: { t: T; orderId?: string | null; sessionId?: string }) {
  return (
    <>
      <h2 className="h-card" style={{ margin: "0 0 8px", fontSize: 20 }}>
        {t("processingHeading")}
      </h2>
      <p className="body" style={{ margin: "0 0 20px" }}>
        {t("processingBody")}
      </p>
      {orderId && (
        <div style={{ marginBottom: 20 }}>
          <span className="small">{t("orderReference")}</span>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, color: "var(--ink-2)" }}>
            {orderId}
          </div>
        </div>
      )}
      <Link
        href={sessionId ? `/cognitive-rewards/order/success?session_id=${encodeURIComponent(sessionId)}` : "/cognitive-rewards/order"}
        className="btn btn-glass"
        style={{ alignSelf: "flex-start" }}
      >
        {t("refresh")}
      </Link>
    </>
  );
}
