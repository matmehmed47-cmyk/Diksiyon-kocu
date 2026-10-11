/*
  Sese / soruna göre çalışmalar ("Çalış" sekmesi).
  Kaynak yöntem: Can Gürzap, Söz Söyleme ve Diksiyon (Konuşma bölümü, ses bozuklukları).
  Hece dizileri, sözcük listeleri ve halk tekerlemeleri genel alıştırma malzemesidir;
  açıklamalar ve cümleler bu uygulama için yazılmıştır.

  Adım türleri:
    bilgi  : açıklama + maddeler (+ isteğe bağlı "dene" sözcükleri)
    tut    : bir sesi belirli süre tutma (tur, süre, dinlenme)
    kart   : hece / sözcük kartları (diziler)
    cumle  : cümle ve tekerleme listesi
*/
window.CALISMALAR = [
  {
    id: 'r', harf: 'R', ad: 'R zorluğu', ozet: 'R sesi çıkmıyor, ğ gibi ya da yutulmuş duyuluyor.',
    hazir: true,
    // "Söyle, kontrol edeyim": duyulan sözcükte hedef harf hangi harfe dönmüşse o açıklama gösterilir
    tanima: {
      harf: 'r',
      karisma: [
        { harf: 'ğ', yazi: 'R, ğ gibi çıkmış olabilir. Dil ucunu öne getir.' },
        { harf: 'g', yazi: 'R, ğ gibi çıkmış olabilir. Dil ucunu öne getir.' },
        { harf: 'l', yazi: 'R, l gibi çıkmış olabilir. Dil ucu titremeli, değip kalmamalı.' },
        { harf: 'y', yazi: 'R, y gibi çıkmış olabilir. Dil ucunu üst diş etine yaklaştır.' }
      ],
      eksik: 'R sesi duyulmadı ya da zayıf kaldı. Dil ucu titremeli.',
      genel: 'R sesini dil ucuyla, net ama hafif söylemeyi dene.'
    },
    // Kayıttan sonra kendi kulağınla değerlendirme. adim: tavsiye edilen adımın sırası (0'dan başlar)
    ozKontrol: [
      { id: 'net', yazi: 'R’ler net ve hafif duyuldu', iyi: true, tavsiye: 'Harika! Tempoyu bir kademe artırıp yeniden dene.' },
      { id: 'g', yazi: 'Bazı r’ler ğ gibi çıktı', tavsiye: 'Dilini geriye çekiyorsun. Dil ucunu öne, üst ön dişlerin arkasındaki diş etine getir. Isınmada Rrrr çalış.', adim: 1 },
      { id: 'yok', yazi: 'Bazı r’ler hiç duyulmadı', tavsiye: 'Dil ucu titremiyor. Önce Rrrr ısınması, sonra hece kartlarını yavaş tempoda çalış.', adim: 2 },
      { id: 'son', yazi: 'Sondaki r’leri yuttum (geliyo, yapıyo)', tavsiye: 'Sözcük sonundaki r’ye dikkat: hafif ama mutlaka duyulsun.', adim: 4 },
      { id: 'sert', yazi: 'R çok sert, fazla titredi', tavsiye: 'Türkçede r hafiftir. Dil ucu bir kez dokunup geçsin, uzun titretme.' },
      { id: 'hiz', yazi: 'Hızlı okudum, sesler karıştı', tavsiye: 'Tempoyu Yavaş’a al. Her heceyi ayrı ve net söyle.', adim: 2 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'R sesi nasıl çıkar?',
        metin: [
          'R sesinde dilin kenarları köpek dişlerinden başlayarak üst diş köklerine değer. Dil ucu, üst ön dişlerin hemen arkasındaki diş etine yaklaşır ve hafifçe titrer.'
        ],
        maddeler: [
          '<b>Dili geriye çekersen</b> r, yumuşak g gibi çıkar: “kara” yerine “kağa”.',
          '<b>Dil ucu titremezse</b> r kaybolur: “para” yerine “paa”.',
          'Türkçede r <b>hafif</b> söylenir. Fazla titretmek konuşmayı sertleştirir.',
          'Ama yutmak da yanlış: “yapıyo” değil <b>yapıyor</b>, “geliyolar” değil <b>geliyorlar</b>.'
        ],
        dene: { yonerge: 'Önce kendini yokla: Aşağıdakileri sesli söyle ve kaydet. Çalışmanın sonunda bir daha kaydedip karşılaştırırsın.', sozler: ['kara', 'para', 'bir adam', 'geliyorlar', 'Rıza resim yapıyor.'] }
      },
      {
        tur: 'tut', baslik: 'Isınma: Rrrr ve Prrrr',
        maddeler: [
          'Mümkünse aynaya bak.',
          'Dil ucunu üst ön dişlerin arkasındaki diş etine götür.',
          'Güçlü bir nefes ver ve dilini <b>abartarak</b> titret: Rrrrrrr.',
          'Sonra dudaklarını da katarak dene: Prrrrrr.',
          'Hemen titremezse zorlama. Dilini gevşek bırak, nefesi biraz artır. Her gün denedikçe gelir.'
        ],
        sesler: ['Rrrrrrr', 'Prrrrrr'], sure: 5, dinlenme: 4, turSayisi: 3, olcum: 'titresim'
      },
      {
        tur: 'kart', baslik: 'Hece kartları', hece: true, sabitDizi: 1, secimDizi: 5,
        yonerge: 'Her heceyi net söyle. Önce yavaş, ısındıkça tempoyu artır. Her açışta farklı diziler gelir.',
        diziler: [
          { ad: 'ra - re - ri', ogeler: ['ra', 're', 'ri', 'ro', 'ru', 'rö', 'rü'] },
          { ad: 'ar - er - ir', ogeler: ['ar', 'er', 'ir', 'or', 'ur', 'ör', 'ür'] },
          { ad: 'rar - rer - rir', ogeler: ['rar', 'rer', 'rir', 'ror', 'rur', 'rör', 'rür'] },
          { ad: 'tar - ter - tir', ogeler: ['tar', 'ter', 'tir', 'tor', 'tur', 'tör', 'tür'] },
          { ad: 'tra - tre - tri', ogeler: ['tra', 'tre', 'tri', 'tro', 'tru', 'trö', 'trü'] },
          { ad: 'far - fer - fir', ogeler: ['far', 'fer', 'fir', 'for', 'fur', 'för', 'für'] },
          { ad: 'fra - fre - fri', ogeler: ['fra', 'fre', 'fri', 'fro', 'fru', 'frö', 'frü'] },
          { ad: 'ara - ere - iri', ogeler: ['ara', 'ere', 'iri', 'oro', 'uru', 'ırı', 'örö', 'ürü'] },
          { ad: 'pra - pre - pri', ogeler: ['pra', 'pre', 'pri', 'pro', 'pru', 'prö', 'prü'] },
          { ad: 'bra - bre - bri', ogeler: ['bra', 'bre', 'bri', 'bro', 'bru', 'brö', 'brü'] },
          { ad: 'kra - kre - kri', ogeler: ['kra', 'kre', 'kri', 'kro', 'kru', 'krö', 'krü'] },
          { ad: 'dra - dre - dri', ogeler: ['dra', 'dre', 'dri', 'dro', 'dru', 'drö', 'drü'] },
          { ad: 'art - ert - irt', ogeler: ['art', 'ert', 'irt', 'ort', 'urt', 'ört', 'ürt'] },
          { ad: 'kar - ker - kir', ogeler: ['kar', 'ker', 'kir', 'kor', 'kur', 'kör', 'kür'] }
        ]
      },
      {
        tur: 'kart', baslik: 'Sözcükler', tanima: true, secim: 8,
        yonerge: 'Her sözcükte r duyulsun ama sert olmasın. Her açışta farklı sözcükler gelir; zorlandıkların daha sık çıkar.',
        havuz: [
          { ad: 'Başta r', ogeler: ['radyo', 'raf', 'rahat', 'rakam', 'randevu', 'renk', 'resim', 'rica', 'rüzgâr', 'rüya', 'rapor', 'reçel', 'reçete', 'rehber', 'rekor', 'ressam', 'roman', 'rol', 'rota', 'rulo', 'risk', 'rıhtım', 'raket', 'roka', 'rumuz', 'rötar', 'rüküş', 'rimel'] },
          { ad: 'Ortada r', ogeler: ['araba', 'kurabiye', 'kirpi', 'kardeş', 'karınca', 'burun', 'erik', 'armut', 'portakal', 'dürüst', 'örnek', 'bereket', 'merak', 'harika', 'şeker', 'kiraz', 'haziran', 'kahraman', 'horoz', 'perde', 'terlik', 'yorgan', 'çarşamba', 'cumartesi', 'arkadaş', 'birlikte', 'kırmızı', 'sarı', 'ırmak', 'kara', 'para', 'koro', 'körük', 'kürek', 'teras', 'turuncu', 'yuvarlak', 'serin', 'güvercin'] },
          { ad: 'Sonda r', ogeler: ['kar', 'var', 'yer', 'her', 'bir', 'duvar', 'bahar', 'çınar', 'pınar', 'sabır', 'fikir', 'şehir', 'nehir', 'kader', 'haber', 'beraber', 'çiçekler', 'kuşlar', 'yıllar', 'gelir', 'gider', 'okur', 'yazar', 'sever', 'bakar', 'çalışır', 'söyler', 'bilir', 'ister', 'kapılar', 'çocuklar', 'zar', 'ter', 'sor', 'tür', 'sür'] },
          { ad: 'Ünsüzle yan yana', ogeler: ['tren', 'trafik', 'tramvay', 'program', 'proje', 'prens', 'kredi', 'krem', 'kravat', 'brokoli', 'kardeş', 'kırk', 'bardak', 'korku', 'türkü', 'sırt', 'kurt', 'yurt', 'dört', 'hırka', 'ortak', 'perşembe', 'sürpriz', 'priz', 'trafo', 'fırsat', 'firma', 'sarmak'] }
        ]
      },
      {
        tur: 'cumle', baslik: 'Sözcük sonundaki r', tanima: true, secim: 5,
        yonerge: 'Sondaki r yutulmaz ama hafif söylenir. Özellikle “-yor” ve “-yorlar” eklerine dikkat et: “geliyo” değil “geliyor”.',
        havuz: [
          'Annem mutfakta çorba pişiriyor.',
          'Çocuklar parkta top oynuyorlar.',
          'Bu akşam yağmur yağacak diyorlar.',
          'Kardeşim her sabah erkenden kalkıyor.',
          'Komşular bahçede çay içiyorlar.',
          'Bir arkadaşım bugün bize geliyor.',
          'Bir elma, bir armut, bir de ayran aldım.',
          'Herkes sırayla söz alıyor.',
          'Otobüs her yarım saatte bir geçiyor.',
          'Babam gazeteyi her sabah okur.',
          'Kuşlar sabahları pencerenin önünde ötüyorlar.',
          'Telefon çalıyor, biri açar mı?',
          'Misafirler birazdan gelirler.',
          'Kitaplar rafta duruyor.',
          'Otobüsü bekliyorum ama geç kalıyor.',
          'Akşamları yürüyüş yapmayı severim.',
          'Öğrenciler teneffüste bahçeye çıkıyorlar.',
          'Bu yaz tatile gidiyor musunuz?',
          'Sizi yeniden görmek çok güzel olur.',
          'Hepimiz sizi bekliyoruz.',
          'Anneannem her bayram baklava yapar.',
          'Bir an önce eve dönmek istiyorum.',
          'Kapıyı biri çalıyor, bakar mısın?',
          'Bu kitabı herkes okumalı diye düşünüyorum.',
          'Arkadaşlar hafta sonu pikniğe gidiyorlar.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Tekerleme ve cümleler', tanima: true, secim: 6,
        yonerge: 'Önce yavaş ve her r duyulacak şekilde oku. Sonra hızlan, ama r kaybolmasın. Her açışta farklı cümleler gelir.',
        havuz: [
          'Bir berber bir berbere, bre berber gel beraber bir berber dükkânı açalım demiş.',
          'Kar kalkar karakartal kalkar, karakartal kalkar kar kalkar.',
          'Dal sarkar kartal kalkar, kartal kalkar dal sarkar.',
          'Bu yoğurdu sarımsaklasak da mı saklasak, sarımsaklamasak da mı saklasak?',
          'Rıza, renkli kartları sırayla raflara yerleştirdi.',
          'Rüzgâr, kıyıdaki kırmızı kayıkları sarstı.',
          'Perşembe akşamı arkadaşlarla buluşup birlikte yürüyeceğiz.',
          'Kardeşim radyoda her sabah haberleri dinler.',
          'Pazardan taze armut, erik ve kiraz aldım.',
          'Arabayı garajın önüne park etmeyi unutma.',
          'Haziranda tatile çıkarken trene bineriz.',
          'Bu resmi kırmızı ve turuncu renklerle boyadım.',
          'Perdeyi aralayınca oda birden aydınlandı.',
          'Merak etme, her şey yolunda gidecek.',
          'Kurabiyeleri fırından çıkarırken dikkatli ol.',
          'Sabırlı olursan her işin sonu güzel olur.',
          'Harika bir hafta sonu geçirdik, herkese teşekkürler.',
          'Ormanın kenarındaki çınarın altında biraz dinlendik.',
          'Bir kahve içip birazdan yola çıkarız.',
          'Ressam, rüyasında gördüğü renkleri resmine aktardı.',
          'Trafik çok yoğun, randevuya biraz geç kalacağım.',
          'Program değişti, buluşma cumartesiye ertelendi.',
          'Rehber, sarayın tarihini merakla dinleyen gruba anlattı.',
          'Kırk yılda bir böyle bir fırsat çıkar.',
          'Arkadaşlar, ders bitti; sıraları toparlayıp kapıya doğru yürüyelim.',
          'Sarı, turuncu ve kırmızı yapraklar rüzgârla birlikte uçuştu.',
          'Torunu, dedesine bahçedeki erik ağacını gösterdi.',
          'Hırkanı al, akşamları hava serin oluyor.'
        ]
      }
    ]
  },
  {
    id: 's', harf: 'S', ad: 'S zorluğu', ozet: 'S sesi peltek, hışırtılı ya da ş’ye benzer çıkıyor.',
    hazir: true,
    tanima: {
      harf: 's',
      karisma: [
        { harf: 'ş', yazi: 'S, ş gibi çıkmış olabilir. Dili üst diş etinden uzaklaştır, dil ucunu alt ön dişlerin arkasına getir.' },
        { harf: 'z', yazi: 'S yumuşayıp z gibi duyulmuş olabilir. S’de ses tellerin titremez, sadece hava çıkar.' },
        { harf: 't', yazi: 'S, t gibi kesik çıkmış olabilir. Havayı kesmeden, akıtarak ver.' }
      ],
      eksik: 'S sesi duyulmadı ya da zayıf kaldı. Havayı ortadan, ince bir şerit gibi ver.',
      genel: 'S sesini ince ve net söyle; hava dilin ortasından çıksın.'
    },
    ozKontrol: [
      { id: 'net', yazi: 'S’ler ince ve net duyuldu', iyi: true, tavsiye: 'Harika! Tempoyu bir kademe artırıp yeniden dene.' },
      { id: 'pel', yazi: 'S’ler peltek çıktı (dil dişlerin arasına kaçtı)', tavsiye: 'Dil ucunu alt ön dişlerin arkasında tut, dişlerin arasından dışarı çıkarma. Dişlerini hafifçe kapat. Aynaya bakarak çalış.', adim: 1 },
      { id: 'yan', yazi: 'S hışırtılı çıktı ya da ş’ye benzedi', tavsiye: 'Dilini üst diş etine değdirme; hava yanlardan kaçıyor. Dil ucunu sivriltip alt ön dişlere yaklaştır, hava ortadan çıksın.', adim: 1 },
      { id: 'isl', yazi: 'S ıslık gibi çok sert çıktı', tavsiye: 'Dişlerini fazla sıkma ve havayı azalt. S’nin sesi ince ama yumuşak olmalı.' },
      { id: 'ss', yazi: 'S ile Ş’yi karıştırdım', tavsiye: 'S’de dudaklar hafif gülümser, Ş’de öne doğru yuvarlanır. Sa-şa hece dizisini ve S ile Ş cümlelerini çalış.', adim: 4 },
      { id: 'hiz', yazi: 'Hızlı okudum, sesler karıştı', tavsiye: 'Tempoyu Yavaş’a al. Her heceyi ayrı ve net söyle.', adim: 2 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'S sesi nasıl çıkar?',
        metin: [
          'S sesinde dil büzülür, dil ucu sivrilir ve alt ön dişlerin arkasına yaklaşır. Dişler hafifçe birbirine yaklaşır, hava dilin ortasından ince bir şerit gibi çıkar. Ses telleri titremez.'
        ],
        maddeler: [
          '<b>Dili üst diş etine değdirirsen</b> hava dilin iki yanından kaçar; s hışırtılı ya da ş’ye benzer çıkar.',
          'Bunu düzeltmek için dili üst diş etine <b>daha güçlü bastırmak</b> s’yi daha da bozar. Çözüm dili aşağı, alt dişlere yaklaştırmak.',
          '<b>Dil ucu dişlerin arasından çıkarsa</b> s peltek olur.',
          '<b>S ile Ş</b> farkı: S’de dudaklar hafif gülümser, Ş’de öne doğru yuvarlanır.',
          'Kontrol: Elini çenenin önüne tut. Hava ortadan, ince bir şerit hâlinde gelmeli; yanaklardan değil.'
        ],
        dene: { yonerge: 'Önce kendini yokla: Aşağıdakileri sesli söyle ve kaydet. Çalışmanın sonunda bir daha kaydedip karşılaştırırsın.', sozler: ['ses', 'sabah', 'masa', 'sıcak su', 'Sinan sessizce sordu.'] }
      },
      {
        tur: 'tut', baslik: 'Isınma: Sssss', fazAd: 'Sssss!',
        maddeler: [
          'Mümkünse aynaya bak.',
          'Dişlerini hafifçe birbirine yaklaştır, dudakların hafif gülümsesin.',
          'Dil ucunu alt ön dişlerin arkasına koy. Dil ucu dişlerin arasından görünmemeli.',
          'Havayı ortadan, ince bir şerit gibi ver: Ssssss.',
          'Sonra ses tellerini de katarak z’ye geç ve geri dön: Sssszzzzssss. Dil yeri değişmemeli.'
        ],
        sesler: ['Ssssss', 'Sssszzzz'], sure: 5, dinlenme: 4, turSayisi: 2, olcum: 'keskinlik'
      },
      {
        tur: 'kart', baslik: 'Hece kartları', hece: true, sabitDizi: 1, secimDizi: 5,
        yonerge: 'Her heceyi ince ve net söyle. Önce yavaş, ısındıkça tempoyu artır. Her açışta farklı diziler gelir.',
        diziler: [
          { ad: 'sa - se - si', ogeler: ['sa', 'se', 'si', 'so', 'su', 'sı', 'sö', 'sü'] },
          { ad: 'sas - ses - sis', ogeler: ['sas', 'ses', 'sis', 'sos', 'sus', 'sıs', 'sös', 'süs'] },
          { ad: 'asa - ese - isi', ogeler: ['asa', 'ese', 'isi', 'oso', 'usu', 'ısı', 'ösö', 'üsü'] },
          { ad: 'as - es - is', ogeler: ['as', 'es', 'is', 'os', 'us', 'ıs', 'ös', 'üs'] },
          { ad: 'pas - pes - pis', ogeler: ['pas', 'pes', 'pis', 'pos', 'pus', 'pıs', 'pös', 'püs'] },
          { ad: 'sa - şa (ayırma)', ogeler: ['sa', 'şa', 'se', 'şe', 'si', 'şi', 'so', 'şo', 'su', 'şu'] },
          { ad: 'tas - tes - tis', ogeler: ['tas', 'tes', 'tis', 'tos', 'tus', 'tıs', 'tös', 'tüs'] },
          { ad: 'kas - kes - kis', ogeler: ['kas', 'kes', 'kis', 'kos', 'kus', 'kıs', 'kös', 'küs'] },
          { ad: 'sta - ste - sti', ogeler: ['sta', 'ste', 'sti', 'sto', 'stu', 'stı', 'stö', 'stü'] },
          { ad: 'ast - est - ist', ogeler: ['ast', 'est', 'ist', 'ost', 'ust', 'ıst', 'öst', 'üst'] },
          { ad: 'ska - ske - ski', ogeler: ['ska', 'ske', 'ski', 'sko', 'sku', 'skı', 'skö', 'skü'] }
        ]
      },
      {
        tur: 'kart', baslik: 'Sözcükler', tanima: true, secim: 8,
        yonerge: 'Her sözcükte s ince ve net duyulsun. Her açışta farklı sözcükler gelir; zorlandıkların daha sık çıkar.',
        havuz: [
          { ad: 'Başta s', ogeler: ['sabah', 'sabun', 'saat', 'sabır', 'saç', 'sağlık', 'sahil', 'salı', 'salata', 'sandalye', 'sarı', 'sayfa', 'sebze', 'ses', 'sevgi', 'sıcak', 'sınıf', 'simit', 'sinema', 'soğuk', 'sokak', 'soru', 'söz', 'su', 'süt', 'sevinç', 'sepet', 'sohbet', 'sonbahar', 'sessiz'] },
          { ad: 'Ortada s', ogeler: ['masa', 'kasa', 'kese', 'misafir', 'resim', 'hasta', 'pasta', 'istasyon', 'kestane', 'mesaj', 'posta', 'yastık', 'aslan', 'masal', 'mısır', 'kısa', 'basit', 'yasak', 'pasaport', 'kusur', 'isim', 'insan', 'bisiklet', 'istek', 'hesap', 'mesafe', 'eskiden', 'yüksek'] },
          { ad: 'Sonda s', ogeler: ['ses', 'kas', 'bas', 'kes', 'süs', 'dans', 'otobüs', 'ders', 'his', 'tenis', 'kaktüs', 'hırs', 'kurs', 'ters', 'kafes', 'nefes', 'heves', 'vals', 'kampüs', 'tas', 'pas', 'sus'] },
          { ad: 'Ünsüzle yan yana', ogeler: ['dost', 'üst', 'test', 'spor', 'skor', 'slogan', 'fıstık', 'pastırma', 'eski', 'uskumru', 'iskele', 'kasket', 'basket', 'kostüm', 'istiridye', 'aspirin', 'istasyon', 'ustalık', 'kısmet', 'pastane'] }
        ]
      },
      {
        tur: 'cumle', baslik: 'S ile Ş’yi ayır', tanima: true, secim: 5,
        yonerge: 'S’de dudaklar hafif gülümser, Ş’de öne yuvarlanır. Bu cümlelerde iki ses yan yana geliyor; ikisini karıştırmadan söyle.',
        havuz: [
          'Sabahları şehirde sis olur.',
          'Şeker ile suyu karıştırıp şerbet yaptık.',
          'Selin şarkı söylerken sesini hiç yükseltmedi.',
          'Şu sepetteki sebzeler taze mi?',
          'Sonbaharda şemsiyeni yanından ayırma.',
          'Şemsi Paşa pasajında sesi büzüşesiceler.',
          'Sesini duyunca çok şaşırdım.',
          'Şimdi sıra sende, sakin ol.',
          'Simitçi sabah erkenden şehre indi.',
          'Şoför sağa dönüp sokakta durdu.',
          'Sıradaki şarkıyı sen seç.',
          'Saçını şampuanla yıkayıp kuruttu.',
          'Şu saati sabah altıya kurar mısın?',
          'Sessiz sedasız şehirden ayrıldılar.',
          'Ses tonun şimdi çok daha sakin.',
          'Şişedeki suyu soğuk soğuk içtik.',
          'Sarı şalını omzuna atıp sokağa çıktı.',
          'Şaşkın serçe, şemsiyenin üstüne kondu.',
          'Sınıfta şiir okurken sesi titredi.',
          'Şekerci, sıcak simitlerin yanına şerbet koydu.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Tekerleme ve cümleler', tanima: true, secim: 6,
        yonerge: 'Önce yavaş ve her s ince duyulacak şekilde oku. Sonra hızlan, ama s kalınlaşmasın. Her açışta farklı cümleler gelir.',
        havuz: [
          'Bu yoğurdu sarımsaklasak da mı saklasak, sarımsaklamasak da mı saklasak?',
          'Sevgili Selma, sabah saat sekizde salonda seni bekliyoruz.',
          'Sokaktaki simitçi, sıcak simitleri sepetine sıraladı.',
          'Salı sabahı sahilde soğuk bir rüzgâr esti.',
          'Susadıysan sürahideki suyu bardağa koy.',
          'Sessizce salona girip sandalyesine oturdu.',
          'Misafirlerimize sıcak çay ve pasta ikram ettik.',
          'Ses sistemi bozulunca sunucu sesini yükseltti.',
          'Sebze ve meyveleri sepete özenle yerleştirdik.',
          'Saat sekizi beş geçe otobüs istasyondan kalktı.',
          'Akşam hep birlikte sinemaya gittik.',
          'Sabahları sokakta yürümek sağlığa iyi gelir.',
          'Sana söylediğim sözleri sakın unutma.',
          'Sevinçten sesini kontrol edemedi.',
          'Sıcak süt içip sakin bir uykuya daldı.',
          'Sorularını sırayla sor, hepsini sabırla yanıtlarım.',
          'Seyahat sırasında sıkılmamak için sesli kitap dinledik.',
          'Bisikletini sokağın sonundaki sarı evin önüne bıraktı.',
          'Sıcak bir sohbetin sonunda herkes mutlu ayrıldı.',
          'Sabırsızlanma, sıran gelince seni çağıracaklar.',
          'Eski dostlar, yıllar sonra sahildeki pastanede buluştu.',
          'Sınav sabahı sakin olmak, soruları daha rahat çözdürür.'
        ]
      }
    ]
  },
  { id: 'z', harf: 'Z', ad: 'Z zorluğu', ozet: 'Z sesi bulanık çıkıyor.', hazir: false },
  { id: 'dudak', harf: 'Ağız', ad: 'Dudak ve dil tembelliği', ozet: 'Sesler yuvarlanıyor, net çıkmıyor.', hazir: false },
  { id: 'isinma', harf: '5 dk', ad: 'Konuşmadan önce ısınma', ozet: 'Gevşeme, dudak-dil hareketleri, Maaa-Meee.', hazir: false },
  { id: 'nefes', harf: 'Nefes', ad: 'Nefesim yetmiyor', ozet: 'Cümlenin sonunda nefesim bitiyor.', hazir: false }
];
