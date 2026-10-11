'use strict';
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(etiket, sinif, yazi) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (yazi != null) e.textContent = yazi;
    return e;
  }
  function sn(x) { return (Math.round(x * 10) / 10).toLocaleString('tr-TR'); }
  function sure(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function gunStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function tarihYaz(iso) {
    try { return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }); } catch (e) { return ''; }
  }
  function medyan(a) {
    if (!a.length) return 0;
    var s = a.slice().sort(function (x, y) { return x - y; });
    return s[Math.floor(s.length / 2)];
  }
  function degiskenlik(a) {
    if (a.length < 3) return 0;
    var ort = a.reduce(function (t, x) { return t + x; }, 0) / a.length;
    var v = a.reduce(function (t, x) { return t + (x - ort) * (x - ort); }, 0) / a.length;
    return ort > 0 ? Math.sqrt(v) / ort : 0;
  }

  // ================= Kalıcı veri (telefonda) =================
  var ANAHTAR = 'dk.v1';
  function bosVeri() {
    return { olcumler: [], nefesler: [], gunler: {}, sonMetin: {}, ayarlar: { rehber: 'sesli', seviye: 'baslangic', kategori: 'veli' } };
  }
  var veri = (function () {
    var v = bosVeri();
    try {
      var k = JSON.parse(localStorage.getItem(ANAHTAR));
      if (k) {
        v = Object.assign(v, k);
        v.ayarlar = Object.assign(bosVeri().ayarlar, k.ayarlar || {});
      }
    } catch (e) { /* boş başla */ }
    return v;
  })();
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(veri)); } catch (e) { /* yer yok */ } }
  function gunuIsaretle(adim) {
    var g = gunStr();
    veri.gunler[g] = veri.gunler[g] || {};
    veri.gunler[g][adim] = true;
    kaydet();
  }

  // Ses kayıtları IndexedDB'de
  var Depo = {
    db: null,
    ac: function () {
      var self = this;
      if (self.db) return Promise.resolve(self.db);
      return new Promise(function (res, rej) {
        var r = indexedDB.open('diksiyon-kocu', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('kayitlar', { keyPath: 'id' }); };
        r.onsuccess = function () { self.db = r.result; res(self.db); };
        r.onerror = function () { rej(r.error); };
      });
    },
    islem: function (mod, fn) {
      return this.ac().then(function (db) {
        return new Promise(function (res, rej) {
          var t = db.transaction('kayitlar', mod);
          var sonuc = fn(t.objectStore('kayitlar'));
          t.oncomplete = function () { res(sonuc && sonuc.result !== undefined ? sonuc.result : undefined); };
          t.onerror = function () { rej(t.error); };
        });
      });
    },
    ekle: function (k) { return this.islem('readwrite', function (s) { s.put(k); }); },
    hepsi: function () { return this.islem('readonly', function (s) { return s.getAll(); }).then(function (r) { return r || []; }); },
    sil: function (id) { return this.islem('readwrite', function (s) { s.delete(id); }); }
  };
  if (navigator.storage && navigator.storage.persist) { navigator.storage.persist().catch(function () {}); }

  // ================= Ses altyapısı =================
  var Ses = {
    ctx: null,
    baglam: function () {
      if (!this.ctx) {
        var C = window.AudioContext || window.webkitAudioContext;
        this.ctx = new C();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    mikrofon: function () {
      if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.reject({ name: 'Desteklenmiyor' });
      }
      return navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
    }
  };

  // Mikrofon seviyesi ölçer (isteğe bağlı yüksek geçiren süzgeç: "sss" sesini öne çıkarır)
  function Olcer(stream, yuksekGecis) {
    var ctx = Ses.baglam();
    var kaynak = ctx.createMediaStreamSource(stream);
    var son = kaynak, suzgec = null;
    if (yuksekGecis) {
      suzgec = ctx.createBiquadFilter();
      suzgec.type = 'highpass';
      suzgec.frequency.value = yuksekGecis;
      kaynak.connect(suzgec);
      son = suzgec;
    }
    var an = ctx.createAnalyser();
    an.fftSize = 2048;
    son.connect(an);
    var tampon = new Float32Array(an.fftSize);
    return {
      rms: function () {
        an.getFloatTimeDomainData(tampon);
        var t = 0;
        for (var i = 0; i < tampon.length; i++) t += tampon[i] * tampon[i];
        return Math.sqrt(t / tampon.length);
      },
      kapat: function () {
        try { kaynak.disconnect(); if (suzgec) suzgec.disconnect(); an.disconnect(); } catch (e) { /* yok say */ }
      }
    };
  }
  function akisiKapat(stream) {
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
  }
  function esikHesapla(taban) { return Math.max(taban * 3, taban + 0.003, 0.004); }

  function mikrofonHatasi(e) {
    var ad = e && e.name;
    var mesaj;
    if (ad === 'NotAllowedError' || ad === 'SecurityError') {
      mesaj = 'Mikrofon izni verilmedi. Tarayıcının ayarlarından bu site için mikrofona izin ver, sonra sayfayı yenile.';
    } else if (ad === 'NotFoundError') {
      mesaj = 'Mikrofon bulunamadı.';
    } else if (ad === 'Desteklenmiyor') {
      mesaj = 'Bu tarayıcı mikrofonu desteklemiyor. Sayfayı Safari ya da Chrome ile, https adresinden aç.';
    } else {
      mesaj = 'Mikrofon açılamadı. Başka bir uygulama mikrofonu kullanıyor olabilir.';
    }
    uyariGoster(mesaj);
  }
  var uyariZaman = null;
  function uyariGoster(m) {
    var u = $('#uyari');
    u.textContent = m;
    u.hidden = false;
    window.scrollTo(0, 0);
    clearTimeout(uyariZaman);
    uyariZaman = setTimeout(function () { u.hidden = true; }, 9000);
  }

  var kilit = null;
  function ekraniAcikTut() {
    try {
      if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (k) { kilit = k; }).catch(function () {});
    } catch (e) { /* yok */ }
  }
  function ekranKilidiBirak() { try { if (kilit) kilit.release(); } catch (e) { /* yok */ } kilit = null; }

  // ================= Sesli rehber =================
  var Rehber = {
    ses: null, konusuyor: false, sonBitis: 0,
    hazirla: function () {
      var self = this;
      if (!('speechSynthesis' in window)) return;
      var sec = function () {
        var sesler = speechSynthesis.getVoices();
        self.ses = sesler.filter(function (v) { return /^tr/i.test(v.lang); })[0] || null;
        rehberNotu();
      };
      sec();
      if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', sec);
    },
    // iOS: konuşmayı bir dokunuşla başlatmak gerekir
    uyandir: function () {
      if (veri.ayarlar.rehber === 'sesli' && 'speechSynthesis' in window) {
        try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* yok */ }
      }
    },
    soyle: function (metin, zilFrekans) {
      var self = this;
      var mod = veri.ayarlar.rehber;
      if (mod === 'sessiz') return;
      if (mod === 'sesli' && self.ses && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(metin);
        u.voice = self.ses; u.lang = self.ses.lang; u.rate = 0.95;
        self.konusuyor = true;
        var bitti = function () { self.konusuyor = false; self.sonBitis = performance.now(); };
        u.onend = bitti; u.onerror = bitti;
        setTimeout(function () { if (self.konusuyor) bitti(); }, 2500);
        speechSynthesis.speak(u);
      } else {
        self.zil(zilFrekans || 660);
      }
    },
    zil: function (f) {
      var self = this;
      var ctx = Ses.baglam();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      var t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.45);
      self.konusuyor = true;
      setTimeout(function () { self.konusuyor = false; self.sonBitis = performance.now(); }, 450);
    },
    mesgul: function () { return this.konusuyor || (performance.now() - this.sonBitis) < 350; },
    durdur: function () { try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* yok */ } this.konusuyor = false; }
  };
  function rehberNotu() {
    var n = $('#rehberNot');
    if (veri.ayarlar.rehber === 'sesli' && !Rehber.ses) {
      n.textContent = 'Telefonunda Türkçe konuşma sesi bulunamadı. Rehber yerine zil sesi çalacak.';
      n.hidden = false;
    } else n.hidden = true;
  }

  // ================= Ekranlar =================
  var BASLIKLAR = {
    bugun: 'Diksiyon Koçu', nefes: 'Nefes ve ses', metin: 'Metin çalışması', ders: 'Dersler', gelisim: 'Gelişimim'
  };
  var aktifEkran = 'bugun';
  function goster(ad, kaydirId) {
    if (!BASLIKLAR[ad]) ad = 'bugun';
    if (aktifEkran !== ad) {
      if (aktifEkran === 'nefes') { nefesDurdur(false); testIptal(); }
      if (aktifEkran === 'metin' && Kayit.aktif) kayitBitir();
      oynatmayiDurdur();
    }
    aktifEkran = ad;
    $$('[data-ekran]').forEach(function (s) { s.hidden = s.getAttribute('data-ekran') !== ad; });
    $$('.tab').forEach(function (t) {
      if (t.getAttribute('data-sekme') === ad) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    $('#baslik').textContent = BASLIKLAR[ad];
    $('#eyebrow').textContent = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (ad === 'bugun') bugunCiz();
    if (ad === 'gelisim') gelisimCiz();
    if (ad === 'metin') kanvasBoyutla();
    if (kaydirId) {
      var h = document.getElementById(kaydirId);
      if (h) setTimeout(function () { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    } else window.scrollTo(0, 0);
  }
  $$('[data-sekme]').forEach(function (b) { b.addEventListener('click', function () { goster(b.getAttribute('data-sekme')); }); });
  $$('[data-git]').forEach(function (b) {
    b.addEventListener('click', function () {
      var kat = b.getAttribute('data-kategori');
      if (kat && katBul(kat) && !Kayit.aktif) {
        veri.ayarlar.kategori = kat; kaydet(); katCiz(); metinSec(false);
      }
      goster(b.getAttribute('data-git'), b.getAttribute('data-kaydir'));
    });
  });

  // ================= Bugün =================
  function seriHesapla() {
    var gun = new Date(), n = 0;
    if (!veri.gunler[gunStr(gun)]) gun.setDate(gun.getDate() - 1);
    while (veri.gunler[gunStr(gun)]) { n++; gun.setDate(gun.getDate() - 1); }
    return n;
  }
  function sonOlcum(tur) {
    var l = veri.olcumler.filter(function (o) { return o.tur === tur; });
    return { son: l[l.length - 1], ilk: l[0], liste: l };
  }
  function bugunCiz() {
    var bugun = veri.gunler[gunStr()] || {};
    var adimlar = ['nefes', 'olcum', 'metin'];
    var tamam = 0, siradakiBulundu = false;
    adimlar.forEach(function (a) {
      var b = $('.step[data-adim="' + a + '"]');
      b.classList.remove('tamam', 'siradaki');
      var num = $('.num', b);
      if (bugun[a]) {
        tamam++;
        b.classList.add('tamam');
        num.textContent = '✓';
        num.setAttribute('aria-label', 'tamamlandı');
      } else {
        num.textContent = String(adimlar.indexOf(a) + 1);
        num.removeAttribute('aria-label');
        if (!siradakiBulundu) { b.classList.add('siradaki'); siradakiBulundu = true; }
      }
    });
    $('#ilerleme').style.width = Math.round(tamam / 3 * 100) + '%';

    var seri = seriHesapla();
    $('#seri').hidden = seri < 1;
    $('#seriYazi').textContent = seri + ' gün seri';

    var kutu = $('#bugunOlcumler');
    kutu.textContent = '';
    var tis = sonOlcum('tislama'), aaa = sonOlcum('aaa');
    function karo(baslik, deger, birim, not, notSinif) {
      var c = el('div', 'card tile');
      c.appendChild(el('div', 'k', baslik));
      var v = el('div', 'v', deger);
      if (birim) { v.appendChild(document.createTextNode(' ')); v.appendChild(el('small', null, birim)); }
      c.appendChild(v);
      c.appendChild(el('div', 'n ' + (notSinif || 'muted'), not));
      kutu.appendChild(c);
    }
    karo('Tıslama süresi', tis.son ? sn(tis.son.sure) : '–', 'sn',
      tis.son ? (tis.liste.length > 1 ? 'İlk ölçüm: ' + sn(tis.ilk.sure) + ' sn' : 'İlk ölçümün') : 'Henüz ölçülmedi',
      tis.son && tis.liste.length > 1 && tis.son.sure >= tis.ilk.sure ? 'ok' : 'muted');
    karo('“Aaa” tutma', aaa.son ? sn(aaa.son.sure) : '–', 'sn',
      aaa.son ? (aaa.liste.length > 1 ? 'İlk ölçüm: ' + sn(aaa.ilk.sure) + ' sn' : 'İlk ölçümün') : 'Henüz ölçülmedi',
      aaa.son && aaa.liste.length > 1 && aaa.son.sure >= aaa.ilk.sure ? 'ok' : 'muted');

    // Ana ekrana ekleme ipucu
    var yuklu = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
    if (!yuklu) {
      var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      $('#kurulumYazi').textContent = ios
        ? 'Safari’de alttaki Paylaş düğmesine (kare ve yukarı ok) dokun, sonra “Ana Ekrana Ekle”yi seç.'
        : 'Chrome’da sağ üstteki üç noktaya dokun, sonra “Ana ekrana ekle” ya da “Uygulamayı yükle”yi seç.';
      $('#kurulum').hidden = false;
    } else $('#kurulum').hidden = true;
  }

  // ================= Nefes egzersizi =================
  var SEVIYELER = {
    baslangic: { ad: 'Başlangıç', al: 4, tut: 4, ver: 6 },
    orta: { ad: 'Orta', al: 4, tut: 4, ver: 8 },
    ileri: { ad: 'İleri', al: 5, tut: 5, ver: 10 }
  };
  var REHBERLER = { sesli: 'Sesli', zil: 'Zil', sessiz: 'Sessiz' };
  var TUR_SAYISI = 5;
  var FAZ = {
    al: { ad: 'Nefes al', soz: 'Nefes al', zil: 523, olcek: 1 },
    tut: { ad: 'Tut', soz: 'Tut', zil: 659, olcek: 1 },
    ver: { ad: 'Yavaşça ver', soz: 'Sss diye ver', zil: 440, olcek: 0.62 }
  };

  function segCiz(kutu, secenekler, secili, degisti) {
    kutu.textContent = '';
    Object.keys(secenekler).forEach(function (k) {
      var b = el('button', null, typeof secenekler[k] === 'string' ? secenekler[k] : secenekler[k].ad);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(k === secili));
      b.addEventListener('click', function () { degisti(k); });
      kutu.appendChild(b);
    });
  }
  function nefesAyarCiz() {
    segCiz($('#seviyeSec'), SEVIYELER, veri.ayarlar.seviye, function (k) {
      if (nefes) return;
      veri.ayarlar.seviye = k; kaydet(); nefesAyarCiz();
    });
    segCiz($('#rehberSec'), REHBERLER, veri.ayarlar.rehber, function (k) {
      veri.ayarlar.rehber = k; kaydet(); nefesAyarCiz(); rehberNotu();
    });
    var sv = SEVIYELER[veri.ayarlar.seviye];
    var f = $('#fazlar');
    f.textContent = '';
    ['al', 'tut', 'ver'].forEach(function (k) {
      var d = el('div', 'phase', FAZ[k].ad);
      d.setAttribute('data-faz', k);
      d.appendChild(el('b', null, sv[k] + ' sn'));
      f.appendChild(d);
    });
    if (!nefes) $('#turYazi').textContent = TUR_SAYISI + ' tur · yaklaşık ' + Math.round((sv.al + sv.tut + sv.ver) * TUR_SAYISI / 60 * 10) / 10 + ' dakika';
  }

  var nefes = null;
  var daire = $('#daire');
  function daireAyarla(olcek, saniye) {
    daire.style.transitionDuration = saniye + 's';
    daire.style.transform = 'scale(' + olcek + ')';
  }

  function nefesBaslat() {
    Ses.baglam();
    Rehber.uyandir();
    var dinle = $('#nefesDinle').checked;
    var sv = SEVIYELER[veri.ayarlar.seviye];
    var basla = function (stream) {
      nefes = {
        sv: sv, stream: stream, olcer: stream ? Olcer(stream, 1500) : null,
        tur: 1, faz: 'hazir', fazBas: performance.now(), sonOrnek: performance.now(),
        kalib: [], esik: null, turVeri: null, turlar: [], zamanlayici: null
      };
      $('#nefesBtn').textContent = 'Durdur';
      $('#nefesSonuc').hidden = !stream;
      $('#nefesTurlar').textContent = '';
      $('#nefesOzet').hidden = true;
      $$('#seviyeSec button').forEach(function (b) { b.disabled = true; });
      $('#nefesDinle').disabled = true;
      ekraniAcikTut();
      $('#fazAd').textContent = stream ? 'Sessiz kal' : 'Hazırlan';
      $('#turYazi').textContent = stream ? 'Ortam sesini ölçüyorum…' : '';
      daireAyarla(0.62, 1);
      Rehber.soyle('Hazırlan', 600);
      nefes.zamanlayici = setInterval(nefesTik, 50);
    };
    if (dinle) {
      Ses.mikrofon().then(basla).catch(function (e) { mikrofonHatasi(e); });
    } else basla(null);
  }

  function fazaGir(f) {
    var n = nefes;
    n.faz = f;
    n.fazBas = performance.now();
    if (f === 'al') {
      n.turVeri = { verAktif: 0, verIlk: null, verSon: null, verRms: [], tutAktif: 0 };
      $('#turYazi').textContent = 'Tur ' + n.tur + ' / ' + TUR_SAYISI;
    }
    $('#fazAd').textContent = FAZ[f].ad;
    $$('.phase').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-faz') === f); });
    daireAyarla(FAZ[f].olcek, n.sv[f]);
    Rehber.soyle(n.olcer ? FAZ[f].soz : FAZ[f].ad, FAZ[f].zil);
  }

  function nefesTik() {
    var n = nefes;
    if (!n) return;
    var simdi = performance.now();
    var dt = Math.min(0.25, (simdi - n.sonOrnek) / 1000);
    n.sonOrnek = simdi;
    var gecen = (simdi - n.fazBas) / 1000;
    var uzunluk = n.faz === 'hazir' ? 2 : n.sv[n.faz];

    if (n.olcer) {
      var r = n.olcer.rms();
      var gorsel = n.esik ? Math.min(1, r / (n.esik * 6)) : Math.min(1, r * 30);
      $('#nefesSeviye').style.width = Math.round(gorsel * 100) + '%';
      if (n.faz === 'hazir') {
        if (!Rehber.mesgul()) n.kalib.push(r);
      } else if (n.esik && !Rehber.mesgul()) {
        var aktif = r > n.esik;
        var t = n.turVeri;
        if (n.faz === 'ver' && aktif) {
          t.verAktif += dt; t.verRms.push(r);
          if (t.verIlk == null) t.verIlk = gecen;
          t.verSon = gecen;
        } else if (n.faz === 'tut' && aktif) {
          t.tutAktif += dt;
        }
      }
    }

    $('#fazSayac').textContent = n.faz === 'hazir' ? '' : String(Math.max(1, Math.ceil(uzunluk - gecen)));

    if (gecen >= uzunluk) {
      if (n.faz === 'hazir') {
        if (n.olcer) n.esik = esikHesapla(medyan(n.kalib));
        fazaGir('al');
      } else if (n.faz === 'al') fazaGir('tut');
      else if (n.faz === 'tut') fazaGir('ver');
      else {
        if (n.olcer) turDegerlendir();
        if (n.tur >= TUR_SAYISI) { nefesDurdur(true); return; }
        n.tur++;
        fazaGir('al');
      }
    }
  }

  function turDegerlendir() {
    var n = nefes, t = n.turVeri, sv = n.sv;
    var durum, mesaj;
    var cv = degiskenlik(t.verRms);
    if (t.verAktif < 0.8) {
      durum = 'b'; mesaj = 'Nefes verişini duyamadım. Telefonu yüzüne yaklaştır ve “sss” diye sesli ver.';
    } else if (t.verSon < sv.ver - 1.2) {
      durum = 'w'; mesaj = 'Erken bitirdin: ' + sn(t.verSon) + ' sn / ' + sv.ver + ' sn. Nefesini daha yavaş ver.';
    } else if (t.verIlk != null && t.verIlk > 2.5) {
      durum = 'w'; mesaj = 'Geç başladın. “Ver” denince hemen ve yavaşça vermeye başla.';
    } else if (cv > 0.6) {
      durum = 'w'; mesaj = 'Süre iyi ama nefesin dengesiz çıktı. Baştan sona aynı güçte vermeye çalış.';
    } else {
      durum = 'g'; mesaj = 'Güzel: tam süre ve dengeli.';
    }
    if (t.tutAktif > 0.6) mesaj += ' “Tut” sırasında nefes kaçırdın.';
    n.turlar.push(durum);

    var satir = el('div', 'card tur');
    var rozet = el('span', 'badge ' + durum, String(n.tur));
    satir.appendChild(rozet);
    satir.appendChild(el('p', null, mesaj));
    $('#nefesTurlar').appendChild(satir);
  }

  function nefesDurdur(tamamlandi) {
    var n = nefes;
    if (!n) return;
    clearInterval(n.zamanlayici);
    if (n.olcer) n.olcer.kapat();
    akisiKapat(n.stream);
    Rehber.durdur();
    ekranKilidiBirak();
    nefes = null;
    $('#nefesBtn').textContent = 'Egzersizi başlat';
    $$('#seviyeSec button').forEach(function (b) { b.disabled = false; });
    $('#nefesDinle').disabled = false;
    $$('.phase').forEach(function (p) { p.classList.remove('on'); });
    $('#nefesSeviye').style.width = '0';
    daireAyarla(0.62, 1);
    $('#fazSayac').textContent = '–';
    if (tamamlandi) {
      $('#fazAd').textContent = 'Bitti';
      Rehber.soyle('Tebrikler, bitti', 784);
      veri.nefesler.push({ tarih: new Date().toISOString(), seviye: veri.ayarlar.seviye, dinlendi: !!n.olcer, turlar: n.turlar });
      gunuIsaretle('nefes');
      if (n.olcer && n.turlar.length) {
        var iyi = n.turlar.filter(function (d) { return d === 'g'; }).length;
        var ozet = TUR_SAYISI + ' turun ' + iyi + ' tanesi tam süre ve dengeli. ';
        if (iyi === TUR_SAYISI) ozet += 'Harika. Hazır hissedersen bir sonraki seviyeyi dene.';
        else if (iyi >= 3) ozet += 'İyi gidiyorsun. Uyarı aldığın turlara dikkat ederek tekrar et.';
        else ozet += 'Nefesi verirken acele etme. Gerekirse bir alt seviyede çalış.';
        $('#nefesOzetYazi').textContent = ozet;
        $('#nefesOzet').hidden = false;
      }
      nefesAyarCiz();
      $('#turYazi').textContent = 'Egzersiz tamamlandı.';
    } else {
      $('#fazAd').textContent = 'Hazır';
      nefesAyarCiz();
    }
  }
  $('#nefesBtn').addEventListener('click', function () { if (nefes) nefesDurdur(false); else { testIptal(); nefesBaslat(); } });

  // ================= Ses ölçümleri (tıslama, aaa) =================
  var test = null;
  function testKart(tur) { return $('.olcum[data-test="' + tur + '"]'); }
  function oncekiYaz() {
    ['tislama', 'aaa'].forEach(function (tur) {
      var o = sonOlcum(tur);
      var enIyi = o.liste.reduce(function (m, x) { return Math.max(m, x.sure); }, 0);
      $('[data-onceki]', testKart(tur)).textContent = o.son ? 'Son: ' + sn(o.son.sure) + ' sn · En iyi: ' + sn(enIyi) + ' sn' : '';
    });
  }
  function testBaslat(tur) {
    if (test) { testIptal(); return; }
    if (nefes) nefesDurdur(false);
    Ses.baglam();
    var kart = testKart(tur);
    var durumKutu = $('[data-durum]', kart);
    var btn = $('[data-testbtn]', kart);
    Ses.mikrofon().then(function (stream) {
      test = {
        tur: tur, stream: stream, olcer: Olcer(stream, tur === 'tislama' ? 1500 : 80),
        evre: 'kalib', evreBas: performance.now(), son: performance.now(), kalib: [], esik: null,
        ilk: null, sonAktif: null, aktif: 0, rmsler: [], kart: kart, durumKutu: durumKutu, btn: btn
      };
      btn.textContent = 'Vazgeç';
      durumKutu.hidden = false;
      durumKutu.textContent = 'Sessiz kal, ortam sesini ölçüyorum…';
      ekraniAcikTut();
      test.zamanlayici = setInterval(testTik, 50);
    }).catch(mikrofonHatasi);
  }
  function testTik() {
    var t = test;
    if (!t) return;
    var simdi = performance.now();
    var dt = Math.min(0.25, (simdi - t.son) / 1000);
    t.son = simdi;
    var gecen = (simdi - t.evreBas) / 1000;
    var r = t.olcer.rms();

    if (t.evre === 'kalib') {
      t.kalib.push(r);
      if (gecen >= 1.5) {
        t.esik = esikHesapla(medyan(t.kalib));
        t.evre = 'hazir'; t.evreBas = simdi;
      }
    } else if (t.evre === 'hazir') {
      var kalan = Math.ceil(3 - gecen);
      t.durumKutu.textContent = 'Derin bir nefes al… ' + Math.max(1, kalan);
      if (gecen >= 3) {
        Rehber.zil(880);
        t.evre = 'olc'; t.evreBas = simdi;
        t.durumKutu.textContent = t.tur === 'tislama' ? 'Şimdi: “sssss”' : 'Şimdi: “aaaa”';
      }
    } else if (t.evre === 'olc') {
      if (Rehber.mesgul()) return;
      var aktif = r > t.esik;
      if (aktif) {
        if (t.ilk == null) t.ilk = gecen;
        t.sonAktif = gecen;
        t.aktif += dt;
        t.rmsler.push(r);
      }
      if (t.ilk != null) {
        var surer = t.sonAktif - t.ilk;
        t.durumKutu.textContent = '';
        t.durumKutu.appendChild(el('span', 'buyuk-sayi', sn(surer) + ' sn'));
        t.durumKutu.appendChild(document.createTextNode('Devam et…'));
        if (gecen - t.sonAktif > 0.7 && t.aktif > 0.3) { testBitir(); return; }
      } else if (gecen > 6) {
        testIptal();
        var k = $('[data-durum]', testKart(t.tur));
        k.hidden = false;
        k.textContent = 'Sesini duyamadım. Telefonu ağzına yaklaştır (bir karış kadar) ve tekrar dene.';
        return;
      }
      if (gecen > 90) testBitir();
    }
  }
  function testTemizle() {
    var t = test;
    if (!t) return null;
    clearInterval(t.zamanlayici);
    t.olcer.kapat();
    akisiKapat(t.stream);
    ekranKilidiBirak();
    t.btn.textContent = 'Ölçümü başlat';
    test = null;
    return t;
  }
  function testIptal() {
    var t = testTemizle();
    if (t) t.durumKutu.hidden = true;
  }
  function testBitir() {
    var t = testTemizle();
    if (!t) return;
    var olculen = Math.round((t.sonAktif - t.ilk) * 10) / 10;
    var cv = degiskenlik(t.rmsler);
    var onceki = sonOlcum(t.tur);
    var enIyi = onceki.liste.reduce(function (m, x) { return Math.max(m, x.sure); }, 0);
    veri.olcumler.push({ tur: t.tur, tarih: new Date().toISOString(), sure: olculen, denge: Math.round(cv * 100) / 100 });
    gunuIsaretle('olcum');

    var k = t.durumKutu;
    k.textContent = '';
    k.appendChild(el('span', 'buyuk-sayi', sn(olculen) + ' sn'));
    var yorum = [];
    if (onceki.son) {
      if (olculen > enIyi) yorum.push('Yeni rekor! Önceki en iyin ' + sn(enIyi) + ' sn idi.');
      else yorum.push('Önceki ölçüm: ' + sn(onceki.son.sure) + ' sn.');
    } else yorum.push('İlk ölçümün kaydedildi. Bundan sonra gelişimini göreceksin.');
    if (cv > 0.6) yorum.push(t.tur === 'tislama' ? 'Nefesin dalgalı çıktı; daha eşit vermeye çalış.' : 'Sesin dalgalandı; daha sabit tutmaya çalış.');
    else if (olculen >= 5) yorum.push(t.tur === 'tislama' ? 'Nefes verişin dengeliydi.' : 'Sesini sabit tuttun.');
    k.appendChild(document.createTextNode(yorum.join(' ')));
    k.hidden = false;
    oncekiYaz();
  }
  $$('[data-testbtn]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tur = b.closest('.olcum').getAttribute('data-test');
      if (test && test.tur === tur) { testIptal(); return; }
      if (test) testIptal();
      testBaslat(tur);
    });
  });

  // ================= Metin =================
  var simdikiMetin = null;
  function katBul(id) { return window.KATEGORILER.filter(function (k) { return k.id === id; })[0]; }
  function katCiz() {
    var kutu = $('#katSec');
    kutu.textContent = '';
    window.KATEGORILER.forEach(function (k) {
      var b = el('button', null, k.ad);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(k.id === veri.ayarlar.kategori));
      b.addEventListener('click', function () {
        if (Kayit.aktif) return;
        veri.ayarlar.kategori = k.id; kaydet(); katCiz(); metinSec(false);
      });
      kutu.appendChild(b);
    });
  }
  function metinSec(yeni) {
    var kat = veri.ayarlar.kategori;
    var liste = window.METINLER.filter(function (m) { return m.kat === kat; });
    var son = veri.sonMetin[kat];
    var m = null;
    if (!yeni && son) m = liste.filter(function (x) { return x.id === son; })[0];
    if (!m) {
      var aday = liste.filter(function (x) { return !simdikiMetin || x.id !== simdikiMetin.id; });
      if (!aday.length) aday = liste;
      m = aday[Math.floor(Math.random() * aday.length)];
    }
    simdikiMetin = m;
    veri.sonMetin[kat] = m.id; kaydet();
    metinCiz(m);
    $('#sonuc').hidden = true;
    $('#kayitci').hidden = false;
    oynatmayiDurdur();
  }
  // İşaretli metni ekrana çizer; kelime ve işaret sayısını döndürür
  function metinCiz(m) {
    var kat = katBul(m.kat);
    $('#metinBaslik').textContent = m.baslik;
    $('#metinHedef').textContent = kat.ad + (kat.hedef ? ' · hedef hız ' + kat.hedef[0] + '–' + kat.hedef[1] + ' kelime/dk' : ' · önce yavaş, sonra hızlan');
    var alan = $('#metinAlan');
    alan.textContent = '';
    var kelime = 0, isaret = 0, vurguAcik = false;
    m.metin.split('\n').forEach(function (satir, si) {
      if (si > 0) alan.appendChild(document.createElement('br'));
      satir.split(/\s+/).filter(Boolean).forEach(function (tok) {
        var span;
        if (tok === '/') { span = el('span', 'mk-n', '/'); isaret++; }
        else if (tok === '|' || tok === '||') { span = el('span', 'mk-d', tok); isaret++; }
        else if (tok === '↘' || tok === '↗') { span = el('span', 'ton', tok); }
        else {
          // *tek kelime* ya da *birden fazla kelimelik* vurgu
          kelime++;
          var p = /^([("“]*)(\*?)(.*?)(\*?)([.,;:!?…")”]*)$/.exec(tok);
          var on = p[1], ac = p[2], govde = p[3], kapa = p[4], son = p[5];
          if (ac) vurguAcik = true;
          var vurgulu = vurguAcik;
          if (kapa) vurguAcik = false;
          span = document.createDocumentFragment();
          if (on) span.appendChild(document.createTextNode(on));
          span.appendChild(vurgulu ? el('b', 'vurgu', govde) : document.createTextNode(govde));
          if (son) span.appendChild(document.createTextNode(son));
        }
        alan.appendChild(span);
        alan.appendChild(document.createTextNode(' '));
      });
    });
    m._kelime = kelime;
    m._isaret = isaret;
  }
  $('#baskaMetin').addEventListener('click', function () { if (!Kayit.aktif) metinSec(true); });

  // ---------- Kayıt ----------
  var ADIM = 0.05; // zarf örnekleme aralığı (sn)
  var Kayit = { aktif: false };
  var canliKanvas = $('#canliDalga'), sonucKanvas = $('#sonucDalga');

  function kanvasBoyutla() {
    [canliKanvas, sonucKanvas].forEach(function (c) {
      var dpr = window.devicePixelRatio || 1;
      var w = c.clientWidth || c.parentNode.clientWidth;
      var h = c.clientHeight || parseInt(c.getAttribute('height'), 10);
      if (w > 0) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    });
    if (sonAnaliz) sonucCiz();
  }
  window.addEventListener('resize', kanvasBoyutla);

  function renk(ad) { return getComputedStyle(document.documentElement).getPropertyValue(ad).trim(); }

  function canliCiz(zarf) {
    var c = canliKanvas, x = c.getContext('2d');
    var W = c.width, H = c.height;
    x.clearRect(0, 0, W, H);
    var dpr = window.devicePixelRatio || 1;
    var cubuk = 4 * dpr, ara = 3 * dpr;
    var n = Math.floor(W / (cubuk + ara));
    var bas = Math.max(0, zarf.length - n);
    var tepe = 0.08;
    x.fillStyle = renk('--accent');
    for (var i = 0; i < n; i++) {
      var v = zarf[bas + i];
      if (v == null) break;
      var h = Math.max(2 * dpr, Math.min(1, v / tepe) * H);
      x.fillRect(i * (cubuk + ara), (H - h) / 2, cubuk, h);
    }
  }

  function uygunTur() {
    if (!window.MediaRecorder) return null;
    var turler = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/aac', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < turler.length; i++) {
      try { if (MediaRecorder.isTypeSupported(turler[i])) return turler[i]; } catch (e) { /* yok */ }
    }
    return '';
  }

  function kayitBaslat() {
    if (!window.MediaRecorder) {
      uyariGoster('Bu tarayıcı ses kaydını desteklemiyor. Telefonunun tarayıcısını güncelle ya da Safari/Chrome kullan.');
      return;
    }
    Ses.baglam();
    oynatmayiDurdur();
    kanvasBoyutla();
    Ses.mikrofon().then(function (stream) {
      var tur = uygunTur();
      var rec;
      try { rec = tur ? new MediaRecorder(stream, { mimeType: tur }) : new MediaRecorder(stream); }
      catch (e) { rec = new MediaRecorder(stream); }
      Kayit = {
        aktif: true, stream: stream, rec: rec, parcalar: [], zarf: [],
        olcer: Olcer(stream, 80), bas: performance.now(), metin: simdikiMetin
      };
      rec.ondataavailable = function (e) { if (e.data && e.data.size) Kayit.parcalar.push(e.data); };
      rec.onstop = kayitTamam;
      rec.start(1000);
      Kayit.zamanlayici = setInterval(function () {
        Kayit.zarf.push(Kayit.olcer.rms());
        canliCiz(Kayit.zarf);
        $('#kayitYazi').textContent = 'Kaydediliyor · ' + sure((performance.now() - Kayit.bas) / 1000);
      }, ADIM * 1000);
      $('#kayitBtn').classList.add('on');
      $('#kayitBtn').setAttribute('aria-label', 'Kaydı bitir');
      $('#kayitDurum').classList.add('on');
      $('#kayitIpucu').textContent = 'Okumayı bitirince düğmeye tekrar bas.';
      ekraniAcikTut();
    }).catch(mikrofonHatasi);
  }

  function kayitBitir() {
    if (!Kayit.aktif) return;
    Kayit.aktif = false;
    Kayit.sure = (performance.now() - Kayit.bas) / 1000;
    clearInterval(Kayit.zamanlayici);
    try { Kayit.rec.stop(); } catch (e) { kayitTamam(); }
    Kayit.olcer.kapat();
    ekranKilidiBirak();
    $('#kayitBtn').classList.remove('on');
    $('#kayitBtn').setAttribute('aria-label', 'Kaydı başlat');
    $('#kayitDurum').classList.remove('on');
    $('#kayitYazi').textContent = 'Hazır · 0:00';
    $('#kayitIpucu').textContent = 'Kırmızı düğmeye bas ve metni sesli oku. Bitince tekrar bas.';
  }

  function kayitTamam() {
    var k = Kayit;
    akisiKapat(k.stream);
    if (!k.parcalar.length || k.sure < 1) {
      uyariGoster('Kayıt çok kısa oldu ya da kaydedilemedi. Tekrar dene.');
      return;
    }
    var mime = (k.rec && k.rec.mimeType) || (k.parcalar[0] && k.parcalar[0].type) || 'audio/mp4';
    var blob = new Blob(k.parcalar, { type: mime });
    var analiz = analizEt(k.zarf, k.metin);
    if (!analiz) {
      uyariGoster('Kayıtta konuşma duyamadım. Telefonu biraz daha yakın tut ve tekrar dene.');
      return;
    }
    analiz.toplamSure = k.sure;
    var kayit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      tarih: new Date().toISOString(), metinId: k.metin.id, baslik: k.metin.baslik, kat: k.metin.kat,
      mime: mime, sure: k.sure, hiz: analiz.hiz, durak: analiz.duraklar.length,
      zarf: k.zarf.map(function (v) { return Math.round(v * 10000) / 10000; })
    };
    gunuIsaretle('metin');
    sonucGoster(blob, analiz, kayit);
    blob.arrayBuffer().then(function (buf) {
      kayit.ses = buf;
      return Depo.ekle(kayit);
    }).catch(function () {
      uyariGoster('Kayıt telefona kaydedilemedi (depolama dolu olabilir). Şimdilik bu ekranda dinleyebilirsin.');
    });
  }

  // Zarftan konuşma, durak ve hız çıkarır
  function analizEt(zarf, metin) {
    if (zarf.length < 10) return null;
    var sirali = zarf.slice().sort(function (a, b) { return a - b; });
    var taban = sirali[Math.floor(sirali.length * 0.1)] || 0;
    var tepe = sirali[Math.floor(sirali.length * 0.95)] || 0;
    var esik = Math.max(taban * 2.5, taban + (tepe - taban) * 0.12, 0.004);
    var aktif = zarf.map(function (v) { return v > esik; });
    var ilk = aktif.indexOf(true), son = aktif.lastIndexOf(true);
    if (ilk < 0 || (son - ilk) * ADIM < 1) return null;

    var duraklar = [];
    var i = ilk;
    while (i <= son) {
      if (!aktif[i]) {
        var j = i;
        while (j <= son && !aktif[j]) j++;
        var uz = (j - i) * ADIM;
        if (uz >= 0.3) duraklar.push({ bas: i * ADIM, sure: uz });
        i = j;
      } else i++;
    }
    var konusma = (son - ilk + 1) * ADIM;
    // en uzun kesintisiz bölüm
    var enUzun = 0, onceki = ilk * ADIM;
    duraklar.forEach(function (d) { enUzun = Math.max(enUzun, d.bas - onceki); onceki = d.bas + d.sure; });
    enUzun = Math.max(enUzun, (son + 1) * ADIM - onceki);

    return {
      esik: esik, ilk: ilk * ADIM, son: (son + 1) * ADIM, duraklar: duraklar,
      uzunDurak: duraklar.filter(function (d) { return d.sure >= 0.9; }).length,
      konusma: konusma, enUzun: enUzun,
      hiz: Math.round(metin._kelime / konusma * 60),
      kelime: metin._kelime, isaret: metin._isaret, metin: metin
    };
  }

  // ---------- Sonuç ekranı ----------
  var sonAnaliz = null, sonZarf = null, oynatUrl = null;
  var oynatici = $('#oynatici');
  var hiz = 1;

  function sonucGoster(blob, a, kayit) {
    sonAnaliz = a; sonZarf = kayit.zarf;
    if (oynatUrl) URL.revokeObjectURL(oynatUrl);
    oynatUrl = URL.createObjectURL(blob);
    oynatici.src = oynatUrl;
    oynatici.load();
    $('#kayitci').hidden = true;
    $('#sonuc').hidden = false;

    // Özet kutuları
    var kat = katBul(a.metin.kat);
    var oz = $('#ozet');
    oz.textContent = '';
    function kutu(baslik, deger, not, sinif) {
      var d = el('div', 'sum ' + (sinif || ''));
      d.appendChild(el('div', 'k', baslik));
      d.appendChild(el('div', 'v', deger));
      d.appendChild(el('div', 'n', not));
      oz.appendChild(d);
    }
    var hizNot = 'kelime/dk', hizSinif = '';
    if (a.konusma < 5) hizNot = 'kayıt kısa';
    else if (kat.hedef) {
      if (a.hiz > kat.hedef[1]) { hizNot = 'Biraz hızlı'; hizSinif = 'w'; }
      else if (a.hiz < kat.hedef[0]) { hizNot = 'Biraz yavaş'; hizSinif = 'w'; }
      else { hizNot = 'Hedefte'; hizSinif = 'g'; }
    }
    kutu('Hız', String(a.hiz), hizNot, hizSinif);
    var oran = a.isaret ? a.duraklar.length / a.isaret : 1;
    kutu('Durak', a.duraklar.length + ' / ' + a.isaret, 'bulunan / işaretli', oran >= 0.6 && oran <= 1.6 ? 'g' : 'w');
    kutu('Süre', sure(a.konusma), 'konuşma süresi', '');

    // Geri bildirim notları
    var gb = $('#geriBildirim');
    gb.textContent = '';
    function not(sinif, isaret, yazi) {
      var c = el('div', 'card not');
      c.appendChild(el('span', 'badge ' + sinif, isaret));
      c.appendChild(el('p', null, yazi));
      gb.appendChild(c);
    }
    if (a.konusma < 5) {
      not('w', '!', 'Kayıt çok kısa olduğu için hızını güvenilir ölçemedim. Metnin tamamını okumayı dene.');
    } else if (kat.hedef) {
      if (a.hiz > kat.hedef[1]) not('w', '!', 'Dakikada ' + a.hiz + ' kelime okudun. ' + kat.ad.toLowerCase() + ' konuşurken hedef ' + kat.hedef[0] + '–' + kat.hedef[1] + '. Biraz yavaşla, işaretli yerlerde dur.');
      else if (a.hiz < kat.hedef[0]) not('w', '!', 'Dakikada ' + a.hiz + ' kelime okudun. Hedef ' + kat.hedef[0] + '–' + kat.hedef[1] + '. Biraz daha akıcı okumayı dene.');
      else not('g', '✓', 'Hızın yerinde: dakikada ' + a.hiz + ' kelime.');
    }
    if (a.isaret) {
      if (oran < 0.6) not('w', '!', 'Metinde ' + a.isaret + ' durak ve nefes işareti var, kaydında ' + a.duraklar.length + ' durak buldum. İşaretli yerlerde kısa duraklar yap.');
      else if (oran > 1.6) not('w', '!', 'Kaydında ' + a.duraklar.length + ' durak buldum, metinde ' + a.isaret + ' işaret var. Gereğinden sık duruyor olabilirsin; işaretler arasında akıcı oku.');
      else not('g', '✓', 'Durak sayın işaretlerle uyumlu (' + a.duraklar.length + ' durak, ' + a.isaret + ' işaret). Dalgada sarı yerlerin metindeki işaretlere denk geldiğini dinleyerek kontrol et.');
    }
    if (a.enUzun > 7) not('w', '!', 'Bir bölümde ' + sn(a.enUzun) + ' saniye hiç durmadan okudun. Bu kadar uzun bölümde nefesin zorlanabilir.');
    else not('g', '✓', 'En uzun kesintisiz bölümün ' + sn(a.enUzun) + ' saniye; nefesin için rahat bir uzunluk.');

    // Bu metnin daha önceki kaydı
    var ilkBtn = $('#ilkKayitBtn');
    ilkBtn.hidden = true;
    Depo.hepsi().then(function (liste) {
      var eski = liste.filter(function (x) { return x.metinId === kayit.metinId && x.id !== kayit.id; })
        .sort(function (x, y) { return x.tarih < y.tarih ? -1 : 1; })[0];
      if (eski) {
        ilkBtn.textContent = 'Bu metnin ilk kaydını dinle (' + tarihYaz(eski.tarih) + ')';
        ilkBtn.hidden = false;
        ilkBtn.onclick = function () { listedenCal(eski, ilkBtn); };
      }
    }).catch(function () {});

    hizCiz();
    $('#oynatZaman').textContent = '0:00 / ' + sure(a.toplamSure);
    setTimeout(function () { kanvasBoyutla(); sonucCiz(); window.scrollTo(0, 0); }, 30);
  }

  function sonucCiz() {
    var c = sonucKanvas, x = c.getContext('2d');
    var W = c.width, H = c.height;
    if (!W || !sonZarf) return;
    x.clearRect(0, 0, W, H);
    var n = sonZarf.length;
    var toplam = n * ADIM;
    var tepe = 0;
    for (var i = 0; i < n; i++) tepe = Math.max(tepe, sonZarf[i]);
    tepe = tepe || 1;
    // duraklar
    x.fillStyle = renk('--pause');
    x.globalAlpha = 0.35;
    sonAnaliz.duraklar.forEach(function (d) { x.fillRect(d.bas / toplam * W, 0, d.sure / toplam * W, H); });
    x.globalAlpha = 1;
    // dalga
    var kolon = Math.max(1, Math.floor(W / Math.min(n, W)));
    var adet = Math.floor(W / kolon);
    x.fillStyle = renk('--accent');
    for (var k = 0; k < adet; k++) {
      var a = Math.floor(k / adet * n), b = Math.max(a + 1, Math.floor((k + 1) / adet * n));
      var m = 0;
      for (var j = a; j < b; j++) m = Math.max(m, sonZarf[j] || 0);
      var h = Math.max(1, Math.sqrt(m / tepe) * H * 0.92);
      x.fillRect(k * kolon, (H - h) / 2, Math.max(1, kolon - 1), h);
    }
    // oynatma imleci
    var t = oynatici.currentTime || 0;
    var cx = Math.min(W - 2, t / toplam * W);
    x.fillStyle = renk('--fg');
    x.fillRect(cx, 0, 2 * (window.devicePixelRatio || 1), H);
  }

  function hizCiz() {
    segCiz($('#hizSec'), { '1': '1×', '0.85': '0,85×', '0.7': '0,7×' }, String(hiz), function (k) {
      hiz = parseFloat(k);
      oynatici.playbackRate = hiz;
      hizCiz();
    });
  }

  var animasyon = null;
  function oynatmaDongusu() {
    if (sonAnaliz && !$('#sonuc').hidden) sonucCiz();
    var top = sonAnaliz ? sonAnaliz.toplamSure : (oynatici.duration || 0);
    $('#oynatZaman').textContent = sure(oynatici.currentTime) + ' / ' + sure(top);
    if (!oynatici.paused) animasyon = requestAnimationFrame(oynatmaDongusu);
  }
  oynatici.addEventListener('play', function () {
    cancelAnimationFrame(animasyon);
    animasyon = requestAnimationFrame(oynatmaDongusu);
  });
  oynatici.addEventListener('pause', oynatmaDurumu);
  oynatici.addEventListener('ended', oynatmaDurumu);
  function oynatmaDurumu() {
    $('#oynatBtn').classList.toggle('caliyor', !oynatici.paused && calanListe === null);
    $$('.kayit .iconbtn.caliyor').forEach(function (b) { if (oynatici.paused) b.classList.remove('caliyor'); });
    if (oynatici.paused) { cancelAnimationFrame(animasyon); oynatmaDongusu(); }
    if (oynatici.paused && calanListe && calanListe.btn === $('#ilkKayitBtn')) { /* ilk kayıt bitti */ }
  }
  function oynatmayiDurdur() { try { oynatici.pause(); } catch (e) { /* yok */ } }

  $('#oynatBtn').addEventListener('click', function () {
    if (calanListe) { geriYukleSonuc(); }
    if (oynatici.paused) {
      oynatici.playbackRate = hiz;
      var p = oynatici.play();
      if (p && p.catch) p.catch(function () { uyariGoster('Kayıt çalınamadı.'); });
      $('#oynatBtn').classList.add('caliyor');
    } else oynatici.pause();
  });
  sonucKanvas.addEventListener('click', function (e) {
    if (!sonAnaliz) return;
    if (calanListe) geriYukleSonuc();
    var r = sonucKanvas.getBoundingClientRect();
    var oran = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    var hedef = oran * sonZarf.length * ADIM;
    var atla = function () {
      try { oynatici.currentTime = hedef; } catch (er) { /* yok */ }
      oynatici.playbackRate = hiz;
      var p = oynatici.play();
      if (p && p.catch) p.catch(function () {});
      $('#oynatBtn').classList.add('caliyor');
      sonucCiz();
    };
    if (oynatici.readyState >= 1) atla();
    else {
      oynatici.addEventListener('loadedmetadata', function bir() { oynatici.removeEventListener('loadedmetadata', bir); atla(); });
      oynatici.load();
    }
  });
  $('#tekrarBtn').addEventListener('click', function () {
    oynatmayiDurdur();
    $('#sonuc').hidden = true;
    $('#kayitci').hidden = false;
    window.scrollTo(0, 0);
  });
  $('#kayitBtn').addEventListener('click', function () { if (Kayit.aktif) kayitBitir(); else kayitBaslat(); });

  // Listeden (eski) bir kaydı aynı oynatıcıda çalmak
  var calanListe = null;
  function geriYukleSonuc() {
    oynatmayiDurdur();
    calanListe = null;
    if (oynatUrl) { oynatici.src = oynatUrl; oynatici.load(); }
  }
  function listedenCal(k, btn) {
    if (calanListe && calanListe.id === k.id && !oynatici.paused) { oynatici.pause(); return; }
    oynatmayiDurdur();
    $$('.kayit .iconbtn').forEach(function (b) { b.classList.remove('caliyor'); });
    $('#oynatBtn').classList.remove('caliyor');
    if (!k.ses) { uyariGoster('Bu kaydın sesi bulunamadı.'); return; }
    var url = URL.createObjectURL(new Blob([k.ses], { type: k.mime }));
    if (calanListe && calanListe.url) URL.revokeObjectURL(calanListe.url);
    calanListe = { id: k.id, url: url, btn: btn };
    oynatici.src = url;
    oynatici.playbackRate = 1;
    var p = oynatici.play();
    if (p && p.catch) p.catch(function () { uyariGoster('Kayıt çalınamadı.'); });
    if (btn && btn.classList.contains('iconbtn')) btn.classList.add('caliyor');
  }

  // ================= Gelişim =================
  function grafik(kutu, ozetEl, tur) {
    var l = sonOlcum(tur).liste.slice(-8);
    kutu.textContent = '';
    if (!l.length) {
      kutu.appendChild(el('div', 'bos', 'Henüz ölçüm yok. Nefes sekmesindeki ölçümle başla.'));
      ozetEl.textContent = '';
      return;
    }
    var tum = sonOlcum(tur).liste;
    var enIyi = tum.reduce(function (m, x) { return Math.max(m, x.sure); }, 0);
    var max = Math.max.apply(null, l.map(function (x) { return x.sure; })) || 1;
    l.forEach(function (o) {
      var b = el('div', 'bar');
      b.appendChild(el('div', null, sn(o.sure)));
      var s = el('span');
      s.style.height = Math.max(3, o.sure / max * 85) + '%';
      b.appendChild(s);
      b.title = tarihYaz(o.tarih);
      kutu.appendChild(b);
    });
    ozetEl.textContent = 'İlk ' + sn(tum[0].sure) + ' · En iyi ' + sn(enIyi) + ' sn';
  }
  function gelisimCiz() {
    grafik($('#gTislama'), $('#gTislamaOzet'), 'tislama');
    grafik($('#gAaa'), $('#gAaaOzet'), 'aaa');
    var hafta = Date.now() - 7 * 864e5;
    var son7 = veri.nefesler.filter(function (n) { return new Date(n.tarih).getTime() > hafta; }).length;
    $('#gNefes').textContent = veri.nefesler.length
      ? 'Toplam ' + veri.nefesler.length + ' egzersiz, son 7 günde ' + son7 + '. Seri: ' + seriHesapla() + ' gün.'
      : 'Henüz nefes egzersizi yapmadın.';
    kayitListesiCiz();
  }
  function kayitListesiCiz() {
    var kutu = $('#kayitListe');
    Depo.hepsi().then(function (liste) {
      kutu.textContent = '';
      if (!liste.length) {
        kutu.appendChild(el('div', 'bos', 'Henüz kayıt yok. Metin sekmesinde bir metin okuyup kaydet.'));
        return;
      }
      liste.sort(function (a, b) { return a.tarih < b.tarih ? 1 : -1; });
      liste.forEach(function (k) {
        var c = el('div', 'card kayit');
        var cal = el('button', 'iconbtn');
        cal.type = 'button';
        cal.setAttribute('aria-label', k.baslik + ' kaydını dinle');
        cal.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        cal.addEventListener('click', function () { listedenCal(k, cal); });
        c.appendChild(cal);
        var bilgi = el('div', 'grow');
        bilgi.appendChild(el('div', 't', k.baslik));
        var kat = katBul(k.kat);
        bilgi.appendChild(el('div', 's', tarihYaz(k.tarih) + ' · ' + sure(k.sure) + ' · ' + k.hiz + ' k/dk' + (kat ? ' · ' + kat.ad : '')));
        c.appendChild(bilgi);
        var sil = el('button', 'secondary kucuk-btn danger', 'Sil');
        sil.type = 'button';
        sil.addEventListener('click', function () {
          if (sil.getAttribute('data-onay') !== '1') {
            sil.setAttribute('data-onay', '1');
            sil.textContent = 'Emin misin?';
            setTimeout(function () { sil.removeAttribute('data-onay'); sil.textContent = 'Sil'; }, 4000);
            return;
          }
          if (calanListe && calanListe.id === k.id) oynatmayiDurdur();
          Depo.sil(k.id).then(kayitListesiCiz);
        });
        c.appendChild(sil);
        kutu.appendChild(c);
      });
    }).catch(function () {
      kutu.textContent = '';
      kutu.appendChild(el('div', 'bos', 'Kayıtlar okunamadı.'));
    });
  }

  // ================= Başlangıç =================
  Rehber.hazirla();
  nefesAyarCiz();
  oncekiYaz();
  katCiz();
  metinSec(false);
  goster('bugun');
  rehberNotu();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
