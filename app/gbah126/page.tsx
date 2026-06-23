/* eslint-disable @next/next/no-img-element */
const BUP_WORDMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75";

export default function InvestorBrief() {
  const stamp = "Q2 2026";

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <img className="bup-word" src={BUP_WORDMARK} alt="BottomUP" />
          </div>
          <div className="host-stamp">
            <span className="label">
              <span className="dot" /> Investor Brief
            </span>
            <span className="sep" />
            <span className="label">Seed round</span>
            <span className="sep" />
            <span className="label">{stamp}</span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="shell">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">Decentralized portfolio management</div>
                <h1 className="display hero-headline">
                  The App Store of<br />
                  <span className="acid">Smart Money.</span>
                </h1>
                <p className="hero-sub">
                  Users connect their own wallet and allocate capital across
                  verified human traders, algorithmic strategies and AI
                  agents &mdash; all secured by a real-time AI risk engine.
                </p>
              </div>

              <div className="hero-meta">
                <div className="meta-row">
                  <span className="k">Entity</span>
                  <span className="v">Delaware, USA</span>
                </div>
                <div className="meta-row">
                  <span className="k">Product</span>
                  <span className="v">bottomup.app · live, in market</span>
                </div>
                <div className="meta-row">
                  <span className="k">Stage</span>
                  <span className="v">$5M Seed · $30M post-money cap</span>
                </div>
                <div className="meta-row">
                  <span className="k">As of</span>
                  <span className="v">{stamp}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPENER — traction punch */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">Cumulative traction · launch July 2023 → today</div>
            <h1 className="opener-display acid">$1.59B</h1>
            <p className="opener-sub">
              Trading volume already routed onto our exchange partner &mdash;
              before a single dollar of Series A.
            </p>
          </div>
        </section>

        {/* CONTEXT — macro backdrop */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">Context · Macro backdrop</div>
              <h2 className="display">Posted into a falling market.</h2>
              <div className="eyebrow">Bitcoin nearly halved this year &mdash; these numbers were earned against the tape</div>
            </div>

            <p className="lead">
              Bitcoin fell from a <strong>~$123K high to ~$62K</strong> this
              year. Open conflict between the US and Iran, Fed policy
              uncertainty and a charged political calendar pulled capital out
              of risk. <strong>Every number in this brief was posted into
              that &mdash; not a bull run.</strong>
            </p>

            <div className="stat-strip">
              <div>
                <div className="k">BTC drawdown</div>
                <div className="v">~−49%</div>
                <div className="sub">From the ~$123K cycle high to $62,309 &mdash; Bitcoin nearly halved this year.</div>
              </div>
              <div>
                <div className="k">Market regime</div>
                <div className="v">Risk-off</div>
                <div className="sub">Broad crypto selloff; capital rotating out of risk assets across the board.</div>
              </div>
              <div>
                <div className="k">Macro overhang</div>
                <div className="v">US · Iran</div>
                <div className="sub">Open US&ndash;Iran conflict, Fed policy uncertainty and a charged political calendar.</div>
              </div>
              <div>
                <div className="k">Our quarter</div>
                <div className="v">+11.9%</div>
                <div className="sub">Revenue still grew QoQ into the drawdown &mdash; the engine doesn&apos;t need a bull market.</div>
              </div>
            </div>

            <p className="section-bridge">
              <strong>The point:</strong> this traction was built in the worst
              tape in years. When the cycle turns, the same funnel compounds on
              a market finally working with us &mdash; not against us.
            </p>
          </div>
        </section>

        {/* 01 / TRACTION */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">01 / Traction</div>
              <h2 className="display">The big picture.</h2>
              <div className="eyebrow">Cumulative from launch (July 2023) through Q2 2026</div>
            </div>

            <div className="stat-strip">
              <div>
                <div className="k">Total downloads</div>
                <div className="v">107K</div>
                <div className="sub">Cumulative installs across iOS &amp; Android</div>
              </div>
              <div>
                <div className="k">Paid users</div>
                <div className="v">5,064</div>
                <div className="sub">4.7% conversion from install to paid</div>
              </div>
              <div>
                <div className="k">Trading volume</div>
                <div className="v">$1.59B</div>
                <div className="sub">All-time USDT routed via BottomUP referrals</div>
              </div>
              <div>
                <div className="k">Deposits originated</div>
                <div className="v">$3.74M</div>
                <div className="sub">USDT deposited onto the exchange through BottomUP signups</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / QUARTER */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">02 / Operations</div>
              <h2 className="display">Q1 vs Q2 2026.</h2>
              <div className="eyebrow">Funnel, paid conversion and auto-trade volume, quarter over quarter</div>
            </div>

            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Q1 2026</th>
                    <th>Q2 2026 · proj.</th>
                    <th>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Downloads</td>
                    <td>14,849</td>
                    <td>15,380</td>
                    <td className="pos">+3.6%</td>
                  </tr>
                  <tr>
                    <td>MAU</td>
                    <td>12.7K</td>
                    <td>13.2K</td>
                    <td className="pos">+3.9%</td>
                  </tr>
                  <tr>
                    <td>Avg DAU</td>
                    <td>3,144</td>
                    <td>3,834</td>
                    <td className="pos">+21.9%</td>
                  </tr>
                  <tr>
                    <td>Paid users</td>
                    <td>446</td>
                    <td>484</td>
                    <td className="pos">+8.5%</td>
                  </tr>
                  <tr>
                    <td>Auto-trade users</td>
                    <td>241</td>
                    <td>287</td>
                    <td className="pos">+19.1%</td>
                  </tr>
                  <tr>
                    <td>Auto-trade volume</td>
                    <td>$322M</td>
                    <td>$369M</td>
                    <td className="pos">+14.6%</td>
                  </tr>
                  <tr className="total">
                    <td>Total revenue</td>
                    <td>$91.7K</td>
                    <td>$102.6K</td>
                    <td className="pos">+11.9%</td>
                  </tr>
                </tbody>
                <caption>
                  Revenue model: $30/month subscription per paid user +
                  $160 per $1M of auto-trade volume. Q1 = $40.1K subs
                  (446 × $30 × 3mo) + $51.5K volume ($322M × $160/$1M).
                  Q2 = $43.6K subs + $59.0K volume.
                </caption>
              </table>
            </div>
          </div>
        </section>

        {/* 03 / P&L */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / P&amp;L</div>
              <h2 className="display">Revenue vs OPEX.</h2>
              <div className="eyebrow">Lean burn — the net loss narrows even while hiring</div>
            </div>

            <div className="ledger-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>Line</th>
                    <th>Q1 2026</th>
                    <th>Q2 2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Revenue</td>
                    <td>$91.7K</td>
                    <td>$102.6K</td>
                  </tr>
                  <tr>
                    <td>Salaries</td>
                    <td className="muted">$74.3K · 8 emp</td>
                    <td className="muted">$80.5K · 11 emp</td>
                  </tr>
                  <tr>
                    <td>Trader acquisition + bonus</td>
                    <td className="muted">$25.7K</td>
                    <td className="muted">$27.4K</td>
                  </tr>
                  <tr>
                    <td>Servers + paid software</td>
                    <td className="muted">$5.0K</td>
                    <td className="muted">$5.8K</td>
                  </tr>
                  <tr>
                    <td>Total OPEX</td>
                    <td>$105.0K</td>
                    <td>$113.7K</td>
                  </tr>
                  <tr className="total">
                    <td>Net</td>
                    <td className="neg">−$13.3K</td>
                    <td className="neg">−$11.1K</td>
                  </tr>
                </tbody>
                <caption>
                  Revenue +11.9% while OPEX +8.3% — even with 3 new hires,
                  the net loss tightens from −$13.3K to −$11.1K.
                </caption>
              </table>
            </div>
          </div>
        </section>

        {/* 04 / RECURRING */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">04 / Recurring</div>
              <h2 className="display">MRR &amp; ARR.</h2>
              <div className="eyebrow">Subscription + volume commission, annualised</div>
            </div>

            <div className="stat-strip">
              <div>
                <div className="k">MRR · Q1</div>
                <div className="v">$30.6K</div>
                <div className="sub">Subscription $13.4K + volume $17.2K</div>
              </div>
              <div>
                <div className="k">MRR · Q2</div>
                <div className="v">$34.2K</div>
                <div className="sub">Subscription $14.5K + volume $19.7K · +11.9% QoQ</div>
              </div>
              <div>
                <div className="k">ARR · Q1</div>
                <div className="v">$366.6K</div>
                <div className="sub">MRR × 12</div>
              </div>
              <div>
                <div className="k">ARR · Q2</div>
                <div className="v">$410.4K</div>
                <div className="sub">MRR × 12</div>
              </div>
            </div>
            <p className="note">
              <strong>MRR</strong> = paid users × $30 + monthly volume ×
              $160/$1M. <strong>ARR</strong> = MRR × 12.
            </p>
          </div>
        </section>

        {/* 05 / TRAJECTORY */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">05 / Trajectory</div>
              <h2 className="display">Rolling revenue.</h2>
              <div className="eyebrow">From a $282K year to a $400K+ ARR run-rate</div>
            </div>

            <div className="traj">
              <div>
                <span className="k">FY 2025</span>
                <span className="v">$282K</span>
                <span className="grow">+315% YoY</span>
              </div>
              <div>
                <span className="k">Q1 2026</span>
                <span className="v">$91.7K</span>
                <span className="grow">+46% QoQ</span>
              </div>
              <div>
                <span className="k">Q2 2026 · proj.</span>
                <span className="v">$102.6K</span>
                <span className="grow">+11.9% QoQ</span>
              </div>
            </div>
          </div>
        </section>

        {/* OPENER — products bridge */}
        <section className="opener">
          <div className="shell">
            <h1 className="opener-display question">
              What are they<br />
              <span className="acid">buying?</span>
            </h1>
            <p className="opener-sub">
              Three products on one platform &mdash; a marketplace, a social
              layer and an AI risk engine.
            </p>
          </div>
        </section>

        {/* PRODUCT GALLERY — real app */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">Product · Live</div>
              <h2 className="display">The app, shipping today.</h2>
              <div className="eyebrow">Not a mockup &mdash; screenshots from the live BottomUP app</div>
            </div>

            <div className="appshots">
              <div className="shot">
                <img src="/gbah126/app/foxy.png" alt="Bup.AI Foxy — ETH analysis" />
                <div className="cap">
                  <div className="lbl">Bup.AI · Foxy</div>
                  <p>On-demand AI trade analysis &mdash; verdict, support/resistance levels, RSI and MACD read.</p>
                </div>
              </div>
              <div className="shot">
                <img src="/gbah126/app/markets.png" alt="Live market dashboard" />
                <div className="cap">
                  <div className="lbl">Live markets</div>
                  <p>Open interest, liquidations, Fear &amp; Greed, altcoin season, BTC dominance and charts in one view.</p>
                </div>
              </div>
              <div className="shot">
                <img src="/gbah126/app/portfolio.png" alt="Portfolio and copy-trading" />
                <div className="cap">
                  <div className="lbl">Portfolio + copy</div>
                  <p>Total and copy balance, live setups with entry, current price and estimated ROE.</p>
                </div>
              </div>
              <div className="shot">
                <img src="/gbah126/app/community.png" alt="Social+ community channels" />
                <div className="cap">
                  <div className="lbl">Social+ chat</div>
                  <p>Topic channels &mdash; setups, community ideas, market analysis, gem hunting, FX, indices.</p>
                </div>
              </div>
              <div className="shot">
                <img src="/gbah126/app/calendar.png" alt="Economic calendar" />
                <div className="cap">
                  <div className="lbl">Economic calendar</div>
                  <p>Macro events color-coded by impact, with live actual / consensus / previous prints.</p>
                </div>
              </div>
              <div className="shot">
                <img src="/gbah126/app/news.png" alt="News feed" />
                <div className="cap">
                  <div className="lbl">News feed</div>
                  <p>Curated multi-source crypto headlines, surfaced in real time next to the markets.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 / PRODUCT — Trader Marketplace */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">06 / Product · Trader Marketplace</div>
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

        {/* 07 / PRODUCT — Social+ */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">07 / Product · Social+</div>
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

        {/* 08 / PRODUCT — Foxy */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">08 / Product · Foxy</div>
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

        {/* 09 / CREATOR */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">09 / Creator</div>
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

        {/* 10 / PERSONA */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">10 / Persona</div>
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

        {/* 11 / GROWTH */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">11 / Growth</div>
              <h2 className="display">From today to $13.5M.</h2>
              <div className="eyebrow">APAC · LATAM · MENA — a ~36× scale-up across 16 months</div>
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
                <div className="sub">Commission from exchange referral volume</div>
              </div>
              <div>
                <div className="k">Credits + ads</div>
                <div className="v">$4.5M</div>
                <div className="sub">In-app credit system + ad inventory</div>
              </div>
              <div>
                <div className="k">B2B contracts</div>
                <div className="v">$1M</div>
                <div className="sub">Banks, hedge funds, factoring, brokerages, wealth managers</div>
              </div>
            </div>

            <h3 className="subhead">Volume needed for the $8M exchange line</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Footprint net rate</div>
                <div className="v">$140 / $1M</div>
                <div className="sub">Our take after the user kickback — 0.014% of volume</div>
              </div>
              <div>
                <div className="k">Annual volume</div>
                <div className="v">~$57B</div>
                <div className="sub">USDT/year · mapped to $8M revenue</div>
              </div>
              <div>
                <div className="k">Monthly run rate</div>
                <div className="v">~$4.8B</div>
                <div className="sub">USDT/month at pilot end</div>
              </div>
              <div>
                <div className="k">Scale vs footprint</div>
                <div className="v">~36×</div>
                <div className="sub">From today&apos;s $1.59B cumulative to $57B annual</div>
              </div>
            </div>
            <p className="note">
              <strong>Two exchange channels:</strong> the leverage-trading
              rebate — the exchange collects $100/$1M, hands us half ($50), we
              rebate 20% ($10) to the trader, keeping $40 — plus a $100/$1M
              volume bonus with no kickback. Net to BottomUP: $140/$1M. To
              date: $1.59B cumulative volume, $118K commission, $3.74M
              deposits.
            </p>

            <h3 className="subhead">Regional plan — 16 months, unit economics</h3>
            <div className="stat-strip">
              <div>
                <div className="k">APAC · Scale</div>
                <div className="v">$4.55M</div>
                <div className="sub">260K users · ARPU ~$17.5/yr</div>
              </div>
              <div>
                <div className="k">LATAM · Engagement</div>
                <div className="v">$4.16M</div>
                <div className="sub">160K users · ARPU ~$26/yr</div>
              </div>
              <div>
                <div className="k">MENA · High value</div>
                <div className="v">$3.76M</div>
                <div className="sub">80K users · ARPU ~$47/yr</div>
              </div>
              <div>
                <div className="k">Retail total</div>
                <div className="v">$12.5M</div>
                <div className="sub">500K users · $25 blended ARPU</div>
              </div>
            </div>
            <p className="note">
              <strong>$4M growth budget across 16 months</strong> (~$250K/mo),
              ~31,300 new users/month. Retail ARPU stacks $16 exchange
              commission + $9 credits &amp; ads = $25 blended. MENA&apos;s
              high-value segment balances APAC&apos;s leaner scale segment,
              keeping the blend healthy.
            </p>
          </div>
        </section>

        {/* 12 / RETENTION */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">12 / Retention</div>
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

        {/* 13 / THE ROUND */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">13 / The Round</div>
              <h2 className="display">The Seed round.</h2>
              <div className="eyebrow">$5M to capitalise the 16-month, three-region scale-up</div>
            </div>

            <div className="duo">
              <div className="panel">
                <h4>This round</h4>
                <div className="rowline">
                  <span className="lab">Raising</span>
                  <span className="amt acid">$5M Seed</span>
                </div>
                <div className="rowline">
                  <span className="lab">Valuation cap</span>
                  <span className="amt">$30M post</span>
                </div>
                <div className="rowline">
                  <span className="lab">Next round</span>
                  <span className="amt">$15M @ $135M</span>
                </div>
                <div className="rowline">
                  <span className="lab">Series A timing</span>
                  <span className="amt">Q4 2027</span>
                </div>
                <div className="rowline">
                  <span className="lab">Target exit</span>
                  <span className="amt">2031 · ~$1B</span>
                </div>
                <div className="rowline">
                  <span className="lab">Seed return</span>
                  <span className="amt acid">33–50×</span>
                </div>
              </div>

              <div className="panel">
                <h4>Use of funds</h4>
                <div className="uof">
                  <span className="s1" style={{ width: "80%" }}>80% Marketing</span>
                  <span className="s2" style={{ width: "15%" }}>15%</span>
                  <span className="s3" style={{ width: "5%" }}>5%</span>
                </div>
                <div className="uof-legend">
                  <span><i className="i1" /> Marketing &amp; user acquisition</span>
                  <span><i className="i2" /> Product</span>
                  <span><i className="i3" /> Legal</span>
                </div>
                <div className="rowline" style={{ marginTop: "8px" }}>
                  <span className="lab">2027 ARR milestone</span>
                  <span className="amt acid">$13.5M</span>
                </div>
                <div className="rowline">
                  <span className="lab">Exchange · Credits+Ads · B2B</span>
                  <span className="amt">$8M · $4.5M · $1M</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="foot">
          <div className="shell foot-row">
            <span>© BottomUP · Investor Brief</span>
            <span>This page is unindexed &middot; do not share</span>
            <span>{stamp}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
