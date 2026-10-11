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
