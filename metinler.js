/*
  Metin kütüphanesi.
  İşaretler:  /  nefes   |  kısa durak   ||  uzun durak   *kelime*  vurgu   ↘ ↗  ton
  Satır sonu için \n kullanılır (şiirlerde).
  hedef: kelime/dakika aralığı (null = hız hedefi yok)
*/
window.KATEGORILER = [
  { id: 'tekerleme', ad: 'Tekerleme', hedef: null },
  { id: 'cocuk', ad: 'Çocuklara', hedef: [100, 130] },
  { id: 'veli', ad: 'Velilere', hedef: [120, 140] },
  { id: 'ogretmen', ad: 'Öğretmenlere', hedef: [125, 150] },
  { id: 'seminer', ad: 'Seminer', hedef: [115, 145] },
  { id: 'siir', ad: 'Şiir', hedef: [80, 115] },
  { id: 'vurgu', ad: 'Vurgu', hedef: null },
  { id: 'tonlama', ad: 'Tonlama', hedef: [100, 135] },
  { id: 'soyleyis', ad: 'Söyleyiş', hedef: null }
];

window.METINLER = [
  // ---------- Tekerlemeler (halk tekerlemeleri) ----------
  { id: 't1', kat: 'tekerleme', baslik: 'Berber',
    metin: 'Bir berber bir berbere / bre berber gel beraber / bir berber dükkânı açalım demiş. ||' },
  { id: 't2', kat: 'tekerleme', baslik: 'Kartal',
    metin: 'Dal sarkar | kartal kalkar, / kartal kalkar | dal sarkar. || Dal *kalkar* | kartal *sarkar*? ||' },
  { id: 't3', kat: 'tekerleme', baslik: 'Şu köşe',
    metin: 'Şu köşe yaz köşesi, | şu köşe kış köşesi, / ortada su şişesi. ||' },
  { id: 't4', kat: 'tekerleme', baslik: 'Yoğurt',
    metin: 'Bu yoğurdu sarımsaklasak da mı saklasak, / sarımsaklamasak da mı saklasak? ||' },
  { id: 't5', kat: 'tekerleme', baslik: 'Kırk küp',
    metin: 'Kırk küp, | kırkının da kulpu kırık küp. ||' },
  { id: 't6', kat: 'tekerleme', baslik: 'Şemsi Paşa',
    metin: 'Şemsi Paşa pasajında / sesi büzüşesiceler. ||' },
  { id: 't7', kat: 'tekerleme', baslik: 'Uzun kelime',
    metin: 'Çekoslovakyalılaştıramadıklarımızdan mısınız? ||' },

  // ---------- Çocuklara ----------
  { id: 'c1', kat: 'cocuk', baslik: 'Sabah selamı',
    metin: 'Günaydın çocuklar! ↗ || Bugün sizinle *çok güzel* bir şey yapacağız. | Önce hep birlikte / derin bir nefes alalım. || Şimdi | gözlerimizi açıp / tahtaya bakalım. ↘ ||' },
  { id: 'c2', kat: 'cocuk', baslik: 'Küçük kaplumbağa',
    metin: 'Bir varmış, | bir yokmuş. || Ormanın kenarında / küçük bir kaplumbağa yaşarmış. || Adı *Tosbi* imiş. | Tosbi çok yavaş yürürmüş, / ama hiç vazgeçmezmiş. ↘ || Bir gün | tepedeki en büyük ağaca / tırmanmaya karar vermiş. ||' },
  { id: 'c3', kat: 'cocuk', baslik: 'Sıraya geçelim',
    metin: 'Arkadaşlar, | şimdi *sessizce* / sıraya geçiyoruz. || Önündeki arkadaşının omzuna / dokunmadan bekle. || Hazır mıyız? ↗ || Haydi bakalım, | bahçeye çıkıyoruz! ↘ ||' },
  { id: 'c4', kat: 'cocuk', baslik: 'Rüzgâr ile güneş',
    metin: 'Rüzgâr ile güneş / bir gün tartışmaya başlamış. || "*Ben* daha güçlüyüm!" | demiş rüzgâr. ↗ || Güneş gülümsemiş: | "Hadi görelim," / demiş. || Yoldan geçen yolcunun ceketini / kim çıkarırsa | o kazanacakmış. ↘ ||' },

  // ---------- Velilere ----------
  { id: 'v1', kat: 'veli', baslik: 'Toplantı açılışı',
    metin: '*Sevgili* veliler, / bugün sizlerle | çocuklarımızın *okuma alışkanlığı* hakkında / konuşmak istiyorum. ↘ || Okumak, | bir çocuğun dünyasını genişleten / *en güçlü* araçtır. ↘ ||' },
  { id: 'v2', kat: 'veli', baslik: 'Ödev düzeni',
    metin: 'Evde ödev saatini / her gün *aynı saatte* yapmak, | çocuğun sorumluluk kazanmasına / çok yardımcı olur. ↘ || Ödevi onun yerine yapmayalım; | yanında olalım, / ama kalemi *ona* bırakalım. ↘ ||' },
  { id: 'v3', kat: 'veli', baslik: 'Birlikte çalışmak',
    metin: 'Okul ve aile / aynı yöne baktığında, | çocuk kendini *güvende* hisseder. || Bir sorun olduğunda / beklemeden bana ulaşabilirsiniz. ↘ || Birlikte çözemeyeceğimiz / bir sorun yoktur. ↘ ||' },
  { id: 'v4', kat: 'veli', baslik: 'Dönem değerlendirmesi',
    metin: 'Bu dönem sınıfımız / özellikle *okuduğunu anlama* konusunda | güzel bir ilerleme gösterdi. || Önümüzdeki dönemde / matematikte problem çözmeye | daha fazla zaman ayıracağız. ↘ || Evde de kısa sorularla / bu çalışmaya destek olabilirsiniz. ↘ ||' },

  // ---------- Öğretmenlere ----------
  { id: 'o1', kat: 'ogretmen', baslik: 'Zümre toplantısı',
    metin: 'Değerli arkadaşlar, | bugünkü toplantımızda / üç konuyu ele alacağız. || *Birincisi* | ortak sınav takvimi, / *ikincisi* | okuma etkinliği, / *üçüncüsü* de | veli toplantısının hazırlığı. ↘ ||' },
  { id: 'o2', kat: 'ogretmen', baslik: 'Öneri sunmak',
    metin: 'Geçen dönem denediğimiz / *istasyon çalışması* | öğrencilerin katılımını / belirgin şekilde artırdı. || Bu yöntemi / diğer sınıflarda da | uygulamayı öneriyorum. ↘ || Görüşlerinizi duymak isterim. ↘ ||' },
  { id: 'o3', kat: 'ogretmen', baslik: 'Toplantıyı kapatmak',
    metin: 'Katılımınız için / hepinize teşekkür ederim. || Aldığımız kararları / *bugün* içinde | yazılı olarak paylaşacağım. || Bir sonraki toplantımızda / sonuçları birlikte değerlendireceğiz. ↘ ||' },

  // ---------- Seminer ----------
  { id: 's1', kat: 'seminer', baslik: 'Seminer açılışı',
    metin: 'Değerli meslektaşlarım, | hoş geldiniz. || Bugün sizlerle / sınıfta *sesimizi* | nasıl daha etkili ve / daha sağlıklı kullanabileceğimizi konuşacağız. ↘ || Çünkü bizim için ses, | sadece bir araç değil; / mesleğimizin *ta kendisidir*. ↘ ||' },
  { id: 's2', kat: 'seminer', baslik: 'Soru ile başlamak',
    metin: 'Size bir soru sormak istiyorum. || Bir gün içinde / kaç saat konuşuyoruz? ↗ || Çoğumuz / bunu hiç hesaplamadık. || Oysa sesimiz, | tıpkı bir sporcunun kası gibi, / *ısınmaya* ve *dinlenmeye* ihtiyaç duyar. ↘ ||' },
  { id: 's3', kat: 'seminer', baslik: 'Kapanış',
    metin: 'Sözlerimi / bir dilekle bitirmek istiyorum. || Sınıfa girdiğimiz her gün, | sesimizin / öğrencilerimize *güven* | ve *merak* taşımasını dilerim. ↘ || Beni dinlediğiniz için / teşekkür ederim. ↘ ||' },

  // ---------- Şiir (Yunus Emre, halk malı) ----------
  { id: 'p1', kat: 'siir', baslik: 'Gelin tanış olalım · Yunus Emre',
    metin: 'Gelin tanış olalım / \n İşi kolay kılalım / \n Sevelim sevilelim / \n Dünya kimseye kalmaz ↘ ||' },
  { id: 'p2', kat: 'siir', baslik: 'Bana seni gerek seni · Yunus Emre',
    metin: 'Aşkın aldı benden beni / \n Bana seni gerek seni / \n Ben yanarım dün ü günü / \n Bana seni gerek seni ↘ ||' },
  { id: 'p3', kat: 'siir', baslik: 'Sabah',
    metin: 'Pencereye konan güneş / \n Masama bir selam bıraktı, | \n Defterler açıldı birer birer, / \n Sınıfa *sabah* uyandı. ↘ ||' },

  // ---------- Vurgu (cümle vurgusu: önemli sözcüğü öne çıkar) ----------
  { id: 'vg1', kat: 'vurgu', baslik: 'Aynı cümle, dört vurgu',
    metin: '*Ben* yarın sınıfa gideceğim. ↘ \n Ben *yarın* sınıfa gideceğim. ↘ \n Ben yarın *sınıfa* gideceğim. ↘ \n Ben yarın sınıfa *gideceğim*. ↘ ||' },
  { id: 'vg2', kat: 'vurgu', baslik: 'Soruya göre vurgu',
    metin: 'Kitabı kim getirdi? | *Elif* getirdi. || Elif ne getirdi? | Elif *kitabı* getirdi. || Elif kitabı ne zaman getirdi? | Elif kitabı *sabah* getirdi. ||' },
  { id: 'vg3', kat: 'vurgu', baslik: 'Soru eki ve vurgu',
    metin: 'Yarın *gelecek* misin? ↗ || Bu kalemi *alabilir* miyim? ↗ || Ödevini *yaptın* mı? ↗ || Siz *hazır* mısınız? ↗ ||' },
  { id: 'vg4', kat: 'vurgu', baslik: 'Önemli sözcük başa gelir',
    metin: '*Başardık* sonunda. ↘ || *Unutmadım* sözümü. ↘ || *Gelmedi* arkadaşım, | haber de vermedi. ↘ ||' },
  { id: 'vg5', kat: 'vurgu', baslik: 'Sınıfta uyarı',
    metin: 'Çantalarınızı *yere* koyun. ↘ || Defterinizi *masaya* çıkarın. ↘ || Kalemi *yalnızca* ben söyleyince alın. ↘ ||' },
  { id: 'vg6', kat: 'vurgu', baslik: 'Yer adları ve seslenmeler · büyük harf vurgulu hece',
    metin: 'ANkara, | İZmir, | BURsa. || anTALya, | amaMASya. || ÇanakKAle, | DiyarBAKır. || MEHmet! | AYşe! | arKAdaşlar! ||' },

  // ---------- Tonlama (aynı söz, değişik duygu; başlıkta nasıl söyleyeceğin yazıyor) ----------
  { id: 'tn1', kat: 'tonlama', baslik: 'Sınıfa girerken · sıcak ve neşeli',
    metin: 'Günaydın! ↗ || Bugün hepinizi *çok* özlemişim. ↗ || Hadi bakalım, | yerlerinize geçelim. ↘ ||' },
  { id: 'tn2', kat: 'tonlama', baslik: 'Sessizlik isterken · sakin ama kararlı',
    metin: 'Şimdi | sessiz olmanızı istiyorum. ↘ || *Herkes* | yerine otursun. ↘ || Teşekkür ederim. ↘ ||' },
  { id: 'tn3', kat: 'tonlama', baslik: 'Yanlış cevaba · cesaretlendirerek',
    metin: 'Güzel bir deneme! ↗ || Şimdi birlikte bakalım: | *hangi* adımda | yanlış gitti? ↗ || Sen yapabilirsin. ↘ ||' },
  { id: 'tn4', kat: 'tonlama', baslik: 'Merak uyandırmak · gizemli',
    metin: 'Bugün size | bir şey göstereceğim. || Ama önce tahmin edin: | *sizce* | bu kutunun içinde ne var? ↗ ||' },
  { id: 'tn5', kat: 'tonlama', baslik: 'Başarıyı kutlamak · coşkulu',
    metin: 'İşte *bu*! ↗ || Hepiniz | çok güzel çalıştınız! ↗ || Kendinizle *gurur* duyabilirsiniz. ↘ ||' },
  { id: 'tn6', kat: 'tonlama', baslik: 'Dikkat çekmek · ciddi',
    metin: 'Dinleyin, | çünkü bu *önemli*. ↘ || Yolun karşısına geçmeden önce / *mutlaka* | sağa ve sola bakın. ↘ ||' },
  { id: 'tn7', kat: 'tonlama', baslik: '“Peki” · dört ayrı anlam',
    metin: 'Peki. ↘ || Peki? ↗ || Peeeki, | gidelim. || Peki, peki! ↗ ||' },

  // ---------- Söyleyiş (sık yanlış söylenen sözcükler) ----------
  { id: 'sy1', kat: 'soyleyis', baslik: 'Hakem ve rakip',
    metin: 'Hakem | maçı düdükle başlattı. ↘ || Rakip takım | sahaya çıktı. ↘ || Rakibimize | başarılar diledik. ↘ ||' },
  { id: 'sy2', kat: 'soyleyis', baslik: 'Millî ve resmî',
    metin: 'Millî bayramlarımız / her yıl coşkuyla kutlanır. ↘ || Resmî tatiller / takvimde yazılıdır. ↘ || Vatanî görevini / sevinçle yaptı. ↘ ||' },
  { id: 'sy3', kat: 'soyleyis', baslik: 'Hayır ve hamal',
    metin: 'Ona | “hayır” dedi. ↘ || Hayır işleri / insanı mutlu eder. ↘ || Hamal | yükü sırtladı. ↘ ||' },
  { id: 'sy4', kat: 'soyleyis', baslik: 'Şahane ve meşale',
    metin: 'Şahane | bir akşamdı. ↘ || Olimpiyat meşalesi / stadyuma girdi. ↘ || Bu vak’ayı / hiç unutmayacağım. ↘ ||' },
  { id: 'sy5', kat: 'soyleyis', baslik: 'İki ünsüz yan yana',
    metin: 'Sürpriz | bir doğum günü. ↘ || Trafo | arızalandı. ↘ || Prestij | sözcüğünü / doğru söyleyelim. ↘ ||' },
  { id: 'sy6', kat: 'soyleyis', baslik: 'Hükûmet ve fazilet',
    metin: 'Hükûmet | yeni bir karar aldı. ↘ || Dürüstlük | büyük bir fazilettir. ↘ || Akıbeti | hepimiz merak ettik. ↘ ||' },

  // ---------- Sürüm 2: Can Gürzap'ın yöntemine göre yazılan özgün metinler ----------
  // Çocuklara: masal ve canlandırma (karakterlere ayrı ses ver, abartma)
  { id: 'c5', kat: 'cocuk', baslik: 'Kayıp Sıfır · masal',
    metin: 'Bir zamanlar | sayılar ülkesinde / *küçücük* bir sıfır yaşarmış. || Herkes ona | “Sen *hiçsin*!” dermiş. ↘ || Sıfır | çok üzülürmüş. || Bir gün | Bir’in yanına oturmuş. | Bir şaşırmış: / “Aaa, | ben *on* oldum!” ↗ || O gün sıfır anlamış ki, | doğru yerde durunca / o da *çok* değerliymiş. ↘ || Peki çocuklar, | siz hangi sayının yanında / durmak isterdiniz? ↗ ||' },
  { id: 'c6', kat: 'cocuk', baslik: 'Kaplumbağa ile Cetvel · üç ayrı ses',
    metin: 'Kaplumbağa sabah sabah: | “Bugün | dünyanın en *uzun* yolunu ölçeceğim!” demiş. ↗ || Cetvel | gıcırtılı sesiyle gülmüş: / “Ben otuz santim, | sen kaç adımsın, | kaplumbağa?” ↗ || Kaplumbağa hiç bozulmamış: / “Ben *sabrım*, | sen *ölçüsün*. | İkimiz birlikte / her yolu ölçeriz.” ↘ || Bir adım, | bir santim, / bir adım, | bir santim... || Akşam olmuş, | yol bitmiş. ↘ ||' },
  { id: 'c7', kat: 'cocuk', baslik: 'Ben Cetvelim · canlandırma',
    metin: 'Merhaba! ↗ || Ben *cetvelim*. | Otuz santim boyum var, / ama hiç büyümüyorum! ↗ || Benden önce insanlar | *karışla*, | *adımla*, / *kulaçla* ölçerdi. || Herkesin eli farklı olunca | ne olurdu sizce? ↗ || Tabii ki | *kavga*! ↘ || Ben geldim, | herkes aynı ölçüyü kullandı. / Kavga bitti. ↘ ||' },

  // Velilere
  { id: 'v5', kat: 'veli', baslik: 'Gelişimi anlatmak · güven veren ses',
    metin: 'Sayın veli, | öncelikle şunu söylemek istiyorum: / kızınız *çok* emek veriyor. ↘ || Kesirlerde | henüz biraz zorlanıyor, ↗ / ama bu | *normal* bir süreç. ↘ || Evde her gün | sadece *on dakika* / birlikte bir soru çözerseniz, ↗ | farkı bir ay içinde göreceksiniz. ↘ || Ne zaman isterseniz | konuşabiliriz. ↘ ||' },
  { id: 'v6', kat: 'veli', baslik: 'Zor bir konu · sakin, yargılamadan',
    metin: 'Bugün sizi | önemli bir konu için çağırdım. ↘ || Oğlunuz | son iki haftadır / derslerde *çok* sessiz. ↘ || Ödevlerini getirmiyor, | arkadaşlarıyla da az konuşuyor. ↘ || Bunu | bir *suçlama* olarak söylemiyorum, / bir *endişe* olarak söylüyorum. ↘ || Evde | sizin fark ettiğiniz bir değişiklik var mı? ↗ || Birlikte bakarsak, | mutlaka bir yol buluruz. ↘ ||' },
  { id: 'v7', kat: 'veli', baslik: 'Kapıdaki veli · iki ses, diyalog',
    metin: 'Veli: | Hocam, | bir dakikanızı alabilir miyim? ↗ \n Öğretmen: | Tabii, | buyurun. ↘ \n Veli: | Bizim oğlan matematiği hiç sevmiyor... | ama... \n Öğretmen: | Ama? ↗ \n Veli: | Dün akşam | market fişini kontrol etti! / Kasiyer *iki* lira fazla almış! ↗ \n Öğretmen: | O zaman matematiği seviyor, / sadece *adını* sevmiyor. ↘ ||' },

  // Öğretmenlere
  { id: 'o4', kat: 'ogretmen', baslik: 'İlk gün · heyecan, korku, şefkat, kararlılık',
    metin: 'Sabah altıda uyandım. | Saat daha çalmamıştı bile! ↗ || Sonra | kapının önünde durdum. / Otuz çift göz... | Ya hiçbir şey söyleyemezsem? ↗ || Ama ön sırada küçük bir kız / bana bakıp gülümsedi. ↘ || O an anladım. | Ben buraya *korkmaya* değil, / *öğretmeye* geldim. ↘ ||' },
  { id: 'o5', kat: 'ogretmen', baslik: 'Not mu, öğrenme mi? · düşünür gibi',
    metin: 'Not | bir sayıdır. | Öğrenme | bir yolculuk. ↘ || Yetmiş alan çocuk geçer, | altmış dokuz alan kalır. ↘ || Arada | *bir* puan var. || Peki | bir puanlık bilgi neye benzer? ↗ || Belki de sormamız gereken / “Kaç aldın?” değil, | “Ne *öğrendin*?” ↘ ||' },
  { id: 'o6', kat: 'ogretmen', baslik: 'İki görüşlü konuşma · ödev her gün mü?',
    metin: 'Bu konuda | iki görüş var. ↘ || *Birinci* görüşe göre / düzenli ödev alışkanlık kazandırır, | konuyu pekiştirir. ↘ || *Öte yandan* ikinci görüş, / çok ödevin öğrenciyi yorduğunu, | dinlenme zamanını aldığını söyler. ↘ || Ben | ikisinin ortasında duruyorum: / *az*, | *kısa*, | ama *her gün*. ↘ ||' },
  { id: 'o7', kat: 'ogretmen', baslik: 'Konuşmadan önce · kendine güç ver',
    metin: 'Karşımdakiler | beni *dinlemek* için burada. ↘ || Hazırlandım. ↘ | *Biliyorum*. ↘ | Anlatabilirim. ↘ || Önce | derin bir nefes. / Sonra | ilk cümle. ↘ ||' },

  // Seminer
  { id: 's4', kat: 'seminer', baslik: 'Retorik soruyla açılış',
    metin: 'Değerli meslektaşlarım, | hoş geldiniz. ↘ || Size bir soru sormak istiyorum: / Bir öğrencinin “Ben matematikten *anlamam*” dediğini | kaç kez duydunuz? ↗ || Ben | sayısını unuttum. ↘ || Bugün | o cümlenin *nereden* geldiğini / ve onu nasıl *değiştirebileceğimizi* konuşacağız. ↘ ||' },
  { id: 's5', kat: 'seminer', baslik: 'Üç neden · konuşmaya yapı kurmak',
    metin: 'Neden ders başında / *iki dakika* hikâye anlatmalıyız? ↗ || Üç nedenim var. ↘ || *Birincisi*: | hikâye dikkati toplar. ↘ || *İkincisi*: | soyut bir kavrama / bir yüz, | bir isim kazandırır. ↘ || *Son olarak*: | öğrenciler formülü unutur, / ama hikâyeyi *unutmaz*. ↘ ||' },

  // Vurgu
  { id: 'vg7', kat: 'vurgu', baslik: 'Yarın sınav var · beş soru, beş vurgu',
    metin: '*Yarın* | ikinci derste | kesirler sınavı var. ↘ \n Yarın | *ikinci derste* | kesirler sınavı var. ↘ \n Yarın | ikinci derste | *kesirler* sınavı var. ↘ \n Yarın | ikinci derste | kesirler *sınavı* var. ↘ \n Yarın | ikinci derste | kesirler sınavı *var*. ↘ ||' },
  { id: 'vg8', kat: 'vurgu', baslik: 'Devrik cümle · önemli sözcük başa',
    metin: 'Bu soruyu | sınıfta herkes çözebilir. ↘ || *Çözebilir* | bu soruyu | sınıfta herkes. ↘ || Ödevini | bugün mutlaka bitir. ↘ || *Bitir* | ödevini | bugün mutlaka. ↘ ||' },
  { id: 'vg9', kat: 'vurgu', baslik: 'Virgülde merak · önce ↗ sonra ↘',
    metin: 'Bir sayıyı sıfırla çarparsak, ↗ | sonuç ne olur? ↗ || Sonuç | her zaman | *sıfır* olur. ↘ || Sıfır dışında bir sayıyı | kendisine bölersek, ↗ | sonuç ne olur? ↗ || Sonuç | her zaman | *bir* olur. ↘ ||' },
  { id: 'vg10', kat: 'vurgu', baslik: 'Bir kez daha · aynı cümle, üç anlam',
    metin: 'İlk gün dedim ki: | “*Bir kez daha* deneyelim.” ↗ || Üçüncü gün dedim ki: | “Bir kez *daha* deneyelim.” ↘ || Onuncu gün | çocuk bana döndü: / “*Bir* kez daha deneyelim, | öğretmenim.” ↗ || O gün | çözdü. ↘ ||' },
  { id: 'vg11', kat: 'vurgu', baslik: 'Pekiştirme · büyük harf vurgulu hece',
    metin: 'KIPkırmızı bir elma. ↘ || MASmavi bir gökyüzü. ↘ || DÜMdüz bir yol. ↘ || KOSkoca bir sınıf. ↘ ||' },

  // Tonlama
  { id: 'tn8', kat: 'tonlama', baslik: 'Sabır ve sabırsızlık · karşıt duygu',
    metin: 'Acele etmeyin. ↘ | Herkes | *kendi hızında* düşünsün. ↘ || *Hadi* çocuklar, ↗ | zil çalmak üzere! ↗ ||' },
  { id: 'tn9', kat: 'tonlama', baslik: 'Övgü ve uyarı · karşıt duygu',
    metin: '*Harika* bir çözüm! ↗ | Bunu hepimize anlatır mısın? ↗ || Bir daha *düşün*. ↘ || İşaretleri | *dikkatle* kontrol et. ↘ ||' },
  { id: 'tn10', kat: 'tonlama', baslik: 'Tek cümle, altı kişi · ses rengini değiştir',
    metin: 'Kızgın: | Ödevini yine mi unuttun? ↘ \n Şaşkın: | Ödevini yine mi unuttun? ↗ \n Yaşlı bir dede: | Ödevini / yine mi unuttun? ↘ \n Robot: | Ödevini | yine | mi | unuttun? \n Spiker: | Ödevini yine mi unuttun? ↘ \n Gülen bir anne: | Ödevini yine mi unuttun? ↗ ||' },
  { id: 'tn11', kat: 'tonlama', baslik: '“Tamam” · onay, soru, karar, isteksiz, sevinç',
    metin: 'Tamam. ↘ || Tamam? ↗ || *Tamam*! ↘ || Tamam... ↘ || Tamaam! ↗ ||' },

  // Söyleyiş
  { id: 'sy7', kat: 'soyleyis', baslik: 'Resmî tören · -î sonu uzun',
    metin: 'Değerli öğrenciler, | yarınki *resmî* tören için / saat sekizde bahçede olalım. ↘ || Okulun *millî* bayram programı | panoda asılıdır. ↘ ||' },
  { id: 'sy8', kat: 'soyleyis', baslik: 'Tahminî süre ve itina',
    metin: 'Sınavın *tahminî* süresi | kırk dakikadır. ↘ || Soruları okurken acele etmeyin, / her birine *itina* gösterin. ↘ ||' },
  { id: 'sy9', kat: 'soyleyis', baslik: 'Akabinde · uzatma yok',
    metin: 'Sayın veliler, | hoş geldiniz. ↘ || Toplantının *akabinde* / her veliyle ayrı ayrı görüşeceğim. ↘ ||' },
  { id: 'sy10', kat: 'soyleyis', baslik: 'Ek alınca uzayanlar · civarı, ilhamı, mizahı',
    metin: 'Okulumuzun *civarı* | oldukça sakindir. ↘ || Matematik *ilhamımı* / çocukların sorularından alırım. ↘ || Derste biraz *mizahı* severim, | dersin havasını yumuşatır. ↘ ||' },
  { id: 'sy11', kat: 'soyleyis', baslik: 'Taraftar ve rakip · ek alınca uzar',
    metin: 'Takımın *taraftarı* | tribünleri doldurmuştu. ↘ || Ama *rakibi* | çok güçlüydü. ↘ || Hakem | maçı zamanında bitirdi. ↘ ||' },
  { id: 'sy12', kat: 'soyleyis', baslik: 'İkametgâh · ka kalın, gâ uzun',
    metin: 'Kayıt için | *ikametgâhınızı* gösteren / bir belge getirmeniz gerekiyor. ↘ ||' },
  { id: 'sy13', kat: 'soyleyis', baslik: 'Edebî ve ebedî',
    metin: 'Türkçe öğretmenimiz | *edebî* bir yarışma düzenliyor. ↘ || Şehitlerimizin anısı / *ebedî* olarak yaşayacak. ↘ ||' },
  { id: 'sy14', kat: 'soyleyis', baslik: 'Doğru sözcüğü seç · zorundayız, maalesef',
    metin: 'Bu formu cuma gününe kadar / teslim etmek *zorundayız*. ↘ || *Maalesef* | müdür hanım bugün okulda değil. ↘ || Etkinlik | saat onda *başlıyor*. ↘ ||' },
  { id: 'sy15', kat: 'soyleyis', baslik: 'Şahane bir dönem · uzun sesler',
    metin: 'Bu dönem sonuçlarınız *şahane*! ↗ || *Harikulade* bir emek verdiniz. ↘ || Çalışmakta *ısrar* ettiniz, | vazgeçmediniz. ↘ || Birincilik alan arkadaşınız da | çok *mütevazı* bir çocuk. ↘ ||' }
];
