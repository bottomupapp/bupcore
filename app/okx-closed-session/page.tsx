/* eslint-disable @next/next/no-img-element */
const BUP_LOGOMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogomark-color.png&w=64&q=75";
const BUP_WORDMARK =
  "https://www.bottomup.app/_next/image?url=%2Flogos%2Flogotype-color-light.png&w=256&q=75";

export default function OkxClosedSession() {
  const stamp = "Kasım 2027";

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <img className="bup-mark" src={BUP_LOGOMARK} alt="BottomUP" />
            <img className="bup-word" src={BUP_WORDMARK} alt="BottomUP" />
          </div>
          <div className="host-stamp">
            <span className="label">
              <span className="dot" /> Kapalı oturum
            </span>
            <span className="sep" />
            <span className="label">
              Ev sahibi <span className="okx-word">OKX</span>
            </span>
            <span className="sep" />
            <span className="label">{stamp}</span>
          </div>
        </div>
      </header>

      <main>
        {/* OPENER 1 — Kasım 2027 */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">Kapalı oturum · OKX merkezinde</div>
            <h1 className="opener-display">
              Kasım 2027<br />
              <span className="opener-tail">geldiğinde…</span>
            </h1>
          </div>
        </section>

        {/* OPENER 2 — $13.5M */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">2027 yılı toplam ciro hedefimiz</div>
            <h1 className="opener-display acid">$13.5M</h1>
            <p className="opener-sub">
              Yıllık ciro &middot; Seri A yatırım turu eşiği
            </p>
          </div>
        </section>

        {/* OPENER 3 — Peki nasıl olacak? */}
        <section className="opener">
          <div className="shell">
            <h1 className="opener-display question">
              Peki nasıl<br />
              <span className="acid">olacak?</span>
            </h1>
          </div>
        </section>

        {/* 01 / PERSONA — KULLANICILAR (B2C + B2B) */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">01 / Persona</div>
              <h2 className="display">Kullanıcılar.</h2>
              <div className="eyebrow">B2C ve B2B — her segmente ayrı strateji</div>
            </div>

            <h3 className="subhead">B2C</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Hiç borsa kullanmamış</h4>
                <p>
                  Sıfırdan KYC + cüzdan + tek-tıkla auto-copy. Trade bilmeyen
                  biri 5 dakika içinde ilk getirisini alır.
                </p>
              </div>
              <div className="segment-card">
                <h4>TradFi yatırımcısı</h4>
                <p>
                  Banka mevduatı, bireysel emeklilik fonu. Konvansiyonel
                  araçlardan kripto / alternatif asset&apos;lere geçiş köprüsü.
                </p>
              </div>
              <div className="segment-card">
                <h4>Büyük cüzdan / HNW</h4>
                <p>
                  Premium deneyim, white-glove onboarding, private creator
                  erişimi, dedicated risk denetimi.
                </p>
              </div>
              <div className="segment-card">
                <h4>Aktif retail trader</h4>
                <p>
                  Edge ve topluluk arayan, zaten OKX kullanan kullanıcı. Foxy +
                  creator topluluğu = profesyonel toolkit.
                </p>
              </div>
              <div className="segment-card">
                <h4>Creator takipçisi</h4>
                <p>
                  Favori trader&apos;ı bir butonla kopyala. Telegram
                  screenshot&apos;ı yerine bağlanmış auto-trade.
                </p>
              </div>
              <div className="segment-card">
                <h4>Pasif gelir arayan</h4>
                <p>
                  Set-and-forget portföy. %5+/ay rolling getiri taahhüdüyle
                  sürekli işleyen sistem.
                </p>
              </div>
            </div>

            <h3 className="subhead">B2B</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Bankalar</h4>
                <p>
                  Trading desk + private banking için Foxy AI risk + sinyal API.
                  Wealth client&apos;larına copy-trading altyapısı.
                </p>
              </div>
              <div className="segment-card">
                <h4>Hedge fonlar</h4>
                <p>
                  Foxy&apos;nin data fabric&apos;i (Arkham, Coinglass, makro) +
                  sinyal altyapısı, API olarak satılır.
                </p>
              </div>
              <div className="segment-card">
                <h4>Faktöring şirketleri</h4>
                <p>
                  Kripto alacak skorlama, OTC takas riski analitiği, on-chain
                  karşı taraf risk feed&apos;i.
                </p>
              </div>
              <div className="segment-card">
                <h4>Brokerage / aracı kurum</h4>
                <p>
                  White-label trader marketplace + social platform. Kendi
                  kullanıcılarına BottomUP deneyimi.
                </p>
              </div>
              <div className="segment-card">
                <h4>Wealth management</h4>
                <p>
                  Copy-trading-as-a-service. Müşteri portföyleri için seçilmiş
                  creator havuzu + risk denetimi.
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
              <h2 className="display">Creator.</h2>
              <div className="eyebrow">BottomUP&apos;ta listeleyip satabilen üreticiler · %70 onlara, %30 platform hattı</div>
            </div>

            <p className="lead">
              Algoritmasını, AI ajanını, sinyalini, eğitimini ya da topluluğunu
              BottomUP&apos;ta listeleyen herkes creator&apos;dır. Fiyatı
              kendileri belirler; ödemeler, keşif, fraud ve payout
              bizde.
            </p>

            <div className="persona-grid">
              <div className="segment-card">
                <h4>Algo bot geliştiriciler</h4>
                <p>
                  Mean-reversion, momentum, arbitraj &mdash; kendi
                  geliştirdikleri otomatik trading sistemlerini paketleyip
                  satar.
                </p>
              </div>
              <div className="segment-card">
                <h4>AI ajan üreticileri</h4>
                <p>
                  LLM tabanlı, otonom karar veren ajanlar &mdash; kullanıcının
                  cüzdanında doğal dil ile pozisyon yönetir.
                </p>
              </div>
              <div className="segment-card">
                <h4>İnsan trader-influencer</h4>
                <p>
                  Kendi pozisyonunu paylaşan, takipçisinin auto-copy&apos;ye
                  bağlandığı manuel trader&apos;lar.
                </p>
              </div>
              <div className="segment-card">
                <h4>Sinyal &amp; eğitim üreticileri</h4>
                <p>
                  Periyodik sinyal akışı, video eğitim setleri, premium içerik
                  &mdash; abonelik bazlı.
                </p>
              </div>
              <div className="segment-card">
                <h4>Topluluk operatörleri</h4>
                <p>
                  İçinde çoklu trader barındıran topluluğu listeler. Kullanıcı
                  topluluğun bütününü tek paket olarak satın alır.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / ÜRÜN — Trader Marketplace */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Ürün · Trader Marketplace</div>
              <h2 className="display">Trader Marketplace.</h2>
              <div className="eyebrow">Algo, AI ajan, sinyal ve toplulukların mağazası</div>
            </div>

            <p className="lead">
              Creator ürünlerini listeler, <strong>fiyatı kendileri belirler</strong>,
              biz ödemeleri/keşfi/payout&apos;ları hallederiz. Onlar zaten trade
              eden global bir kitleye ulaşır.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <div className="split">
                  <div>
                    <div className="k">Creator payı</div>
                    <div className="v">%70</div>
                    <div className="sub">her satıştan &mdash; fiyat onların</div>
                  </div>
                  <div>
                    <div className="k">Platform payı</div>
                    <div className="v">%30</div>
                    <div className="sub">BottomUP hattı &mdash; borsa ortağıyla paylaşılır</div>
                  </div>
                </div>
              </div>

              <div className="pcard">
                <h4>Dahili reklam envanteri</h4>
                <p>
                  Featured listing, push & email blast, in-app banner, topluluk
                  spot&apos;u. <strong>Creator&apos;lar BottomUP kullanıcılarına
                  ulaşmak için bize ödüyor</strong> &mdash; marketplace
                  kesintisinin üstüne ikinci gelir hattı.
                </p>
              </div>

              <div className="pcard">
                <h4>Cüzdan → otomatik trade</h4>
                <p>
                  Kullanıcı OKX cüzdanını bir kez bağlar; aldığı ürünler
                  hesabında otomatik çalışır. <strong>Referans hacminin
                  %70&apos;i creator&apos;a, %30&apos;u platform hattına.</strong>{" "}
                  Tek seferlik satış değil, sürekli gelir hattı.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / ÜRÜN — Social+ */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Ürün · Social+</div>
              <h2 className="display">
                Social<span className="acid">+</span>
              </h2>
              <div className="eyebrow">Trader ve takipçileri için native ev</div>
            </div>

            <p className="lead">
              Trader&apos;lar takipçilerini sahip olmadıkları Telegram ve
              Discord odalarında dolaştırmamalı. <strong>Social+, chat&apos;in,
              içeriğin ve canlı trade&apos;in aynı üründe yaşadığı bir
              platform.</strong>
            </p>

            <div className="pcards three">
              <div className="pcard">
                <h4>Tek platform, her format</h4>
                <p>
                  Spot, futures, hisse, FX, makro &mdash; her konuya bir kanal.
                  Video, shorts, canlı session, eğitim seti, planlı yayın &mdash;{" "}
                  <strong>chat ile aynı feed&apos;de</strong>.
                </p>
              </div>
              <div className="pcard">
                <h4>Alıcı, işlemi canlı görür</h4>
                <p>
                  Marketplace&apos;ten trader satın alan kullanıcı pozisyonu
                  real-time görür. <strong>Pozisyon, chat, auto-trade tek
                  ekranda.</strong>
                </p>
              </div>
              <div className="pcard">
                <h4>Her dil, her coğrafya</h4>
                <p>
                  Her mesaj, post ve caption AI ile çevriliyor. Creator kendi
                  dilinde yazar, takipçi kendi dilinde okur. <strong>OKX
                  Global&apos;ın coğrafyası tek klavyeden ulaşılabilir.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / ÜRÜN — Foxy */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / Ürün · Foxy</div>
              <h2 className="display">Foxy.</h2>
              <div className="eyebrow">Platformdaki her işlem için AI yardımcısı ve risk denetmeni</div>
            </div>

            <p className="lead">
              Foxy borsa feed&apos;lerini, on-chain veriyi, türev
              pozisyonlamayı, makro takvimi ve ML sinyallerini tek feature
              store&apos;da birleştirir &mdash; sonra <strong>creator işlem
              paylaşırken yanında durur.</strong>
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <h4>Veri kumaşı &mdash; gerçek zamanlı + tarihsel, tek feature store</h4>
                <div className="sources">
                  <span>OKX API</span>
                  <span>Binance API</span>
                  <span>Arkham</span>
                  <span>Coinglass</span>
                  <span>CoinGecko</span>
                  <span>US 10Y · ETF · JP CPI</span>
                </div>
              </div>

              <div className="pcard">
                <h4>Creator-tarafı risk skoru</h4>
                <p>
                  Creator işlemi takipçilerine paylaşmadan önce Foxy riski
                  hesaplar. <strong>&ldquo;Trump 4 saat sonra konuşacak &mdash;
                  stop&apos;unu genişlet, size&apos;ı yarıla, ya da işlemi
                  atla.&rdquo;</strong> Makro + korelasyon bilinçli.
                </p>
              </div>

              <div className="pcard">
                <h4>TP/SL optimizasyonu</h4>
                <p>
                  Açık pozisyonlarda Foxy koşullar değiştikçe TP ve stop&apos;u
                  yeniden hesaplar; onay verilirse wallet bağlantılı auto-trade
                  rail&apos;ine push&apos;lar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / BÜYÜME — AAARRR + Math */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">04 / Büyüme</div>
              <h2 className="display">Bugünden $13.5M&apos;a.</h2>
              <div className="eyebrow">AAARRR funnel · APAC · LATAM · MENA</div>
            </div>

            <h3 className="subhead">Bugünkü ayak izimiz</h3>
            <div className="stat-strip">
              <div>
                <div className="k">İşlem hacmi</div>
                <div className="v">$1.56B</div>
                <div className="sub">Tüm zamanlar, BottomUP referansıyla OKX&apos;e yönlendirilen USDT</div>
              </div>
              <div>
                <div className="k">Geri ödenen komisyon</div>
                <div className="v">$118K</div>
                <div className="sub">$118,282.8 USDT — OKX&apos;in BottomUP&apos;a ödediği toplam</div>
              </div>
              <div>
                <div className="k">Açılan mevduat</div>
                <div className="v">$3.74M</div>
                <div className="sub">BottomUP üzerinden OKX&apos;e onboard edilen USDT</div>
              </div>
              <div>
                <div className="k">Bugünkü oran</div>
                <div className="v">$100 / $1M</div>
                <div className="sub">1 bp &mdash; OKX&apos;in 10 bps taker fee&apos;sinin %10&apos;u</div>
              </div>
            </div>

            <h3 className="subhead">AAARRR &mdash; strateji ve aksiyon</h3>
            <div className="funnel-grid">
              <div className="funnel-card">
                <span className="stage">A · Awareness</span>
                <h4>Bölgesel görünürlük</h4>
                <p>
                  APAC, LATAM, MENA&apos;da yerel partner trader
                  workshop&apos;ları, OKX co-PR, regional medya ve etkinlik
                  ortaklıkları.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Acquisition</span>
                <h4>Wallet-first sign-up</h4>
                <p>
                  OKX wallet connect tek tıkla; creator audience leverage,
                  referral graph, regional brand ambassador&apos;lar.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Activation</span>
                <h4>İlk 30 gün, ilk getiri</h4>
                <p>
                  İlk satın almadan veya auto-trade bağlanmadan ürün değer
                  realize etmiyor &mdash; onboarding bunu garanti eder.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Retention</span>
                <h4>%5+ aylık taban</h4>
                <p>
                  Performans taahhüdü (KORUMA bölümünde tam math). 12 aylık
                  rolling ortalama %5&apos;in altına inmez.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Revenue</span>
                <h4>Segment başına ARPU</h4>
                <p>
                  HNW yüksek-ARPU, retail orta-ARPU, B2B fixed kontrat. Karma
                  hedef $13.5M.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Referral</span>
                <h4>Üçlü referral graph</h4>
                <p>
                  Kullanıcı → kullanıcı, creator → kullanıcı, community →
                  kullanıcı. Her üç hat da revenue share&apos;e bağlı.
                </p>
              </div>
            </div>

            <h3 className="subhead">$13.5M math</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Toplam 2027 ciro</div>
                <div className="v">$13.5M</div>
                <div className="sub">Seri A yatırım turu eşiği</div>
              </div>
              <div>
                <div className="k">Borsa hattından</div>
                <div className="v">$8M</div>
                <div className="sub">OKX referans hacminden komisyon</div>
              </div>
              <div>
                <div className="k">Bugünkü rate&apos;te hacim</div>
                <div className="v">~$80B</div>
                <div className="sub">USDT/yıl · 1 bp · ~$6.7B/ay</div>
              </div>
              <div>
                <div className="k">3 bps rate&apos;te hacim</div>
                <div className="v">~$27B</div>
                <div className="sub">USDT/yıl · %30 share · ~$2.2B/ay</div>
              </div>
            </div>
            <p className="section-bridge">
              Bugünkü 1 bp oranda (OKX&apos;in 10 bps standart taker fee&apos;sinin
              ~%10&apos;u) $8M borsa-hattı için ~$80B yıllık hacim gerekir
              (~$6.7B/ay). Yapısal kaldıraç &mdash; referral attribution + temiz
              rev-share, BottomUP&apos;a net ~3 bps (~%30 share, bu ölçekteki
              affiliate programlarının standardı) &mdash; gereken hacmi 3&times;
              azaltır: yıllık ~$27B, ayda ~$2.2B. Kalan $5.5M ciro Trader
              Marketplace satışları + Social+ ad inventory + Foxy B2B kontrat
              hatlarından gelir.
            </p>

            <h3 className="subhead">OKX&apos;in desteğine ihtiyacımız olan üç nokta</h3>
            <div className="ask">
              <div className="ask-card">
                <div className="num">01</div>
                <h4>OKX Cüzdan auto-trade altyapısı</h4>
                <p>
                  Kullanıcı OKX cüzdanını bir kez bağlasın; aldığı ürünler
                  hesabında otomatik çalışsın. En büyük unlock burada.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">02</div>
                <h4>Referral atıf + gelir paylaşımı</h4>
                <p>
                  BottomUP-referanslı kullanıcılar signup&apos;ta etiketlensin,
                  temiz raporlama feed&apos;i olsun. %30 share BottomUP + borsa
                  hattı paylaşımında.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">03</div>
                <h4>APAC + LATAM + MENA co-marketing</h4>
                <p>
                  OKX Global&apos;ın güçlü olduğu bölgelerde ortak launch
                  &mdash; push, in-app, sosyal, yerel medya. Creator&apos;lar
                  gün bir&apos;de bu pazarlarda görünür.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 / KORUMA */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">05 / Koruma</div>
              <h2 className="display">
                %5 / ay → <span className="acid">%79.6 / yıl.</span>
              </h2>
              <div className="eyebrow">Performans taahhüdü &middot; düşük churn &middot; vazgeçilmez ürün</div>
            </div>

            <p className="lead">
              BottomUP&apos;tan ne satın alırsa alsın, kullanıcının portföyü{" "}
              <strong>12 aylık rolling ortalamada aylık %5 getirinin altına
              inmez.</strong> Bir ay %4, başka ay %6 olabilir &mdash; yıllık
              ortalama %5 tabanı korunur.
            </p>

            <div className="stat-strip">
              <div>
                <div className="k">Aylık taban</div>
                <div className="v">%5</div>
                <div className="sub">12 aylık rolling ortalama</div>
              </div>
              <div>
                <div className="k">Yıllık compound</div>
                <div className="v">%79.6</div>
                <div className="sub">(1.05)¹² − 1 &mdash; PnL hesapta kalırsa</div>
              </div>
              <div>
                <div className="k">Yıllık simple</div>
                <div className="v">%60</div>
                <div className="sub">%5 × 12 &mdash; çekildiğinde</div>
              </div>
              <div>
                <div className="k">Pencere</div>
                <div className="v">12 ay</div>
                <div className="sub">Rolling ortalama hesaplama penceresi</div>
              </div>
            </div>

            <h3 className="subhead">Nasıl koruyoruz</h3>
            <div className="pcards three">
              <div className="pcard">
                <h4>Foxy filtresi</h4>
                <p>
                  Creator/ürün performansı 7/24 izlenir. Eşik altı durumda
                  listing&apos;den otomatik düşer; yeni kullanıcı bu ürüne
                  giremez.
                </p>
              </div>
              <div className="pcard">
                <h4>Performance pool</h4>
                <p>
                  Aşağı sapmalarda fark BottomUP performans havuzundan
                  kapatılır. Kullanıcı için underperformance riski yok.
                </p>
              </div>
              <div className="pcard">
                <h4>Replacement &amp; refund</h4>
                <p>
                  Yıllık ortalaması %5&apos;in altında kalan ürünlerde kullanıcı
                  tam refund alır veya başka ürünle değiştirir.
                </p>
              </div>
            </div>

            <p className="section-bridge">
              Bu taahhüt BottomUP&apos;ı vazgeçilmez yapar. Kullanıcı sürekli
              pozitif getiri alıyorsa hesabını boşaltma sebebi kalmaz; OKX&apos;teki
              hacim sürekli işler. Viral creator cohort ile kalıcı creator
              cohort arasındaki fark budur.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderBottom: 0 }}>
          <div className="shell">
            <div className="cta-strip">
              <div>
                <h3>
                  Bugün iyi giderse:<br />
                  6 haftada 30 creator&apos;lık pilot.
                </h3>
                <p>
                  BottomUP&apos;ta zaten olan top 30 creator ile pilot
                  öneriyoruz &mdash; cüzdan rail&apos;i canlı, referral atıf
                  açık. Vanity metric değil, haftalık hacimde ölçülebilir.
                </p>
              </div>
              <div className="row">
                <span className="pill solid">Pilotu konuşalım</span>
                <span className="pill">deniz@bottomup.app</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="foot">
          <div className="shell foot-row">
            <span>© BottomUP · OKX merkezinde kapalı oturum</span>
            <span>Bu sayfa indexli değil &middot; paylaşmayın</span>
            <span>{stamp}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
