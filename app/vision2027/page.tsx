/* eslint-disable @next/next/no-img-element */
const BUP_LOGOMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogomark-color.png&w=64&q=75";
const BUP_WORDMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75";

export default function Vision2027() {
  const stamp = "November 2027";

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <img className="bup-word" src={BUP_WORDMARK} alt="BottomUP" />
          </div>
          <div className="host-stamp">
            <span className="label">
              <span className="dot" /> Vision 2027
            </span>
            <span className="sep" />
            <span className="label">Series A brief</span>
            <span className="sep" />
            <span className="label">{stamp}</span>
          </div>
        </div>
      </header>

      <main>
        {/* OPENER 1 */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">Series A brief</div>
            <h1 className="opener-display">
              When November 2027<br />
              <span className="opener-tail">arrives…</span>
            </h1>
          </div>
        </section>

        {/* OPENER 2 */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">Our 2027 annual revenue target</div>
            <h1 className="opener-display acid">$13.5M</h1>
            <p className="opener-sub">
              Annual revenue &middot; Series A round milestone
            </p>
          </div>
        </section>

        {/* OPENER 3 */}
        <section className="opener">
          <div className="shell">
            <h1 className="opener-display question">
              How will<br />
              <span className="acid">we get there?</span>
            </h1>
          </div>
        </section>

        {/* 01 / PERSONA */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">01 / Persona</div>
              <h2 className="display">Users.</h2>
              <div className="eyebrow">B2C and B2B. A distinct strategy for every segment.</div>
            </div>

            <h3 className="subhead">B2C</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Never used an exchange</h4>
                <p>
                  A user who&apos;s never opened an exchange account. KYC,
                  wallet and copy-trade in a single flow &mdash; their account
                  is live in five minutes.
                </p>
              </div>
              <div className="segment-card">
                <h4>Traditional investor</h4>
                <p>
                  Money parked in bank deposits, pension funds or mutual funds.
                  When they bridge from traditional instruments to crypto,
                  we&apos;re the safe gateway they&apos;re looking for.
                </p>
              </div>
              <div className="segment-card">
                <h4>High-net-worth</h4>
                <p>
                  Large-wallet user. White-glove onboarding, access to a
                  private creator list, dedicated risk monitoring.
                </p>
              </div>
              <div className="segment-card">
                <h4>Active retail trader</h4>
                <p>
                  Already on an exchange with their own setup. Gets an
                  additional edge through Foxy and the creator community on
                  top of their existing toolkit.
                </p>
              </div>
              <div className="segment-card">
                <h4>Following a creator</h4>
                <p>
                  Already watching a trader they like. Instead of waiting for
                  Telegram screenshots, opens the same position on BottomUP
                  with one tap.
                </p>
              </div>
              <div className="segment-card">
                <h4>Passive-income seeker</h4>
                <p>
                  Doesn&apos;t want to trade actively. Sets up a portfolio,
                  walks away; the 5%+ monthly average commitment keeps
                  running for them.
                </p>
              </div>
            </div>

            <h3 className="subhead">B2B</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Banks</h4>
                <p>
                  Foxy&apos;s risk + signal APIs for the trading desk and
                  private banking side. They offer copy-trading to their
                  clients on top of BottomUP&apos;s rails.
                </p>
              </div>
              <div className="segment-card">
                <h4>Hedge funds</h4>
                <p>
                  Foxy&apos;s data layer &mdash; Arkham, Coinglass, macro
                  calendar, ML signals &mdash; consumed directly as API.
                </p>
              </div>
              <div className="segment-card">
                <h4>Factoring firms</h4>
                <p>
                  Crypto receivables scoring, OTC settlement risk analytics,
                  on-chain counterparty monitoring. Plugged into their
                  existing workflows.
                </p>
              </div>
              <div className="segment-card">
                <h4>Brokerages</h4>
                <p>
                  White-label trader marketplace + social platform. Their
                  users get the BottomUP experience without ever seeing our
                  brand.
                </p>
              </div>
              <div className="segment-card">
                <h4>Wealth management firms</h4>
                <p>
                  They sell copy-trading as a service to their clients on top
                  of BottomUP. The curated creator pool and risk monitoring
                  come from us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / CREATOR */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">02 / Creator</div>
              <h2 className="display">Creators.</h2>
              <div className="eyebrow">Producers who sell on BottomUP &middot; 70% to them, 30% to the platform line</div>
            </div>

            <p className="lead">
              Anyone who lists their algo, AI agent, signal, education set or
              community for sale on BottomUP is a creator. They set the
              price; payments, discovery, fraud control and payouts are on
              us.
            </p>

            <div className="persona-grid">
              <div className="segment-card">
                <h4>Algo developers</h4>
                <p>
                  Mean-reversion, momentum, arbitrage. They package the
                  automated trading systems they&apos;ve built and sell them.
                </p>
              </div>
              <div className="segment-card">
                <h4>AI-agent makers</h4>
                <p>
                  LLM-based agents that decide autonomously. Open and close
                  positions inside the user&apos;s wallet via natural
                  language.
                </p>
              </div>
              <div className="segment-card">
                <h4>Human traders</h4>
                <p>
                  Manual traders who share their positions openly; followers
                  hook in directly through auto-copy.
                </p>
              </div>
              <div className="segment-card">
                <h4>Signal &amp; education creators</h4>
                <p>
                  Regular signal feeds, video education sets, subscription-based
                  premium content.
                </p>
              </div>
              <div className="segment-card">
                <h4>Community operators</h4>
                <p>
                  They list communities that host multiple traders. The buyer
                  takes the entire community as a single package.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / PRODUCT — Trader Marketplace */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Product · Trader Marketplace</div>
              <h2 className="display">Trader Marketplace.</h2>
              <div className="eyebrow">The store for algos, AI agents, signals and communities</div>
            </div>

            <p className="lead">
              Creators list their products and <strong>set their own
              price</strong>. Payments, discovery, payouts &mdash; all on us.
              In return, they reach an audience that already trades, across
              every market.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <div className="split">
                  <div>
                    <div className="k">Creator share</div>
                    <div className="v">70%</div>
                    <div className="sub">of every sale &mdash; their price</div>
                  </div>
                  <div>
                    <div className="k">Platform share</div>
                    <div className="v">30%</div>
                    <div className="sub">BottomUP line &mdash; shared with the exchange partner</div>
                  </div>
                </div>
              </div>

              <div className="pcard">
                <h4>Ad inventory</h4>
                <p>
                  Featured placement, push and email blasts, in-app banners,
                  community spots.{" "}
                  <strong>Creators pay BottomUP to reach BottomUP
                  users</strong> &mdash; a second revenue line on top of the
                  sales commission.
                </p>
              </div>

              <div className="pcard">
                <h4>Wallet → auto-trade</h4>
                <p>
                  The user connects their exchange wallet once; products they
                  bought run automatically in their account.{" "}
                  <strong>Of the volume driven by our referral, 70% goes to
                  the creator, 30% to the platform.</strong> Not a one-shot
                  sale, but a continuously earning revenue line.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / PRODUCT — Social+ */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Product · Social+</div>
              <h2 className="display">
                SOCIAL<span className="acid">+</span>
              </h2>
              <div className="eyebrow">The real home for traders and their followers</div>
            </div>

            <p className="lead">
              A trader shouldn&apos;t have to herd their followers through
              someone else&apos;s house &mdash; Telegram, Discord.{" "}
              <strong>Social+ is where chat, content and live trading sit
              on one screen.</strong>
            </p>

            <div className="pcards three">
              <div className="pcard">
                <h4>One platform, every format</h4>
                <p>
                  Spot, futures, equities, FX, macro &mdash; a channel for any
                  topic. Daily market videos, shorts, live sessions,
                  education sets, scheduled streams &mdash; <strong>all in
                  the same feed as the chat</strong>.
                </p>
              </div>
              <div className="pcard">
                <h4>Buyers watch the trade live</h4>
                <p>
                  A user who bought a trader from the marketplace watches
                  that trader&apos;s position in real time.{" "}
                  <strong>Position, chat and auto-trade on the same
                  screen.</strong>
                </p>
              </div>
              <div className="pcard">
                <h4>Every language, every country</h4>
                <p>
                  Messages, posts, captions &mdash; all translated by AI on
                  the fly. The creator writes in their own language, the
                  follower reads in theirs.{" "}
                  <strong>Every global market, reachable from a single
                  keyboard.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / PRODUCT — Foxy */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Product · Foxy</div>
              <h2 className="display">Foxy.</h2>
              <div className="eyebrow">The AI and risk assistant beside every trade on the platform</div>
            </div>

            <p className="lead">
              Foxy collapses exchange prices, on-chain data, derivatives
              positioning, the macro calendar and ML signals into{" "}
              <strong>a single data layer</strong>. Then it sits beside the
              creator when they share a trade, and behind the buyer when they
              take it.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <h4>One data layer &mdash; live + historical</h4>
                <div className="sources">
                  <span>Exchange APIs</span>
                  <span>Arkham</span>
                  <span>Coinglass</span>
                  <span>CoinGecko</span>
                  <span>Macro feeds</span>
                  <span>US 10Y · ETF · JP CPI</span>
                </div>
              </div>

              <div className="pcard">
                <h4>Risk score for the creator</h4>
                <p>
                  Before a creator publishes a trade, Foxy scores its risk.{" "}
                  <strong>&ldquo;Macro event in four hours. Widen your stop,
                  halve your size, or skip this one.&rdquo;</strong>{" "}
                  Macro- and correlation-aware. Trained on cross-asset
                  history, not just last week&apos;s candles.
                </p>
              </div>

              <div className="pcard">
                <h4>TP / SL adjustment on open positions</h4>
                <p>
                  While a position is open, Foxy recomputes TP and stop
                  levels as conditions shift; with consent it pushes the
                  adjustment into the wallet-connected auto-trade rail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / GROWTH */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">04 / Growth</div>
              <h2 className="display">From today to $13.5M.</h2>
              <div className="eyebrow">AAARRR funnel &middot; APAC &middot; LATAM &middot; MENA</div>
            </div>

            <h3 className="subhead">Today&apos;s footprint</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Trading volume</div>
                <div className="v">$1.56B</div>
                <div className="sub">All-time USDT routed onto our exchange partner via BottomUP referrals</div>
              </div>
              <div>
                <div className="k">Commission paid back</div>
                <div className="v">$118K</div>
                <div className="sub">$118,282.8 USDT &mdash; total commission received to date</div>
              </div>
              <div>
                <div className="k">Deposits originated</div>
                <div className="v">$3.74M</div>
                <div className="sub">USDT deposited onto the exchange through BottomUP signups</div>
              </div>
              <div>
                <div className="k">Our net rate</div>
                <div className="v">$140 / $1M</div>
                <div className="sub">0.014% of volume. Two channels: (1) half of the leverage trading rebate ($50) &mdash; 20% ($10) rebated to the user, $40 to us; (2) $100/$1M volume bonus. Net: $40 + $100 = $140/$1M.</div>
              </div>
            </div>

            <h3 className="subhead">AAARRR &mdash; strategy &amp; action per stage</h3>
            <div className="funnel-grid">
              <div className="funnel-card">
                <span className="stage">A · Awareness</span>
                <h4>Regional visibility</h4>
                <p>
                  Local trader partnerships across APAC, LATAM and MENA;
                  regional media buys, podcast circuits, on-the-ground
                  conference presence.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Acquisition</span>
                <h4>Wallet-first signup</h4>
                <p>
                  Exchange wallet connect in one tap. Audience leverage from
                  creators, triple referral graph, regional brand
                  ambassadors.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Activation</span>
                <h4>First 30 days, first return</h4>
                <p>
                  Without a purchase or an auto-trade connection, the product
                  doesn&apos;t realise value. Onboarding guarantees both
                  happen in the first 30 days.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Retention</span>
                <h4>5%+ monthly floor</h4>
                <p>
                  Performance commitment. The 12-month rolling average never
                  drops below 5%/month. Full math in the Retention section.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Revenue</span>
                <h4>Revenue per segment</h4>
                <p>
                  HNW high-yield, retail mid-yield, B2B fixed-contract.
                  Blended target $13.5M.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Referral</span>
                <h4>Triple referral graph</h4>
                <p>
                  User, creator and community &mdash; all three bring new
                  users; all three tied to revenue share.
                </p>
              </div>
            </div>

            <h3 className="subhead">Where the $13.5M comes from</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Total 2027 revenue</div>
                <div className="v">$13.5M</div>
                <div className="sub">Series A round milestone</div>
              </div>
              <div>
                <div className="k">Exchange line</div>
                <div className="v">$8M</div>
                <div className="sub">Commission from exchange referral volume (detailed below)</div>
              </div>
              <div>
                <div className="k">Credits + ads</div>
                <div className="v">$4.5M</div>
                <div className="sub">In-app credit system (users spend on marketplace) + ad inventory</div>
              </div>
              <div>
                <div className="k">B2B contracts</div>
                <div className="v">$1M</div>
                <div className="sub">Banks, hedge funds, factoring firms, brokerages, wealth managers</div>
              </div>
            </div>

            <h3 className="subhead">Volume needed for the $8M exchange line</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Net rate</div>
                <div className="v">$140 / $1M</div>
                <div className="sub">Our take &mdash; after the user kickback</div>
              </div>
              <div>
                <div className="k">Annual volume</div>
                <div className="v">~$57B</div>
                <div className="sub">USDT/year &middot; mapped to $8M revenue</div>
              </div>
              <div>
                <div className="k">Monthly run rate</div>
                <div className="v">~$4.8B</div>
                <div className="sub">USDT/month at pilot end</div>
              </div>
              <div>
                <div className="k">Scale vs cumulative footprint</div>
                <div className="v">~37×</div>
                <div className="sub">From today&apos;s $1.56B to $57B annual</div>
              </div>
            </div>

            <p className="section-bridge">
              <strong>Exchange-line detail:</strong> two separate payment
              channels with the exchange partner. The first is the
              leverage-trading commission rebate &mdash; the exchange
              collects $100 per $1M of leverage volume and hands us half
              ($50), of which we rebate 20% ($10) to the user who placed the
              trade, keeping $40. The second is a volume bonus &mdash; an
              extra $100 per $1M, no kickback. Net to BottomUP:{" "}
              <strong>$140 / $1M, i.e. 0.014% of volume</strong>.
            </p>

            <h3 className="subhead">Growth plan &mdash; 16 months, regional targets, unit economics</h3>
            <div className="stat-strip">
              <div>
                <div className="k">APAC · Scale</div>
                <div className="v">260K</div>
                <div className="sub">Users · ARPU ~$17.5/yr · $4.55M revenue</div>
              </div>
              <div>
                <div className="k">LATAM · Engagement</div>
                <div className="v">160K</div>
                <div className="sub">Users · ARPU ~$26/yr · $4.16M revenue</div>
              </div>
              <div>
                <div className="k">MENA · High value</div>
                <div className="v">80K</div>
                <div className="sub">Users · ARPU ~$47/yr · $3.76M revenue</div>
              </div>
              <div>
                <div className="k">Retail total</div>
                <div className="v">500K</div>
                <div className="sub">Users · $25 blended ARPU · $12.5M retail revenue</div>
              </div>
            </div>
            <p className="section-bridge">
              <strong>$4M growth budget spread across 16 months</strong>{" "}
              (~$250K/month). Average 31,300 new users per month &mdash; 16.3K
              to APAC, 10K to LATAM, 5K to MENA. Retail ARPU{" "}
              <span className="ink-2" style={{ fontStyle: "italic" }}>(Average Revenue Per User &mdash; mean annual revenue per user)</span>{" "}
              stacks two layers: <strong>$16 exchange commission per user
              per year</strong> (proportional to trading volume) +{" "}
              <strong>$9 credits and ads</strong> = $25 blended retail ARPU.
              MENA&apos;s high-value segment ($47/year) balances APAC&apos;s
              leaner scale segment ($17.5/year), keeping the blend healthy.
              Per-user trading volume on the exchange:{" "}
              <strong>~$114K/year</strong> (~$9.5K/month) &mdash; a
              reasonable floor for the active-trader segment.
            </p>

          </div>
        </section>

        {/* 05 / RETENTION */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">05 / Retention</div>
              <h2 className="display">
                5% / month → <span className="acid">79.6% / year.</span>
              </h2>
              <div className="eyebrow">Performance commitment &middot; low churn &middot; indispensable product</div>
            </div>

            <p className="lead">
              Whichever product they buy on BottomUP, the user&apos;s
              portfolio <strong>doesn&apos;t fall below an average 5%
              monthly return on a 12-month rolling basis</strong>. One month
              might land at 4%, another at 6% &mdash; the 12-month average
              always holds the 5% floor.
            </p>

            <div className="stat-strip">
              <div>
                <div className="k">Monthly floor</div>
                <div className="v">5%</div>
                <div className="sub">12-month rolling average</div>
              </div>
              <div>
                <div className="k">Annual compound</div>
                <div className="v">79.6%</div>
                <div className="sub">(1.05)¹² − 1 &mdash; if returns stay on platform</div>
              </div>
              <div>
                <div className="k">Annual simple</div>
                <div className="v">60%</div>
                <div className="sub">5% × 12 &mdash; if withdrawn monthly</div>
              </div>
              <div>
                <div className="k">Window</div>
                <div className="v">12 months</div>
                <div className="sub">Rolling-average calculation window</div>
              </div>
            </div>

          </div>
        </section>

        <footer className="foot">
          <div className="shell foot-row">
            <span>© BottomUP · Vision 2027</span>
            <span>This page is unindexed &middot; do not share</span>
            <span>{stamp}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
