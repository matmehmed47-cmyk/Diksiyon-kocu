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
        sesler: ['Rrrrrrr', 'Prrrrrr'], sure: 5, dinlenme: 4, turSayisi: 3, titresimOlc: true
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
  { id: 's', harf: 'S', ad: 'S zorluğu', ozet: 'S sesi peltek ya da hışırtılı çıkıyor.', hazir: false },
  { id: 'z', harf: 'Z', ad: 'Z zorluğu', ozet: 'Z sesi bulanık çıkıyor.', hazir: false },
  { id: 'dudak', harf: 'Ağız', ad: 'Dudak ve dil tembelliği', ozet: 'Sesler yuvarlanıyor, net çıkmıyor.', hazir: false },
  { id: 'isinma', harf: '5 dk', ad: 'Konuşmadan önce ısınma', ozet: 'Gevşeme, dudak-dil hareketleri, Maaa-Meee.', hazir: false },
  { id: 'nefes', harf: 'Nefes', ad: 'Nefesim yetmiyor', ozet: 'Cümlenin sonunda nefesim bitiyor.', hazir: false }
];
