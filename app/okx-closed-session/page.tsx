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
        {/* OPENER 1 */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">Kapalı oturum</div>
            <h1 className="opener-display">
              Kasım 2027<br />
              <span className="opener-tail">geldiğinde…</span>
            </h1>
          </div>
        </section>

        {/* OPENER 2 */}
        <section className="opener">
          <div className="shell">
            <div className="eyebrow">2027 yılı toplam ciro hedefimiz</div>
            <h1 className="opener-display acid">$13.5M</h1>
            <p className="opener-sub">
              Yıllık ciro &middot; Seri A yatırım turu eşiği
            </p>
          </div>
        </section>

        {/* OPENER 3 */}
        <section className="opener">
          <div className="shell">
            <h1 className="opener-display question">
              Peki nasıl<br />
              <span className="acid">olacak?</span>
            </h1>
          </div>
        </section>

        {/* 01 / PERSONA */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">01 / Persona</div>
              <h2 className="display">Kullanıcılar.</h2>
              <div className="eyebrow">B2C ve B2B. Her segmentin kendi stratejisi var.</div>
            </div>

            <h3 className="subhead">B2C</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Hayatında borsa görmemiş</h4>
                <p>
                  Hiç borsa hesabı açmamış kullanıcı. KYC, cüzdan ve copy-trade
                  tek akışta &mdash; beş dakikada hesabı çalışmaya başlıyor.
                </p>
              </div>
              <div className="segment-card">
                <h4>Klasik yatırımcı</h4>
                <p>
                  Banka mevduatında, BES&apos;te ya da fonda parası olan
                  kullanıcı. Klasik araçtan kriptoya geçişte aradığı güvenli
                  kapı biziz.
                </p>
              </div>
              <div className="segment-card">
                <h4>Yüksek bakiyeli</h4>
                <p>
                  Büyük cüzdan sahibi kullanıcı. Özel onboarding, kapalı
                  creator listesine erişim, kişiye özel risk takibi.
                </p>
              </div>
              <div className="segment-card">
                <h4>Aktif retail trader</h4>
                <p>
                  OKX&apos;i zaten kullanan, kendi setup&apos;ı olan trader.
                  Foxy ve creator topluluğu sayesinde işine ek bir avantaj
                  alıyor.
                </p>
              </div>
              <div className="segment-card">
                <h4>Bir creator&apos;ı takip eden</h4>
                <p>
                  Beğendiği trader&apos;ı zaten izliyor. Telegram&apos;dan
                  screenshot beklemek yerine BottomUP&apos;ta tek tuşla aynı
                  işlemi açıyor.
                </p>
              </div>
              <div className="segment-card">
                <h4>Pasif gelir arayan</h4>
                <p>
                  Aktif trade etmek istemiyor. Portföyünü kuruyor, bırakıyor;
                  aylık ortalama %5+ taahhüdü çalışmaya devam ediyor.
                </p>
              </div>
            </div>

            <h3 className="subhead">B2B</h3>
            <div className="persona-grid">
              <div className="segment-card">
                <h4>Bankalar</h4>
                <p>
                  Trading masası ve private banking tarafı için Foxy&apos;nin
                  risk + sinyal API&apos;leri. Müşterilerine BottomUP altyapısı
                  ile copy-trading sunuyorlar.
                </p>
              </div>
              <div className="segment-card">
                <h4>Hedge fonlar</h4>
                <p>
                  Foxy&apos;nin veri katmanı &mdash; Arkham, Coinglass, makro
                  takvim, ML sinyalleri &mdash; doğrudan API olarak alıyorlar.
                </p>
              </div>
              <div className="segment-card">
                <h4>Faktöring şirketleri</h4>
                <p>
                  Kripto alacak skorlama, OTC takas riski analizi, on-chain
                  karşı taraf izleme. Mevcut süreçlerine entegre ediyorlar.
                </p>
              </div>
              <div className="segment-card">
                <h4>Aracı kurumlar</h4>
                <p>
                  Kendi markaları altında trader marketplace ve sosyal platform.
                  Kullanıcılar BottomUP deneyimini bizim ürünümüzü görmeden
                  alıyor.
                </p>
              </div>
              <div className="segment-card">
                <h4>Varlık yönetimi şirketleri</h4>
                <p>
                  Müşterilerine BottomUP üzerinden copy-trading hizmeti
                  satıyorlar. Seçilmiş creator listesi ve risk takibi bizden
                  geliyor.
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
              <div className="eyebrow">BottomUP&apos;ta satış yapan üreticiler &middot; %70 onlara, %30 platform hattına</div>
            </div>

            <p className="lead">
              Algo&apos;sunu, AI ajanını, sinyalini, eğitim setini ya da
              topluluğunu BottomUP&apos;ta satışa açan herkes creator. Fiyatı
              kendileri belirler; ödeme, keşif, fraud kontrolü ve payout tarafı
              bizde.
            </p>

            <div className="persona-grid">
              <div className="segment-card">
                <h4>Algo geliştiriciler</h4>
                <p>
                  Mean-reversion, momentum, arbitraj. Geliştirdikleri otomatik
                  trading sistemini paketleyip satıyorlar.
                </p>
              </div>
              <div className="segment-card">
                <h4>AI ajan üreticileri</h4>
                <p>
                  LLM tabanlı, otonom karar veren ajanlar. Kullanıcının
                  cüzdanında doğal dil ile pozisyon açıp kapatıyor.
                </p>
              </div>
              <div className="segment-card">
                <h4>İnsan trader&apos;lar</h4>
                <p>
                  Kendi pozisyonunu açık paylaşan, takipçisi auto-copy ile
                  doğrudan bağlanan manuel trader.
                </p>
              </div>
              <div className="segment-card">
                <h4>Sinyal &amp; eğitim üreticileri</h4>
                <p>
                  Düzenli sinyal akışı, video eğitim setleri, abonelikli
                  premium içerik.
                </p>
              </div>
              <div className="segment-card">
                <h4>Topluluk operatörleri</h4>
                <p>
                  İçinde çoklu trader barındıran topluluğu listeliyor.
                  Kullanıcı topluluğun tamamını tek paket olarak alıyor.
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
              Creator ürününü listeler, <strong>fiyatı kendisi koyar</strong>.
              Ödeme, keşif, payout &mdash; hepsi bizde. Karşılığında zaten
              trade eden, dünya genelinde bir kitleye ulaşır.
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
                <h4>Reklam envanteri</h4>
                <p>
                  Listing&apos;de öne çıkarma, push ve email gönderimi, uygulama
                  içi banner, topluluk spotu.{" "}
                  <strong>Creator BottomUP kullanıcısına ulaşmak için reklam
                  alıyor</strong> &mdash; satış komisyonunun üstüne ikinci gelir
                  hattı.
                </p>
              </div>

              <div className="pcard">
                <h4>Cüzdan → otomatik trade</h4>
                <p>
                  Kullanıcı OKX cüzdanını bir kez bağlıyor; satın aldığı ürünler
                  hesabında otomatik işliyor.{" "}
                  <strong>Bizim referansımızdan gelen hacmin %70&apos;i
                  creator&apos;a, %30&apos;u platforma.</strong>{" "}
                  Tek seferlik satış değil, sürekli işleyen bir gelir hattı.
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
                SOCIAL<span className="acid">+</span>
              </h2>
              <div className="eyebrow">Trader ve takipçilerinin asıl evi</div>
            </div>

            <p className="lead">
              Trader, takipçisini başkasının evinde &mdash; Telegram&apos;da,
              Discord&apos;da &mdash; gezdirmemeli. <strong>Social+ chat,
              içerik ve canlı trade&apos;in tek ekrana toplandığı yer.</strong>
            </p>

            <div className="pcards three">
              <div className="pcard">
                <h4>Tek platform, her format</h4>
                <p>
                  Spot, futures, hisse, FX, makro &mdash; istediği konuya bir
                  kanal açıyor. Video, shorts, canlı yayın, eğitim, planlı seans
                  &mdash; <strong>hepsi chat ile aynı akışta</strong>.
                </p>
              </div>
              <div className="pcard">
                <h4>Alıcı işlemi canlı görür</h4>
                <p>
                  Marketplace&apos;ten trader alan kullanıcı,
                  trader&apos;ın pozisyonunu canlı izliyor.{" "}
                  <strong>Pozisyon, chat ve auto-trade aynı ekranda.</strong>
                </p>
              </div>
              <div className="pcard">
                <h4>Her dil, her ülke</h4>
                <p>
                  Mesaj, post, caption &mdash; hepsi AI ile çevriliyor. Creator
                  kendi dilinde yazıyor, takipçi kendi dilinde okuyor.{" "}
                  <strong>OKX Global&apos;ın olduğu her pazara tek
                  klavyeden ulaşılıyor.</strong>
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
              <div className="eyebrow">Her işlemin yanında duran AI ve risk asistanı</div>
            </div>

            <p className="lead">
              Foxy borsa fiyatlarını, on-chain veriyi, türev pozisyonlarını,
              makro takvimi ve ML sinyallerini <strong>tek bir veri katmanında
              topluyor</strong>. Creator işlem paylaşırken yanında, kullanıcı
              işlem alırken arkasında duruyor.
            </p>

            <div className="pcards">
              <div className="pcard wide">
                <h4>Tek veri katmanı &mdash; canlı + tarihsel</h4>
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
                <h4>Creator için risk skoru</h4>
                <p>
                  Creator işlemi paylaşmadan önce Foxy risk skorunu hesaplıyor.{" "}
                  <strong>&ldquo;Trump 4 saat sonra konuşacak. Stop&apos;unu
                  genişlet, pozisyonu yarıya indir ya da bu işlemi
                  atla.&rdquo;</strong>{" "}
                  Makro ve korelasyona dikkat eden bir model.
                </p>
              </div>

              <div className="pcard">
                <h4>Açık pozisyonda TP / SL ayarı</h4>
                <p>
                  Pozisyon açıkken Foxy şartlar değiştikçe TP ve stop
                  seviyelerini yeniden hesaplıyor. Onay verilirse cüzdan
                  bağlantılı auto-trade&apos;e iletiliyor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / BÜYÜME */}
        <section>
          <div className="shell">
            <div className="sec-head">
              <div className="sec-num">04 / Büyüme</div>
              <h2 className="display">Bugünden $13.5M&apos;a.</h2>
              <div className="eyebrow">AAARRR funnel &middot; APAC &middot; LATAM &middot; MENA</div>
            </div>

            <h3 className="subhead">Bugünkü ayak izimiz</h3>
            <div className="stat-strip">
              <div>
                <div className="k">İşlem hacmi</div>
                <div className="v">$1.56B</div>
                <div className="sub">Tüm zamanlar, BottomUP referansıyla OKX&apos;e gelen USDT</div>
              </div>
              <div>
                <div className="k">Geri ödenen komisyon</div>
                <div className="v">$118K</div>
                <div className="sub">$118,282.8 USDT &mdash; OKX&apos;in bize toplam ödemesi</div>
              </div>
              <div>
                <div className="k">Açılan mevduat</div>
                <div className="v">$3.74M</div>
                <div className="sub">BottomUP üzerinden OKX&apos;e yatırılan USDT</div>
              </div>
              <div>
                <div className="k">BottomUP&apos;a net oran</div>
                <div className="v">$140 / $1M</div>
                <div className="sub">Hacmin %0,014&apos;ü. İki kanal: (1) kaldıraç işlem komisyon iadesinin yarısı $50 — %20&apos;si ($10) kullanıcıya iade, kalan $40 bize; (2) $100/$1M hacim bonusu. Net: $40 + $100 = $140/$1M.</div>
              </div>
            </div>

            <h3 className="subhead">AAARRR &mdash; her aşamada strateji ve aksiyon</h3>
            <div className="funnel-grid">
              <div className="funnel-card">
                <span className="stage">A · Awareness</span>
                <h4>Bölgesel görünürlük</h4>
                <p>
                  APAC, LATAM ve MENA&apos;da yerel trader iş birlikleri, OKX
                  ile ortak PR çıkışları, bölgesel medya ve etkinlik anlaşmaları.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Acquisition</span>
                <h4>Cüzdan-öncelikli kayıt</h4>
                <p>
                  OKX cüzdan bağlantısı tek tıkla. Creator&apos;lardan gelen
                  kitle, üçlü referans ağı, bölgesel marka temsilcileri.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">A · Activation</span>
                <h4>İlk 30 gün, ilk getiri</h4>
                <p>
                  Kullanıcı bir ürün almadan ya da auto-trade&apos;i bağlamadan
                  değer almıyor. Onboarding bu ikisini ilk 30 günde mutlaka
                  oluşturuyor.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Retention</span>
                <h4>%5+ aylık taban</h4>
                <p>
                  Performans taahhüdü. 12 ayın ortalaması aylık %5&apos;in
                  altına düşmüyor. Detaylı hesap KORUMA bölümünde.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Revenue</span>
                <h4>Segment başına gelir</h4>
                <p>
                  Yüksek bakiyeli kullanıcı yüksek getiri, retail orta getiri,
                  B2B sabit sözleşme. Karma toplam $13.5M.
                </p>
              </div>
              <div className="funnel-card">
                <span className="stage">R · Referral</span>
                <h4>Üçlü referans ağı</h4>
                <p>
                  Kullanıcı, creator ve topluluk &mdash; üçü de yeni kullanıcı
                  getiriyor, üçü de gelir paylaşımına bağlı.
                </p>
              </div>
            </div>

            <h3 className="subhead">$13.5M nereden geliyor</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Toplam 2027 ciro</div>
                <div className="v">$13.5M</div>
                <div className="sub">Seri A yatırım turu eşiği</div>
              </div>
              <div>
                <div className="k">Borsa hattı</div>
                <div className="v">$8M</div>
                <div className="sub">OKX referans hacmi komisyonu (detay aşağıda)</div>
              </div>
              <div>
                <div className="k">Kredi + reklam</div>
                <div className="v">$4,5M</div>
                <div className="sub">Uygulama içi kredi sistemi (kullanıcı marketplace&apos;te harcıyor) + reklam envanteri</div>
              </div>
              <div>
                <div className="k">B2B anlaşmalar</div>
                <div className="v">$1M</div>
                <div className="sub">Banka, hedge fon, faktöring, brokerage, varlık yönetimi</div>
              </div>
            </div>

            <h3 className="subhead">$8M borsa hattı için gereken hacim</h3>
            <div className="stat-strip">
              <div>
                <div className="k">Net oran</div>
                <div className="v">$140 / $1M</div>
                <div className="sub">BottomUP&apos;a düşen — kickback sonrası</div>
              </div>
              <div>
                <div className="k">Yıllık hacim</div>
                <div className="v">~$57B</div>
                <div className="sub">USDT/yıl &middot; $8M ciroya karşılık</div>
              </div>
              <div>
                <div className="k">Aylık koşu hızı</div>
                <div className="v">~$4,8B</div>
                <div className="sub">USDT/ay pilot sonunda</div>
              </div>
              <div>
                <div className="k">Kümülatif ayak izimize ölçek</div>
                <div className="v">~37×</div>
                <div className="sub">Mevcut $1,56B&apos;dan yıllık $57B&apos;a</div>
              </div>
            </div>

            <p className="section-bridge">
              <strong>Borsa hattı detayı:</strong> OKX ile iki ayrı ödeme
              kanalı işliyor. Birincisi kaldıraç işlem hacmindeki komisyon
              iadesi &mdash; OKX&apos;in $1M&apos;a topladığı $100 komisyonun
              yarısı ($50) bize, %20&apos;sini ($10){" "}
              <strong>işlemi yapan kullanıcıya iade ediyoruz</strong>, kalan
              $40 bizde. İkincisi hacim bonusu &mdash; her $1M&apos;a $100 ek,
              kickback yok. Toplam BottomUP&apos;a net:{" "}
              <strong>$140 / $1M, yani hacmin %0,014&apos;ü</strong>.
            </p>
            <h3 className="subhead">Büyüme planı &mdash; 16 ay, bölgesel hedef, unit economics</h3>
            <div className="stat-strip">
              <div>
                <div className="k">APAC · Ölçek</div>
                <div className="v">260K</div>
                <div className="sub">Kullanıcı · ARPU ~$17,5/yıl · $4,55M ciro</div>
              </div>
              <div>
                <div className="k">LATAM · Etkileşim</div>
                <div className="v">160K</div>
                <div className="sub">Kullanıcı · ARPU ~$26/yıl · $4,16M ciro</div>
              </div>
              <div>
                <div className="k">MENA · Yüksek değer</div>
                <div className="v">80K</div>
                <div className="sub">Kullanıcı · ARPU ~$47/yıl · $3,76M ciro</div>
              </div>
              <div>
                <div className="k">Toplam retail</div>
                <div className="v">500K</div>
                <div className="sub">Kullanıcı · $25 blended ARPU · $12,5M retail ciro</div>
              </div>
            </div>
            <p className="section-bridge">
              <strong>$4M büyüme bütçesi 16 aya yayılır</strong> (aylık
              ~$250K). Aylık ortalama 31.300 yeni kullanıcı edinim &mdash;
              APAC&apos;a 16,3K, LATAM&apos;a 10K, MENA&apos;ya 5K. Retail
              ARPU <span className="ink-2" style={{ fontStyle: "italic" }}>(Average Revenue Per User &mdash; kullanıcı başına yıllık ortalama ciro)</span>{" "}
              iki katmandan beslenir: kullanıcı başı yıllık{" "}
              <strong>$16 borsa komisyonu</strong> (OKX işlem hacmiyle
              orantılı) + <strong>$9 kredi ve reklam</strong> = $25 blended
              retail ARPU. MENA&apos;nın yüksek değerli müşteri segmenti
              ($47/yıl) APAC&apos;ın yalın ölçek segmentinin ($17,5/yıl)
              karşısında blended&apos;ı dengeliyor. Kullanıcı başı OKX işlem
              hacmi: <strong>~$114K/yıl</strong> (~$9,5K/ay) &mdash; aktif
              trader segmenti için makul taban.
            </p>

            <h3 className="subhead">OKX&apos;in desteğine ihtiyacımız olan üç nokta</h3>
            <div className="ask">
              <div className="ask-card">
                <div className="num">01</div>
                <h4>OKX Cüzdan auto-trade altyapısı</h4>
                <p>
                  Kullanıcı OKX cüzdanını bir kez bağlasın, satın aldığı
                  ürünler hesabında otomatik çalışsın. Modelin tamamını açan
                  parça bu.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">02</div>
                <h4>Net referans takibi + tier görünürlüğü</h4>
                <p>
                  BottomUP referansıyla gelen kullanıcılar kayıt sırasında
                  temiz etiketlensin, net bir raporlama akışı olsun. Hacim
                  büyüdükçe üst tier&apos;a geçişin yol haritası açık
                  yazılsın.
                </p>
              </div>
              <div className="ask-card">
                <div className="num">03</div>
                <h4>APAC + LATAM + MENA ortak çıkış</h4>
                <p>
                  OKX Global&apos;ın güçlü olduğu üç bölgede ortak lansman:
                  push, uygulama içi, sosyal medya, yerel basın.
                  Creator&apos;lar ilk gün bu pazarlarda görünür hale geliyor.
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
              BottomUP&apos;tan hangi ürünü alırsa alsın, kullanıcının portföyü{" "}
              <strong>12 ayın ortalamasında aylık %5 getirinin altına
              düşmüyor.</strong> Bir ay %4, başka ay %6 olabilir; 12 ayın
              ortalaması %5 tabanını her zaman tutuyor.
            </p>

            <div className="stat-strip">
              <div>
                <div className="k">Aylık taban</div>
                <div className="v">%5</div>
                <div className="sub">12 ayın ortalaması</div>
              </div>
              <div>
                <div className="k">Yıllık bileşik</div>
                <div className="v">%79.6</div>
                <div className="sub">(1.05)¹² − 1 &mdash; kazanç hesapta kalırsa</div>
              </div>
              <div>
                <div className="k">Yıllık düz</div>
                <div className="v">%60</div>
                <div className="sub">%5 × 12 &mdash; ay sonu çekilirse</div>
              </div>
              <div>
                <div className="k">Pencere</div>
                <div className="v">12 ay</div>
                <div className="sub">Ortalamanın alındığı süre</div>
              </div>
            </div>

            <h3 className="subhead">Nasıl koruyoruz</h3>
            <div className="pcards three">
              <div className="pcard">
                <h4>Foxy filtresi</h4>
                <p>
                  Foxy creator ve ürünün performansını 7/24 izliyor. Eşik altına
                  düşen ürün otomatik olarak listeden çıkıyor; yeni kullanıcı o
                  ürüne giremiyor.
                </p>
              </div>
              <div className="pcard">
                <h4>Performans havuzu</h4>
                <p>
                  Aşağı sapan ürünlerde fark BottomUP&apos;ın performans
                  havuzundan kapatılıyor. Kötü performansın yükünü kullanıcı
                  taşımıyor.
                </p>
              </div>
              <div className="pcard">
                <h4>Geri ödeme veya değişim</h4>
                <p>
                  Yıllık ortalaması %5&apos;in altına düşen üründe kullanıcı
                  parasını geri alıyor ya da başka bir ürünle değiştiriyor.
                </p>
              </div>
            </div>

            <p className="section-bridge">
              Bu taahhüt BottomUP&apos;ı vazgeçilmez kılıyor. Kullanıcı her ay
              artıda kalıyorsa parasını çıkarmak için bir sebebi kalmıyor;
              OKX&apos;teki hacim sürekli akıyor. Viral creator dalgası ile
              kalıcı creator kütlesi arasındaki fark tam olarak burada.
            </p>
          </div>
        </section>

        <footer className="foot">
          <div className="shell foot-row">
            <span>© BottomUP · Kapalı oturum</span>
            <span>Bu sayfa arama motorlarına kapalı &middot; paylaşmayın</span>
            <span>{stamp}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
