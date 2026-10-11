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
  { id: 'sy6', kat: 'soyleyis', baslik: 'Hükümet ve fazilet',
    metin: 'Hükümet | yeni bir karar aldı. ↘ || Dürüstlük | büyük bir fazilettir. ↘ || Akıbeti | hepimiz merak ettik. ↘ ||' }
];
