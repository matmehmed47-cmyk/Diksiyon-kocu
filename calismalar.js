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
        sesler: ['Rrrrrrr', 'Prrrrrr'], sure: 5, dinlenme: 4, turSayisi: 3
      },
      {
        tur: 'kart', baslik: 'Hece kartları',
        yonerge: 'Her heceyi net söyle. Önce yavaş, ısındıkça tempoyu artır.',
        diziler: [
          { ad: 'ra - re - ri', ogeler: ['ra', 're', 'ri', 'ro', 'ru', 'rö', 'rü'] },
          { ad: 'ar - er - ir', ogeler: ['ar', 'er', 'ir', 'or', 'ur', 'ör', 'ür'] },
          { ad: 'rar - rer - rir', ogeler: ['rar', 'rer', 'rir', 'ror', 'rur', 'rör', 'rür'] },
          { ad: 'tar - ter - tir', ogeler: ['tar', 'ter', 'tir', 'tor', 'tur', 'tör', 'tür'] },
          { ad: 'tra - tre - tri', ogeler: ['tra', 'tre', 'tri', 'tro', 'tru', 'trö', 'trü'] },
          { ad: 'far - fer - fir', ogeler: ['far', 'fer', 'fir', 'for', 'fur', 'för', 'für'] },
          { ad: 'fra - fre - fri', ogeler: ['fra', 'fre', 'fri', 'fro', 'fru', 'frö', 'frü'] }
        ]
      },
      {
        tur: 'kart', baslik: 'Sözcükler',
        yonerge: 'Her sözcükte r duyulsun ama sert olmasın.',
        diziler: [
          { ad: 'Başta r', ogeler: ['raket', 'resim', 'rimel', 'roka', 'rumuz', 'rötar', 'rüküş'] },
          { ad: 'Ortada r', ogeler: ['kara', 'para', 'tere', 'kere', 'koro', 'toro', 'körük', 'yörük', 'türev', 'kürek'] },
          { ad: 'Sonda r', ogeler: ['kar', 'zar', 'ser', 'ter', 'sor', 'yor', 'sör', 'kör', 'tür', 'sür'] }
        ]
      },
      {
        tur: 'cumle', baslik: 'Sözcük sonundaki r',
        yonerge: 'Sondaki r yutulmaz ama hafif söylenir. Özellikle “-yor” ve “-yorlar” eklerine dikkat et.',
        cumleler: [
          'Öğrenciler sınıfa geliyorlar.',
          'Herkes sırayla soruyu okuyor.',
          'Bir arkadaşın bugün okula gelmiyor.',
          'Bir elma, bir armut, bir de ayran aldım.',
          'Çocuklar bahçede oyun oynuyorlar, ben de onları izliyorum.'
        ]
      },
      {
        tur: 'cumle', baslik: 'Tekerleme ve cümleler',
        yonerge: 'Önce yavaş ve her r duyulacak şekilde oku. Sonra hızlan, ama r kaybolmasın.',
        cumleler: [
          'Bir berber bir berbere, bre berber gel beraber bir berber dükkânı açalım demiş.',
          'Kar kalkar karakartal kalkar, karakartal kalkar kar kalkar.',
          'Rıza, renkli kartları sırayla raflara yerleştirdi.',
          'Perşembe günü pergelle büyük bir daire çizeceğiz.',
          'Rüzgâr, kıyıdaki kırmızı kayıkları sarstı.',
          'Arkadaşlar, ders bitti; sıraları toparlayıp kapıya doğru yürüyelim.'
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
