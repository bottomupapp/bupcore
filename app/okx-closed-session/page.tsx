export default function OkxClosedSession() {
  const stamp = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <span className="okx-mark">OKX</span>
            <span className="x">×</span>
            <span>BOTTOMUP</span>
          </div>
          <div className="stamp">
            <span className="dot" /> CLOSED SESSION <span className="clock">— {stamp}</span>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="shell">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">Private briefing · For OKX leadership</div>
                <h1 className="display hero-headline">
                  The App Store<br />
                  of Smart Money,<br />
                  <span className="acid">routed into OKX.</span>
                </h1>
                <p className="hero-sub">
                  BottomUP turns Turkey&apos;s top traders, algo builders and AI agent
                  creators into a recurring revenue funnel for OKX Global. Three
                  products, one wallet integration, one referral graph, three
                  revenue lines &mdash; sold to creators who already have the audience.
                </p>
              </div>

              <aside className="hero-meta">
                <div className="meta-row">
                  <span className="k">Session</span>
                  <span className="v">OKX × BottomUP, closed door</span>
                </div>
                <div className="meta-row">
                  <span className="k">Asking</span>
                  <span className="v">Wallet + referral + co-marketing</span>
                </div>
                <div className="meta-row">
                  <span className="k">Live</span>
                  <span className="v">
                    <span className="acid">bottomup.app/analyst</span> &middot; 2.2.1 in stores
                  </span>
                </div>
                <div className="meta-row">
                  <span className="k">Stack</span>
                  <span className="v">Mobile (iOS+Android), Studio web, Foxy ML core</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section>
          <div className="shell">
            <div className="eyebrow">The opportunity in one strip</div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: "10px 0 36px" }}>
              Turkey ships traders. OKX needs volume.
            </h2>
            <div className="stat-strip">
              <div>
                <div className="k">Local creator pool</div>
                <div className="v">8K+</div>
                <div className="sub">Turkish traders, algo &amp; AI builders mapped on BottomUP</div>
              </div>
              <div>
                <div className="k">Mobile install base</div>
                <div className="v">2.2.1</div>
                <div className="sub">iOS + Play, live across 10 locales</div>
              </div>
              <div>
                <div className="k">Rev-share to OKX</div>
                <div className="v">30%</div>
                <div className="sub">on marketplace + 30% on referral trading volume</div>
              </div>
              <div>
                <div className="k">Time to wire</div>
                <div className="v">≤ 6 wk</div>
                <div className="sub">OKX Wallet auto-trade + referral attribution</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT 1 — TRADER MARKETPLACE */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div>
                <div className="sec-num">01 / 03</div>
                <h2 className="display">Trader<br />Marketplace.</h2>
              </div>
              <div className="eyebrow">Storefront for algo, AI agents, signals &amp; communities</div>
            </div>

            <div className="product">
              <div className="lhs">
                <span className="tag">Product 01</span>
                <h3>The Store</h3>
                <p className="one-liner">
                  Traders, algo bot builders and AI agent makers list their crypto
                  and TradFi products. They set the price. We do payments,
                  discovery, fraud, payouts. They get an audience that already
                  trades on OKX.
                </p>
              </div>

              <div className="rhs">
                <div className="split">
                  <div>
                    <div className="k">Creator take</div>
                    <div className="v">70%</div>
                    <div className="sub">of every sale &mdash; price is theirs to set</div>
                  </div>
                  <div>
                    <div className="k">Platform take</div>
                    <div className="v">30%</div>
                    <div className="sub">BottomUP &amp; OKX revenue line</div>
                  </div>
                </div>

                <div className="pcard">
                  <h4>Built-in ad inventory creators buy from us</h4>
                  <p>
                    Featured slots in product listings, push and email blasts to
                    all users or targeted cohorts, in-app banner placements,
                    community spotlights. <strong>Creators pay BottomUP to reach
                    BottomUP users</strong> &mdash; a second revenue line on top of the
                    marketplace cut.
                  </p>
                </div>

                <div className="pcard">
                  <h4>Communities, listed and shoppable</h4>
                  <p>
                    Whole trading communities can be listed alongside individual
                    creators. Buyers unlock every trader inside, with full
                    performance metrics, and choose who to follow. Communities
                    that bring their own referral graph pay BottomUP a monthly
                    invoice instead of revenue-sharing &mdash; they pick the model.
                  </p>
                </div>

                <div className="pcard">
                  <h4>OKX Wallet → auto-trade</h4>
                  <p>
                    Users connect their <strong>OKX wallet</strong> and the products
                    they bought execute autonomously. <strong>70% of trading volume
                    from BottomUP-referred users goes to creators; 30% to
                    BottomUP&apos;s line with OKX.</strong> Volume becomes a recurring
                    rail, not a one-shot purchase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT 2 — SOCIAL+ */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div>
                <div className="sec-num">02 / 03</div>
                <h2 className="display">Social<span className="acid">+</span></h2>
              </div>
              <div className="eyebrow">A native home for human traders &amp; their followers</div>
            </div>

            <div className="product">
              <div className="lhs">
                <span className="tag">Product 02</span>
                <h3>Kill the<br />Telegram tax.</h3>
                <p className="one-liner">
                  Human traders shouldn&apos;t herd their audience through Telegram
                  and Discord rooms they don&apos;t own. Social+ is a free chat,
                  content and live-trading surface where the trader, their feed
                  and their store live in the same product.
                </p>
              </div>

              <div className="rhs">
                <div className="pcard">
                  <h4>One platform, every format</h4>
                  <p>
                    Open a channel for any subject &mdash; spot crypto, futures,
                    equities, FX, macro. Followers see daily market videos,
                    shorts, live trading sessions, education sets, scheduled
                    streams &mdash; <strong>all in the same feed as the chat</strong>.
                  </p>
                </div>
                <div className="pcard">
                  <h4>Buyers see the trades, live</h4>
                  <p>
                    Users who own a trader from the marketplace get the trader&apos;s
                    positions piped into Social+ in real-time. No more screenshots
                    of TradingView in a paid Telegram group &mdash; the position,
                    the chat and the auto-trade execution sit on one screen.
                  </p>
                </div>
                <div className="pcard">
                  <h4>Push the moment, not the message</h4>
                  <p>
                    Traders go live &rarr; followers get a push. New education
                    drop &rarr; push. Scheduled stream in 10 minutes &rarr; push.
                    Engagement isn&apos;t a Telegram broadcast; it&apos;s a real
                    notification channel BottomUP owns.
                  </p>
                </div>
                <div className="pcard">
                  <h4>Speak Turkish, read Chinese, sell to everyone</h4>
                  <p>
                    Every message, post and caption is auto-translated by our AI
                    layer. A trader writes in Turkish; followers in Brazil,
                    Indonesia, the UAE read it natively. <strong>OKX Global&apos;s
                    geographic surface, addressable from one keyboard.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT 3 — FOXY */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div>
                <div className="sec-num">03 / 03</div>
                <h2 className="display">Foxy.</h2>
              </div>
              <div className="eyebrow">AI co-pilot &amp; risk supervisor for every trade on the platform</div>
            </div>

            <div className="product">
              <div className="lhs">
                <span className="tag">Product 03</span>
                <h3>The shield<br />on the trade.</h3>
                <p className="one-liner">
                  Foxy ingests exchange feeds, on-chain intelligence, derivatives
                  positioning, macro calendar and ML-derived signals &mdash; then
                  sits next to the creator when they post a trade. It scores risk,
                  warns on tail events, and optimises take-profit and stop levels
                  on positions already open.
                </p>
              </div>

              <div className="rhs">
                <div className="pcard">
                  <h4>Data fabric</h4>
                  <p style={{ marginBottom: 14 }}>
                    Real-time and historical, blended into one feature store:
                  </p>
                  <div className="sources">
                    <span>OKX API</span>
                    <span>Binance API</span>
                    <span>Arkham</span>
                    <span>Coinglass</span>
                    <span>CoinGecko</span>
                    <span>US 10Y · ETFs · JP CPI</span>
                  </div>
                </div>

                <div className="pcard">
                  <h4>Creator-side risk score</h4>
                  <p>
                    Before a creator shares a trade with their buyers, Foxy
                    computes a risk score. <strong>&ldquo;Trump speaks in 4 hours
                    &mdash; widen your stop, halve your size, or skip the
                    trade.&rdquo;</strong> Macro-aware. Correlation-aware. Trained on
                    cross-asset history, not just last week&apos;s candles.
                  </p>
                </div>

                <div className="pcard">
                  <h4>TP / SL optimisation on open positions</h4>
                  <p>
                    For trades already live, Foxy keeps optimising take-profit
                    and stop-loss as conditions change &mdash; suggesting
                    adjustments to the creator and, with consent, pushing them
                    into the OKX-connected auto-trade rail.
                  </p>
                </div>

                <div className="pcard">
                  <h4>Why this matters to OKX</h4>
                  <p>
                    Better creator risk &rarr; lower buyer churn &rarr; longer
                    auto-trade lifetime &rarr; <strong>more sustained volume on
                    OKX</strong>. Foxy is the difference between a viral creator
                    cohort and a durable one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATION ASK */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div>
                <div className="sec-num">∎</div>
                <h2 className="display">What we&apos;re<br />asking OKX for.</h2>
              </div>
              <div className="eyebrow">Three concrete asks &mdash; technical, commercial, distribution</div>
            </div>

            <div className="ask">
              <div className="ask-card">
                <div className="num">01</div>
                <h4>OKX Wallet auto-trade rail</h4>
                <p>
                  A green-lit integration so BottomUP users can connect their OKX
                  wallet once and let bought products execute on their account.
                  This is the single largest unlock &mdash; without it, Trader
                  Marketplace is a content store; with it, it&apos;s a recurring
                  volume engine.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">02</div>
                <h4>Referral attribution &amp; rev share</h4>
                <p>
                  BottomUP-referred users tagged at signup, with a clean reporting
                  feed. <strong>70% of fee revenue to the creator, 30% to OKX &amp;
                  BottomUP&apos;s shared line.</strong> Communities that bring their own
                  referral can opt into a monthly invoice model instead.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">03</div>
                <h4>Co-marketing into OKX Global geos</h4>
                <p>
                  Turkey&apos;s creator pipeline is real &mdash; the audience is in
                  every OKX Global market. A joint launch (push, in-app, social,
                  PR) plugs Turkish algo and AI-agent makers directly into LATAM,
                  MENA, SEA and CIS user bases on day one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderBottom: 0 }}>
          <div className="shell">
            <div className="cta-strip">
              <div>
                <h3>Next step: wire the wallet,<br />ship a pilot cohort.</h3>
                <p>
                  We propose a 30-creator pilot &mdash; the top Turkish traders
                  already on BottomUP &mdash; with the OKX wallet rail live and
                  referral attribution on. Measurable in weekly volume, not
                  vanity metrics.
                </p>
              </div>
              <div className="row">
                <span className="pill solid">Discuss the pilot</span>
                <span className="pill">deniz@bottomup.app</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="foot">
          <div className="shell foot-row">
            <span>© BottomUP · OKX Closed Session</span>
            <span>This page is unindexed &middot; do not redistribute</span>
            <span>{stamp}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
