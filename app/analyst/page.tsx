import Link from "next/link";
import {
  fetchAnalysts,
  type Analyst,
  type AnalystOrder,
} from "@/lib/bottomup-api";
import { TopBar, TickerTape } from "./v2/top-bar";
import { LiveAnalystTable } from "./v2/live-table";
import { fmtUsd } from "./v2/format";
import { resolveLocale, tFor, RTL_LOCALES, type Locale } from "./v2/i18n";

export const revalidate = 60;

const ORDER_OPTIONS: Array<{ value: AnalystOrder; labelKey: string }> = [
  { value: "monthly_pnl", labelKey: "sort30dPnl" },
  { value: "monthly_roi", labelKey: "sort30dRoi" },
  { value: "monthly_win_rate", labelKey: "sort30dWr" },
  { value: "win_rate", labelKey: "sortAllWr" },
  { value: "pnl", labelKey: "sortAllPnl" },
  { value: "followers", labelKey: "sortFollowers" },
  { value: "name", labelKey: "sortName" },
];

function isOrder(value: string | undefined): value is AnalystOrder {
  return ORDER_OPTIONS.some((o) => o.value === value);
}

function fullName(a: Analyst): string {
  if (a.name) return a.name;
  const real = [a.first_name, a.last_name].filter(Boolean).join(" ").trim();
  if (real) return real;
  if (a.referral_code) return a.referral_code;
  return "—";
}

export default async function AnalystListPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; lang?: string }>;
}) {
  const sp = await searchParams;
  const order: AnalystOrder = isOrder(sp.order) ? sp.order : "monthly_pnl";
  const locale: Locale = resolveLocale(sp.lang);
  const t = tFor(locale);

  let analysts: Analyst[] = [];
  let error: string | null = null;
  try {
    // 90-day activity gate: hide traders dormant for 3+ months so the
    // public list doesn't surface stale or never-traded profiles.
    analysts = await fetchAnalysts(60, order, 90);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const tape = [
    { k: t("analystsTitle"), v: analysts.length.toString(), up: true },
    {
      k: "TOP",
      v: analysts[0]
        ? `${fullName(analysts[0])} ${fmtUsd(analysts[0].stats.monthly_pnl, { sign: true, compact: true })}`
        : "—",
      up: true,
    },
    { k: "BOTTOMUP", v: t("live"), up: true },
  ];

  const langSuffix = locale === "en" ? "" : `&lang=${locale}`;
  const langOnlySuffix = locale === "en" ? "" : `?lang=${locale}`;

  return (
    <div dir={RTL_LOCALES.has(locale) ? "rtl" : "ltr"}>
      <TopBar crumb={`/ ${t("analystsTitle")}`} locale={locale} />
      <TickerTape items={tape} />

      <main className="list-main">
        <section style={{ maxWidth: 900 }}>
          <div className="eyebrow" style={{ color: "var(--ink-3)" }}>
            // BOTTOMUP_TERMINAL · {t("analystIndex")}
          </div>
          <h1 className="display list-headline">
            {t("analystsTitle")}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-2)",
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            {t("analystListTagline")}
          </p>
        </section>

        {/* sort row */}
        <section style={{ marginTop: 32 }}>
          <div
            className="eyebrow"
            style={{
              marginBottom: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span>// {t("sortBy")}</span>
            <span style={{ color: "var(--ink-4)" }}>
              {analysts.length} {t("rowsDesc")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 0,
              border: "1px solid var(--line-2)",
              flexWrap: "wrap",
            }}
          >
            {ORDER_OPTIONS.map((o, i) => {
              const active = o.value === order;
              const href =
                o.value === "monthly_pnl"
                  ? `/analyst${langOnlySuffix}`
                  : `/analyst?order=${o.value}${langSuffix}`;
              return (
                <Link
                  key={o.value}
                  href={href}
                  style={{
                    padding: "10px 16px",
                    background: active ? "var(--acid)" : "transparent",
                    color: active ? "var(--bg)" : "var(--ink-3)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    borderRight:
                      i < ORDER_OPTIONS.length - 1 ? "1px solid var(--line-2)" : "none",
                  }}
                >
                  {t(o.labelKey as never)}
                </Link>
              );
            })}
          </div>
        </section>

        {error ? (
          <div
            style={{
              marginTop: 24,
              border: "1px solid var(--warn)",
              padding: "20px 24px",
              background: "var(--bg-2)",
              fontSize: 13,
              color: "var(--ink-2)",
            }}
          >
            <div className="eyebrow" style={{ color: "var(--warn)", marginBottom: 8 }}>
              {t("fetchError")}
            </div>
            {error}
          </div>
        ) : analysts.length === 0 ? (
          <div
            style={{
              marginTop: 24,
              padding: 32,
              border: "1px solid var(--line-2)",
              background: "var(--bg-2)",
              color: "var(--ink-3)",
              fontSize: 12,
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            {t("noAnalysts")}
          </div>
        ) : (
          <div style={{ marginTop: 24 }}>
            <LiveAnalystTable initial={analysts} order={order} locale={locale} />
          </div>
        )}

        <footer
          className="list-footer"
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid var(--line-2)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: ".06em",
          }}
        >
          <div>© {new Date().getFullYear()} BOTTOMUP</div>
          <div className="list-footer-meta" style={{ maxWidth: 600, textAlign: "right" }}>
            {t("virtualTrackRecord").replace(/ /g, "_")} · NOT_FINANCIAL_ADVICE · PAST_PERFORMANCE_≠_FUTURE_RESULTS
          </div>
        </footer>
      </main>
    </div>
  );
}
