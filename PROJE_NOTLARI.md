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
