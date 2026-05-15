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
        {/* HERO */}
        <section className="hero">
          <div className="shell">
            <div className="eyebrow">Kapalı ürün oturumu · OKX merkezinde</div>
            <h1 className="display hero-headline">
              AKILLI PARANIN<br />
              APP STORE&apos;U,<br />
              <span className="acid">OKX İLE BÜYÜYECEK.</span>
            </h1>
            <div className="hero-tag">
              <span className="lbl">Seri A yatırım turu hedefi</span>
              <span className="val">$14M yıllık ciro</span>
            </div>
          </div>
        </section>

        {/* TODAY ON OKX — real cumulative numbers */}
        <section>
          <div className="shell">
            <div className="section-head">
              <div className="eyebrow">Bugünkü ayak izimiz · ilişki halihazırda kazandırıyor</div>
              <h2 className="display">
                $1.56B HACİM YÖNLENDİRDİK.<br />
                <span className="acid">$118K GERİ ALDIK.</span>
              </h2>
            </div>
            <div className="stat-strip">
              <div>
                <div className="k">İşlem hacmi</div>
                <div className="v">$1.56B</div>
                <div className="sub">Tüm zamanlar, BottomUP referansıyla OKX&apos;e yönlendirilen USDT</div>
              </div>
              <div>
                <div className="k">Geri ödenen komisyon</div>
                <div className="v">$118K</div>
                <div className="sub">$118,282.8 USDT — OKX&apos;in BottomUP&apos;a ödediği toplam komisyon</div>
              </div>
              <div>
                <div className="k">Açılan mevduat</div>
                <div className="v">$3.74M</div>
                <div className="sub">BottomUP üzerinden OKX&apos;e onboard edilen USDT</div>
              </div>
              <div>
                <div className="k">Bugünkü oranımız</div>
                <div className="v">$100 / $1M</div>
                <div className="sub">Mevcut OKX anlaşması — 1 bp, OKX&apos;in 10 bps standart taker fee&apos;sinin ~%10&apos;u</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERIES A — $14M ARR */}
        <section>
          <div className="shell">
            <div className="section-head">
              <div className="eyebrow">Series A hedefi · $14M ARR</div>
              <h2 className="display">
                $14M&apos;NIN $8M&apos;I<br />
                <span className="acid">BU ODADAN DOĞACAK.</span>
              </h2>
            </div>
            <div className="stat-strip">
              <div>
                <div className="k">Series A hedef ARR</div>
                <div className="v">$14M</div>
                <div className="sub">~$6M marketplace + Social+ + Foxy &middot; $8M borsa hattından</div>
              </div>
              <div>
                <div className="k">Borsa hattından</div>
                <div className="v">$8M</div>
                <div className="sub">BottomUP&apos;un OKX referans hacminden kazanması gereken yıllık komisyon</div>
              </div>
              <div>
                <div className="k">Gereken yıllık hacim</div>
                <div className="v">~$80B</div>
                <div className="sub">USDT, bugünkü $100/$1M oranında &mdash; kümülatif ayak izimizin 51 katı</div>
              </div>
              <div>
                <div className="k">Aylık koşu hızı</div>
                <div className="v">~$6.7B</div>
                <div className="sub">USDT/ay pilot sonunda &mdash; yapısal oran artışı (~3 bps / %30 pay) bunu ~$2.2B/aya çeker</div>
              </div>
            </div>
            <p className="section-bridge">
              Bugünkü <strong>$100-her-$1M</strong> OKX affiliate oranında (1 bp,
              OKX&apos;in 10 bps standart taker fee&apos;sinin ~%10&apos;u), $8M
              yıllık komisyon ~$80B yıllık hacim demek &mdash; ayda ~$6.7B.
              Önerimizdeki yapısal kaldıraç (referral attribution + OKX&apos;in
              standart fee&apos;sinden temiz bir rev-share, BottomUP&apos;a net
              ~3 bps &mdash; bu ölçekteki affiliate programlarının tipik %30
              payı) gereken hacmi ~3× azaltarak yıllık ~$27B&apos;a, ayda
              ~$2.2B&apos;a indirir &mdash; wallet + referral altyapısı altı
              hafta içinde devreye girerse Series A süresi içinde ulaşılabilir.
            </p>
          </div>
        </section>

        {/* PRODUCT 01 — TRADER MARKETPLACE */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">01 / 03 · Ürün</div>
              <h2 className="display">Trader Marketplace.</h2>
              <div className="eyebrow">Algo, AI ajan, sinyal ve toplulukların mağazası</div>
            </div>

            <p className="lead">
              Trader&apos;lar, algo bot geliştiricileri ve AI ajan üreticileri
              kripto ve TradFi ürünlerini BottomUP&apos;ta listeler.{" "}
              <strong>Fiyatı kendileri belirler.</strong> Ödemeler, keşif, fraud
              ve payout&apos;ları biz hallederiz. Onlar zaten trade eden bir
              kitleye ulaşır.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <div className="split">
                  <div>
                    <div className="k">Creator payı</div>
                    <div className="v">%70</div>
                    <div className="sub">her satıştan — fiyat onların</div>
                  </div>
                  <div>
                    <div className="k">Platform payı</div>
                    <div className="v">%30</div>
                    <div className="sub">BottomUP hattı — borsa ortağıyla paylaşılır</div>
                  </div>
                </div>
              </div>

              <div className="pcard">
                <h4>Dahili reklam envanteri</h4>
                <p>
                  Listing&apos;de öne çıkma, tüm kullanıcılara ya da hedef
                  kitleye push & email blast, in-app banner, topluluk spot&apos;u.{" "}
                  <strong>Creator&apos;lar BottomUP kullanıcılarına ulaşmak için
                  bize ödüyor</strong> &mdash; marketplace kesintisinin üstüne
                  ikinci bir gelir hattı.
                </p>
              </div>

              <div className="pcard">
                <h4>Topluluklar — listelenir, satılır</h4>
                <p>
                  Tüm trading toplulukları bireysel creator&apos;ların yanında
                  listelenebilir. Satın alan, içerideki her trader&apos;ı tüm
                  performans metrikleriyle görür ve takip edeceğini seçer. Kendi
                  referral graph&apos;ını getiren topluluklar aylık invoice
                  modeline geçebilir &mdash; modeli seçen onlar.
                </p>
              </div>

              <div className="pcard wide">
                <h4>Cüzdan → otomatik trade · OKX ile birlikte kurmak istediğimiz entegrasyon</h4>
                <p>
                  Kullanıcı <strong>OKX cüzdanını</strong> bir kez bağlar; aldığı
                  ürünler hesabında otomatik çalışır.{" "}
                  <strong>BottomUP referansıyla gelen hacmin %70&apos;i
                  creator&apos;a, %30&apos;u BottomUP platform hattına gider
                  &mdash; borsa ortağıyla paylaşılır.</strong> Hacim, tek seferlik
                  satış değil, sürekli işleyen bir gelir hattına dönüşür.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT 02 — SOCIAL+ */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">02 / 03 · Ürün</div>
              <h2 className="display">
                Social<span className="acid">+</span>
              </h2>
              <div className="eyebrow">Trader ve takipçileri için native ev</div>
            </div>

            <p className="lead">
              İnsan trader&apos;lar takipçilerini sahip olmadıkları Telegram ve
              Discord odalarında dolaştırmamalı.{" "}
              <strong>Social+, chat&apos;in, içeriğin ve canlı trade&apos;in
              aynı üründe yaşadığı bir platform.</strong>
            </p>

            <div className="pcards three">
              <div className="pcard">
                <h4>Tek platform, her format</h4>
                <p>
                  Spot, futures, hisse, FX, makro &mdash; her konuya bir kanal.
                  Günlük market videoları, shorts, canlı trading session, eğitim
                  seti, planlı yayın &mdash; <strong>hepsi chat ile aynı
                  feed&apos;de</strong>.
                </p>
              </div>
              <div className="pcard">
                <h4>Alıcı, işlemi canlı görür</h4>
                <p>
                  Marketplace&apos;ten trader satın alan kullanıcı,
                  trader&apos;ın pozisyonlarını Social+&apos;a real-time akıtır.
                  TradingView screenshot&apos;u Telegram&apos;da yok artık
                  &mdash; <strong>pozisyon, chat ve auto-trade tek
                  ekranda</strong>.
                </p>
              </div>
              <div className="pcard">
                <h4>Türkçe yaz, dünya okusun</h4>
                <p>
                  Her mesaj, post ve caption AI ile çevriliyor. Trader Türkçe
                  yazıyor; Brezilya, Endonezya, BAE&apos;deki takipçi kendi
                  dilinde okuyor. <strong>OKX Global&apos;ın coğrafyası tek bir
                  klavyeden ulaşılabilir.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT 03 — FOXY */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">03 / 03 · Ürün</div>
              <h2 className="display">Foxy.</h2>
              <div className="eyebrow">Platformdaki her işlem için AI yardımcısı ve risk denetmeni</div>
            </div>

            <p className="lead">
              Foxy borsa feed&apos;lerini, on-chain veriyi, türev pozisyonlamayı,
              makro takvimi ve ML sinyallerini tek bir feature store&apos;da
              birleştirir &mdash; sonra <strong>creator işlem paylaşırken
              yanında durur</strong>: riski skorlar, tail event&apos;e karşı uyarır,
              açık pozisyonlarda TP/SL&apos;i optimize eder.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <h4>Veri kumaşı — gerçek zamanlı + tarihsel, tek feature store&apos;da</h4>
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
                  hesaplar.{" "}
                  <strong>&ldquo;Trump 4 saat sonra konuşacak &mdash;
                  stop&apos;unu genişlet, size&apos;ı yarıla, ya da işlemi
                  atla.&rdquo;</strong>{" "}
                  Makro-bilinçli. Korelasyon-bilinçli. Geçen haftanın mumlarına
                  değil, çapraz-varlık geçmişine eğitildi.
                </p>
              </div>

              <div className="pcard">
                <h4>Açık pozisyonlarda TP/SL optimizasyonu</h4>
                <p>
                  Canlı işlemlerde Foxy koşullar değiştikçe TP ve stop&apos;u
                  yeniden hesaplar &mdash; creator&apos;a öneri sunar, onay
                  verildiğinde wallet bağlantılı auto-trade rail&apos;ine push&apos;lar.
                </p>
              </div>

              <div className="pcard wide">
                <h4>Borsa partneri için ne anlama gelir?</h4>
                <p>
                  Daha iyi creator riski → daha düşük alıcı churn → daha uzun
                  auto-trade ömrü →{" "}
                  <strong>borsada daha sürdürülebilir hacim</strong>. Foxy, viral
                  creator kohortu ile kalıcı creator kohortu arasındaki farktır.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROPOSAL */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">∎ Öneri</div>
              <h2 className="display">
                OKX&apos;İN DESTEĞİNE<br />
                İHTİYACIMIZ <span className="acid">OLAN ÜÇ NOKTA.</span>
              </h2>
              <div className="eyebrow">Üç somut öneri &mdash; teknik, ticari, dağıtım</div>
            </div>

            <div className="ask">
              <div className="ask-card">
                <div className="num">01</div>
                <h4>OKX Cüzdan auto-trade altyapısı</h4>
                <p>
                  BottomUP kullanıcısı OKX cüzdanını bir kez bağlasın, aldığı
                  ürünler hesabında otomatik çalışsın. En büyük unlock burada
                  &mdash; bu olmadan Marketplace bir içerik mağazası; bu varsa
                  sürekli hacim motoru.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">02</div>
                <h4>Referral atıf + gelir paylaşımı</h4>
                <p>
                  BottomUP-referansıyla gelen kullanıcılar signup&apos;ta
                  etiketlensin, temiz bir raporlama feed&apos;i olsun.{" "}
                  <strong>Fee gelirinin %70&apos;i creator&apos;a, %30 BottomUP
                  + borsa hattı paylaşımında.</strong> Kendi referral graph&apos;ını
                  getiren topluluklar aylık invoice modeline geçebilir.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">03</div>
                <h4>OKX Global coğrafyasına co-marketing</h4>
                <p>
                  Türkiye&apos;nin creator pipeline&apos;ı gerçek &mdash; kitle
                  her OKX Global pazarında var. Ortak launch (push, in-app,
                  sosyal, PR) Türk algo ve AI ajan üreticilerini LATAM, MENA,
                  GDA ve BDT kullanıcı tabanlarına gün bir&apos;de bağlar.
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
                <h3>
                  BUGÜN İYİ GİDERSE:<br />
                  6 HAFTADA 30 CREATOR&apos;LIK PİLOT.
                </h3>
                <p>
                  BottomUP&apos;ta zaten olan Türkiye&apos;nin top 30
                  trader&apos;ı ile pilot öneriyoruz &mdash; cüzdan rail&apos;i
                  canlı, referral atıf açık. Vanity metric değil, haftalık
                  hacimde ölçülebilir. Bunun altı bir senaryoda da konuşmaya
                  devam etmeyi çok isteriz.
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
