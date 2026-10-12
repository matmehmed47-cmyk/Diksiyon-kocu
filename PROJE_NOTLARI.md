# Diksiyon Koçu: Proje notları

## Amaç
Öğretmen (Mehmet) için diksiyon antrenmanı uygulaması. Çocuklara, öğretmenlere, velilere ve seminerlerde konuşmaya yönelik.
Telefon ve tablette kullanılacak. Kullanıcı işleri yalnızca telefondan yapıyor, bilgisayar yok.

## Eğitim yapısı (araştırmaya dayalı)
1. Nefes ve ses (ses sağlığı dahil)
2. Sık yapılan telaffuz hataları (kelime sonu yutma, uzun ünlüler, ğ/h vb.)
3. Vurgu, tonlama ve durak
4. Metin çalışması ve geri bildirim
İlkeler: günlük 10-15 dk kısa çalışma, zamanla azalan geri bildirim, çeşitli bağlamlar, kayıt paylaşma (insan geri bildirimi).

## Yayın
- Kod: https://github.com/matmehmed47-cmyk/Diksiyon-kocu (public)
- Site (GitHub Pages, main / root): https://matmehmed47-cmyk.github.io/Diksiyon-kocu/
- Düz HTML/CSS/JS, derleme yok. PWA (manifest + sw.js), ana ekrana eklenebilir.

## İlk sürümde olanlar
- Nefes: sesli rehber (Türkçe TTS, yoksa zil), 3 seviye (4-4-6, 4-4-8, 5-5-10), 5 tur.
  Mikrofon "sss" nefes verişini dinler: süre, denge, erken bitirme, "tut"ta nefes kaçırma.
- Ses ölçümleri: tıslama ve "aaa" tutma süresi, geçmiş ve rekor.
- Metin: 24 işaretli metin, 6 kategori (/ nefes, | kısa durak, || uzun durak, *vurgu*, ↘↗ ton).
  Kayıt, 1×/0,85×/0,7× dinleme, dalgaya dokunup oradan dinleme, hız ve durak analizi, ilk kayıtla karşılaştırma.
- Gelişimim: grafikler, seri, kayıt listesi. Veriler yalnızca telefonda (localStorage + IndexedDB).

## Sürüm 2 (11 Ekim 2026): Can Gürzap kitabına göre güncelleme
Kaynak: Can Gürzap, Söz Söyleme ve Diksiyon (Remzi Kitabevi). Kitap taranmış PDF; Diksiyon (s.105-131), Söyleyiş Yanlışları (s.147-151) ve Genel Çalışmalar başı okundu.
Telif nedeniyle kitaptan metin kopyalanmadı; yöntem ve kurallar özetlendi, tüm metinler özgün.
- Yeni **Dersler** sekmesi: çalışma yöntemi, vurgu (sözcük + cümle), tonlama, durak/nefes, sık söyleyiş hataları tablosu.
- Metin kütüphanesine 3 kategori: **Vurgu** (6), **Tonlama** (7), **Söyleyiş** (6). Toplam 43 metin, 9 kategori.
- Ders sayfalarındaki düğmeler ilgili metin kategorisini açar.
- Önbellek sürümü diksiyon-v2.
- Kitaptan henüz kullanılmayan: Nefes/ses/boğumlanma bölümleri (s.57-104), Genel Çalışmalar'daki monolog ve metin parçaları (s.152-196). Monologlar telifli olabilir, doğrudan alınmaz.
- Tarayıcıda gerçek denemesi yapılmadı (araç yoktu); söz dizimi ve HTML dengesi kontrol edildi.

## Sürüm 3 (11 Ekim 2026): kitabın üç bölümü ayrıntılı incelendi
Diksiyon (s.105-131), Söyleyiş Yanlışları (s.147-151) ve Genel Çalışmalar (s.152-196) sayfa sayfa okundu.
Ayrıntılı özetler kullanıcının Obsidian kasasında (Ders Kitabı Özetleri/), depoda değil.
- Dersler sayfası yeniden yazıldı: üstte ders menüsü; Nasıl çalışmalı, Vurgu, Tonlama, Durak, **Hız** (125-160 sözcük/dk),
  **Heyecan ve korku**, Söyleyiş (gruplu tablolar + doğru sözcük seçimi), **Doğru mu yanlış mı testi** (18 soru, karışık sıra).
- Düzeltme: olumsuz soruda vurgu (kitaptaki örneklere göre olumsuzluk hecesinde: oturMAZ mısınız).
- Metin ekranına "Kime? Ne istiyorum? Ne hissediyorum?" ipucu.
- 30 yeni özgün metin: masallar, veli görüşmeleri, diyalog, duygu geçişli monolog, seminer, vurgu, tonlama, söyleyiş. Toplam 73 metin.
- Önbellek sürümü diksiyon-v3.
- Kitaptaki monolog, şiir ve masalların neredeyse hepsi telifli; uygulamaya konmadı.
- Fikir olarak bekleyenler: iki dereceli vurgu işareti, uzatma (:) ve hızlı/ağır işaretleri, "Metin ekle", "sunum öncesi 1 dk nefes" modu,
  hazırlıklı konuşma (konu + ipucu) bölümü, kitabın Nefes/Ses/Boğumlanma bölümleri (s.57-104) henüz okunmadı.

## Sürüm 4 (11 Ekim 2026): "Çalış" sekmesi, R zorluğu
Kullanıcının asıl isteği: kitaptaki bütün etkinlikleri (hece dizileri, dudak-dil hareketleri, r/s/z bozukluğu çalışmaları)
sitede düğmeye basarak yapmak. Kitabın tamamı tarandı (özetler kullanıcının kasasında). Teker teker eklenecek.
- Yeni **Çalış** sekmesi (6. sekme; "Gelişimim" → "Gelişim"). Veriler `calismalar.js` içinde, adım türleri: bilgi, tut, kart, cumle.
- **R zorluğu** (kitap s.95-96): açıklama + kendini yokla, Rrrr/Prrrr sayaçlı ısınma (5 sn × 3 tur, bip + titreşim),
  7 hece dizisi ve 3 sözcük listesi kart olarak (dokun/otomatik, 3 tempo, isteğe bağlı telefon önce söyler),
  sözcük sonu r cümleleri, tekerleme + özgün cümleler.
- Her çalışmada mini kayıt: kayıtlar IndexedDB'de (kat: 'calis', calis: modül id), ilk kayıtla karşılaştırma. Kayıtlarım listesinde görünür.
- Sıradaki modüller: S (s.96-97), Z (s.97), Dudak ve dil (s.90, 6 hareket), Isınma (gevşeme s.44-50 + ünlü yuvarlağı s.79-81),
  Nefes (s.66-72). Kitapta ş/ç/l için ayrı çalışma yok; istenirse aynı yöntemle eklenebilir.
- jsdom ile akış testi yapıldı (gerçek tarayıcı yok).

## Sürüm 6 (11 Ekim 2026): dönüt ve kayıt yönetimi
Kullanıcı: "Sesimi analiz etsin, nerede hata yaptığımı söylesin; kayıtları istediğimde sileyim."
- **Titreşim ölçer** (Rrrr ısınması, `titresimOlc`): mikrofon zarfında 18-40 Hz genlik dalgalanması aranır
  (10 ms RMS pencere, 2 ms adım, özilinti r>0.55, derinlik>0.14). Tur başına titreşim süresi ve özet. Deneme aşamasında;
  gerçek seslerle eşikler ayarlanabilir.
- **Konuşma tanıma** (`tanima: true` adımlar): webkitSpeechRecognition tr-TR, ilk kullanımda onay (veri.ayarlar.tanima).
  Sözcükte: duyulan ≠ hedef ise r→ğ ya da eksik r teşhisi. Cümlede: r'li sözcüklerden hangileri anlaşılmadı.
  Zorlanılan sözcükler veri.calis[id].zor içinde; 1. adımda "Senin için notlar".
- **Öz değerlendirme** (`ozKontrol`): her kayıttan sonra işaretlenen sorunlara tavsiye ve "o adıma git".
- **Kayıt listesi**: çalışma başına kayıtlar, dinle / sil (iki dokunuşla) / hepsini sil. İlk kayıt karşılaştırması korunur.

## Sürüm 7 (11 Ekim 2026): titreşim ölçeri kişinin sesine göre ayarlama
- Isınma adımında "Sesime göre ayarla": 3 sn "aaaa" + 3 sn "Rrrrr" dinlenir; kisiselEsik() derinlik eşiğini
  (aaa 90. yüzdelik ile Rrrr medyanının ortası) ve özilinti eşiğini (Rrrr 25. yüzdelik − 0.05) hesaplar.
  Fark yetersizse ayarlamaz ve nedenini söyler. Ayar veri.ayarlar.titresim içinde; "Genel ayara dön" ile silinir.

## Sürüm 10 (11 Ekim 2026): R çalışmasında çeşitlilik
Kullanıcı: "Sürekli aynı şeyler çıkıyor." Amaç günlük konuşma (matematikle ilişkilendirme İSTENMEDİ).
- Hece: 14 dizi (kitabın 7'si + ara/pra/bra/kra/dra/art/kar), her açışta ra-re-ri + rastgele 4.
- Sözcük havuzu 131 (başta / ortada / sonda / ünsüzle yan yana), grup başına 8 seçilir.
- Cümle havuzları: sözcük sonu r 25 (5 seçilir), tekerleme + günlük cümle 28 (6 seçilir).
- Set, çalışma açılınca bir kez oluşur (Calis.set); "🔀 Yeni set" ile yenilenir.
- Ağırlıklı seçim: zorlanılan sözcük (zor[y] > zor[d]) ağırlığı 1 + 3·min(y−d, 3).
- Telefonun TTS'i kısa heceleri harf harf okuyor; hece kartlarında sesli okuma kapalı.

## Sürüm 11 (12 Ekim 2026): S zorluğu
- Kitap s.96-97 (s bozukluğu): dil büzülür, ucu sivrilip alt ön dişlere yaklaşır; üst diş etine değerse hava yanlardan kaçar.
- 6 adım: bilgi, Sssss/Sssszzzz ısınması, 11 hece dizisi (kitabın 5'i + sa-şa ayırma, tas, kas, sta, ast, ska),
  100 sözcük (4 grup), "S ile Ş'yi ayır" 20 cümle, tekerleme + günlük 22 cümle.
- **S incelik ölçer** (`olcum: 'keskinlik'`): 1.5-12 kHz bandında spektral ağırlık merkezi; varsayılan eşik 4800 Hz
  (ince s ≈ 5-7 kHz, ş/yanal s ≈ 3-4 kHz). Kişisel ayar: "şşşş" 90. yüzdelik ile "ssss" medyanının ortası.
- Kod genelleştirildi: OLCUMLER (titresim, keskinlik) ölçer/ayar/mesaj tanımları; modül düzeyinde
  `tanima: { harf, karisma[], eksik, genel }` ile "Söyle, kontrol edeyim" her harfe uyarlanıyor; adımda `fazAd`.

## Önbellek kuralı (sürüm 5)
Telefon yeni index.html ile eski app.js'i birleştirince Çalış sekmesi boş kaldı. Çözüm: index.html'deki css/js
bağlantılarında `?v=N` var ve sw.js aynı kaynaktan gelenleri `cache: 'no-cache'` ile çeker.
**Her güncellemede:** index.html'deki `?v=` sayısını ve sw.js'deki ONBELLEK sürümünü birlikte artır.

## Açık sorunlar
- Android'de mikrofon izni penceresi "Bu site izninizi isteyemiyor" uyarısıyla engelleniyor
  (ekran üstü öğe: sağ kenardaki yüzen kalem simgesi, ekran kaydı vb.).
  Önerilen çözüm: Ayarlar > Uygulamalar > Chrome > İzinler > Mikrofon; Chrome site ayarlarından mikrofona izin;
  olmazsa "Diğer uygulamaların üzerinde göster" iznini geçici kapatmak. Henüz çözüldüğü doğrulanmadı.
- Gerçek telefonda gerçek sesle test edilmedi; ses eşikleri ayar isteyebilir.

## Sıradaki adımlar
1. Mikrofon iznini çözmek, gerçek kullanımla eşikleri ayarlamak.
2. (Kısmen yapıldı, bkz. Sürüm 2.) Kitabın kalan bölümlerinden (nefes, boğumlanma, çalışmalar) özgün egzersizler ve halk tekerlemeleri eklenecek.
3. "Metin ekle" özelliği: kullanıcının kendi metinleri sadece telefonunda saklanır.
4. Metin sayısını artırmak (kategori başına 10-15, ses odaklı metinler: r, ş/s, kelime sonları).
5. Sonraki sürüm: "Dersler" bölümü (sık hatalar), yapay zekâ ile telaffuz hatası tespiti, metin üretme, koç yorumu.

## Sürüm 12 (12 Ekim 2026)
- S çalışmasında telefonun sesli okuması kapatıldı (modül alanı `sesli: false`); telefon kısa sözcükleri harf harf okuyordu. Sesli okuma ayarı her çalışma açılışında sıfırlanır.
- Nefes ekranında "Sss diye ver" yerine "Yavaşça ver" (harf harf okuma).
- Isınma ekranına "Bip seslerini çal" kutusu eklendi (ayar hatırlanır).
- İçerik: bozuk "büzüşesiceler" cümlesi, "çözdürür" ve tekrar eden "ses"/"istasyon" düzeltildi.

## Sürüm 13 (12 Ekim 2026)
- Tanıma metni normalleştirme: sayılar sözcüğe çevrilir ("8'de" → "sekizde", "4'ü" → "dördü"), â/î/û → a/i/u ("Rüzgâr" → "rüzgar").
- Sözcük kartında hiçbir şey duyulmadıysa "zor sözcük" sayacı artmaz.
- Tanıma başlarken telefonun sesi (Rehber) kesilir.
- Ölçerler başlangıçtaki bip/ilk anı atlar (Keskinlik 350 ms, Titreşim 450 ms).
- S ısınmasında "Sssszzzz" fazı ölçülmez (ses telli z); sonuç etiketi tam ses adını gösterir.
- Keskinlik sessizlik eşiği 0.003 → 0.005.
- Cümle adımı açılırken sesli okuma kapalı başlar; alt nota "tanıma ipucudur, kesin değil" uyarısı eklendi.
- İçerik: dilbilgisi düzeltmeleri; R listelerinde şeker (sonda), kardeş yerine tarak; R ısınmasına "abartı sadece ısınma içindir" notu.
- Nefes ekranında "Tut" fazı sesli "Nefesi tut" der (ekranda "Tut" kalır).

## Sürüm 14 (12 Ekim 2026)
- **Z zorluğu** eklendi (kitap s.97): bilgi (s'nin sesli hâli, boğaz titreşimi), "Sss → Zzz" ısınması (ölçersiz), 9 hece dizisi (sa-za ayırma dahil), 4 kategoride ~120 günlük sözcük, "S ile Z'yi ayır" cümleleri, tekerleme ve günlük cümleler. Kayıt, öz değerlendirme, "Söyle, kontrol edeyim" diğerleri gibi.
- Modül alanı `sesliMin: 5`: telefon 5 harften kısa sözcükleri okumaz (harf harf okuma riski).

## Sürüm 15 (12 Ekim 2026)
- **Dudak ve dil tembelliği** modülü eklendi (kitap s.89-91): bilgi, 6 ağız hareketi (20 sn'lik sayaçlı ısınma, `birim: 'hareket'`), hızlı hece dizileri (pa-ta-ka vb., 9 dizi), 15 halk tekerlemesi, 16 günlük cümle. Modülde `tanima` yok (tekerlemede tanıma güvenilmez), `sesli: false`.

## Sürüm 16 (12 Ekim 2026) — TASLAK
- **Konuşmadan önce ısınma** (5 dk) ve **Nefesim yetmiyor** modülleri taslak olarak eklendi (kitap s.66-72, 79-81, 90). Isınma: gevşeme-nefes, dudak-dil, Maaa-Meee, tekerleme. Nefes: doğru nefes bilgisi, kollarla nefes (kısaltılmış), sayılı nefes (6 al / 8-10-12 ver), "/" işaretli cümleler, uzun cümle tek nefeste. Süreler elle ayarlı (her tur sabit saniye), nefesi gerçekten ölçmüyor. Tanıma yok.
- Eksikler (konuşulacak): nefes ölçümü (mikrofonla verme süresi), ünlü yuvarlağı için ses perdesi, "ğ" ve ulama kuralları, h sesi, sesin renklendirilmesi (Çirozname tekniği), günlük program/hatırlatma.

## Sürüm 17 (12 Ekim 2026)
- İki ajanın topladığı halk tekerlemeleri eklendi (vault: Notlar/Araştırmalar/Tekerleme Derlemesi - 1. ve 2. Ajan). Kısa/orta zor olanlar sesine göre R, S, Z ve Dudak-dil havuzlarına; kolay çocuk/oyun tekerlemeleri Isınma'ya; uzun diksiyon metinleri yeni **Zor metinler** modülüne.
- Doğrulanamayanlar, sayı/matematik temalılar ve uygunsuz bulunanlar alınmadı. "Şemsi Paşa pasajında sesi büzüşesiceler" gerçek bir tekerleme, S havuzuna geri kondu.

## Sürüm 18 (12 Ekim 2026): Günlük rutin
Kullanıcı: günde 10-15 dk, her gün harf ve metinler değişsin, nefes başta, sıra nefes → harf → dudak-dil → tekerleme; seri sayacı ve zorlaşma istendi.
- "Bugünün rutini" kartı hem Bugün hem Çalış ekranının en üstünde. 10 adım, ~12 dk: kollarla nefes, sayılı nefes, harf ısınması, hece, sözcük, harf cümleleri, 6 ağız hareketi, hızlı hece, tekerleme, bitiş kaydı.
- Harf R → S → Z sırayla döner (her yeni günün rutininde bir sonraki). Seçimler mevcut modül havuzlarından yapılır (calisBul), yeni içerik yok.
- Son 7 günde görülen sözcük/cümle/diziler ağırlık ×0.03 ile neredeyse hiç gelmez (veri.rutin.goruldu, 30 günden eskiler silinir); zorlanılan sözcükler daha sık.
- Günün seti bir kez kurulur ve veri.rutin.bugun içinde saklanır; adım ve ✓ bölümler kaydedilir, kaldığın yerden devam edilir. Bölüm çipleri ✓ gösterir ve dokununca o bölüme gider.
- Seri: veri.rutin.gunler ile ayrı "🔥 N gün" sayacı. Seviye tamamlanan gün sayısına göre: 0-6 Başlangıç, 7-13 Orta, 14+ İleri. Seviye artınca nefes verme sayıları, ısınma turu, dizi/sözcük/cümle sayısı, hareket süresi ve tekerleme uzunluğu artar; İleri'de bir "Zor metin" eklenir.
- Kayıtlar calis: 'rutin' altında; tanıma ve zor sözcük verisi harfin kendi modülüne yazılır (modul.veriId).
- jsdom ile akış, ertesi gün harf değişimi, tekrar etmeme, seri, seviye ve devam testi yapıldı. Gerçek telefonda denenmedi.

## Sürüm 19 (12 Ekim 2026): rutinde dinlemeli nefes
Kullanıcı: "Nefes al, sssss diye ver" ve nefes verişi kontrol edilsin; 6-8 iyi, seviyeyle zorlaşsın.
- Rutinin 2. adımı yeni adım türü `nefesOlc` (nefesOlcCiz): 2 sn ortam ölçümü, sonra 5 tur 6 sn al / 8-10-12 sn (seviyeye göre) "sssss" ver.
  Nefes sekmesindeki ölçümle aynı yöntem (1500 Hz yüksek geçiren süzgeç, esikHesapla): duyamadım / erken bitirdin / geç başladın / dalgalı / güzel; "al" sırasında 1,5 sn'den fazla ses varsa uyarı.
  Özet + veri.nefesler'e kayıt (seviye: 'rutin'). Mikrofon izni yoksa sadece rehberli çalışır.
- Telefon "Yavaşça ver" der (TTS "Sss"yi harf harf okur), ekranda "Sssss diye ver" yazar.
- RUTIN_SURUM 2: bugünkü kayıtlı set yeniden kurulur (harf aynı kalır).
- jsdom'da sahte mikrofonla test edildi (erken bırakılan tur yakalandı).

## Sürüm 20 (12 Ekim 2026): Şiirler ve rutinde "Günün şiiri"
- **14 şiir eklendi** (metinler.js, p4-p17; Can Gürzap, "Söz Söyleme ve Diksiyon", s.177-189): Beni unutma, Sessiz gemi, Anabel Lee, Mutlu olabilme sanatı, İçe kapanış, Endülüs'te raks, Ne içindeyim zamanın, Hürriyete doğru, Kaldırımlar, Hikâye, O gece, Resim, Aşk, Ben sana mecburum. La Fontaine masalı (şiir değil) alınmadı. Metin kitaptaki taramadan, sözcükleri değiştirmeden yazıldı.
- **İzin notu:** kullanıcı kitabevinden yayın izni aldığını bildirdi (12 Ekim 2026). Kaynak ve not metinler.js başındaki yorumda da var.
- **İşaretleme ilkeleri:** `/` nefes, yalnızca anlam birimi bitince (genelde 2 dizede bir, cümle sonunda; anlamı bölen yerde yok). `|` kısa durak: virgül, hitap, söz öbeği sınırı, anlamın sonraki dizeye taştığı dize sonları. `||` her kıtanın sonunda ve şiir bitişinde. Ton oku yok (kitap: şiiri düz yazı gibi oku); vurgu yalnızca Aşk'ta "*Git.*". Kıtalar görüntüdeki boşluklara göre; boşluk yoksa mantıklı kıtalara bölündü (Anabel Lee, Mutlu olabilme sanatı, İçe kapanış 4-4-3-3, Hürriyete doğru, Aşk ve Ben sana mecburum kıtalaması kitaptaki gibi).
- **Kategori sırası:** Tekerleme, Şiir, Çocuklara, Velilere, Öğretmenlere, Seminer, Vurgu, Tonlama, Söyleyiş.
- **app.js:** `metinCiz` içindeki belirteç çizimi ortak `isaretliYaz(alan, metin)` işlevine çıkarıldı (kelime/işaret sayısını döndürür). Yeni adım türü `siir` (`siirCiz`).
- **Günlük rutin:** tekerlemeden sonra, bitiş kaydından önce "Günün şiiri" adımı (11 adım, ~14 dk). Bölümler: Nefes, harf sesi, Dudak-dil, Tekerleme, Şiir, Bitiş. Şiir `rutinSec` ile seçilir (son 7 gün ağırlık ×0.03, anahtar `siir:<id>`); uzunluk sınırı: Seviye 1 ≤ 14 dize, Seviye 2 ≤ 24, Seviye 3 sınırsız. RUTIN_SURUM 3 (bugünkü set yeniden kurulur). Öz değerlendirme adım eşlemesi (esle) değişmedi; şiir adımı sonda olduğu için indeksler aynı.
- **Belirsiz sözcükler (taramada):** Hürriyete doğru'da "ıpların çalkantısında" (görüntüdeki yazım kullanıldı); Kaldırımlar son kıtada "Asla buz gibi taşlar alnımdan" (görüntüdeki "Asla" kullanıldı; başka basımlarda "Alsa" olabilir). Ayrıca kitaptaki olası baskı yazımları aynen bırakıldı: Ben sana mecburum'da "Ne vakit bir yaşamak düşünsen", Anabel Lee'de "rüzgarından" (düzeltme işaretsiz).
- Sürüm: ?v=20, önbellek diksiyon-v20. jsdom ile rutin akışı (11 adım), şiir adımının işaretli çizimi, 3 seviyede şiir seçimi, Metin sekmesi şiir kategorisi ve kategori sırası test edildi; JS hatası yok.
