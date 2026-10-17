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
          'Bu abartı sadece ısınma içindir; konuşurken r hafif söylenir.',
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
          { ad: 'Ortada r', ogeler: ['araba', 'kurabiye', 'kirpi', 'tarak', 'karınca', 'burun', 'erik', 'armut', 'portakal', 'dürüst', 'örnek', 'bereket', 'merak', 'harika', 'kiraz', 'haziran', 'kahraman', 'horoz', 'perde', 'terlik', 'yorgan', 'çarşamba', 'cumartesi', 'arkadaş', 'birlikte', 'kırmızı', 'sarı', 'ırmak', 'kara', 'para', 'koro', 'körük', 'kürek', 'teras', 'turuncu', 'yuvarlak', 'serin', 'güvercin'] },
          { ad: 'Sonda r', ogeler: ['kar', 'var', 'yer', 'her', 'bir', 'duvar', 'bahar', 'çınar', 'pınar', 'sabır', 'fikir', 'şehir', 'nehir', 'kader', 'haber', 'beraber', 'çiçekler', 'kuşlar', 'yıllar', 'gelir', 'gider', 'okur', 'yazar', 'sever', 'bakar', 'çalışır', 'söyler', 'bilir', 'ister', 'kapılar', 'çocuklar', 'zar', 'ter', 'sor', 'tür', 'sür', 'şeker'] },
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
          'Hırkanı al, akşamları hava serin oluyor.',
          "Bu kara kantar kırk kilo kara katran tartar.",
          "Tek tek tekerleme, içi dolu şekerleme, bunu bilmeyen kertenkele.",
          "Kırk kantar, kırkar kırkar, kantar tartar.",
          "Gagavuz kuşunun gagası gerdandan sarkar, ger ger gerilen gergefin gültası Galata'dan galat gergedana gül atar.",
          "Dört deryanın deresini dört dergâhın derbendine devrederlerse, dört deryadan dört dert, dört dergâhtan dört dev çıkar.",
          "İki kel kör kirpinin yırtık kürkünü dişi kel kör kirpinin yırtık kürküne eklemişler."
        ]
      }
    ]
  },
  {
    id: 's', harf: 'S', ad: 'S zorluğu', ozet: 'S sesi peltek, hışırtılı ya da ş’ye benzer çıkıyor.',
    hazir: true,
    sesli: false,
    tanima: {
      harf: 's',
      karisma: [
        { harf: 'ş', yazi: 'S, ş gibi çıkmış olabilir. Dili üst diş etinden uzaklaştır, dil ucunu alt ön dişlerin arkasına getir.' },
        { harf: 'z', yazi: 'S yumuşayıp z gibi duyulmuş olabilir. S’de ses telleri titremez, sadece hava çıkar.' },
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
        tur: 'nefesOlc', baslik: 'Nefes al, sssss diye ver', ses: 'sssss', filtre: 1500,
        al: [4, 4, 5], tut: [4, 4, 5], ver: [8, 10, 12], turSayisi: [3, 4, 5],
        maddeler: [
          'Seviyen: <b>{seviye}</b>. Her tur: {al} saniye nefes al, {tut} saniye tut, <b>{ver} saniye</b> sssss diye ver; {tur} tur yapacaksın. Çalıştıkça süre ve tur sayısı artar.',
          'Mümkünse aynaya bak. Dişlerini hafifçe birbirine yaklaştır, dudakların hafif gülümsesin.',
          'Dil ucunu alt ön dişlerin arkasına koy. Dil ucu dişlerin arasından görünmemeli.',
          'Elini karnına koy; burundan sessizce nefes al. “Ver” denince havayı ortadan, ince bir şerit gibi, baştan sona aynı güçte ver: Sssss.',
          'İstersen son turda sesi z’ye geçirip geri dön: Sssszzzzssss. Dil yeri değişmemeli.'
        ]
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
          { ad: 'Sonda s', ogeler: ['kas', 'bas', 'kes', 'süs', 'dans', 'otobüs', 'ders', 'his', 'tenis', 'kaktüs', 'hırs', 'kurs', 'ters', 'kafes', 'nefes', 'heves', 'vals', 'kampüs', 'tas', 'pas', 'sus'] },
          { ad: 'Ünsüzle yan yana', ogeler: ['dost', 'üst', 'test', 'spor', 'skor', 'slogan', 'fıstık', 'pastırma', 'eski', 'uskumru', 'iskele', 'kasket', 'basket', 'kostüm', 'istiridye', 'aspirin', 'ustalık', 'kısmet', 'pastane'] }
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
          'Şemsi Paşa, pasajdaki sessiz sedasız sokakta şiir okudu.',
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
          'Sınav sabahı sakin olmak, soruları daha rahat çözmeni sağlar.',
          "Şemsi Paşa pasajında sesi büzüşesiceler.",
          "Falcı, falcının falına fasa fiso dedi.",
          "Sudan çıktı iki su şadısı, biri erkek şu şadısı, diğeri dişi şu şadısı.",
          "Bu evi yıkıp yapsak da mı otursak, yoksa yıkmasak onarsak da mı otursak?",
          "Kara kızın kısa kayışını kasışına kızmayışına şaşmamışsın da, kuru kazın kızıp kayısı kazışına şaşmış kalmışsın."
        ]
      }
    ]
  },
  {
    id: 'z', harf: 'Z', ad: 'Z zorluğu', ozet: 'Z sesi s gibi ya da bulanık çıkıyor.',
    hazir: true,
    sesliMin: 5,
    tanima: {
      harf: 'z',
      karisma: [
        { harf: 's', yazi: 'Z, s gibi çıkmış olabilir. Z’de ses telleri titrer; elini boğazına koyup titreşimi hisset.' },
        { harf: 'j', yazi: 'Z, j gibi çıkmış olabilir. Dudaklarını öne yuvarlama, hafif gülümseyerek söyle.' },
        { harf: 'c', yazi: 'Z, c gibi kesik çıkmış olabilir. Havayı kesmeden, akıtarak ver.' }
      ],
      eksik: 'Z sesi duyulmadı ya da zayıf kaldı. Önce s’yi söyle, sonra ses tellerini katarak z’ye geç.',
      genel: 'Z sesini titreşimli ve net söyle; hava dilin ortasından çıksın.'
    },
    ozKontrol: [
      { id: 'net', yazi: 'Z’ler titreşimli ve net duyuldu', iyi: true, tavsiye: 'Harika! Tempoyu bir kademe artırıp yeniden dene.' },
      { id: 'sgibi', yazi: 'Z’ler s gibi çıktı (titreşim yoktu)', tavsiye: 'Z, s’nin sesli hâlidir. Elini boğazına koy; Sssss’den Zzzzz’ye geçerken titreşimi hissetmelisin. Isınmayı tekrar yap.', adim: 1 },
      { id: 'pel', yazi: 'Z’ler peltek çıktı (dil dişlerin arasına kaçtı)', tavsiye: 'Dil ucunu alt ön dişlerin arkasında tut, dişlerin arasından dışarı çıkarma. Dişlerini hafifçe kapat. Aynaya bakarak çalış.', adim: 1 },
      { id: 'bulanik', yazi: 'Z’ler bulanık, hışırtılı çıktı', tavsiye: 'Hava dilin iki yanından kaçıyor olabilir. Dil ucunu sivriltip havayı ortadan ver. Önce yavaş hece kartlarını çalış.', adim: 2 },
      { id: 'sz', yazi: 'S ile Z’yi karıştırdım', tavsiye: 'Sa-za hece dizisini ve S ile Z cümlelerini çalış. Tek fark: Z’de boğaz titrer, S’de titremez.', adim: 4 },
      { id: 'hiz', yazi: 'Hızlı okudum, sesler karıştı', tavsiye: 'Tempoyu Yavaş’a al. Her heceyi ayrı ve net söyle.', adim: 2 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'Z sesi nasıl çıkar?',
        metin: [
          'Z, s ile aynı yerden çıkar: dil büzülür, dil ucu sivrilip alt ön dişlerin arkasına yaklaşır, hava ortadan ince bir şerit gibi geçer. Tek fark: S’de ses telleri titremez, Z’de titrer.'
        ],
        maddeler: [
          '<b>Elini boğazına koy.</b> Sssss derken titreşim yok, Zzzzz derken var.',
          'S’yi iyi söyleyebiliyorsan z’yi de söyleyebilirsin: önce s’yi söyle, sesini katıp z’ye geç.',
          '<b>S bozuksa z de genelde bozuktur.</b> İkisini birlikte çalışmak işe yarar.',
          '<b>Dil ucu dişlerin arasından çıkarsa</b> z peltek olur.',
          '<b>Titreşim yoksa</b> z, s gibi duyulur: “güzel” yerine “güsel”.'
        ],
        dene: { yonerge: 'Önce kendini yokla: Aşağıdakileri sesli söyle ve kaydet. Çalışmanın sonunda bir daha kaydedip karşılaştırırsın.', sozler: ['zil', 'güzel', 'yüz', 'Zeynep’in gözleri', 'Zeki sizi zaman zaman arıyor.'] }
      },
      {
        tur: 'nefesOlc', baslik: 'Nefes al, zzzzz diye ver', ses: 'zzzzz', filtre: 400,
        al: [4, 4, 5], tut: [4, 4, 5], ver: [8, 10, 12], turSayisi: [3, 4, 5],
        maddeler: [
          'Seviyen: <b>{seviye}</b>. Her tur: {al} saniye nefes al, {tut} saniye tut, <b>{ver} saniye</b> zzzzz diye ver; {tur} tur yapacaksın. Çalıştıkça süre ve tur sayısı artar.',
          'Mümkünse aynaya bak. Elini boğazına koy: z’de boğazda titreşim hissedeceksin.',
          'Dil yeri s’deki gibi kalsın; fark sadece ses tellerinin çalışması. İstersen önce kısa bir sssss söyleyip sonra z’ye geç.',
          'Elini karnına koy; burundan sessizce nefes al. “Ver” denince baştan sona aynı güçte, titreşerek ver: Zzzzz.'
        ]
      },
      {
        tur: 'kart', baslik: 'Hece kartları', hece: true, sabitDizi: 1, secimDizi: 5,
        yonerge: 'Her heceyi titreşimli ve net söyle. Önce yavaş, ısındıkça tempoyu artır. Her açışta farklı diziler gelir.',
        diziler: [
          { ad: 'za - ze - zi', ogeler: ['za', 'ze', 'zi', 'zo', 'zu', 'zı', 'zö', 'zü'] },
          { ad: 'zaz - zez - ziz', ogeler: ['zaz', 'zez', 'ziz', 'zoz', 'zuz', 'zız', 'zöz', 'züz'] },
          { ad: 'aza - eze - izi', ogeler: ['aza', 'eze', 'izi', 'ozo', 'uzu', 'ızı', 'özö', 'üzü'] },
          { ad: 'zar - zer - zir', ogeler: ['zar', 'zer', 'zir', 'zor', 'zur', 'zır', 'zör', 'zür'] },
          { ad: 'az - ez - iz', ogeler: ['az', 'ez', 'ız', 'iz', 'oz', 'öz', 'uz', 'üz'] },
          { ad: 'sa - za (ayırma)', ogeler: ['sa', 'za', 'se', 'ze', 'si', 'zi', 'so', 'zo', 'su', 'zu'] },
          { ad: 'asa - aza (ayırma)', ogeler: ['asa', 'aza', 'ese', 'eze', 'isi', 'izi', 'oso', 'ozo', 'usu', 'uzu'] },
          { ad: 'maz - mez - miz', ogeler: ['maz', 'mez', 'mız', 'miz', 'moz', 'möz', 'muz', 'müz'] },
          { ad: 'taz - tez - tiz', ogeler: ['taz', 'tez', 'tız', 'tiz', 'toz', 'töz', 'tuz', 'tüz'] }
        ]
      },
      {
        tur: 'kart', baslik: 'Sözcükler', tanima: true, secim: 8,
        yonerge: 'Her sözcükte z titreşimli ve net duyulsun. Her açışta farklı sözcükler gelir; zorlandıkların daha sık çıkar.',
        havuz: [
          { ad: 'Başta z', ogeler: ['zaman', 'zarf', 'zayıf', 'zengin', 'zeytin', 'zil', 'zor', 'zarar', 'zeka', 'zafer', 'zemin', 'zürafa', 'zincir', 'ziyaret', 'zihin', 'zirve', 'zarif', 'zehir', 'zümrüt', 'zıt', 'zahmet', 'zam', 'zeminde', 'zorluk', 'zevk', 'zembil', 'zeytinyağı', 'zamanla', 'zarfı', 'zorba'] },
          { ad: 'Ortada z', ogeler: ['gazete', 'kazak', 'pazar', 'mezar', 'kuzu', 'yazı', 'güzel', 'özür', 'düzen', 'hazır', 'bozuk', 'sezon', 'mezun', 'uzun', 'ezber', 'yüzük', 'dizi', 'tuzluk', 'süzgeç', 'kazanç', 'lezzet', 'tazı', 'bozulmuş', 'kuzey', 'pazu', 'kaza', 'azık', 'kızım', 'bozulmak'] },
          { ad: 'Sonda z', ogeler: ['yüz', 'kız', 'göz', 'söz', 'buz', 'tuz', 'saz', 'yaz', 'kaz', 'düz', 'toz', 'boz', 'koz', 'diz', 'siz', 'biz', 'deniz', 'beyaz', 'sensiz', 'temiz', 'çiz', 'kurnaz', 'haz', 'ceviz', 'tez', 'kez', 'köz', 'az', 'iz', 'öz'] },
          { ad: 'Ünsüzle yan yana', ogeler: ['gözlük', 'sözlük', 'yazlık', 'tuzlu', 'buzlu', 'kızgın', 'dizgin', 'özgür', 'ezme', 'azmi', 'kuzgun', 'yüzme', 'gezgin', 'düzlük', 'sızlanmak', 'uzman', 'tezgâh', 'çizgi', 'ezgi', 'bozguncu'] }
        ]
      },
      {
        tur: 'cumle', baslik: 'S ile Z’yi ayır', tanima: true, secim: 5,
        yonerge: 'S’de boğaz titremez, Z’de titrer. Bu cümlelerde iki ses yan yana geliyor; ikisini karıştırmadan söyle.',
        havuz: [
          'Sezin sabah erkenden zili çalıp bizi uyandırdı.',
          'Zeynep sessizce sözlüğü açıp yazıyı inceledi.',
          'Sizinle bu zor soruyu birlikte çözeriz.',
          'Zafer, sınıftaki sesi duyunca gözlerini kıstı.',
          'Zeytinyağlı salatayı sofraya sen koy, ben suyu getireyim.',
          'Seher, sepetteki kızıl elmaları sezonun sonunda topladı.',
          'Susuz kalan zeytin ağacı yazın sararıp soldu.',
          'Zeki sana sözünü hatırlatmak istedi.',
          'Sokaktaki zil sesini herkes duyunca sustu.',
          'Bu sabah gazeteyi masanın üstünde bulamadım.',
          'Yazın deniz kıyısında uzun yürüyüşler yaparız.',
          'Sizin sesiniz çok güzel ve net çıkıyor.',
          'Zarf masada kalmış, sakın unutma.',
          'Sessiz sokakta zayıf bir ses duyuldu.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Tekerleme ve cümleler', tanima: true, secim: 6,
        yonerge: 'Önce yavaş ve her z titreşimli duyulacak şekilde oku. Sonra hızlan, ama z s’ye dönmesin. Her açışta farklı cümleler gelir.',
        havuz: [
          'Zeynep zeytinin zararını zekice anlattı, Zeki ise zeytinyağının zevkine vardı.',
          'Yüzü güzel kızın gözleri hep yazı yazıyordu.',
          'Gazetede güzel bir yazı çıkmış, hepimiz bayıldık.',
          'Zil çalınca herkes bahçeye zıpladı.',
          'Dizilerin sonunda uzun, güzel bir şarkı çaldı.',
          'Kızım gözlüğünü masaya bıraktı, sözlüğü açtı.',
          'Zamanı iyi kullanan, zorluğun üstesinden gelir.',
          'Tuzlu su, buzlu limonata, kızarmış zeytin.',
          'Uzun bir yazın ardından düzenli bir kışa girdik.',
          'Bozuk saati zahmetle tamir ettirdi.',
          'Zürafa, sazlığın yanındaki uzun ağacı yedi.',
          'Hazırlıklarımız tamam, zamanımız bol, yüzümüz gülüyor.',
          'Pazar günü kuzuları gezdirip gazetelerimizi okuduk.',
          'Zeynep’in kazağı, Zeki’nin gözlüğü ile aynı masada duruyordu.',
          'Gözümüz ufukta, sözümüz dosdoğru, yüzümüz hep güleç.',
          'Zorlukları sevgiyle ve sabırla aşabiliriz.',
          'Güzel konuşmak, düzenli çalışmanın ürünüdür.',
          'Zeytin ağacının altında bir saz çalındı.',
          "Çarşıda koza ucuz, çarşıda darı ucuz, çarşıda boza da ucuz mu?",
          "Bu bankaya eski veznedar gelecek, bu bankaya eski vezne dar gelecek.",
          "Zihni, zihnini Zeki'nin zikzak çizen zevzek züğürt sözleriyle uzun uzun zorladı."
        ]
      }
    ]
  },
  {
    id: 'dudak', harf: 'Ağız', ad: 'Dudak ve dil tembelliği', ozet: 'Sesler yuvarlanıyor, net çıkmıyor.',
    hazir: true,
    sesli: false,
    ozKontrol: [
      { id: 'net', yazi: 'Sesler net ve rahat çıktı', iyi: true, tavsiye: 'Harika! Tempoyu bir kademe artırıp yeniden dene.' },
      { id: 'yuvarlak', yazi: 'Sesler yuvarlandı, birbirine karıştı', tavsiye: 'Yavaşla ve her sesi abartarak söyle. Hece kartlarında Yavaş tempoyla başla; ağzını normalden fazla aç.', adim: 2 },
      { id: 'cene', yazi: 'Çenem ve yüzüm gerildi', tavsiye: 'Çeneyi gevşet, dişlerini sıkma. Isınmadaki yüz masajını yap ve hareketleri zorlamadan, yumuşak yap.', adim: 1 },
      { id: 'dil', yazi: 'Dilim dolaştı, takıldım', tavsiye: 'Tempoyu düşür. Takıldığın yeri ayrı ayrı yavaşça söyle, sonra tekrar hızlan. Takılmak tekerlemede normaldir.', adim: 3 },
      { id: 'yorgun', yazi: 'Dudağım ve dilim çabuk yoruldu', tavsiye: 'Normal. Her gün 1–2 dakika, düzenli yap. Süreyi zamanla artırırsın.', adim: 1 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'Dudak ve dil neden çalışır?',
        metin: [
          'Konuşurken dudak, dil, yanak ve çene kasları çalışır. Bu kaslar tembel kalırsa sesler yuvarlanır, sözcüklerin sonu yutulur. Her gün birkaç dakika çalışmak bunları canlı ve esnek tutar.'
        ],
        maddeler: [
          '<b>Önce yüzün ve çenen gevşek olsun.</b> Hareketleri zorlamadan, yumuşak yap.',
          '<b>Kalemi dişle sıkıp konuşmak yanlıştır.</b> Dudak çalışır ama çene sertleşir.',
          'Mümkünse <b>ayna karşısında</b> yap.',
          '1–2 hafta, her gün en az bir kez çalış.',
          '<b>Önemli bir konuşmadan önce</b> en az 1, 2, 5 ve 6. hareketleri yap.',
          'Hızlı çalışmalarda amaç <b>hız değil</b>, her sesin tam çıkmasıdır.'
        ],
        dene: { yonerge: 'Önce kendini yokla: Aşağıdakileri sesli söyle ve kaydet. Çalışmanın sonunda bir daha kaydedip karşılaştırırsın.', sozler: ['Bir berber bir berbere bre berber gel beraber.', 'Yarın veli toplantısına geliyor musunuz?', 'Kapıyı kapatıp pencereyi açabilir misiniz?'] }
      },
      {
        tur: 'tut', baslik: 'Isınma: 6 ağız hareketi', fazAd: 'Yap!', birim: 'hareket',
        maddeler: [
          '<b>1 Masaj:</b> Parmak uçlarınla şakaklardan başlayıp yanaklardan çeneye doğru masaj yap. Ağzın biraz açık olsun.',
          '<b>2 Büz-ger:</b> Dudaklarını büzüp ileri çıkar, sonra yanlara doğru ger. Bir süre sonra hızlan.',
          '<b>3 Kıvır:</b> Önce üst, sonra alt dudağını dışarı doğru kıvırıp gevşet. Diğer dudağın oynamasın.',
          '<b>4 Dil uzat:</b> Dilini burun, çene ve kulaklar yönünde birkaç kez çıkarıp ger, gevşet.',
          '<b>5 Dil dayama:</b> Dilinin ön kısmını önce üst, sonra alt arka dişlerine ve diş etine dayayıp ger, gevşet.',
          '<b>6 Diş temizle:</b> Dişlerinin arasına yemek girmiş gibi dil ucunla temizle; üst-alt, ön-arka bütün dişlerine uğra.',
          'Her harekete 20 saniye ayrılır. Ekranda hangi harekette olduğunu görürsün.'
        ],
        sesler: ['1 Masaj', '2 Büz-ger', '3 Kıvır', '4 Dil uzat', '5 Dil dayama', '6 Diş temizle'], sure: 20, dinlenme: 3, turSayisi: 1
      },
      {
        tur: 'kart', baslik: 'Hızlı hece dizileri', hece: true, sabitDizi: 1, secimDizi: 5,
        yonerge: 'Üç heceyi kesintisiz, düzgün bir ritimle söyle. Önce yavaş, ısındıkça tempoyu artır. Her sesin net çıkmasına dikkat et.',
        diziler: [
          { ad: 'pa-ta-ka', ogeler: ['pa-ta-ka', 'pe-te-ke', 'pı-tı-kı', 'pi-ti-ki', 'po-to-ko', 'pö-tö-kö', 'pu-tu-ku', 'pü-tü-kü'] },
          { ad: 'ba-da-ga', ogeler: ['ba-da-ga', 'be-de-ge', 'bı-dı-gı', 'bi-di-gi', 'bo-do-go', 'bö-dö-gö', 'bu-du-gu', 'bü-dü-gü'] },
          { ad: 'pa-ba-ma', ogeler: ['pa-ba-ma', 'pe-be-me', 'pı-bı-mı', 'pi-bi-mi', 'po-bo-mo', 'pö-bö-mö', 'pu-bu-mu', 'pü-bü-mü'] },
          { ad: 'la-na-da', ogeler: ['la-na-da', 'le-ne-de', 'lı-nı-dı', 'li-ni-di', 'lo-no-do', 'lö-nö-dö', 'lu-nu-du', 'lü-nü-dü'] },
          { ad: 'ra-la-na', ogeler: ['ra-la-na', 're-le-ne', 'rı-lı-nı', 'ri-li-ni', 'ro-lo-no', 'rö-lö-nö', 'ru-lu-nu', 'rü-lü-nü'] },
          { ad: 'şa-ça-ja', ogeler: ['şa-ça-ca', 'şe-çe-ce', 'şı-çı-cı', 'şi-çi-ci', 'şo-ço-co', 'şö-çö-cö', 'şu-çu-cu', 'şü-çü-cü'] },
          { ad: 'fa-va-ha', ogeler: ['fa-va-ha', 'fe-ve-he', 'fı-vı-hı', 'fi-vi-hi', 'fo-vo-ho', 'fö-vö-hö', 'fu-vu-hu', 'fü-vü-hü'] },
          { ad: 'bap-dat-gak', ogeler: ['bap-dat-gak', 'bep-det-gek', 'bıp-dıt-gık', 'bip-dit-gik', 'bop-dot-gok', 'böp-döt-gök', 'bup-dut-guk', 'büp-düt-gük'] },
          { ad: 'kapı-tepe-pike', ogeler: ['kapı', 'tepe', 'pike', 'kutu', 'pati', 'tuğba', 'kakule', 'tıpkı'] }
        ]
      },
      {
        tur: 'cumle', baslik: 'Tekerlemeler', secim: 5,
        yonerge: 'Önce yavaş ve her ses tam çıkacak şekilde söyle; sonra tempoyu artır. Takılırsan normal, yavaşlayıp yeniden başla. Amaç hız değil net söyleyiş.',
        havuz: [
          'Bir berber bir berbere bre berber gel beraber bir berber dükkânı açalım demiş.',
          'Şu köşe yaz köşesi, bu köşe kış köşesi, ortada su şişesi.',
          'Barınaksız baykuşların bağırdığı bakir ormanda bakkallar baş başa sallandılar.',
          'Karamürselli kara kaptan kadehiyle kasabanın kaynağından kana kana su içti.',
          'Al şu takatukaları takatukacıya götür. Takatukacı takatukaları takatukalamam derse takatukaları takatukalatmadan al da gel.',
          'Çatalca’da topal çoban çatal yapıp çatal satar.',
          'Şu karşıdaki kara kuru kavak, karardın mı ey kara kuru kavak, sarardın mı ey kara kuru kavak.',
          'Kar kalkar karakartal kalkar, karakartal kalkar kar kalkar.',
          'Üç tunç tas kayısı hoşafı.',
          'Kırk kırık küp kırkının da kulpu kırık kara küp.',
          'A be kuru dayı, ne kuru sarı darı bu darı, a be kuru dayı.',
          'El alem aladanalandı da biz bir aladana alıp aladanalanamadık.',
          'Çarık çorap dolak, ben sana çarık çorap dolak mı dedim.',
          'Gül dibi bülbül dili gibi, gül dibi bülbül dili gibi.',
          'Değirmene girdi köpek, değirmenci çaldı kötek, hem kepek yedi köpek hem kötek yedi köpek.',
          "Hakkı Hakkı'dan hakkını istedi, Hakkı Hakkı'nın hakkını vermeyince, Hakkı Hakkı'nın hakkından geldi.",
          "Ooo eveleme geveleme, karakuşu kovalama, karakuş miskin, gagası keskin, ne zaman geldin, yazın geldim, yazılsın çizilsin, bir tahtaya dizilsin, al çık bal çık, sana dedim sen çık.",
          "Mutfakta neler oluyor, bezelyeler bize bakıyor. Çatlak patlak yusyuvarlak, kremalı börek, sütlü çörek, çek yavrum çek.",
          "Ali dayının keçileri kıyır kıyır kişniyor, arpa saman istiyor, arpa saman yok, kilimcide çok, kilimci kilim dokur, içinde bülbül okur, o bülbül benim olsa, iki kardeşim olsa, biri ay biri yıldız, biri oğlan biri kız.",
          "Laleli Belkıs, içeriye gel kız, ipten dut kız, dışarıya çık kız. Yağar yağar yağmur, teknede hamur, tarlada çamur, ver Allah'ım yağmur.",
          "O piti piti, karamela sepeti, terazi lastik jimnastik, biz size geldik bitlendik, hamama gittik temizlendik, dik dik dik, anne bana çorap dik.",
          "Üşüdüm üşüdüm, daldan elma düşürdüm, elmamı yediler, bana cüce dediler, cücelikten çıktım, ablama çıktım, ablam pilav pişirmiş, içine fare kaçırmış, bu fareyi ne yapmalı, minareden atmalı, minarede kuş var, kanadında gümüş var, amcamın cebinde türlü türlü yemiş var.",
          "Kapıdan tavşan geçti mi? Geçti. Tuttun mu? Tuttum. Kestin mi? Kestim. Tuzladın mı? Tuzladım. Pişirdin mi? Pişirdim. Bana ayırdın mı? Ayırdım. Hangi dolaba koydun? Çıt çıtlı dolaba koydum. Haydi al getir. Getiremem. Neden getiremezsin? Kara kediler yemiş.",
          "Komşu komşu, oğlun geldi mi? Geldi. Ne getirdi? İnci, boncuk. Kime kime? Sana, bana. Başka kime? Kara kediye. Kara kedi nerde? Ağaca çıktı. Ağaç nerde? Balta kesti. Balta nerde? Suya düştü. Su nerde? İnek içti. İnek nerde? Dağa kaçtı. Dağ nerde? Yandı bitti kül oldu.",
          "Götür küpü, dök küpü. Getir küpü, dök küpü.",
          "Keşkekçinin keşkeklenmiş keşkek kepçesi.",
          "Kapıyı kıcır gattırıcılardan mısın, ocağı kıvılcımlattırıcılardan mısın? Ne kapıyı kıcırdattırıcılardanım ne ocağı kıvılcımlattırıcılardanım.",
          "Uykucu Ülkü, ucu tüllü üç örtüyü ütüyle ütüleyip de mi üstüne örtünmeli, üç örtünün ucunu tülleyip ütüleyip de mi üstüne örtünmeli?",
          "Gece penceredeki benekli tekir kedi tenceresindeki eti yedi.",
          "İbiş ile Memiş mahkemeye gitmiş, mahkemeleşmiş mi, mahkemeleşmemiş mi?"
        ]
      },
      {
        tur: 'cumle', baslik: 'Günlük konuşma cümleleri', secim: 6,
        yonerge: 'Doğal bir hızda ama her sözcüğün başını ve sonunu net söyle. Sözcük sonlarını yutma: “geliyorsunuz” de, “geliyosunuz” deme.',
        havuz: [
          'Yarın veli toplantısına geliyor musunuz?',
          'Kapıyı kapatıp pencereyi açabilir misiniz?',
          'Toplantıya katılamayacağımı bildirmek istiyorum.',
          'Çocukların sorularını sabırla dinleyip cevapladı.',
          'Bu hafta içinde ödevleri toplayıp değerlendireceğim.',
          'Öğrencilerimizin başarısını birlikte değerlendireceğiz.',
          'Lütfen herkes yerine oturup defterini açsın.',
          'Sizi dinlerken çok şey öğrendiğimi söylemeliyim.',
          'Gelecek hafta okulda bir etkinlik düzenlenecek.',
          'Bu konuyu daha sonra yeniden konuşabiliriz.',
          'Teşekkür ederim, çok güzel bir konuşma yaptınız.',
          'Arkadaşlar, dikkatinizi çekmek istediğim önemli bir konu var.',
          'Sınıfa girerken kapıyı yavaşça kapatıp yerinize geçin.',
          'Her sorunun mutlaka bir çözümü olduğunu unutmayın.',
          'Yanlış söylediysem düzeltmenizi rica ediyorum.',
          'Sözlerimi bitirirken hepinize teşekkür etmek istiyorum.'
        ]
      }
    ]
  },
  {
    id: 'zormetin', harf: 'Metin', ad: 'Zor metinler', ozet: 'Uzun ve zor tekerlemeler; ısındıktan sonra, yavaştan hıza.',
    hazir: true,
    sesli: false,
    ozKontrol: [
      { id: 'net', yazi: 'Sesler net kaldı, takılmadan bitirdim', iyi: true, tavsiye: 'Harika! Daha hızlı tempoyla dene.' },
      { id: 'takildi', yazi: 'Bazı yerlerde takıldım', tavsiye: 'Takıldığın kısmı ayrı ayrı yavaşça söyle, sonra baştan al. Takılmak bu metinlerde normaldir.', adim: 1 },
      { id: 'yuvarlak', yazi: 'Hız artınca sesler yuvarlandı', tavsiye: 'Tempoyu düşür. Hızdan çok net söyleyiş önemli.', adim: 1 },
      { id: 'nefes', yazi: 'Nefesim yetmedi', tavsiye: 'Cümleyi virgüllerden böl ve her bölümün başında nefes al.', adim: 1 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'Zor metinler nasıl çalışılır?',
        metin: ['Bu uzun tekerlemelerde amaç hız değil, her sesin net çıkmasıdır. Önce yavaş, parça parça çalış; ısındıkça tempoyu artır.'],
        maddeler: [
          '<b>Önce ısın:</b> Dudak ve dil ya da Isınma çalışmasını yap.',
          '<b>Parçala:</b> Uzun metni virgüllerden bölüp her parçayı ayrı söyle.',
          '<b>Yavaştan hıza:</b> Önce çok yavaş, sonra normal, sonra hızlı.',
          '<b>Kayıt al:</b> Dinle, takıldığın yeri not et.',
          'Birçok metinde sözcük farkı olabilir; siteler arasında küçük farklar normaldir.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Uzun tekerlemeler', secim: 3,
        yonerge: 'Önce yavaş, parçalara bölerek oku. Sonra tek soluk ve tempoyu artırarak dene. Takılırsan yeniden başla.',
        havuz: [
          "Hakkı haklının hakkını yemiş. Haklı, Hakkı'dan hakkını istemiş. Hakkı, haklıya hakkını vermeyince haklı da Hakkı'nın hakkından gelmiş.",
          "Gide gide yün buldum, yünün içinde tarak buldum, tarağı nineye verdim, nine bana ekmek verdi, ekmeği köpeğe attım, köpek bana enik verdi, eniği çobana verdim, çoban bana kuzu verdi, kuzuyu misafire kestim, misafir bana kamçı verdi, kamçıyı yere vurdum, yer bana su kabı verdi, su kabını ırmağa attım, ırmak bana köpük verdi, köpüğü rafa koydum.",
          "Kınıklı kılıbık kırpıntı Kıyasettin, Kırımlı kılkuyruk kıtmiri kıkır kıkır kıkırdatarak küskütük küçümen küfeci külhaniyle külüstür Kürşat'ı külünklü küngür üstüne küttedek devirdi.",
          "Be birader buraya bak, başı bereli burma bıyıklı bastı bacak bayan berberiyle bizim Bedri bey birlikte bir pirinci birinci buluşta birbirine dizip Bursa pazarına indi.",
          "Bir pirinci birinci buluşta bir inci gibi birbirine bağlayıp, Perlepe berberi bastıbacak Bedri ile beraber Balıkesir pazarına parasız giden bu paytak budala, babası topal Badi'den biberli bir papara yedi.",
          "İbibiklerin ibiklerini iyice iyileştirmek için İstinyeli istifçi İbiş'in istif istiridyeleri mi, yoksa İskilipli İspinoz işportacı İshak'ın işliğindeki ibrişimleri mi daha iyi, bilemiyorum.",
          "Ilım ılınan, ılıcalı ılıcalı akan ılık ılık Iğdır ırmağı'nın kıyıları ıkır tıkır ığrıp ağaçlarıyla kaplıdır.",
          "Kokorozlanan koca köstek, kostak kostak kostaklanmış, kök sökmek, kösnül kösnül bakmak da ne oluyor, demiş.",
          "Yalancıoğlu yalıncık Yayla Dağı'nın yahnisini yağsız yiyebilirse de Yayla Dağı'nın yağlı yoğurdundan, Yüksekova'nın yusyumru yumurta yumurtlayan tavuklarından, bir de yörük ayranıyla yufkasından asla vazgeçemez.",
          "Sizin damda var beş boz başlı beş boz ördek, bizim damda var beş boz başlı beş boz ördek. Sizin damdaki beş boz başlı beş boz ördek, bizim damdaki beş boz başlı beş boz ördeğe, \"siz de bizcileyin beş boz başlı beş boz ördek misiniz\" demiş.",
          "Şu tarlaya bir şinik kekere mekere ekmişler. Şu tarlaya ekilen bir şinik kekere mekereye dadanan boz ala boz başlıklı pis porsuk, bu tarlaya ekilen bir şinik kekere mekereye dadanan boz ala boz başlıklı pis porsuğa demiş ki: \"Ben bu tarlaya ekilen bir şinik kekere mekereye dadanan boz ala boz başlıklı pis porsuğum.\"",
          "Taşlı tarladaki terasta talaşlar tutuşunca başlayan telaş, talaşların tamamıyla ve büsbütün tutuşmasıyla artmış. Tutuşan talaşları görüp tellaklar telaş ettikçe talaşlar tutuşmuş, talaşlar tutuştukça tellaklar telaş etmiş ve terasın trabzanına tutunmuş bakan Trabzonlu teşrifatçı titiz Tahsin Tevfik, talaşlar tutuştukça telaş eden tellaklara \"boşuna telaş ediyorsunuz\" demiş.",
          "Cırcır böceği çeneli ciciannenin çıtır pıtır kızının çıtı pıtı çıtkırıldım çocuğu için çıtı pıtı hanım, ciciannesine çatmış, çıkışmış.",
          "Sason'un susuz sazlıklarında sadece soğanla sarımsak yetişebileceğini söyleyen Samsunlu sebzecilerin sözüne sizler de sessizce ve sezgilerinize sığınarak inanabilirsiniz.",
          "Sazende Şazi ile Zifos Zihni zaman zaman sizin sokağın sağ köşesinde sinsi sinsi fiskoslaşarak sizi zibidi Suzi'ye sonsuz ve sorumsuz bir hayasızlıkla ikide bir şikayet ederler.",
          "Sedat Tınaz'ın bütün tasası suratsız teyzesine rastlamadan önce set üstünde sırtını zerzevat sepetinin pis tepesine sürten sıska sülük tazısını tuz tortusu tütsüsüne tutmasıydı.",
          "Şavşatlı Şaban, Şarkışlalı şipşakçı Şekip ve Şıpsevdi Şehime; Şişhane'den şeytankuşu mu, şömine maşası mı, masa şemsiyesi mi, şoson mu, şezlong mu ne, bir şeyler almaya gitmişler.",
          "Safranbolulu Safinazla Salihlili Salih Sivrihisar'da soğuk almışlar, sinüzit olmuşlar, sonra sımsıkı sarınarak söylenmesiz Seyitgazi'ye varıp, sarımsaklı suteresini susarımsağı ile karıştırarak suyunu süzmüşler.",
          "Vırvırcı Vedia ile vıdı vıdıcı Veli, velînimeti vatman Vahit'e vilâyette veda edip Vefa'ya doğru velespitle, vaveylâsız volta vururlarken, voleybolcu Volkan, virtüöz Vicdanî ve Viranşehirli vatansever viyolonselist Vecibe ile karşılaştılar.",
          "Çapakçurlu çapaçul çarkçıbaşı çaylak Zülküf, Çatalcalı çakmakçı çivit Cahit'e: \"Behey çaçabalığı çepiç, çerçi, çakaloz, çayırhorozu, çöpçatan, çurçur, çirişotu\" demiş.",
          "Ertenekli Örtenekli, Ergene'nin ecesi, Esentepe'nin eğlencesi, Erdenler erkete Erdem'le bize geldiler.",
          "Dadaylı dayımın Dodurgalı düdük deli dedesi, diline doladığı debdebeli dedim dedisiyle, dırdırını dilinden düşürüp de bir kez olsun doya doya düden diyemeden, düdenin dallara doldurduğu doyumlu yemişlerden doyasıya yiyemeden dar dünyadan göçüp gitti.",
          "Babaeskili bonboncu Bilal'le Bigalı bıngıldak Bahir'in bön bön bakışlarına, bomboş büyülü, büyük büyük laflarına kızıyordu. Bir berbere, bir bibere bre berber beri gel biber al, diyordu.",
          "Hayrabolulu hamamzade Hamitle, Hayrettin'in hanımı Halide Harputlu, has undan hamur açıp Halâskârgazi'de hassa alayından müteakit hamurkâr Hüsnü Hayrettin ile halası Hayrünisa Hanım'ın hem hayretine sebep oldu, hem de hayranlığını kazanıp hayır duasını aldı.",
          "Titiz, temiz, tendürüst dadım, tadını tattığı tere demedini dide dide dağıttı da, hiddetinden hem dut dalında takılı duran dirilti düdüğünü öttürdü, hem de didine didine dedim dedi, dedim dedi, dedi durdu.",
          "Sizin dala konmuş, hallu, bellu, gabellu, kabak baş bel baykuşu; bizim dala konmuş, hallu, bellu, gabellu, kabak baş bel baykuşuna \"Sen nasıl bir hallu, bellu, gabellu, kabak baş bel baykuşusun\" demiş."
        ]
      }
    ]
  },
  {
    id: 'isinma', harf: '5 dk', ad: 'Konuşmadan önce ısınma', ozet: 'Taslak: gevşeme, nefes, dudak-dil, Maaa-Meee, tekerleme.',
    hazir: true,
    sesli: false,
    ozKontrol: [
      { id: 'net', yazi: 'Sesim açıldı, rahatım', iyi: true, tavsiye: 'Harika! Konuşmaya hazırsın.' },
      { id: 'gergin', yazi: 'Hâlâ gerginim', tavsiye: 'Gevşeme ve nefes adımını bir tur daha yap. Omuzlarını düşür, çeneni gevşet.', adim: 1 },
      { id: 'agiz', yazi: 'Ağzım ve dilim hâlâ uyuşuk', tavsiye: 'Dudak ve dil hareketlerini tekrarla, ardından tekerlemeyi yavaştan hıza söyle.', adim: 2 },
      { id: 'ses', yazi: 'Sesim kısık ya da titrek çıkıyor', tavsiye: 'Su iç, Maaa-Meee adımını bağırmadan, rahat bir perdede tekrarla.', adim: 3 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'Beş dakikalık ısınma',
        metin: ['Önemli bir konuşmadan önce ses de, tıpkı bir sporcunun kası gibi ısınmaya ihtiyaç duyar. Bu sıra yaklaşık 5 dakika sürer.'],
        maddeler: [
          '<b>1. Gevşeme ve nefes</b> (1 dk): omuz, boyun, çene ve nefes.',
          '<b>2. Dudak ve dil</b> (1,5 dk): 6 ağız hareketi.',
          '<b>3. Ses</b> (1,5 dk): Maaa-Meee-Miii ünlü yuvarlağı.',
          '<b>4. Tekerleme</b> (1 dk): yavaştan hıza.',
          'Kısa sürede yapmak istersen sadece 2. ve 4. adımı yap.'
        ]
      },
      {
        tur: 'tut', baslik: 'Gevşeme ve nefes', fazAd: 'Yap!', birim: 'hareket',
        maddeler: [
          '<b>Omuzlar:</b> Omuzlarını kulaklarına doğru kaldır, sonra bırak.',
          '<b>Boyun:</b> Başını yavaşça sağa, sonra sola yatır. Zorlama.',
          '<b>Çene:</b> Dişlerini sıkma. Ağzını biraz aç, çeneni gevşet.',
          '<b>Burundan al:</b> Karnın ve kaburgalar yana doğru açılsın, omuzlar kalkmasın.',
          '<b>Ağızdan ver:</b> Yavaşça, uzatarak ver.',
          'Ekranda hangi hareketin sırası olduğunu görürsün.'
        ],
        sesler: ['Omuz bırak', 'Boyun yatır', 'Çene gevşet', 'Burundan al', 'Ağızdan ver', 'Burundan al', 'Ağızdan ver'], sure: 8, dinlenme: 1, turSayisi: 1
      },
      {
        tur: 'tut', baslik: 'Dudak ve dil hareketleri', fazAd: 'Yap!', birim: 'hareket',
        maddeler: [
          '<b>1 Masaj:</b> Parmak uçlarınla şakaktan çeneye yanak masajı.',
          '<b>2 Büz-ger:</b> Dudaklarını büz, sonra yanlara ger.',
          '<b>3 Kıvır:</b> Üst sonra alt dudağını dışarı kıvır.',
          '<b>4 Dil uzat:</b> Dilini burun, çene, kulaklar yönünde çıkar.',
          '<b>5 Dil dayama:</b> Dil ucunu üst ve alt dişlerin arkasına dayayıp ger.',
          '<b>6 Diş temizle:</b> Dil ucunla dişlerinin arasında gez.'
        ],
        sesler: ['1 Masaj', '2 Büz-ger', '3 Kıvır', '4 Dil uzat', '5 Dil dayama', '6 Diş temizle'], sure: 15, dinlenme: 1, turSayisi: 1
      },
      {
        tur: 'tut', baslik: 'Maaa - Meee - Miii', fazAd: 'Söyle!',
        maddeler: [
          'Rahat çıkabildiğin bir perdeden başla, bağırma.',
          'Ağızdan nefes al, sesten sese <b>kayarak ve uzatarak</b> söyle.',
          'Ses titremesin, incelip kalınlaşmasın. “Sesler su gibi aksın.”',
          'Önce Maaaaa-Meeeee-Miiiii-Moooo-Muuuu, sonra Laaaa-Leeee-Liii-Looo-Luuu.'
        ],
        sesler: ['Maaa-Meee-Miii', 'Mooo-Muuu', 'Laaa-Leee-Liii', 'Looo-Luuu'], sure: 8, dinlenme: 2, turSayisi: 1
      },
      {
        tur: 'cumle', baslik: 'Tekerlemeyle bitir', secim: 3,
        yonerge: 'Önce yavaş, sonra tempoyu artırarak söyle. Her sesin net çıkması hız kadar önemli.',
        havuz: [
          'Ping-pong, ping-pong, ping-pong, ping-pong.',
          'Ding-dong, ding-dong, ding-dong, ding-dong.',
          'Şu köşe yaz köşesi, bu köşe kış köşesi, ortada su şişesi.',
          'Üç tunç tas kayısı hoşafı.',
          'Kırk kırık küp kırkının da kulpu kırık kara küp.',
          'Kar kalkar karakartal kalkar, karakartal kalkar kar kalkar.',
          'Gül dibi bülbül dili gibi, gül dibi bülbül dili gibi.',
          'Bir berber bir berbere bre berber gel beraber.',
          "Evvel zaman içinde, kalbur saman içinde, develer tellal iken, pireler berber iken, ben anamın beşiğini tıngır mıngır sallar iken.",
          "Yağ yağ yağmur, tarlada çamur, teknede hamur, ver Allah'ım ver, sicim gibi yağmur.",
          "Portakalı soydum, başucuma koydum, ben bir yalan uydurdum, duma duma dum, kırmızı mum, dolapta pekmez, yala yala bitmez, Ayşecik cik cik cik, Fatmacık cık cık cık, sen bu oyundan çık.",
          "İğne battı, canımı yaktı, tombul kuş, arabaya koş, arabanın tekeri, İstanbul'un şekeri, hop hop altın top, bundan başka oyun yok.",
          "Ebe ebe nerede, su doldurur derede, dere boyu çalılık, şu ebe de ne alık, ebe suya dalamaz, arasa da bulamaz, ene nene bulamaz, ben sana küstüm.",
          "Ebe ebe gel bize, uzaktan vur elimize, eğer vuramazsan ebesin ebe.",
          "Ah ne süslü kelebek, üstü mavi altı benek, aman tutsam şunu ben, hemen uçup gitmeden.",
          "Uç uç böceğim, yarın düğün olacak, annem sana terlik pabuç alacak.",
          "Horoz öttü, tavuk tepti, bülbül kızı selamına dua etti.",
          "Incık mıncık, sen dur sen çık.",
          "Karnım aç, karnına kapak aç, değirmene kaç.",
          "Kızın adı Hediye, ekmek vermez kediye, kedi gider kadıya.",
          "Bir gün bir gün bir çocuk, eve de gelmiş kimse yok, açmış bakmış dolabı, şeker de sanmış ilacı, yemiş yemiş bitirmiş, akşama sancı başlamış, kıvrım kıvrım kıvranmış, hastaneyi boylamış.",
          "Gökte ne var? Gök boncuk. Yerde ne var? Yer boncuk. Dalda ne var? Elmacık. Babanın adı ne? Yusufçuk. Annenin adı ne? Fatmacık. Kaldır beni hoppacık.",
          "Fatma, pabucu yarım, çık dışarıya, oynayalım.",
          "Kuzu kuzu me, bin tepeme, hadi gidelim Hacı dedeme, Hacı dedem hasta, çorbası tasta, dedem çorba içti, oyun vakti geçti.",
          "Çıkalım çayıra, yem vereyim ördeğe, ördek yemini yemeden, cıyak mıyak demeden, çıktım çıkardım.",
          "Denizde dalga, hoş geldin abla, eteğini topla, üç kere atla.",
          "Ahmet Paşa leyleği, geymiş keten gömleği, keten gömlek dizinde, gözü vezir kızında.",
          "Belimi büke büke girdim hana, hancı dedi \"siz de bize, biz de size.\"",
          "Leylek leylek lekirdek, hani bana çekirdek? Çekirdeğin içi yok, koca kızın saçı yok.",
          "Adem madene gitmiş. Adem madende badem yemiş. Madem ki Adem madende badem yemiş, niye bize getirmemiş.",
          "Leylek leylek havada, yumurtası tavada, gel bizim hayata, hayat kapısı kitli, leyleğin başı bitli.",
          "Mustafa, Mıstık, arabaya kıstık, üç mum yaktık, seyrine baktık.",
          "Karga karga \"gak\" dedi, \"çık şu dala bak\" dedi, karga seni tutarım, kanadını yolarım.",
          "Saksağan sek sek, kuyruğu tümsek, kuyruğuna binelim, bizim köye gidelim.",
          "Fış fış kayıkçı, kayıkçının küreği, hop hop (bazı sitelerde \"tıp tıp\") eder yüreği, akşama fincan böreği.",
          "Makas, makas, makas, Ali dayı, noktaya bas, trampetler çalınıyor, yüzbaşılar darılıyor, darılmayın yüzbaşılar, can yürekten ayrılmıyor."
        ]
      }
    ]
  },
  {
    id: 'nefes', harf: 'Nefes', ad: 'Nefesim yetmiyor', ozet: 'Taslak: doğru nefes, sayılı nefes, “/” işaretli cümleler.',
    hazir: true,
    sesli: false,
    ozKontrol: [
      { id: 'net', yazi: 'Cümleyi rahatça bitirdim', iyi: true, tavsiye: 'Harika! Daha uzun cümlelerle dene.' },
      { id: 'omuz', yazi: 'Nefes alırken omuzlarım kalktı', tavsiye: 'Göğüs nefesi alıyorsun. Elini karnına koy; nefeste karın ve kaburgalar yana açılsın, omuzlar sabit kalsın.', adim: 1 },
      { id: 'bitti', yazi: 'Cümlenin sonunda nefesim bitti', tavsiye: 'Cümleyi daha erken bir yerde (virgülde ya da anlamı bölmeyen yerde) nefes alacak şekilde böl. Sayılı nefes çalışmasında verme süresini artır.', adim: 2 },
      { id: 'ortada', yazi: 'Cümlenin ortasında nefes aldım, anlam bölündü', tavsiye: 'Nefesi cümle başında ya da virgülde al. İşaretli cümlelerde “/” yerlerini kullan.', adim: 3 }
    ],
    adimlar: [
      {
        tur: 'bilgi', baslik: 'Doğru nefes nasıl alınır?',
        metin: ['Sesin gücü nefesten gelir. Doğru nefeste kaburgalar yana ve yukarı açılır, diyafram aşağı iner; hava önce akciğerin altını doldurur. Göğüs nefesinde yalnız akciğerin üstü dolar ve nefes çabuk biter.'],
        maddeler: [
          '<b>Omuzlar kalkıyorsa</b> göğüs nefesi alıyorsun demektir.',
          'Elini karnına koy: nefes alırken karın hafifçe öne, kaburgalar yana açılır.',
          'Nefes <b>cümle başında</b> ya da anlamı bölmeyen <b>virgülde</b> alınır.',
          'Cümle ortasında nefes almak anlamı böler; nefes yetmezse cümle sonu (yüklem) duyulmaz.',
          'Konuşurken nefes <b>ağızdan</b> ve belli etmeden alınır.',
          'Doğru nefes anlatmakla değil, bedenle çalışarak öğrenilir. Günde birkaç dakika yeter.'
        ],
        dene: { yonerge: 'Önce kendini yokla: Aşağıdakileri tek nefeste söyle ve kaydet.', sozler: ['Sabahları erken kalkıp güne sakin başlamak insana çok iyi gelir.'] }
      },
      {
        tur: 'tut', baslik: 'Kollarla nefes', fazAd: 'Yap!', birim: 'hareket',
        maddeler: [
          '<b>Yana aç:</b> Kolları yavaşça iki yana açarken burundan nefes al; kollar omuz hizasında nefes dolsun. İndirirken ağızdan yavaşça ver, verişi uzat.',
          '<b>Yukarı ger:</b> Kolları yukarı kaldır, ayak ucunda yüksel, burundan derin nefes al, 3 say, gevşerken ağızdan ver.',
          '<b>Öne yukarı:</b> Kolları paralel öne-yukarı kaldırırken nefes al, indirirken ağızdan yavaşça ver.',
          'Kollar gergin olmasın, “uçar gibi” gevşek. Omuzlar kalkmasın.',
          'Hepsi toplam 5 dakika; burada kısaltılmış hâli var. Günde birkaç kez, 4-5 hafta yap.'
        ],
        sesler: ['Yana aç', 'Yukarı ger', 'Öne yukarı'], sure: 25, dinlenme: 3, turSayisi: 1
      },
      {
        tur: 'tut', baslik: 'Sayılı nefes', fazAd: 'Yap!', birim: 'tur',
        maddeler: [
          'Burundan <b>6 sayıda</b> nefes al (omuzlar sabit).',
          'Ağızdan <b>8 sayıda</b> ver. Sonra verme sayısını ikişer ikişer artır: 10, 12, 14…',
          'Alma sayısı hep 6 kalır.',
          'Nefes bitti sanılan yerde biraz daha zorlamadan ver.',
          'Her tur 14 saniyedir: önce 6 sayı al, sonra yavaşça ver.'
        ],
        sesler: ['Al 6 · Ver 8', 'Al 6 · Ver 10', 'Al 6 · Ver 12'], sure: 14, dinlenme: 3, turSayisi: 1
      },
      {
        tur: 'cumle', baslik: '“/” işaretinde nefes al', secim: 4,
        yonerge: 'Yalnızca “/” işaretinde, ağızdan ve belli etmeden nefes al. Cümleyi anlam bölünmeden, rahat bir sesle oku.',
        havuz: [
          'Sabahları erken kalkmak, / güne sakin başlamak / ve acele etmemek / insana iyi gelir.',
          'Sınıfa girdiğimde / önce herkesi selamlıyorum, / sonra günün planını / kısaca anlatıyorum.',
          'Bugün sizinle / yeni bir konuyu konuşacağız, / ama önce / geçen haftayı hatırlayalım.',
          'Konuşurken acele etmeyin, / sesinizi güçlü tutun / ve her cümlenin sonunu / net söyleyin.',
          'Toplantıya geldiğiniz için teşekkür ederim, / çocuklarımızın başarısı için / birlikte çalışacağız.',
          'Akşam eve gelince / çayımı koyuyor, / biraz dinleniyor / sonra yarının hazırlığına başlıyorum.',
          'Her yeni gün, / öğrenmek için / yeni bir fırsattır.',
          'Güzel konuşmanın sırrı, / doğru nefes almak / ve cümleyi / zamanında bölmektir.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Uzun cümleyi tek nefeste', secim: 3,
        yonerge: 'Cümleyi önce içinden oku. Nefes al, sonra tek nefeste söyle. Yetmezse virgülden önce nefes al ve bir sonraki sefer cümleyi daha erken parçala.',
        havuz: [
          'Sabah erkenden kalkıp çayımı içtim, çocukları okula bıraktım ve işe yetişmek için acele ettim.',
          'Toplantıda konuşulan bütün konuları not alıp arkadaşlarımıza gönderdim.',
          'Bu hafta sonu ailemle birlikte sahile gidip uzun uzun yürüyüş yapmayı düşünüyoruz.',
          'Öğrencilerimin her birinin güçlü yanlarını fark edip onları destekleyerek ilerlemeyi seviyorum.',
          'Yağmur yağınca sokaklar sessizleşti, insanlar evlerine çekildi ve şehir bir an için durdu.',
          'Konuşurken nefesimi iyi yönetirsem cümlelerim daha güçlü ve daha anlaşılır oluyor.'
        ]
      }
    ]
  }
];
