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
  var VERI_SURUM = 1;
  // Depolama sağlığı: kayıt hatası, kalıcılık, kullanılan yer (Gelişim > Ayarlar ve veri'de gösterilir)
  var Saglik = { kayitHata: null, kayitUyarildi: false, kalici: null, kullanilan: null, bozuk: false };
  function nesneMi(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function bosVeri() {
    return { surum: VERI_SURUM, olcumler: [], nefesler: [], gunler: {}, sonMetin: {}, ayarlar: { rehber: 'sesli', seviye: 'baslangic', kategori: 'veli' } };
  }
  // Eski ya da eksik veriyi bugünkü biçime getirir (alan silmez, yalnızca ekler/düzeltir)
  function migrasyon(v) {
    if (!nesneMi(v)) v = {};
    if (typeof v.surum !== 'number') v.surum = 0;
    if (!Array.isArray(v.olcumler)) v.olcumler = [];
    if (!Array.isArray(v.nefesler)) v.nefesler = [];
    ['gunler', 'sonMetin', 'calis', 'rutin', 'ayarlar'].forEach(function (a) {
      if (!nesneMi(v[a])) v[a] = {};
    });
    v.surum = VERI_SURUM;
    return v;
  }
  // Okunamayan ham metni ayrı anahtara kopyalar; en fazla 3 bozuk kopya tutulur
  function bozukKopyala(ham) {
    try {
      var on = 'dk.v1.bozuk.', anahtarlar = [];
      for (var i = 0; i < localStorage.length; i++) {
        var a = localStorage.key(i);
        if (a && a.indexOf(on) === 0) anahtarlar.push(a);
      }
      anahtarlar.sort();
      while (anahtarlar.length > 2) localStorage.removeItem(anahtarlar.shift());
      localStorage.setItem(on + Date.now(), ham);
    } catch (e) { /* yer yok ya da erişim yok */ }
  }
  var veri = (function () {
    var v = bosVeri(), ham = null;
    try { ham = localStorage.getItem(ANAHTAR); } catch (e) { ham = null; }
    if (ham !== null && ham !== '') {
      var k = null;
      try { k = JSON.parse(ham); } catch (e) { k = null; }
      if (nesneMi(k)) {
        k = migrasyon(k);
        v = Object.assign(v, k);
        v.ayarlar = Object.assign(bosVeri().ayarlar, k.ayarlar);
      } else {
        Saglik.bozuk = true;
        bozukKopyala(ham);
      }
    }
    return v;
  })();
  function kaydet() {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(veri));
      return true;
    } catch (e) {
      Saglik.kayitHata = (e && e.name) || 'Hata';
      if (!Saglik.kayitUyarildi) {
        Saglik.kayitUyarildi = true;
        uyariGoster('Verin telefona kaydedilemedi (yer dolmuş olabilir). Yedeği indirmeni öneririm.', true);
      }
      return false;
    }
  }
  function gunuIsaretle(adim, tarih) {
    var g = tarih || gunStr();
    veri.gunler[g] = veri.gunler[g] || {};
    veri.gunler[g][adim] = true;
    kaydet();
  }
  function kayitYazilamadi() {
    Saglik.kayitHata = Saglik.kayitHata || 'DepoHatasi';
    uyariGoster('Kayıt telefona yazılamadı (yer dolmuş olabilir).', true);
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
          t.onabort = function () { rej(t.error); };
        });
      });
    },
    ekle: function (k) { return this.islem('readwrite', function (s) { s.put(k); }); },
    hepsi: function () { return this.islem('readonly', function (s) { return s.getAll(); }).then(function (r) { return r || []; }); },
    sil: function (id) { return this.islem('readwrite', function (s) { s.delete(id); }); }
  };
  // Kalıcı depolama izni ve kullanılan yer (API yoksa Saglik alanları null kalır)
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(function (ok) { Saglik.kalici = !!ok; depoSatiriYaz(); }).catch(function () {});
  }
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(function (e) {
      if (e && typeof e.usage === 'number') { Saglik.kullanilan = e.usage; depoSatiriYaz(); }
    }).catch(function () {});
  }

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
      mesaj = 'Mikrofon açılamadı. İki neden olabilir: (1) İzin vermedin ya da izin penceresi çıkmadı; Chrome ayarlarından bu site için mikrofona izin ver. (2) Ekranda yüzen bir simge, baloncuk ya da ekran kaydı varsa izin penceresini engeller; onları kapat. Sonra sayfayı yenile. Mikrofon olmadan egzersiz yine yapılır ama ölçülmez.';
    } else if (ad === 'NotFoundError') {
      mesaj = 'Mikrofon bulunamadı.';
    } else if (ad === 'Desteklenmiyor') {
      mesaj = 'Bu tarayıcı mikrofonu desteklemiyor. Sayfayı Safari ya da Chrome ile, https adresinden aç.';
    } else {
      mesaj = 'Mikrofon açılamadı. Başka bir uygulama mikrofonu kullanıyor olabilir.';
    }
    uyariGoster(mesaj, true);
  }
  var uyariZaman = null;
  // kalici: kullanıcı dokunana kadar ekranda kalır (mikrofon sorunları gibi önemli uyarılar)
  function uyariGoster(m, kalici) {
    var u = $('#uyari');
    u.textContent = kalici ? m + '  (Kapatmak için dokun.)' : m;
    u.onclick = function () { u.hidden = true; };
    u.hidden = false;
    window.scrollTo(0, 0);
    clearTimeout(uyariZaman);
    if (!kalici) uyariZaman = setTimeout(function () { u.hidden = true; }, 9000);
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
    bugun: 'Diksiyon Koçu', nefes: 'Nefes ve ses', metin: 'Metin çalışması', calis: 'Çalış', ders: 'Dersler', gelisim: 'Gelişimim'
  };
  var aktifEkran = 'bugun';
  function goster(ad, kaydirId) {
    if (!BASLIKLAR[ad]) ad = 'bugun';
    if (aktifEkran !== ad) {
      if (aktifEkran === 'nefes') { nefesDurdur(false); testIptal(); }
      if (aktifEkran === 'metin' && Kayit.aktif) kayitBitir();
      if (aktifEkran === 'calis') { calisDurdur(); mkDurdur(); }
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

  // ================= Çalış (sese / soruna göre çalışmalar) =================
  // Bir ses parçasında dil/dudak titreşimi (yaklaşık 18-40 Hz genlik dalgalanması) arar.
  function titresimAnaliz(buf, sr) {
    var pencere = Math.round(sr * 0.010), adim = Math.round(sr * 0.002);
    var env = [];
    for (var bas = 0; bas + pencere <= buf.length; bas += adim) {
      var t = 0;
      for (var i = bas; i < bas + pencere; i++) t += buf[i] * buf[i];
      env.push(Math.sqrt(t / pencere));
    }
    var n = env.length;
    if (n < 40) return { ses: false };
    var ort = 0; for (var j = 0; j < n; j++) ort += env[j]; ort /= n;
    if (ort < 0.004) return { ses: false };
    var v = 0; for (j = 0; j < n; j++) { env[j] -= ort; v += env[j] * env[j]; }
    var derinlik = Math.sqrt(v / n) / ort;
    var enIyi = 0, enL = 0;
    var lmin = Math.round(1 / 40 / 0.002), lmax = Math.round(1 / 18 / 0.002);
    for (var L = lmin; L <= lmax; L++) {
      var a = 0, b = 0, c = 0;
      for (var k = 0; k + L < n; k++) { a += env[k] * env[k + L]; b += env[k] * env[k]; c += env[k + L] * env[k + L]; }
      var r = a / Math.sqrt(b * c || 1);
      if (r > enIyi) { enIyi = r; enL = L; }
    }
    var hz = enL ? 1 / (enL * 0.002) : 0;
    return { ses: true, r: enIyi, hz: hz, derinlik: derinlik, titresim: enIyi > titresimEsik().r && derinlik > titresimEsik().derinlik && hz >= 18 && hz <= 40 };
  }
  function titresimEsik() { return (veri.ayarlar && veri.ayarlar.titresim) || { r: 0.55, derinlik: 0.14 }; }
  // Kişisel ayar: "aaa" (titreşimsiz) ve "Rrrr" (titreşimli) karelerinden eşik çıkarır
  function yuzdelik(dizi, p) {
    if (!dizi.length) return 0;
    var s = dizi.slice().sort(function (a, b) { return a - b; });
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  }
  function kisiselEsik(duz, titrek) {
    var dD = duz.map(function (k) { return k.derinlik; });
    var tAralik = titrek.filter(function (k) { return k.hz >= 18 && k.hz <= 40; });
    if (duz.length < 10) return { ok: false, mesaj: '“aaa” sesini yeterince duyamadım. Telefonu biraz daha yakın tut ve yeniden dene.' };
    if (tAralik.length < 10) return { ok: false, mesaj: '“Rrrr” sırasında titreşim bulamadım. Dil ucun henüz titremiyor olabilir; bu çok normal. Genel ayarla devam ediyorum.' };
    var duzUst = yuzdelik(dD, 0.9);
    var titrekOrta = yuzdelik(tAralik.map(function (k) { return k.derinlik; }), 0.5);
    if (titrekOrta < duzUst * 1.4 || titrekOrta < 0.08) {
      return { ok: false, mesaj: '“aaa” ile “Rrrr” arasında yeterince fark duyamadım. Rrrr’yi biraz daha güçlü bir nefesle dene ya da genel ayarla devam et.' };
    }
    var d = Math.max(0.06, Math.min(0.4, (duzUst + titrekOrta) / 2));
    var r = Math.max(0.35, Math.min(0.6, yuzdelik(tAralik.map(function (k) { return k.r; }), 0.25) - 0.05));
    return { ok: true, derinlik: Math.round(d * 1000) / 1000, r: Math.round(r * 100) / 100,
      mesaj: 'Senin sesine göre ayarlandı ✓ Artık ölçüm senin “aaa” ve “Rrrr” sesine göre yapılacak.' };
  }

  // Mikrofondan sürekli dinleyip titreşimli süreyi toplar
  function TitresimOlcer(stream) {
    var ctx = Ses.baglam();
    this.stream = stream;
    this.kaynak = ctx.createMediaStreamSource(stream);
    this.an = ctx.createAnalyser();
    this.an.fftSize = 8192;
    this.kaynak.connect(this.an);
    this.buf = new Float32Array(this.an.fftSize);
    this.sr = ctx.sampleRate;
    this.titresimli = 0; this.sesli = 0; this.hzler = [];
    this.calisiyor = false; this.son = 0;
  }
  TitresimOlcer.prototype.basla = function () {
    var self = this;
    self.titresimli = 0; self.sesli = 0; self.hzler = []; self.kareler = [];
    self.calisiyor = true; self.son = performance.now(); self.t0 = self.son;
    (function dongu() {
      if (!self.calisiyor) return;
      var simdi = performance.now(), dt = Math.min((simdi - self.son) / 1000, 0.2);
      self.son = simdi;
      if (simdi - self.t0 < 450) { requestAnimationFrame(dongu); return; }
      self.an.getFloatTimeDomainData(self.buf);
      var r = titresimAnaliz(self.buf, self.sr);
      if (r.ses) { self.sesli += dt; self.kareler.push({ r: r.r, hz: r.hz, derinlik: r.derinlik }); }
      if (r.titresim) { self.titresimli += dt; self.hzler.push(r.hz); }
      requestAnimationFrame(dongu);
    })();
  };
  TitresimOlcer.prototype.dur = function () {
    this.calisiyor = false;
    var h = this.hzler.slice().sort(function (a, b) { return a - b; });
    return { iyi: this.titresimli, ses: this.sesli, hz: h.length ? h[Math.floor(h.length / 2)] : 0, kareler: this.kareler };
  };
  TitresimOlcer.prototype.kapat = function () {
    this.calisiyor = false;
    try { this.kaynak.disconnect(); } catch (e) { /* yok */ }
    akisiKapat(this.stream);
  };

  // Sürtünmeli sesin (s/ş) spektral ağırlık merkezi: s ince (yüksek), ş kalın (düşük)
  function keskinlikAnaliz(db, binHz, rms) {
    if (rms < 0.005) return { ses: false };
    var alt = Math.floor(1500 / binHz), ust = Math.min(db.length - 1, Math.floor(12000 / binHz));
    var top = 0, agir = 0;
    for (var i = alt; i <= ust; i++) {
      var p = Math.pow(10, db[i] / 10);
      top += p; agir += p * i * binHz;
    }
    if (!top) return { ses: false };
    return { ses: true, merkez: agir / top };
  }
  function keskinlikEsik() { return (veri.ayarlar && veri.ayarlar.keskinlik) || { esik: 4800 }; }
  // S sesinin inceliğini ölçer: ağırlık merkezi eşiğin üstündeyse "ince"
  function KeskinlikOlcer(stream) {
    var ctx = Ses.baglam();
    this.stream = stream;
    this.kaynak = ctx.createMediaStreamSource(stream);
    this.an = ctx.createAnalyser();
    this.an.fftSize = 2048;
    this.an.smoothingTimeConstant = 0.3;
    this.kaynak.connect(this.an);
    this.db = new Float32Array(this.an.frequencyBinCount);
    this.zaman = new Float32Array(this.an.fftSize);
    this.binHz = ctx.sampleRate / this.an.fftSize;
    this.calisiyor = false;
  }
  KeskinlikOlcer.prototype.basla = function () {
    var self = this;
    self.ince = 0; self.sesli = 0; self.kareler = [];
    self.calisiyor = true; self.son = performance.now(); self.t0 = self.son;
    (function dongu() {
      if (!self.calisiyor) return;
      var simdi = performance.now(), dt = Math.min((simdi - self.son) / 1000, 0.2);
      self.son = simdi;
      if (simdi - self.t0 < 350) { requestAnimationFrame(dongu); return; }
      self.an.getFloatTimeDomainData(self.zaman);
      var t = 0; for (var i = 0; i < self.zaman.length; i++) t += self.zaman[i] * self.zaman[i];
      self.an.getFloatFrequencyData(self.db);
      var r = keskinlikAnaliz(self.db, self.binHz, Math.sqrt(t / self.zaman.length));
      if (r.ses) {
        self.sesli += dt; self.kareler.push({ merkez: r.merkez });
        if (r.merkez >= keskinlikEsik().esik) self.ince += dt;
      }
      requestAnimationFrame(dongu);
    })();
  };
  KeskinlikOlcer.prototype.dur = function () {
    this.calisiyor = false;
    var m = this.kareler.map(function (k) { return k.merkez; });
    return { iyi: this.ince, ses: this.sesli, merkez: yuzdelik(m, 0.5), kareler: this.kareler };
  };
  KeskinlikOlcer.prototype.kapat = TitresimOlcer.prototype.kapat;

  function keskinlikKisisel(kalin, ince) {
    if (kalin.length < 10) return { ok: false, mesaj: '“şşşş” sesini yeterince duyamadım. Telefonu biraz daha yakın tut ve yeniden dene.' };
    if (ince.length < 10) return { ok: false, mesaj: '“ssss” sesini yeterince duyamadım. Telefonu biraz daha yakın tut ve yeniden dene.' };
    var kUst = yuzdelik(kalin.map(function (k) { return k.merkez; }), 0.9);
    var iOrta = yuzdelik(ince.map(function (k) { return k.merkez; }), 0.5);
    if (iOrta < kUst + 400) {
      return { ok: false, mesaj: '“ssss” ile “şşşş” birbirine çok yakın çıktı. Bu, s sesinin ş’ye kaydığını gösterebilir. Genel ayarla devam ediyorum; ısınma ve hece kartlarıyla çalışmaya devam et.' };
    }
    return { ok: true, deger: { esik: Math.round((kUst + iOrta) / 2) },
      mesaj: 'Senin sesine göre ayarlandı ✓ Artık s sesin, kendi “şşşş” sesinden ne kadar ayrıldığına göre ölçülecek.' };
  }

  // Ölçüm türleri: ısınma adımlarındaki "olcum" alanı bunlardan birini seçer
  var OLCUMLER = {
    titresim: {
      Olcer: function (st) { return new TitresimOlcer(st); },
      aciklama: 'Telefon dinler ve dilinin ne kadar süre titrediğini tahmin eder. Bu yalnızca bir ipucudur ve yanılabilir (Türkçede r çoğu zaman kısa bir vuruştur). Asıl ölçüt kulağındır: kaydını dinle. Sessiz bir yerde daha iyi çalışır.',
      ayarAnahtar: 'titresim',
      ayarAdim: [{ ses: 'aaaa', yazi: '1/2 · Rahat bir sesle “aaaa” de' }, { ses: 'Rrrrr', yazi: '2/2 · Şimdi güçlü bir “Rrrrr” de' }],
      ayarHesap: function (a, b) { var s = kisiselEsik(a, b); if (s.ok) s.deger = { r: s.r, derinlik: s.derinlik }; return s; },
      sonuc: function (o, oran) {
        if (oran >= 0.5) return 'Titreşim ' + sn(o.iyi) + ' sn ✓ Telefon dilinin titrediğini duydu.';
        if (oran >= 0.15) return 'Titreşim ' + sn(o.iyi) + ' sn. Kesik kesik geliyor; nefesi biraz artır, dili gevşek bırak.';
        return 'Telefon titreşim yakalayamadı (ölçüm yanılabilir; kaydını da dinle). Dil ucunu öne, üst diş etine getir ve güçlü bir nefes ver.';
      },
      ozet: function (iyi, top) {
        return iyi === top ? 'Bütün turlarda titreşim güzeldi. Hece kartlarına geçmeye hazırsın.'
          : iyi > 0 ? top + ' turun ' + iyi + ' tanesinde titreşim iyiydi. Birkaç gün daha ısınmaya devam et, hece kartlarını yavaş tempoda çalış.'
          : 'Henüz titreşim yakalayamadık. Bu normal, r titreşimi zamanla gelir. Her gün 2-3 dakika bu ısınmayı yap.';
      }
    },
    keskinlik: {
      Olcer: function (st) { return new KeskinlikOlcer(st); },
      aciklama: 'Telefon dinler ve s sesinin ne kadar ince ve net olduğunu ölçer. Doğru s ince ve keskindir; kalınlaşırsa ş’ye benzer. Bu yalnızca bir ipucudur; telefonun mikrofonu ve sesinin tonu sonucu etkiler. Asıl ölçüt kulağındır: kaydını dinle. Sessiz bir yerde daha iyi çalışır.',
      ayarAnahtar: 'keskinlik',
      ayarAdim: [{ ses: 'şşşş', yazi: '1/2 · “şşşş” de' }, { ses: 'ssss', yazi: '2/2 · Şimdi en ince “ssss” sesini çıkar' }],
      ayarHesap: keskinlikKisisel,
      sonuc: function (o, oran) {
        var k = o.merkez ? ' (' + sn(o.merkez / 1000) + ' kHz)' : '';
        if (oran >= 0.5) return 'S’in ince ve net ✓' + k;
        if (oran >= 0.15) return 'Ara ara kalınlaşıyor' + k + '. Dil ucunu alt ön dişlerin arkasında tut, dişlerini hafifçe kapat.';
        return 'S kalın çıkıyor, ş’ye benziyor' + k + '. Dilini üst diş etinden uzaklaştır, dil ucunu sivriltip alt ön dişlere yaklaştır.';
      },
      ozet: function (iyi, top) {
        return iyi === top ? 'Bütün turlarda s sesin ince ve netti. Hece kartlarına geçmeye hazırsın.'
          : iyi > 0 ? top + ' turun ' + iyi + ' tanesinde s sesin inceydi. Ayna karşısında dil ucunun yerine bakarak ısınmaya devam et.'
          : 'S sesin henüz kalın çıkıyor. Dil ucunu alt ön dişlerin arkasına koy, dişlerini hafif kapat, havayı ortadan ince bir şerit gibi ver.';
      }
    }
  };

  var Calis = { modul: null, adim: 0, zaman: null, oto: false, tempo: 'orta', dizi: 0, kart: 0, sesli: false, tutCalisiyor: false, olcer: null, tanima: null };
  var TEMPO = { yavas: 2200, orta: 1400, hizli: 800 };
  function calisBul(id) { return window.CALISMALAR.filter(function (c) { return c.id === id; })[0]; }

  function calisListeCiz() {
    var kutu = $('#calisKartlar');
    kutu.textContent = '';
    window.CALISMALAR.forEach(function (c) {
      var b = el('button', 'calis-kart' + (c.hazir ? '' : ' yakinda'));
      b.type = 'button';
      b.appendChild(el('span', 'harf', c.harf));
      var y = el('span', 'yazi');
      y.appendChild(el('b', null, c.ad));
      y.appendChild(el('span', 'muted kucuk', c.hazir ? c.ozet : 'Yakında'));
      b.appendChild(y);
      if (c.hazir) b.addEventListener('click', function () { calisAc(c.id); });
      else b.disabled = true;
      kutu.appendChild(b);
    });
  }
  function calisAc(id) {
    Calis.modul = calisBul(id);
    Calis.adim = 0;
    Calis.sesli = false;
    Calis.set = {};
    $('#calisListe').hidden = true;
    $('#calisDetay').hidden = false;
    mkHazirla();
    adimCiz();
  }
  function calisKapat() {
    calisDurdur(); mkDurdur();
    $('#calisDetay').hidden = true;
    $('#calisListe').hidden = false;
    rutinKartlariCiz();
    window.scrollTo(0, 0);
  }

  // ---------- Günlük rutin: nefes → günün harfi → dudak-dil → tekerleme → şiir → bitiş kaydı ----------
  // Harf her gün sırayla değişir; son 7 günde görülen sözcük ve cümleler pek gelmez.
  // Seviye, son 28 gündeki geçerli gün sayısına göre belirlenir (8 gün → Orta, 16 gün → İleri); uzun aradan sonra düşer.
  var RUTIN_HARFLER = ['r', 's', 'z'];
  var RUTIN_SEVIYE = ['', 'Başlangıç', 'Orta', 'İleri'];
  var RUTIN_SURUM = 8;
  function gunFark(a, b) { return Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 86400000); }
  function rutinVeri() {
    var r = veri.rutin = veri.rutin || {};
    r.gunler = r.gunler || {}; r.goruldu = r.goruldu || {};
    return r;
  }
  var SEVIYE_ESIK = [0, 8, 16];
  var HAFTA_HEDEF = 4;
  var SURE_ESIK = { tam: 240, kisa: 90 };
  // Geçerli gün: eski kayıt (true) ya da süresi eşiği geçen kayıt.
  function gunGecerli(v) { return v === true || !!(v && v.sn >= (v.mod === 'kisa' ? SURE_ESIK.kisa : SURE_ESIK.tam)); }
  // Bugünden başlayıp 27 gün geriye (toplam 28 gün) geçerli günleri sayar.
  function rutinSonGunSayisi() {
    var g = rutinVeri().gunler, gun = new Date(), n = 0, i;
    for (i = 0; i < 28; i++) {
      if (gunGecerli(g[gunStr(gun)])) n++;
      gun.setDate(gun.getDate() - 1);
    }
    return n;
  }
  function rutinSeviye() {
    var n = rutinSonGunSayisi();
    return n >= SEVIYE_ESIK[2] ? 3 : (n >= SEVIYE_ESIK[1] ? 2 : 1);
  }
  function rutinHedef() {
    var h = veri.ayarlar && Number(veri.ayarlar.haftaHedef);
    return h > 0 ? h : HAFTA_HEDEF;
  }
  // Bu hafta (Pazartesi-Pazar) kayıtlı gün sayısı; süre eşiği aranmaz.
  function rutinHafta() {
    var g = rutinVeri().gunler, gun = new Date(), n = 0, i;
    gun.setDate(gun.getDate() - ((gun.getDay() + 6) % 7));
    for (i = 0; i < 7; i++) {
      if (g[gunStr(gun)]) n++;
      gun.setDate(gun.getDate() + 1);
    }
    return n;
  }
  // Seri: bugün kayıtlı değilse dünden başlar; tek boş gün bozmaz, ardışık iki boş gün bozar.
  function rutinSeri() {
    var g = rutinVeri().gunler, gun = new Date(), n = 0, bos = 0, i;
    if (!g[gunStr(gun)]) gun.setDate(gun.getDate() - 1);
    for (i = 0; i < 400; i++) {
      if (g[gunStr(gun)]) { n++; bos = 0; }
      else { bos++; if (bos >= 2) break; }
      gun.setDate(gun.getDate() - 1);
    }
    return n;
  }
  // Rutinde geçen gerçek süreyi sayar (adım başına en fazla 120 sn).
  function rutinSureTik() {
    var b = veri.rutin && veri.rutin.bugun;
    if (!b) return;
    var now = Date.now();
    b.sn = (b.sn || 0) + Math.min(120, Math.max(0, (now - (b.t || now)) / 1000));
    b.t = now;
  }
  function rutinSiradakiHarf() {
    var r = rutinVeri();
    return RUTIN_HARFLER[(RUTIN_HARFLER.indexOf(r.sonHarf) + 1) % RUTIN_HARFLER.length];
  }
  function rutinSec(liste, n, anahtar, zor) {
    var g = rutinVeri().goruldu, bugun = gunStr();
    return agirlikliSec(liste, Math.min(n, liste.length), function (x) {
      var t = g[anahtar ? anahtar(x) : x], w = 1;
      if (zor) trKucuk(x).split(' ').forEach(function (s) { var k = zor[s]; if (k && k.y - k.d >= 2) w += 3 * Math.min(k.y - k.d, 3); });
      if (t && gunFark(t, bugun) < 7) w *= 0.03;
      return w;
    });
  }
  function rutinKur(harfId, sv, mod) {
    mod = mod === 'kisa' ? 'kisa' : 'tam';
    var H = calisBul(harfId), D = calisBul('dudak'), N = calisBul('nefes'), Z = calisBul('zormetin');
    var zor = ((veri.calis || {})[harfId] || {}).zor || {};
    var secilen = [];
    function sec(liste, n, anahtar, z) {
      var s = rutinSec(liste, n, anahtar, z);
      s.forEach(function (x) { secilen.push(anahtar ? anahtar(x) : x); });
      return s;
    }
    function dizi(d) { return 'dizi:' + d.ad; }
    function kirp(y) { return (y || '').replace(/\s*Her açışta[^.]*\./g, ''); }
    function kopya(a, ek) { return Object.assign({}, a, ek); }
    function katYon(id) { var k = katBul(id); return k && k.yonerge ? k.yonerge.slice() : []; }
    var i = sv - 1, adimlar = [];

    var kisaMod = mod === 'kisa';
    var gercekAdim = {
      tur: 'gercek', bolum: 5, baslik: 'Bugün kullanacağım cümle',
      // Boş bırakılırsa gösterilecek yedek cümle (eski "Bitiş kaydı" havuzundan, günde bir kez seçilir)
      yedek: sec(D.adimlar[4].havuz.concat(N.adimlar[4].havuz), 1)[0] || ''
    };
    var ver = [8, 10, 12][i];
    var nefesOlcAdim = {
      tur: 'nefesOlc', bolum: 0, baslik: 'Nefes al, ffuuu diye ver', ses: 'ffuuu', filtre: 400,
      al: [4, 4, 5][i], tut: [4, 4, 5][i], ver: ver, turSayisi: kisaMod ? 3 : 5,
      maddeler: [
        'Elini karnına koy. Burundan <b>' + [4, 4, 5][i] + ' saniyede</b> sessizce nefes al; omuzların kalkmasın, karın ve kaburgalar açılsın.',
        '<b>' + [4, 4, 5][i] + ' saniye</b> tut; sonra “Ver” denince <b>ffuuu</b> diye (mum üfler gibi, dudaklar hafif büzük), <b>' + ver + ' saniye</b> boyunca aynı güçte ver.',
        'Telefonu yüzünden bir karış uzakta tut. Mikrofon her turda nefes verişini dinler ve ne olduğunu yazar.',
        'Mikrofon omzunu ya da karnını göremez; onu elinle ya da aynada kontrol et.'
      ]
    };
    var sk = H.adimlar[3], sn = [4, 5, 6][i];

    if (kisaMod) {
      // Kısa rutin (5 dk): nefes ölçümü, günün sesinin sözcükleri, 1 tekerleme, gerçek cümle.
      // Bölüm numaraları tam rutinle aynıdır (0, 1, 3, 5); boş bölümler çizilmez.
      var yarim = Math.max(3, Math.ceil(sn / 2));
      adimlar.push(nefesOlcAdim);
      adimlar.push(kopya(sk, { bolum: 1, yonerge: kirp(sk.yonerge), havuz: null, secim: null,
        diziler: sk.havuz.map(function (g) { return { ad: g.ad, ogeler: sec(g.ogeler, yarim, null, zor) }; }) }));
      var tek1 = sec(H.adimlar[5].havuz, 1, null, zor);
      adimlar.push({ tur: 'cumle', bolum: 3, baslik: 'Tekerleme', cumleler: tek1,
        maddeler: katYon('tekerleme') });
      adimlar.push(gercekAdim);
      secilen.forEach(function (k) { rutinVeri().goruldu[k] = gunStr(); });
      // Kısa rutinde adım sıraları farklı olduğu için "adıma git" eşlemeleri kaldırılır
      var ozK = (H.ozKontrol || []).map(function (o) { var k = Object.assign({}, o); delete k.adim; return k; });
      return { adimlar: adimlar, ozKontrol: ozK };
    }

    // 1) Nefes
    adimlar.push(kopya(N.adimlar[1], { bolum: 0, baslik: 'Kollarla nefes', sure: [18, 22, 25][i], maddeler: N.adimlar[1].maddeler.slice(0, 4) }));
    adimlar.push(nefesOlcAdim);

    // 2) Günün harfi
    adimlar.push(kopya(H.adimlar[1], H.adimlar[1].tur === 'nefesOlc' ? { bolum: 1 } : { bolum: 1, turSayisi: [2, 2, 3][i] }));
    var hk = H.adimlar[2];
    adimlar.push(kopya(hk, { bolum: 1, yonerge: kirp(hk.yonerge), secimDizi: null, sabitDizi: null,
      diziler: hk.diziler.slice(0, 1).concat(sec(hk.diziler.slice(1), [2, 3, 4][i], function (d) { return 'dizi:' + harfId + ':' + d.ad; })) }));
    adimlar.push(kopya(sk, { bolum: 1, yonerge: kirp(sk.yonerge), havuz: null, secim: null,
      diziler: sk.havuz.map(function (g) { return { ad: g.ad, ogeler: sec(g.ogeler, sn, null, zor) }; }) }));
    var ck = H.adimlar[4];
    adimlar.push(kopya(ck, { bolum: 1, havuz: null, secim: null, cumleler: sec(ck.havuz, [2, 3, 4][i], null, zor) }));

    // 3) Dudak-dil
    var dh = D.adimlar[1], dSure = [12, 15, 18][i];
    adimlar.push(kopya(dh, { bolum: 2, sure: dSure, dinlenme: 2,
      maddeler: dh.maddeler.slice(0, 6).concat(['Her harekete ' + dSure + ' saniye ayrılır.']) }));
    var dk = D.adimlar[2];
    adimlar.push(kopya(dk, { bolum: 2, secimDizi: null, sabitDizi: null,
      diziler: dk.diziler.slice(0, 1).concat(sec(dk.diziler.slice(1), [1, 2, 3][i], dizi)) }));

    // 4) Tekerleme: seviye arttıkça uzar
    var sinir = [80, 150, 100000][i];
    function uygun(l) { var f = l.filter(function (x) { return x.length <= sinir; }); return f.length >= 4 ? f : l; }
    var tek = sec(uygun(H.adimlar[5].havuz), 2, null, zor);
    tek = tek.concat(sec(uygun(D.adimlar[3].havuz).filter(function (x) { return tek.indexOf(x) < 0; }), 1));
    if (sv >= 3) tek = tek.concat(sec(Z.adimlar[1].havuz, 1));
    adimlar.push({ tur: 'cumle', bolum: 3, baslik: 'Tekerlemeler', cumleler: tek,
      maddeler: katYon('tekerleme').concat(sv >= 3 ? ['Sonuncusu uzun bir metin; virgüllerden bölerek oku.'] : []) });

    // 5) Günün şiiri: işaretli (nefes / durak) okunur; seviyeye göre uzunluk sınırı
    var dizeSinir = [14, 24, 100000][i];
    var siirler = window.METINLER.filter(function (m) { return m.kat === 'siir'; });
    var kisa = siirler.filter(function (m) { return m.metin.split('\n').length <= dizeSinir; });
    var siir = sec(kisa.length ? kisa : siirler, 1, function (m) { return 'siir:' + m.id; })[0];
    if (siir) {
      adimlar.push({ tur: 'siir', bolum: 4, baslik: 'Günün şiiri', siirId: siir.id,
        maddeler: katYon('siir') });
    }

    // 6) Bugün kullanacağım gerçek cümle (eski "Bitiş kaydı" yerine; aynı sıra, bölüm 5)
    adimlar.push(gercekAdim);

    // Öz değerlendirmedeki "adıma git" sıraları rutindeki yerlerine çevrilir
    var esle = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 8 };
    var oz = (H.ozKontrol || []).map(function (o) {
      var k = Object.assign({}, o);
      if (o.adim != null) { if (esle[o.adim] != null) k.adim = esle[o.adim]; else delete k.adim; }
      return k;
    });
    var bugun = gunStr();
    secilen.forEach(function (k) { rutinVeri().goruldu[k] = bugun; });
    return { adimlar: adimlar, ozKontrol: oz };
  }
  function rutinBugun(mod) {
    var r = rutinVeri(), g = gunStr(), o = r.bugun;
    // mod verilmezse varsayılan 'tam'; ama var olan setin modu da korunabilsin diye sadece kısa istenirse kısa olur
    mod = mod === 'kisa' ? 'kisa' : 'tam';
    // Başlanmış günün seti, sürüm değişse bile aynen korunur (ilerleme kaybolmasın).
    if (o && o.tarih === g) {
      var basladi = o.bitti || o.adim > 0 || Object.keys(o.tamam || {}).length > 0;
      if (basladi && o.surum !== RUTIN_SURUM) {
        // Başlanmış günün seti korunur; yalnızca eski nefes adımları yenileriyle değiştirilir (ilerleme bozulmaz).
        var yeni = rutinKur(o.harf, o.seviye || rutinSeviye(), o.mod || 'tam');
        if (yeni.adimlar.length === o.adimlar.length) {
          o.adimlar = o.adimlar.map(function (x, k) {
            var y = yeni.adimlar[k];
            if (y.tur === 'nefesOlc' && x.bolum === y.bolum) return y;
            if (y.tur === x.tur && y.maddeler && (x.tur === 'siir' || /^Tekerleme/.test(x.baslik || ''))) {
              return Object.assign({}, x, { yonerge: y.yonerge, maddeler: y.maddeler });
            }
            return x;
          });
        }
        o.surum = RUTIN_SURUM; kaydet();
        return o;
      }
      if (basladi || (o.surum === RUTIN_SURUM && (o.mod || 'tam') === mod)) return o;
    }
    var harf = r.bugun && r.bugun.tarih === g ? r.bugun.harf : rutinSiradakiHarf();
    Object.keys(r.goruldu).forEach(function (k) { if (gunFark(r.goruldu[k], g) > 30) delete r.goruldu[k]; });
    var sv = rutinSeviye(), kur = rutinKur(harf, sv, mod);
    r.bugun = { tarih: g, surum: RUTIN_SURUM, mod: mod, harf: harf, seviye: sv, adim: 0, tamam: {}, bitti: !!r.gunler[g], sn: 0, t: Date.now(), adimlar: kur.adimlar, ozKontrol: kur.ozKontrol };
    kaydet();
    return r.bugun;
  }
  function rutinModul() {
    var b = veri.rutin.bugun, H = calisBul(b.harf);
    return {
      id: 'rutin', veriId: b.harf, rutin: true, mod: b.mod || 'tam', harf: 'Rutin', ad: 'Günlük rutin', sesli: false,
      tanima: H.tanima, ozKontrol: b.ozKontrol, adimlar: b.adimlar,
      bolumler: ['Nefes', H.harf + ' sesi', 'Dudak-dil', 'Tekerleme', 'Şiir', 'Bitiş']
    };
  }
  function rutinAc(mod) {
    var b = rutinBugun(mod);
    b.t = Date.now();
    Calis.modul = rutinModul();
    Calis.adim = b.bitti ? 0 : Math.min(b.adim || 0, b.adimlar.length - 1);
    Calis.sesli = false;
    Calis.set = {};
    $('#calisListe').hidden = true;
    $('#calisDetay').hidden = false;
    mkHazirla();
    adimCiz();
  }
  function rutinBolumCiz(kutu) {
    var b = veri.rutin.bugun, simdi = b.adimlar[Calis.adim].bolum;
    var s = el('div', 'rutin-bolumler');
    Calis.modul.bolumler.forEach(function (ad, i) {
      var sira = [];
      b.adimlar.forEach(function (a, j) { if (a.bolum === i) sira.push(j); });
      if (!sira.length) return; // adımı olmayan bölüm (kısa rutin) çizilmez
      var bitti = sira.every(function (j) { return b.tamam[j]; });
      var c = el('button', 'rutin-bolum' + (bitti ? ' bitti' : '') + (i === simdi ? ' simdi' : ''), (bitti ? '✓ ' : '') + ad);
      c.type = 'button';
      c.addEventListener('click', function () { Calis.adim = sira[0]; adimCiz(); });
      s.appendChild(c);
    });
    kutu.appendChild(s);
  }
  function rutinKartCiz(kutu) {
    if (!kutu) return;
    kutu.textContent = '';
    var r = rutinVeri(), b = r.bugun && r.bugun.tarih === gunStr() ? r.bugun : null;
    var H = calisBul(b ? b.harf : rutinSiradakiHarf());
    var sv = b ? b.seviye : rutinSeviye(), seri = rutinSeri(), svSimdi = rutinSeviye();
    var sonGun = rutinSonGunSayisi(), hafta = rutinHafta(), hedef = rutinHedef();
    var bitti = !!(b && (b.bitti || r.gunler[b.tarih]));
    // Kart <div>: içinde iki düğme olduğu için tüm kart düğme olamaz.
    var kart = el('div', 'rutin-kart');
    var basladi = !!(b && (b.adim > 0 || Object.keys(b.tamam).length));
    var kisaGun = !!(b && (b.mod || 'tam') === 'kisa' && (basladi || bitti));
    var ust = el('span', 'satir');
    ust.appendChild(el('b', 'grow', 'Bugünün rutini'));
    ust.appendChild(el('span', 'pill', (seri > 0 ? '🔥 ' + seri + ' gün · bu hafta ' : 'Bu hafta ') + hafta + ' / ' + hedef));
    kart.appendChild(ust);
    if (kisaGun) {
      kart.appendChild(el('span', 'muted kucuk', 'Bugünkü rutin: Kısa · 5 dk'));
      kart.appendChild(el('span', 'muted kucuk', 'Nefes → ' + H.harf + ' sesi → Tekerleme · yaklaşık 5 dk'));
    } else {
      kart.appendChild(el('span', 'muted kucuk', 'Nefes → ' + H.harf + ' sesi → Dudak-dil → Tekerleme → Şiir · yaklaşık 14 dk'));
    }
    kart.appendChild(el('span', 'muted kucuk', 'Seviye ' + sv + ': ' + RUTIN_SEVIYE[sv] + ' · son 28 günde ' + sonGun + ' gün' +
      (svSimdi < 3 ? ' · Seviye ' + (svSimdi + 1) + ' için ' + Math.max(1, SEVIYE_ESIK[svSimdi] - sonGun) + ' gün daha' : '')));
    if (hafta >= hedef) kart.appendChild(el('span', 'muted kucuk', '✓ Bu haftanın hedefi tamam'));
    var dun = new Date(), dunDun = new Date();
    dun.setDate(dun.getDate() - 1); dunDun.setDate(dunDun.getDate() - 2);
    if (!r.gunler[gunStr()] && !r.gunler[gunStr(dun)] && r.gunler[gunStr(dunDun)])
      kart.appendChild(el('span', 'muted kucuk', 'Dün atladın, seri bozulmadı. Bugün devam et.'));
    // Ertesi gün geri bildirimi: hazırlanan cümle gerçekten kullanıldı mı?
    var gc = r.gercek;
    if (gc && gc.metin && gc.tarih < gunStr() && gc.kullandi === undefined) {
      var soru = el('div', 'rutin-soru');
      soru.appendChild(el('span', 'rutin-soru-cumle', '“' + gc.metin + '”'));
      soru.appendChild(el('span', 'kucuk', 'Dün hazırladığın cümleyi gerçekten kullandın mı?'));
      var sb = el('div', 'rutin-btnlar');
      [['Evet', true], ['Hayır', false]].forEach(function (x) {
        var d = el('button', 'secondary', x[0]); d.type = 'button';
        d.addEventListener('click', function () { gc.kullandi = x[1]; kaydet(); rutinKartlariCiz(); });
        sb.appendChild(d);
      });
      soru.appendChild(sb);
      kart.appendChild(soru);
    }
    var bt = el('div', 'rutin-btnlar');
    function dugme(yazi, sinif, mod) {
      var d = el('button', sinif, yazi); d.type = 'button';
      d.addEventListener('click', function () { goster('calis'); rutinAc(mod); });
      bt.appendChild(d);
      return d;
    }
    if (bitti) {
      dugme('✓ Bugün bitti. İstersen tekrar yap.', 'secondary rutin-bitti', (b && b.mod) || 'tam');
    } else if (basladi) {
      dugme('Kaldığın yerden devam et (' + (b.adim + 1) + ' / ' + b.adimlar.length + ') →', 'primary', b.mod || 'tam');
    } else {
      dugme('Başla · 14 dk', 'primary', 'tam');
      dugme('Kısa · 5 dk', 'secondary', 'kisa');
    }
    kart.appendChild(bt);
    if (!bitti && !basladi) kart.appendChild(el('span', 'muted kucuk', 'Yoğun günlerde: nefes, günün sesi, tekerleme, gerçek cümle.'));
    kutu.appendChild(kart);
  }
  function rutinKartlariCiz() { rutinKartCiz($('#rutinKartBugun')); rutinKartCiz($('#rutinKartCalis')); }
  function rutinBitir() {
    var r = rutinVeri(), b = r.bugun, g = b.tarih, ilk = !r.gunler[g];
    rutinSureTik();
    // Rutinin günü, başladığı gündür (gece yarısını geçse de).
    var mod = b.mod || 'tam', sn = Math.round(b.sn || 0), hizli = sn < SURE_ESIK[mod === 'kisa' ? 'kisa' : 'tam'];
    r.gunler[g] = { sn: sn, mod: mod };
    r.sonHarf = b.harf;
    b.bitti = true; b.adim = 0;
    gunuIsaretle('rutin', g);
    var sv = rutinSeviye();
    uyariGoster('Tebrikler, bugünkü rutin bitti! 🔥 ' + rutinSeri() + ' gün üst üste. ' +
      (hizli ? 'Bugün çok hızlı geçti; seri için sayıldı ama seviyeyi artırmaz. ' : '') +
      (r.bugun.olcumsuz ? 'Not: nefes adımı ölçümsüz yapıldı (mikrofon açılmadı). ' : '') +
      (ilk && sv > r.bugun.seviye ? 'Yarından itibaren Seviye ' + sv + ': ' + RUTIN_SEVIYE[sv] + '.' : 'Yarın yeni harf ve yeni metinler gelecek.'));
    calisKapat();
  }
  function calisDurdur() {
    clearTimeout(Calis.zaman); Calis.zaman = null;
    Calis.oto = false; Calis.tutCalisiyor = false;
    if (Calis.olcer) { Calis.olcer.kapat(); Calis.olcer = null; }
    if (Calis.tanima) { try { Calis.tanima.abort(); } catch (e) { /* yok */ } Calis.tanima = null; }
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* yok */ }
  }
  function calisSoyle(metin) {
    if (!('speechSynthesis' in window) || !Rehber.ses) return false;
    // Kısa sözcükleri telefon harf harf okuyabiliyor; modül en az uzunluk isteyebilir
    if (Calis.modul && Calis.modul.sesliMin && metin.length < Calis.modul.sesliMin) return false;
    try {
      var u = new SpeechSynthesisUtterance(metin);
      u.voice = Rehber.ses; u.lang = Rehber.ses.lang; u.rate = 0.8;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  function bip(frekans) {
    if (veri.ayarlar.bip === false) return;
    try {
      var c = Ses.baglam(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = frekans; g.gain.value = 0.08;
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.15);
    } catch (e) { /* yok */ }
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) { /* yok */ }
  }

  // ---------- Her açışta farklı set (zorlanılan sözcükler daha sık) ----------
  function agirlikliSec(liste, n, agirlik) {
    var havuz = liste.map(function (x) { return { x: x, w: agirlik ? agirlik(x) : 1 }; }), sec = [];
    while (sec.length < n && havuz.length) {
      var top = 0, i;
      for (i = 0; i < havuz.length; i++) top += havuz[i].w;
      var r = Math.random() * top;
      for (i = 0; i < havuz.length - 1; i++) { r -= havuz[i].w; if (r <= 0) break; }
      sec.push(havuz.splice(i, 1)[0].x);
    }
    return sec;
  }
  function zorAgirlik(metin) {
    var z = veriCalis().zor, w = 1;
    trKucuk(metin).split(' ').forEach(function (s) {
      var k = z[s];
      if (k && k.y - k.d >= 2) w += 3 * Math.min(k.y - k.d, 3);
    });
    return w;
  }
  function adimVerisi(i) {
    Calis.set = Calis.set || {};
    if (Calis.set[i]) return Calis.set[i];
    var a = Calis.modul.adimlar[i], b = a;
    if (a.tur === 'kart' && a.havuz) {
      b = Object.assign({}, a, { diziler: a.havuz.map(function (g) {
        return { ad: g.ad, ogeler: agirlikliSec(g.ogeler, a.secim || g.ogeler.length, zorAgirlik) };
      }) });
    } else if (a.tur === 'kart' && a.secimDizi && a.diziler.length > a.secimDizi) {
      var sabit = a.diziler.slice(0, a.sabitDizi || 0);
      b = Object.assign({}, a, { diziler: sabit.concat(agirlikliSec(a.diziler.slice(sabit.length), a.secimDizi - sabit.length)) });
    } else if (a.tur === 'nefesOlc' && Array.isArray(a.ver)) {
      var sv0 = rutinSeviye();
      function sec0(x) { return Array.isArray(x) ? x[sv0 - 1] : x; }
      var al0 = sec0(a.al), tut0 = sec0(a.tut), v0 = sec0(a.ver), t0 = sec0(a.turSayisi);
      b = Object.assign({}, a, { al: al0, tut: tut0, ver: v0, turSayisi: t0, maddeler: a.maddeler.map(function (md) {
        return md.replace('{seviye}', RUTIN_SEVIYE[sv0]).replace('{al}', al0).replace('{tut}', tut0).replace('{ver}', v0).replace('{tur}', t0);
      }) });
    } else if (a.tur === 'cumle' && a.havuz) {
      b = Object.assign({}, a, { cumleler: agirlikliSec(a.havuz, a.secim || a.havuz.length, zorAgirlik) });
    }
    Calis.set[i] = b;
    return b;
  }
  function yeniSetSatiri(kutu, a) {
    var ham = Calis.modul.adimlar[Calis.adim], yazi;
    if (ham.havuz && ham.tur === 'kart') {
      var t = 0; ham.havuz.forEach(function (g) { t += g.ogeler.length; });
      yazi = 'Havuzda ' + t + ' sözcük var. Her açışta farklı ' + (ham.secim || '') + '’er tane gelir.';
    } else if (ham.havuz) yazi = 'Havuzda ' + ham.havuz.length + ' cümle var. Her açışta farklı ' + ham.secim + ' tanesi gelir.';
    else if (ham.secimDizi) yazi = ham.diziler.length + ' dizi var. Her açışta farklı ' + ham.secimDizi + ' tanesi gelir.';
    else return;
    var satir = el('div', 'yeni-set');
    satir.appendChild(el('span', 'muted kucuk grow', yazi));
    var b = el('button', 'secondary kucuk-btn', '🔀 Yeni set'); b.type = 'button';
    b.addEventListener('click', function () { delete Calis.set[Calis.adim]; adimCiz(); });
    satir.appendChild(b);
    kutu.appendChild(satir);
  }

  function adimCiz() {
    calisDurdur();
    var m = Calis.modul, a = adimVerisi(Calis.adim), kutu = $('#calisIcerik');
    kutu.textContent = '';
    $('#calisAdimYazi').textContent = m.ad + ' · ' + (Calis.adim + 1) + ' / ' + m.adimlar.length;
    $('#calisIlerleme').style.width = Math.round((Calis.adim + 1) / m.adimlar.length * 100) + '%';
    if (m.rutin) {
      rutinSureTik();
      veri.rutin.bugun.adim = Calis.adim; kaydet();
      rutinBolumCiz(kutu);
    }
    kutu.appendChild(el('h2', 'h2', (Calis.adim + 1) + '. ' + a.baslik));
    (a.metin || []).forEach(function (p) { kutu.appendChild(el('p', 'calis-p', p)); });
    if (a.yonerge) kutu.appendChild(el('p', 'muted calis-p', a.yonerge));
    yeniSetSatiri(kutu, a);
    if (a.maddeler) {
      var ul = el('ul', 'calis-ul');
      a.maddeler.forEach(function (md) { var li = document.createElement('li'); li.innerHTML = md; ul.appendChild(li); });
      kutu.appendChild(ul);
    }
    if (a.tur === 'bilgi' && a.dene) {
      var d = el('div', 'dene');
      d.appendChild(el('div', null, a.dene.yonerge));
      var cs = el('div', 'soz-chipler');
      a.dene.sozler.forEach(function (s) { cs.appendChild(el('span', 'soz-chip', s)); });
      d.appendChild(cs);
      kutu.appendChild(d);
    }
    if (a.tur === 'bilgi' && Calis.adim === 0) zorlukCiz(kutu);
    if (a.tur === 'tut') tutCiz(kutu, a);
    if (a.tur === 'nefesOlc') nefesOlcCiz(kutu, a);
    if (a.tur === 'kart') kartCiz(kutu, a);
    if (a.tur === 'cumle') cumleCiz(kutu, a);
    if (a.tur === 'siir') siirCiz(kutu, a);
    if (a.tur === 'gercek') gercekCiz(kutu, a);
    $('#calisOnceki').disabled = Calis.adim === 0;
    $('#calisSonraki').textContent = Calis.adim === m.adimlar.length - 1 ? 'Bitir ✓' : 'Sonraki →';
    var ust = $('#calisDetay');
    if (ust.getBoundingClientRect().top < 0) ust.scrollIntoView({ block: 'start' });
  }

  // ---------- Günün şiiri: nefes ve durak işaretli ----------
  function siirCiz(kutu, a) {
    var m = window.METINLER.filter(function (x) { return x.id === a.siirId; })[0];
    if (!m) { kutu.appendChild(el('p', 'muted calis-p', 'Şiir bulunamadı.')); return; }
    var bas = el('p', 'calis-p'); bas.appendChild(el('b', null, m.baslik)); kutu.appendChild(bas);
    var kn = kunyeYazi(m.id);
    if (kn) kutu.appendChild(el('p', 'muted kucuk calis-p', kn));
    var lg = el('div', 'legend');
    lg.innerHTML = '<span><span class="mk-n">/</span> nefes</span><span><span class="mk-d">|</span> kısa durak</span><span><span class="mk-d">||</span> uzun durak</span><span><b class="vurgu">kalın</b> vurgu</span>';
    kutu.appendChild(lg);
    var kart = el('div', 'card passage');
    isaretliYaz(kart, m.metin);
    kutu.appendChild(kart);
  }

  function zorlukCiz(kutu) {
    var v = veriCalis();
    var zor = Object.keys(v.zor).filter(function (w) { return v.zor[w].y - v.zor[w].d >= 2; })
      .sort(function (x, y) { return (v.zor[y].y - v.zor[y].d) - (v.zor[x].y - v.zor[x].d); }).slice(0, 8);
    var oz = Object.keys(v.oz).filter(function (k) { return v.oz[k] > 0 && k !== 'net'; })
      .sort(function (x, y) { return v.oz[y] - v.oz[x]; });
    if (!zor.length && !oz.length) return;
    var k = el('div', 'coach');
    k.appendChild(el('div', 'label', 'Senin için notlar'));
    if (zor.length) k.appendChild(el('p', null, 'Telefonun zor anladığı sözcükler: ' + zor.join(', ') + '. Bunlara özellikle dikkat et.'));
    if (oz.length) {
      var ok = (Calis.modul.ozKontrol || []).filter(function (o) { return o.id === oz[0]; })[0];
      if (ok) k.appendChild(el('p', null, 'En sık işaretlediğin sorun: “' + ok.yazi + '”. ' + ok.tavsiye));
    }
    kutu.appendChild(k);
  }

  // ---------- Ses tutma (Rrrr gibi) ----------
  function tutCiz(kutu, a) {
    var ekran = el('div', 'tut-ekran');
    var ses = el('div', 'tut-ses', a.sesler[0]);
    var faz = el('div', 'tut-faz', 'Hazır');
    var bilgi = el('div', 'muted kucuk', a.birim
      ? a.sesler.length + ' ' + a.birim + ' · her biri ' + a.sure + ' saniye'
      : a.sesler.length + ' ses × ' + a.turSayisi + ' tur · her tur ' + a.sure + ' saniye');
    ekran.appendChild(ses); ekran.appendChild(faz); ekran.appendChild(bilgi);
    kutu.appendChild(ekran);
    var OL = a.olcum ? OLCUMLER[a.olcum] : null;
    if (OL) kutu.appendChild(el('div', 'muted kucuk', OL.aciklama));
    var bipEt = el('label', 'check');
    var bipKutu = document.createElement('input'); bipKutu.type = 'checkbox'; bipKutu.checked = veri.ayarlar.bip !== false;
    bipEt.appendChild(bipKutu);
    bipEt.appendChild(document.createTextNode(' Bip seslerini çal (kapatırsan sadece ekrandaki yazıyı izlersin)'));
    bipKutu.addEventListener('change', function () { veri.ayarlar.bip = bipKutu.checked; kaydet(); });
    kutu.appendChild(bipEt);
    var btn = el('button', 'primary', 'Başlat');
    btn.type = 'button';
    kutu.appendChild(btn);
    if (OL) ayarCiz(kutu, ekran, ses, faz, btn, OL, a);
    var sonuclar = el('div', 'stack');
    sonuclar.style.gap = '6px';
    kutu.appendChild(sonuclar);
    var fazlar = [];
    a.sesler.forEach(function (s) {
      for (var t = 1; t <= a.turSayisi; t++) {
        fazlar.push({ ses: s, ad: a.fazAd || 'Titret!', sn: a.sure, tur: t, olcumsuz: !!(a.olcumsuz && a.olcumsuz.indexOf(s) >= 0) });
        fazlar.push({ ses: s, ad: 'Dinlen', sn: a.dinlenme, tur: t, dinlen: true });
      }
    });
    fazlar.pop();
    var olcumler = [];
    function sonucYaz(f, o) {
      var oran = o.ses > 0 ? o.iyi / Math.max(o.ses, f.sn * 0.6) : 0;
      var satir = el('div', 'olcum-satir ' + (oran >= 0.5 ? 'iyi' : oran >= 0.15 ? 'orta' : 'zayif'));
      var yazi = o.ses < 0.5 ? 'Ses duyamadım. Telefonu biraz daha yakın tut.' : OL.sonuc(o, oran);
      satir.appendChild(el('b', null, f.ses + ' · ' + f.tur + '. tur: '));
      satir.appendChild(document.createTextNode(yazi));
      sonuclar.appendChild(satir);
      olcumler.push({ ses: f.ses, oran: oran, sesVar: o.ses >= 0.5 });
    }
    function ozetYaz() {
      var gecerli = olcumler.filter(function (o) { return o.sesVar; });
      if (!gecerli.length) return;
      var iyi = gecerli.filter(function (o) { return o.oran >= 0.5; }).length;
      var ozet = el('div', 'coach');
      ozet.appendChild(el('div', 'label', 'Özet'));
      var m = OL.ozet(iyi, gecerli.length);
      ozet.appendChild(el('p', null, m));
      sonuclar.appendChild(ozet);
      veriCalis().isinma.push({ tarih: new Date().toISOString(), iyi: iyi, toplam: gecerli.length });
      kaydet();
    }
    function bitir(tamam) {
      var olcer = Calis.olcer; Calis.olcer = null;
      calisDurdur();
      if (olcer) olcer.kapat();
      btn.textContent = 'Yeniden başlat';
      faz.textContent = tamam ? 'Bitti! Sonraki adıma geçebilirsin.' : 'Durduruldu';
      ekran.classList.remove('aktif', 'dinlen');
      if (tamam) ozetYaz();
    }
    function calistir(i, kalan) {
      if (!Calis.tutCalisiyor) return;
      if (i >= fazlar.length) { bip(880); bitir(true); return; }
      var f = fazlar[i];
      if (kalan === f.sn) {
        bip(f.dinlen ? 440 : 660);
        if (!f.dinlen && !f.olcumsuz && Calis.olcer) Calis.olcer.basla();
      }
      ses.textContent = f.ses;
      faz.textContent = f.ad + ' ' + kalan + ' · ' + f.tur + '. tur';
      ekran.classList.toggle('aktif', !f.dinlen);
      ekran.classList.toggle('dinlen', !!f.dinlen);
      Calis.zaman = setTimeout(function () {
        if (kalan > 1) { calistir(i, kalan - 1); return; }
        if (!f.dinlen && !f.olcumsuz && Calis.olcer) sonucYaz(f, Calis.olcer.dur());
        calistir(i + 1, i + 1 < fazlar.length ? fazlar[i + 1].sn : 0);
      }, 1000);
    }
    function basla(olcer) {
      Calis.olcer = olcer;
      Calis.tutCalisiyor = true;
      btn.textContent = 'Durdur';
      ekraniAcikTut();
      calistir(0, fazlar[0].sn);
    }
    btn.addEventListener('click', function () {
      if (Calis.tutCalisiyor) { bitir(false); return; }
      calisDurdur(); mkDurdur();
      sonuclar.textContent = ''; olcumler = [];
      if (!OL) { basla(null); return; }
      faz.textContent = 'Mikrofon açılıyor…';
      Ses.mikrofon().then(function (stream) { basla(OL.Olcer(stream)); })
        .catch(function (e) { mikrofonHatasi(e); basla(null); });
    });
  }

  // ---------- Dinlemeli nefes (Nefes sekmesindeki daireli şablon): al · tut · ver (mikrofon dinler) ----------
  function nefesOlcCiz(kutu, a) {
    var SES = a.ses || 'sssss';
    var TUT = a.tut != null ? a.tut : 4;
    var SN = { al: a.al, tut: TUT, ver: a.ver };
    var AD = { al: 'Nefes al', tut: 'Tut', ver: SES.charAt(0).toUpperCase() + SES.slice(1) + ' diye ver' };
    var OLCEK = { al: 1, tut: 1, ver: 0.62 };
    var SOZ = { al: ['Nefes al', 523], tut: ['Nefesi tut', 659], ver: ['Yavaşça ver', 440] };
    var ekran = el('div', 'stack'); ekran.style.gap = '10px';
    var sarma = el('div', 'breath-wrap');
    sarma.appendChild(el('div', 'breath-ring'));
    var daireEl = el('div', 'breath-circle');
    sarma.appendChild(daireEl);
    var etiket = el('div', 'breath-label');
    var fazAd = el('div', 'p', 'Hazır'), sayac = el('div', 'c', '–');
    etiket.appendChild(fazAd); etiket.appendChild(sayac);
    sarma.appendChild(etiket);
    var fazlar = el('div', 'phases'), fazKutu = {};
    ['al', 'tut', 'ver'].forEach(function (k) {
      var d = el('div', 'phase', k === 'ver' ? SES + ' ver' : AD[k]);
      d.appendChild(el('b', null, SN[k] + ' sn'));
      fazlar.appendChild(d); fazKutu[k] = d;
    });
    var cubuk = el('div', 'seviye-cubuk'), dolgu = el('span');
    cubuk.appendChild(dolgu);
    var turYazi = el('div', 'muted'); turYazi.style.textAlign = 'center';
    turYazi.textContent = a.turSayisi + ' tur · yaklaşık ' + Math.round((SN.al + SN.tut + SN.ver) * a.turSayisi / 60 * 10) / 10 + ' dakika';
    [sarma, fazlar, cubuk, turYazi].forEach(function (x) { ekran.appendChild(x); });
    kutu.appendChild(ekran);
    var btn = el('button', 'primary', 'Başlat'); btn.type = 'button';
    kutu.appendChild(btn);
    kutu.appendChild(el('div', 'muted kucuk', 'Telefon süreyi ve dengeyi tahmin eder; telefonun yüzüne uzaklığı ve sesin sönmesi sonucu etkiler. Sonuç bir ipucudur.'));
    var sonuclar = el('div', 'stack'); sonuclar.style.gap = '6px';
    kutu.appendChild(sonuclar);

    function daireAyarla(olcek, sn) {
      daireEl.style.transitionDuration = sn + 's';
      daireEl.style.transform = 'scale(' + olcek + ')';
    }
    function sifirla() {
      daireAyarla(0.62, 0.5);
      fazAd.textContent = 'Hazır'; sayac.textContent = '–';
      dolgu.style.width = '0';
      Object.keys(fazKutu).forEach(function (k) { fazKutu[k].classList.remove('on'); });
    }
    function bitir(tamam, n) {
      var turlar = n ? n.turlar : [];
      calisDurdur();
      btn.textContent = 'Yeniden başlat';
      sifirla();
      if (!tamam) { fazAd.textContent = 'Durduruldu'; return; }
      Rehber.soyle('Tebrikler, bitti', 784);
      if (!n.dinle) {
        fazAd.textContent = 'Bitti';
        sonuclar.appendChild(el('div', 'olcum-satir orta', 'Mikrofon açılmadığı için nefesin ölçülmedi; süreleri ekrandan izledin. Mikrofonu açıp yeniden deneyebilirsin.'));
        if (Calis.modul && Calis.modul.rutin && veri.rutin && veri.rutin.bugun) { veri.rutin.bugun.olcumsuz = true; kaydet(); }
        return;
      }
      fazAd.textContent = 'Bitti!';
      var iyi = turlar.filter(function (d) { return d === 'g'; }).length;
      var ozet = el('div', 'coach');
      ozet.appendChild(el('div', 'label', 'Özet'));
      ozet.appendChild(el('p', null, a.turSayisi + ' turun ' + iyi + ' tanesi tam süre ve dengeli. ' +
        (iyi === a.turSayisi ? 'Harika!' : iyi >= 3 ? 'İyi gidiyorsun; uyarı aldığın turlara dikkat et.' : 'Acele etme; nefesi daha yavaş ve eşit ver.')));
      sonuclar.appendChild(ozet);
      veri.nefesler.push({ tarih: new Date().toISOString(), seviye: 'rutin', dinlendi: true, turlar: turlar });
      gunuIsaretle('nefes');
    }
    function turYaz(n) {
      var t = n.turVeri, durum, mesaj, cv = degiskenlik(t.verRms);
      if (t.verAktif < 0.8) { durum = 'b'; mesaj = 'Nefes verişini duyamadım. Telefonu yüzüne yaklaştır ve “' + SES + '” diye duyulur şekilde ver.'; }
      else if (t.verSon < a.ver - 1.2) { durum = 'w'; mesaj = 'Erken bitirdin: ' + sn(t.verSon) + ' sn / ' + a.ver + ' sn. Daha yavaş ver.'; }
      else if (t.verIlk != null && t.verIlk > 2.5) { durum = 'w'; mesaj = 'Geç başladın. “Ver” denince hemen başla.'; }
      else if (cv > 0.6) { durum = 'w'; mesaj = 'Süre iyi ama nefesin dalgalı çıktı. Baştan sona aynı güçte ver.'; }
      else { durum = 'g'; mesaj = 'İyi görünüyor: telefon ' + a.ver + ' saniye dengeli bir nefes duydu.'; }
      if (t.tutAktif > 0.6) mesaj += ' “Tut” sırasında nefes kaçırdın.';
      n.turlar.push(durum);
      var satir = el('div', 'card tur');
      satir.appendChild(el('span', 'badge ' + durum, String(n.tur)));
      satir.appendChild(el('p', null, mesaj));
      sonuclar.appendChild(satir);
    }
    function fazaGir(n, f) {
      n.faz = f; n.fazBas = performance.now();
      if (f === 'al') {
        n.turVeri = { verAktif: 0, verIlk: null, verSon: null, verRms: [], tutAktif: 0 };
        turYazi.textContent = 'Tur ' + n.tur + ' / ' + a.turSayisi;
      }
      fazAd.textContent = AD[f];
      Object.keys(fazKutu).forEach(function (k) { fazKutu[k].classList.toggle('on', k === f); });
      daireAyarla(OLCEK[f], SN[f]);
      Rehber.soyle(n.olcer ? SOZ[f][0] : AD[f], SOZ[f][1]);
    }
    function tik(n) {
      var simdi = performance.now(), dt = Math.min(0.25, (simdi - n.son) / 1000);
      n.son = simdi;
      var gecen = (simdi - n.fazBas) / 1000, uzunluk = n.faz === 'hazir' ? 2 : SN[n.faz];
      if (n.olcer) {
        var r = n.olcer.rms();
        dolgu.style.width = Math.round((n.esik ? Math.min(1, r / (n.esik * 6)) : Math.min(1, r * 30)) * 100) + '%';
        if (n.faz === 'hazir') { if (!Rehber.mesgul()) n.kalib.push(r); }
        else if (n.esik && !Rehber.mesgul() && r > n.esik) {
          var t = n.turVeri;
          if (n.faz === 'tut') t.tutAktif += dt;
          else if (n.faz === 'ver') { t.verAktif += dt; t.verRms.push(r); if (t.verIlk == null) t.verIlk = gecen; t.verSon = gecen; }
        }
      }
      sayac.textContent = n.faz === 'hazir' ? '' : String(Math.max(1, Math.ceil(uzunluk - gecen)));
      if (gecen < uzunluk) return;
      if (n.faz === 'hazir') { if (n.olcer) n.esik = esikHesapla(medyan(n.kalib)); fazaGir(n, 'al'); }
      else if (n.faz === 'al') fazaGir(n, 'tut');
      else if (n.faz === 'tut') fazaGir(n, 'ver');
      else {
        if (n.olcer) turYaz(n);
        if (n.tur >= a.turSayisi) { bitir(true, n); return; }
        n.tur++; fazaGir(n, 'al');
      }
    }
    function basla(stream) {
      var n = { dinle: !!stream, stream: stream, olcer: stream ? Olcer(stream, a.filtre || 1500) : null, tur: 1, faz: 'hazir',
        fazBas: performance.now(), son: performance.now(), kalib: [], esik: null, turVeri: null, turlar: [], zaman: null };
      // calisDurdur() bu nesnenin kapat()'ını çağırarak her şeyi durdurur
      Calis.olcer = { kapat: function () {
        clearInterval(n.zaman);
        if (n.olcer) n.olcer.kapat();
        akisiKapat(n.stream);
        Rehber.durdur();
        ekranKilidiBirak();
      } };
      Calis.tutCalisiyor = true;
      btn.textContent = 'Durdur';
      fazAd.textContent = stream ? 'Sessiz kal' : 'Hazırlan';
      sayac.textContent = '';
      daireAyarla(0.62, 1);
      ekraniAcikTut();
      Rehber.soyle('Hazırlan', 600);
      n.zaman = setInterval(function () { tik(n); }, 50);
      btn.onclick = function () { if (Calis.tutCalisiyor) bitir(false, n); else baslat(); };
    }
    function baslat() {
      calisDurdur(); mkDurdur();
      sonuclar.textContent = '';
      Ses.baglam(); Rehber.uyandir();
      fazAd.textContent = 'Mikrofon açılıyor…';
      Ses.mikrofon().then(basla).catch(function (e) { mikrofonHatasi(e); basla(null); });
    }
    btn.onclick = baslat;
  }

  // ---------- Titreşim ölçeri kişinin sesine göre ayarlama ----------
  function ayarCiz(kutu, ekran, ses, faz, anaBtn, OL, a) {
    var sar = el('div', 'ayar-kutu');
    var durum = el('div', 'muted kucuk');
    var bt = el('button', 'secondary kucuk-btn', '🎚 Sesime göre ayarla'); bt.type = 'button';
    var gen = el('button', 'secondary kucuk-btn', 'Genel ayara dön'); gen.type = 'button';
    var sonuc = el('div', 'tanima-sonuc'); sonuc.hidden = true;
    function durumYaz() {
      var t = veri.ayarlar[OL.ayarAnahtar];
      durum.textContent = t ? 'Ölçüm senin sesine göre ayarlı (' + tarihYaz(t.tarih) + ').' : 'Ölçüm genel ayarda. Daha doğru sonuç için sesine göre ayarla.';
      gen.hidden = !t;
    }
    var satir = el('div', 'ayar-dugmeler'); satir.appendChild(bt); satir.appendChild(gen);
    sar.appendChild(durum); sar.appendChild(satir); sar.appendChild(sonuc);
    kutu.appendChild(sar);
    durumYaz();
    gen.addEventListener('click', function () { delete veri.ayarlar[OL.ayarAnahtar]; kaydet(); durumYaz(); sonuc.hidden = true; });
    var adimlar = OL.ayarAdim;
    bt.addEventListener('click', function () {
      if (Calis.tutCalisiyor) return;
      calisDurdur(); mkDurdur();
      sonuc.hidden = true;
      bt.disabled = true; anaBtn.disabled = true;
      faz.textContent = 'Mikrofon açılıyor…';
      Ses.mikrofon().then(function (stream) {
        var olcer = OL.Olcer(stream), toplanan = [];
        Calis.olcer = olcer; Calis.tutCalisiyor = true;
        function bitir(s) {
          Calis.olcer = null; Calis.tutCalisiyor = false;
          olcer.kapat();
          bt.disabled = false; anaBtn.disabled = false;
          ekran.classList.remove('aktif', 'dinlen');
          ses.textContent = a.sesler[0];
          faz.textContent = 'Hazır';
          if (!s) return;
          if (s.ok) { veri.ayarlar[OL.ayarAnahtar] = Object.assign({ tarih: new Date().toISOString() }, s.deger); kaydet(); }
          sonuc.className = 'tanima-sonuc ' + (s.ok ? 'iyi' : 'kotu');
          sonuc.textContent = s.mesaj;
          sonuc.hidden = false;
          durumYaz();
        }
        function adim(i, geri) {
          if (!Calis.tutCalisiyor) { bitir(null); return; }
          if (i >= adimlar.length) { bitir(OL.ayarHesap(toplanan[0], toplanan[1])); return; }
          var A = adimlar[i];
          ses.textContent = A.ses;
          if (geri > 0) {
            ekran.classList.remove('aktif'); ekran.classList.add('dinlen');
            faz.textContent = A.yazi + ' · ' + geri;
            Calis.zaman = setTimeout(function () { adim(i, geri - 1); }, 1000);
            return;
          }
          bip(660);
          ekran.classList.add('aktif'); ekran.classList.remove('dinlen');
          faz.textContent = A.yazi + ' · dinliyorum';
          olcer.basla();
          Calis.zaman = setTimeout(function () {
            toplanan.push(olcer.dur().kareler);
            adim(i + 1, 3);
          }, 3000);
        }
        adim(0, 3);
      }).catch(function (e) { bt.disabled = false; anaBtn.disabled = false; faz.textContent = 'Hazır'; mikrofonHatasi(e); });
    });
  }

  // ---------- Konuşma tanıma: "Doğru anlaşıldı mı?" ----------
  function veriCalis() {
    var id = Calis.modul.veriId || Calis.modul.id;
    veri.calis = veri.calis || {};
    var v = veri.calis[id] = veri.calis[id] || {};
    v.zor = v.zor || {}; v.oz = v.oz || {}; v.isinma = v.isinma || [];
    return v;
  }
  function tanimaVar() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
  function tanimaAcik() { return veri.ayarlar.tanima === true && veri.ayarlar.tanimaSurum === 2; }
  function tanimaIzni() {
    if (tanimaAcik()) return true;
    var tamam = window.confirm('Söylediğini kontrol etmek için telefonunun konuşma tanıması kullanılacak. ' +
      'Sesin, telefonunun tanıma hizmetine (Android’de genellikle Google, iPhone’da Apple) internet üzerinden gönderilip yazıya çevrilir. ' +
      'Bu uygulama sesi kendi başına saklamaz ya da başka yere göndermez. Mikrofon kayıtların telefonda kalır.\n\nKabul ediyor musun?');
    if (tamam) { veri.ayarlar.tanima = true; veri.ayarlar.tanimaSurum = 2; kaydet(); }
    return tamam;
  }
  var SAYI_BIR = ['sıfır','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
  var SAYI_ON  = ['','on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'];
  function sayiSoz(n) {
    if (n === 0) return 'sıfır';
    var p = [], b = Math.floor(n/1000), y = Math.floor(n%1000/100), o = Math.floor(n%100/10), e = n%10;
    if (b) { if (b > 1) p.push(SAYI_BIR[b]); p.push('bin'); }
    if (y) { if (y > 1) p.push(SAYI_BIR[y]); p.push('yüz'); }
    if (o) p.push(SAYI_ON[o]);
    if (e) p.push(SAYI_BIR[e]);
    return p.join(' ');
  }
  function sayilariCevir(s) {
    return s.replace(/(\d{1,4})(?:\s*['’]\s*|(?=[a-zçğıöşüâîû]))([a-zçğıöşüâîû]*)|(\d{1,4})(?!\d)/gi,
      function (m, a, ek, c) {
        var w = sayiSoz(parseInt(a || c, 10));
        if (ek) { if (/^[aeıioöuüâîû]/i.test(ek) && /t$/.test(w)) w = w.slice(0, -1) + 'd'; return w + ek; }
        return w;
      });
  }
  function trKucuk(s) {
    s = sayilariCevir(s).toLocaleLowerCase('tr-TR').replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u');
    return s.replace(/[.,;:!?…"“”'’()\-]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function dinle(cb) {
    var R = window.SpeechRecognition || window.webkitSpeechRecognition;
    var r = new R(), bitti = false, sonuc = [];
    r.lang = 'tr-TR'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    r.onresult = function (e) {
      // e.results birikimlidir: her çağrıda listeyi baştan kur.
      // İlk aday: her sonucun en iyi alternatiflerinin birleşimi; sonra ilk sonucun kalan alternatifleri.
      var en = [], i;
      for (i = 0; i < e.results.length; i++) {
        var q = e.results[i];
        if (q && q.length) en.push(q[0].transcript);
      }
      sonuc = [trKucuk(en.join(' '))];
      var ilkS = e.results[0];
      if (ilkS) for (i = 1; i < ilkS.length; i++) sonuc.push(trKucuk(ilkS[i].transcript));
    };
    r.onerror = function (e) { if (!bitti) { bitti = true; Calis.tanima = null; cb({ hata: e.error }); } };
    r.onend = function () { if (!bitti) { bitti = true; Calis.tanima = null; cb({ duyulan: sonuc }); } };
    Calis.tanima = r;
    try { r.start(); } catch (e) { bitti = true; Calis.tanima = null; cb({ hata: 'baslamadi' }); }
  }
  function tanimaHataYazi(h) {
    if (h === 'not-allowed' || h === 'service-not-allowed') return 'Mikrofon ya da konuşma tanıma izni verilmedi.';
    if (h === 'network') return 'İnternet bağlantısı gerekiyor.';
    if (h === 'no-speech') return 'Seni duyamadım. Düğmeye basıp hemen söyle.';
    return 'Dinleyemedim, tekrar dene.';
  }
  function zorIsle(sozcuk, dogru) {
    var z = veriCalis().zor;
    var k = z[sozcuk] = z[sozcuk] || { y: 0, d: 0 };
    if (dogru) k.d++; else k.y++;
    kaydet();
  }
  // Tek sözcük kontrolü
  function sozcukDegerlendir(hedef, duyulan) {
    hedef = trKucuk(hedef);
    if (!duyulan.length || !duyulan[0]) return { dogru: false, yazi: 'Seni duyamadım. Biraz daha yüksek sesle tekrar dene.' };
    var tum = duyulan.join(' ').split(' ');
    if (tum.indexOf(hedef) >= 0) return { dogru: true, yazi: '“' + hedef + '” doğru anlaşıldı ✓ (telefon bozuk sesi de tamamlayabilir; kaydını dinleyerek kendin de kontrol et)' };
    var ilk = duyulan[0];
    var T = Calis.modul.tanima, hf = T.harf, re = new RegExp(hf, 'g');
    var hH = (hedef.match(re) || []).length, hD = (ilk.match(re) || []).length;
    var neden = T.genel;
    var karisan = T.karisma.filter(function (k) { return hedef.replace(re, k.harf) === ilk; })[0];
    if (karisan) neden = karisan.yazi;
    else if (hD < hH) neden = T.eksik;
    return { dogru: false, yazi: 'Ben “' + ilk + '” duydum. ' + neden };
  }
  // Cümle kontrolü: r'li sözcükler anlaşıldı mı?
  function cumleDegerlendir(hedef, duyulan) {
    if (!duyulan.length || !duyulan[0]) return { dogru: false, yazi: 'Seni duyamadım. Biraz daha yüksek sesle tekrar dene.', eksik: [] };
    var hf = Calis.modul.tanima.harf;
    var sozler = trKucuk(hedef).split(' ').filter(function (w) { return w.indexOf(hf) >= 0; });
    var enIyi = null, enEksik = null;
    duyulan.forEach(function (d) {
      var dw = d.split(' ');
      var eksik = sozler.filter(function (w) { return dw.indexOf(w) < 0; });
      if (!enEksik || eksik.length < enEksik.length) { enEksik = eksik; enIyi = d; }
    });
    sozler.forEach(function (w) { zorIsle(w, enEksik.indexOf(w) < 0); });
    if (!enEksik.length) return { dogru: true, yazi: hf + '’li sözcüklerin hepsi doğru anlaşıldı ✓ (' + sozler.length + ' / ' + sozler.length + ')', eksik: [] };
    return { dogru: false, eksik: enEksik,
      yazi: (sozler.length - enEksik.length) + ' / ' + sozler.length + ' ' + hf + '’li sözcük doğru anlaşıldı. Şunlarda ' + hf + ' net değildi: ' + enEksik.join(', ') + '. Ben şunu duydum: “' + enIyi + '”' };
  }
  function tanimaDugmesi(etiket, hedefAl, degerlendir, sonucKutu, basarida) {
    var b = el('button', 'secondary tanima-btn', '🎤 ' + etiket);
    b.type = 'button';
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      if (Calis.tanima) { try { Calis.tanima.stop(); } catch (x) { /* yok */ } return; }
      if (!tanimaVar()) { uyariGoster('Bu tarayıcı konuşma tanımayı desteklemiyor. Chrome ile açmayı dene.'); return; }
      if (!tanimaIzni()) return;
      clearTimeout(Calis.zaman); Calis.oto = false;
      mkDurdur(); Rehber.durdur();
      var hedef = hedefAl();
      b.textContent = '👂 Dinliyorum… söyle';
      b.classList.add('dinliyor');
      sonucKutu.hidden = true;
      dinle(function (r) {
        b.textContent = '🎤 ' + etiket;
        b.classList.remove('dinliyor');
        var d = r.hata ? { dogru: false, yazi: tanimaHataYazi(r.hata), hata: true } : degerlendir(hedef, r.duyulan);
        sonucKutu.className = 'tanima-sonuc ' + (d.dogru ? 'iyi' : 'kotu');
        sonucKutu.textContent = d.yazi;
        sonucKutu.hidden = false;
        if (d.dogru && basarida) basarida();
      });
    });
    return b;
  }

  // ---------- Hece / sözcük kartları ----------
  function kartCiz(kutu, a) {
    Calis.dizi = 0; Calis.kart = 0;
    var chipler = el('div', 'chips kaydir');
    var kart = el('button', 'hece-kart');
    kart.type = 'button';
    kart.setAttribute('aria-label', 'Sonraki kart');
    var satir = el('div', 'dizi-satir');
    var durum = el('div', 'muted kucuk', '');
    durum.style.textAlign = 'center';

    var kontrol = el('div', 'kart-kontrol');
    var geri = el('button', 'secondary', '◀'); geri.type = 'button'; geri.setAttribute('aria-label', 'Önceki kart');
    var oto = el('button', 'primary', '▶ Otomatik'); oto.type = 'button';
    var ileri = el('button', 'secondary', '▶'); ileri.type = 'button'; ileri.setAttribute('aria-label', 'Sonraki kart');
    kontrol.appendChild(geri); kontrol.appendChild(oto); kontrol.appendChild(ileri);

    var ayar = el('div', 'kart-ayar');
    var tempo = el('div', 'chips');
    [['yavas', 'Yavaş'], ['orta', 'Orta'], ['hizli', 'Hızlı']].forEach(function (t) {
      var b = el('button', null, t[1]); b.type = 'button';
      b.setAttribute('aria-pressed', String(Calis.tempo === t[0]));
      b.addEventListener('click', function () {
        Calis.tempo = t[0];
        $$('button', tempo).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
      tempo.appendChild(b);
    });
    var sesliEt = el('label', 'check');
    var kutucuk = document.createElement('input'); kutucuk.type = 'checkbox'; kutucuk.checked = Calis.sesli;
    sesliEt.appendChild(kutucuk);
    sesliEt.appendChild(document.createTextNode(' Önce telefon söylesin, sonra ben tekrar edeyim'));
    kutucuk.addEventListener('change', function () {
      if (kutucuk.checked && !Rehber.ses) {
        kutucuk.checked = false;
        uyariGoster('Telefonunda Türkçe konuşma sesi bulunamadı. Kartları kendin okuyabilirsin.');
        return;
      }
      Calis.sesli = kutucuk.checked;
    });
    ayar.appendChild(el('span', 'muted kucuk', 'Tempo'));
    ayar.appendChild(tempo);

    kutu.appendChild(chipler);
    kutu.appendChild(kart);
    kutu.appendChild(satir);
    kutu.appendChild(durum);
    kutu.appendChild(kontrol);
    kutu.appendChild(ayar);
    // Telefonun konuşma sesi kısa heceleri harf harf okuyor ("rö" → "R, Ö"); hecelerde sesli okuma yok
    if (!a.hece && Calis.modul.sesli !== false) kutu.appendChild(sesliEt);
    if (a.tanima) {
      var tSonuc = el('div', 'tanima-sonuc'); tSonuc.hidden = true;
      kutu.insertBefore(tanimaDugmesi('Söyle, kontrol edeyim', function () { return dizi().ogeler[Calis.kart]; },
        function (h, d) { var r = sozcukDegerlendir(h, d); if (d && d.length && d[0]) zorIsle(trKucuk(h), r.dogru); return r; }, tSonuc), kontrol);
      kutu.insertBefore(tSonuc, kontrol);
    }

    function dizi() { return a.diziler[Calis.dizi]; }
    function chipCiz() {
      chipler.textContent = '';
      a.diziler.forEach(function (d, i) {
        var b = el('button', null, d.ad); b.type = 'button';
        b.setAttribute('aria-pressed', String(i === Calis.dizi));
        b.addEventListener('click', function () { otoDurdur(); Calis.dizi = i; Calis.kart = 0; chipCiz(); goster1(false); });
        chipler.appendChild(b);
      });
    }
    function goster1(soyle) {
      var d = dizi();
      var ts = kutu.querySelector('.tanima-sonuc'); if (ts) ts.hidden = true;
      kart.textContent = d.ogeler[Calis.kart];
      kart.classList.remove('vurus'); void kart.offsetWidth; kart.classList.add('vurus');
      satir.textContent = '';
      d.ogeler.forEach(function (o, i) {
        var s = el('span', i === Calis.kart ? 'simdi' : (i < Calis.kart ? 'gecti' : null), o);
        s.addEventListener('click', function () { otoDurdur(); Calis.kart = i; goster1(Calis.sesli); });
        satir.appendChild(s);
      });
      durum.textContent = (Calis.kart + 1) + ' / ' + d.ogeler.length;
      if (soyle && Calis.sesli && !a.hece) calisSoyle(d.ogeler[Calis.kart]);
    }
    function adimAt(yon) {
      var d = dizi(), y = Calis.kart + yon;
      if (y >= d.ogeler.length) {
        if (Calis.dizi < a.diziler.length - 1) { Calis.dizi++; Calis.kart = 0; chipCiz(); }
        else { Calis.kart = d.ogeler.length - 1; otoDurdur(); durum.textContent = 'Bütün diziler bitti. Bir tur daha yap ya da sonraki adıma geç.'; return false; }
      } else if (y < 0) {
        if (Calis.dizi > 0) { Calis.dizi--; Calis.kart = dizi().ogeler.length - 1; chipCiz(); }
        else Calis.kart = 0;
      } else Calis.kart = y;
      goster1(true);
      return true;
    }
    function otoDurdur() { clearTimeout(Calis.zaman); Calis.zaman = null; Calis.oto = false; oto.textContent = '▶ Otomatik'; }
    function otoTik() {
      if (!Calis.oto) return;
      Calis.zaman = setTimeout(function () {
        if (adimAt(1)) otoTik();
      }, TEMPO[Calis.tempo] * (Calis.sesli && !a.hece ? 2 : 1));
    }
    oto.addEventListener('click', function () {
      if (Calis.oto) { otoDurdur(); return; }
      Calis.oto = true; oto.textContent = '❚❚ Durdur';
      ekraniAcikTut();
      goster1(true);
      otoTik();
    });
    geri.addEventListener('click', function () { otoDurdur(); adimAt(-1); });
    ileri.addEventListener('click', function () { otoDurdur(); adimAt(1); });
    kart.addEventListener('click', function () { otoDurdur(); adimAt(1); });
    chipCiz();
    goster1(false);
  }

  // ---------- Bugün kullanacağım gerçek cümle (rutinin son adımı) ----------
  var gercekOneriOnbellek = null;
  // Sınıf/veli/seminer metinlerinden kısa, tek cümlelik öneriler (işaretler temizlenir).
  function gercekOneriler() {
    var g = gunStr();
    if (gercekOneriOnbellek && gercekOneriOnbellek.gun === g) return gercekOneriOnbellek.liste;
    var adaylar = [];
    (window.METINLER || []).forEach(function (m) {
      if (m.kat !== 'veli' && m.kat !== 'ogretmen' && m.kat !== 'seminer') return;
      var t = (m.metin || '').replace(/[\/|*↗↘]/g, ' ').replace(/\s+/g, ' ').trim();
      var k = t.match(/^[^.?!]*[.?!]/);
      var c = (k ? k[0] : t).trim();
      if (c && c.length <= 160) adaylar.push(c);
    });
    gercekOneriOnbellek = { gun: g, liste: agirlikliSec(adaylar, 3) };
    return gercekOneriOnbellek.liste;
  }
  function gercekCiz(kutu, a) {
    Calis.sesli = false;
    var r = rutinVeri(), b = r.bugun, tarih = b.tarih;
    var onceki = r.gercek && r.gercek.tarih === tarih ? r.gercek.metin : '';
    var zaman = null;
    kutu.appendChild(el('p', 'calis-p', 'Bugün sınıfta ya da veli görüşmesinde gerçekten söyleyeceğin bir cümle yaz (örn. ders girişi, bir uyarı, bir teşekkür). Sonra söyleyerek çalışalım.'));
    var ta = document.createElement('textarea');
    ta.id = 'gercekMetin'; ta.rows = 3; ta.maxLength = 240;
    ta.placeholder = 'Bugün söyleyeceğim cümle…';
    ta.value = onceki;
    ta.className = 'gercek-metin';
    kutu.appendChild(ta);
    var chipKutu = el('div', 'soz-chipler gercek-oneri');
    kutu.appendChild(chipKutu);
    var kart = el('div', 'card passage'); kart.id = 'gercekKart';
    var yon = el('p', 'muted calis-p'); yon.id = 'gercekYonerge';
    kutu.appendChild(kart); kutu.appendChild(yon);

    function kaydetMetin() {
      clearTimeout(zaman); zaman = null;
      var m = ta.value.trim().slice(0, 240);
      if (m) {
        r.gercek = { tarih: tarih, metin: m };
        var l = (r.cumleler || []).filter(function (x) { return x !== m; });
        l.unshift(m);
        r.cumleler = l.slice(0, 10);
      } else if (r.gercek && r.gercek.tarih === tarih) {
        delete r.gercek; // bugün yazılan silindiyse "kullandın mı" sorusu çıkmasın
      }
      kaydet();
    }
    function metinGoster() {
      var m = ta.value.trim();
      kart.textContent = '';
      if (m) {
        kart.textContent = m; kart.hidden = false;
        yon.textContent = 'Önce iki kez yavaş, sonra bir kez doğal hızda oku. Sonra kırmızı düğmeyle kendini kaydet.';
      } else if (a.yedek) {
        kart.textContent = a.yedek; kart.hidden = false;
        yon.textContent = 'Bugün için kendi cümleni yazmadın; bu cümleyi oku ve kaydet.';
      } else { kart.hidden = true; yon.textContent = ''; }
    }
    ta.addEventListener('input', function () {
      metinGoster();
      clearTimeout(zaman); zaman = setTimeout(kaydetMetin, 700);
    });
    ta.addEventListener('blur', kaydetMetin);

    // Öneriler: dünkü cümle (varsa) + en fazla 3 hazır cümle; toplam en fazla 4
    var oneri = [];
    if (r.gercek && r.gercek.metin && r.gercek.tarih < tarih) oneri.push({ yazi: r.gercek.metin, dun: true });
    gercekOneriler().forEach(function (c) { if (oneri.length < 4) oneri.push({ yazi: c }); });
    oneri.forEach(function (o) {
      var c = el('button', 'soz-chip gercek-chip', (o.dun ? 'Dünkü cümlen: ' : '') + o.yazi); c.type = 'button';
      c.addEventListener('click', function () { ta.value = o.yazi; metinGoster(); kaydetMetin(); });
      chipKutu.appendChild(c);
    });
    metinGoster();
  }

  // ---------- Cümleler ----------
  function cumleCiz(kutu, a) {
    Calis.sesli = false;
    var liste = el('div', 'stack');
    liste.style.gap = '8px';
    a.cumleler.forEach(function (c, i) {
      var sar = el('div', 'stack'); sar.style.gap = '6px';
      var b = el('button', 'cumle-kart'); b.type = 'button';
      b.appendChild(el('span', 'no', String(i + 1)));
      b.appendChild(el('span', 'grow', c));
      b.addEventListener('click', function () {
        b.classList.toggle('okundu');
        if (Calis.sesli && Calis.modul.sesli !== false && b.classList.contains('okundu')) calisSoyle(c);
      });
      sar.appendChild(b);
      if (a.tanima) {
        var sonuc = el('div', 'tanima-sonuc'); sonuc.hidden = true;
        var tb = tanimaDugmesi('Söyle, kontrol edeyim', function () { return c; }, cumleDegerlendir, sonuc,
          function () { b.classList.add('okundu'); });
        tb.classList.add('kucuk-btn');
        sar.appendChild(tb);
        sar.appendChild(sonuc);
      }
      liste.appendChild(sar);
    });
    kutu.appendChild(liste);
    kutu.appendChild(el('div', 'muted kucuk', a.tanima
      ? 'Okuduğun cümleye dokunup işaretle. “Söyle, kontrol edeyim” düğmesiyle telefon ' + Calis.modul.tanima.harf + '’li sözcükleri doğru anlayıp anlamadığını söyler. Telefonun tanıması hızlı konuşmada ve tekerlemelerde yanılabilir; sonucu kesin değil, ipucu say.'
      : 'Okuduğun cümleye dokunup işaretle.'));
  }

  $('#calisGeri').addEventListener('click', calisKapat);
  $('#calisOnceki').addEventListener('click', function () { if (Calis.adim > 0) { Calis.adim--; adimCiz(); } });
  $('#calisSonraki').addEventListener('click', function () {
    var m = Calis.modul;
    if (m.rutin) { rutinSureTik(); veri.rutin.bugun.tamam[Calis.adim] = true; kaydet(); }
    if (Calis.adim < m.adimlar.length - 1) { Calis.adim++; adimCiz(); return; }
    if (m.rutin) { rutinBitir(); return; }
    gunuIsaretle('calis');
    uyariGoster('Tebrikler, ' + m.ad + ' çalışmasını bitirdin! Kaydını ilk kaydınla karşılaştırmayı unutma.');
    calisKapat();
  });

  // ---------- Mini kayıt (her çalışmada) ----------
  var MK = { aktif: false, rec: null, stream: null, parcalar: [], bas: 0, saat: null, urller: [], sonKayit: null, calar: null };
  function mkUrl(blob) { var u = URL.createObjectURL(blob); MK.urller.push(u); return u; }
  function mkKayitlari() {
    var id = Calis.modul.id;
    return Depo.hepsi().then(function (l) {
      return l.filter(function (k) { return k.calis === id && k.ses; })
        .sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; });
    });
  }
  function mkHazirla() {
    mkDurdur();
    MK.urller.forEach(function (u) { URL.revokeObjectURL(u); }); MK.urller = [];
    MK.sonKayit = null;
    $('#mkSonKutu').hidden = true; $('#mkOz').hidden = true;
    $('#mkListe').hidden = true;
    $('#mkDurum').textContent = 'Kırmızı düğmeye bas, söyle, tekrar bas.';
    mkListeYenile();
  }
  function mkListeYenile() {
    var id = Calis.modul.id;
    mkKayitlari().then(function (l) {
      if (!Calis.modul || Calis.modul.id !== id) return;
      var ilkK = $('#mkIlkKutu'), lb = $('#mkListeBtn');
      if (l.length > 1 || (l.length === 1 && !MK.sonKayit)) {
        var ilk = l[0];
        $('#mkIlk').src = mkUrl(new Blob([ilk.ses], { type: ilk.mime }));
        $('#mkIlkYazi').textContent = 'İlk kaydın · ' + tarihYaz(ilk.tarih);
        ilkK.hidden = false;
      } else ilkK.hidden = true;
      lb.hidden = !l.length;
      lb.textContent = ($('#mkListe').hidden ? 'Kayıtlarımı göster' : 'Kayıtlarımı gizle') + ' (' + l.length + ')';
      mkListeCiz(l);
    }).catch(function () { /* depo yok */ });
  }
  function mkListeCiz(l) {
    var kutu = $('#mkListe');
    kutu.textContent = '';
    l.slice().reverse().forEach(function (k) {
      var satir = el('div', 'mk-kayit');
      var cal = el('button', 'iconbtn', '▶'); cal.type = 'button';
      cal.setAttribute('aria-label', 'Dinle');
      cal.addEventListener('click', function () {
        if (!MK.calar) MK.calar = new Audio();
        if (MK.calar._id === k.id && !MK.calar.paused) { MK.calar.pause(); return; }
        mkDurdur();
        if (MK.calar._url) URL.revokeObjectURL(MK.calar._url);
        MK.calar._url = URL.createObjectURL(new Blob([k.ses], { type: k.mime }));
        MK.calar._id = k.id;
        MK.calar.src = MK.calar._url;
        var p = MK.calar.play(); if (p && p.catch) p.catch(function () {});
      });
      var bilgi = el('div', 'grow');
      bilgi.appendChild(el('div', 't', (k.baslik || '').replace(Calis.modul.ad + ' · ', '')));
      bilgi.appendChild(el('div', 'muted kucuk', tarihYaz(k.tarih) + ' · ' + sure(k.sure)));
      var sil = el('button', 'secondary kucuk-btn danger', 'Sil'); sil.type = 'button';
      sil.addEventListener('click', function () {
        if (sil.getAttribute('data-onay') !== '1') {
          sil.setAttribute('data-onay', '1'); sil.textContent = 'Emin misin?';
          setTimeout(function () { sil.removeAttribute('data-onay'); sil.textContent = 'Sil'; }, 4000);
          return;
        }
        if (MK.sonKayit && MK.sonKayit.id === k.id) { MK.sonKayit = null; $('#mkSonKutu').hidden = true; $('#mkOz').hidden = true; }
        Depo.sil(k.id).then(mkListeYenile);
      });
      var ind = el('button', 'secondary kucuk-btn', 'İndir'); ind.type = 'button';
      ind.addEventListener('click', function () { sesIndir(k); });
      satir.appendChild(cal); satir.appendChild(bilgi); satir.appendChild(ind); satir.appendChild(sil);
      kutu.appendChild(satir);
    });
    if (l.length > 1) {
      var hep = el('button', 'secondary kucuk-btn danger', 'Bu çalışmanın bütün kayıtlarını sil'); hep.type = 'button';
      hep.addEventListener('click', function () {
        if (hep.getAttribute('data-onay') !== '1') {
          hep.setAttribute('data-onay', '1'); hep.textContent = 'Emin misin? ' + l.length + ' kayıt silinecek';
          setTimeout(function () { hep.removeAttribute('data-onay'); hep.textContent = 'Bu çalışmanın bütün kayıtlarını sil'; }, 4000);
          return;
        }
        mkDurdur();
        Promise.all(l.map(function (k) { return Depo.sil(k.id); })).then(function () {
          MK.sonKayit = null;
          $('#mkSonKutu').hidden = true; $('#mkOz').hidden = true; $('#mkListe').hidden = true;
          mkListeYenile();
        });
      });
      kutu.appendChild(hep);
    }
  }
  $('#mkListeBtn').addEventListener('click', function () {
    var k = $('#mkListe'); k.hidden = !k.hidden;
    mkListeYenile();
  });
  function mkDurdur() {
    if (MK.aktif && MK.rec) { try { MK.rec.stop(); } catch (e) { /* yok */ } }
    ['#mkSon', '#mkIlk'].forEach(function (s) { try { $(s).pause(); } catch (e) { /* yok */ } });
    if (MK.calar) { try { MK.calar.pause(); } catch (e) { /* yok */ } }
  }
  // Kayıttan sonra kendi kulağınla değerlendirme
  function ozKontrolCiz(kayit) {
    var kutu = $('#mkOz'), liste = Calis.modul.ozKontrol;
    kutu.textContent = '';
    if (!liste) { kutu.hidden = true; return; }
    kutu.appendChild(el('b', null, 'Kaydını dinle, sonra kendine sor:'));
    var secim = {};
    liste.forEach(function (o) {
      var l = el('label', 'check');
      var c = document.createElement('input'); c.type = 'checkbox';
      c.addEventListener('change', function () { secim[o.id] = c.checked; });
      l.appendChild(c); l.appendChild(document.createTextNode(' ' + o.yazi));
      kutu.appendChild(l);
    });
    var b = el('button', 'primary', 'Değerlendir'); b.type = 'button';
    var sonuc = el('div', 'stack'); sonuc.style.gap = '8px';
    b.addEventListener('click', function () {
      var secilen = liste.filter(function (o) { return secim[o.id]; });
      sonuc.textContent = '';
      if (!secilen.length) { sonuc.appendChild(el('div', 'muted kucuk', 'Önce en az bir seçeneği işaretle.')); return; }
      var v = veriCalis();
      secilen.forEach(function (o) {
        v.oz[o.id] = (v.oz[o.id] || 0) + 1;
        var t = el('div', 'tavsiye ' + (o.iyi ? 'iyi' : ''));
        t.appendChild(el('b', null, o.yazi + ': '));
        t.appendChild(document.createTextNode(o.tavsiye));
        if (o.adim != null && o.adim !== Calis.adim) {
          var git = el('button', 'secondary kucuk-btn', (o.adim + 1) + '. adıma git'); git.type = 'button';
          git.addEventListener('click', function () { Calis.adim = o.adim; adimCiz(); });
          t.appendChild(git);
        }
        sonuc.appendChild(t);
      });
      kaydet();
      kayit.oz = secilen.map(function (o) { return o.id; });
      if (kayit.ses) Depo.ekle(kayit).catch(kayitYazilamadi);
      b.disabled = true; b.textContent = 'Değerlendirildi';
    });
    kutu.appendChild(b);
    kutu.appendChild(sonuc);
    kutu.hidden = false;
  }
  function mkBitti() {
    clearInterval(MK.saat);
    MK.aktif = false;
    $('#mkBtn').classList.remove('on');
    $('#mkBtn').setAttribute('aria-label', 'Kaydı başlat');
    akisiKapat(MK.stream);
    var sure = (Date.now() - MK.bas) / 1000;
    if (!MK.parcalar.length || sure < 0.7) { $('#mkDurum').textContent = 'Kayıt çok kısa oldu, tekrar dene.'; return; }
    var mime = (MK.rec && MK.rec.mimeType) || MK.parcalar[0].type || 'audio/mp4';
    var blob = new Blob(MK.parcalar, { type: mime });
    var m = Calis.modul, a = m.adimlar[Calis.adim];
    $('#mkSon').src = mkUrl(blob);
    $('#mkSonKutu').hidden = false;
    $('#mkDurum').textContent = 'Kaydedildi · ' + sure.toFixed(0) + ' sn.';
    var kayit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      tarih: new Date().toISOString(), baslik: m.ad + ' · ' + a.baslik, kat: 'calis', calis: m.id,
      mime: mime, sure: sure, hiz: null
    };
    MK.sonKayit = kayit;
    ozKontrolCiz(kayit);
    blob.arrayBuffer().then(function (buf) { kayit.ses = buf; return Depo.ekle(kayit); }).then(mkListeYenile).catch(kayitYazilamadi);
  }
  $('#mkBtn').addEventListener('click', function () {
    if (MK.aktif) { mkDurdur(); return; }
    if (!window.MediaRecorder) { uyariGoster('Bu tarayıcı ses kaydını desteklemiyor.'); return; }
    calisDurdur();
    mkDurdur();
    Ses.mikrofon().then(function (stream) {
      var tur = uygunTur(), rec;
      try { rec = tur ? new MediaRecorder(stream, { mimeType: tur }) : new MediaRecorder(stream); }
      catch (e) { rec = new MediaRecorder(stream); }
      MK.stream = stream; MK.rec = rec; MK.parcalar = []; MK.bas = Date.now(); MK.aktif = true;
      rec.ondataavailable = function (e) { if (e.data && e.data.size) MK.parcalar.push(e.data); };
      rec.onstop = mkBitti;
      rec.start();
      $('#mkOz').hidden = true;
      $('#mkBtn').classList.add('on');
      $('#mkBtn').setAttribute('aria-label', 'Kaydı bitir');
      MK.saat = setInterval(function () { $('#mkDurum').textContent = 'Kaydediliyor · ' + sure((Date.now() - MK.bas) / 1000); }, 250);
      $('#mkDurum').textContent = 'Kaydediliyor · 0:00';
    }).catch(mikrofonHatasi);
  });
  calisListeCiz();
  rutinKartlariCiz();

  // ================= Dersler =================
  $$('[data-ders]').forEach(function (b) {
    b.addEventListener('click', function () {
      var h = document.getElementById(b.getAttribute('data-ders'));
      if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Doğru mu, yanlış mı? testi: [gösterilen, doğru mu, açıklama]
  var SORULAR = [
    ['resmi: (son hece uzun)', true, '-î ile biten sözcüklerde son hece uzun söylenir.'],
    ['ha:kem', false, 'Doğrusu: hakem. Hiçbir hece uzamaz.'],
    ['civa:rı', true, 'Civar ek alınca va hecesi uzar.'],
    ['aza:metli', false, 'Doğrusu: azametli. Uzatma yok.'],
    ['mütevazi (alçak gönüllü)', false, 'Doğrusu: mütevazı. Mütevazi “paralel” demektir.'],
    ['ilha:mım', true, 'İlham ek alınca ha hecesi uzar.'],
    ['sürpiriz', false, 'Doğrusu: sürpriz. İki ünsüz arasına ünlü girmez.'],
    ['tahmi:ni:', true, 'Tahminî sözcüğünde iki î de uzundur.'],
    ['ra:kip', false, 'Doğrusu: rakip. Ek alınca raki:bi olur.'],
    ['“Bu işi yapmak durumundayız.”', false, 'Doğrusu: “Bu işi yapmak zorundayız.”'],
    ['şa:ha:ne', true, 'Şahane sözcüğünde iki a da uzundur.'],
    ['meşa:le', false, 'Doğrusu: meş’ale. Uzatma yok, kısa bir kesinti var.'],
    ['hükû:met', true, 'Hükûmet sözcüğünde ku hecesi uzundur.'],
    ['ha:yır', false, 'Doğrusu: hayır. Ha hecesi uzamaz.'],
    ['tırafo', false, 'Doğrusu: trafo. Araya ı sokulmaz.'],
    ['milli: bayram', true, 'Millî sözcüğünde son hece uzundur.'],
    ['“Korkarım müdür bey bugün gelemeyecek.”', false, 'Doğrusu: “Maalesef müdür bey bugün gelemeyecek.”'],
    ['tarafta:rı', true, 'Taraftar ek alınca üçüncü a uzar.']
  ];
  var Test = { sira: [], i: 0, dogru: 0, cevaplandi: false };
  function testKaristir() {
    Test.sira = SORULAR.map(function (x, i) { return i; });
    for (var k = Test.sira.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1)), t = Test.sira[k];
      Test.sira[k] = Test.sira[j]; Test.sira[j] = t;
    }
    Test.i = 0; Test.dogru = 0;
  }
  function testSoruCiz() {
    if (Test.i >= Test.sira.length) testKaristir();
    var q = SORULAR[Test.sira[Test.i]];
    Test.cevaplandi = false;
    $('#testSoru').textContent = q[0];
    $('#testSkor').textContent = (Test.i + 1) + ' / ' + Test.sira.length + ' · ' + Test.dogru + ' doğru';
    $('#testSonuc').hidden = true;
    $('#testSonraki').hidden = true;
    $('#testDogru').disabled = false; $('#testYanlis').disabled = false;
  }
  function testCevap(dedi) {
    if (Test.cevaplandi) return;
    Test.cevaplandi = true;
    var q = SORULAR[Test.sira[Test.i]];
    var bildi = dedi === q[1];
    if (bildi) Test.dogru++;
    var kutu = $('#testSonuc');
    kutu.textContent = '';
    kutu.className = 'test-sonuc ' + (bildi ? 'iyi' : 'kotu');
    kutu.appendChild(el('b', null, bildi ? 'Bildin! ' : 'Olmadı. '));
    kutu.appendChild(document.createTextNode(q[2]));
    kutu.hidden = false;
    $('#testDogru').disabled = true; $('#testYanlis').disabled = true;
    $('#testSkor').textContent = (Test.i + 1) + ' / ' + Test.sira.length + ' · ' + Test.dogru + ' doğru';
    var son = Test.i === Test.sira.length - 1;
    $('#testSonraki').textContent = son ? 'Baştan başla (' + Test.dogru + ' / ' + Test.sira.length + ')' : 'Sonraki soru';
    $('#testSonraki').hidden = false;
  }
  $('#testDogru').addEventListener('click', function () { testCevap(true); });
  $('#testYanlis').addEventListener('click', function () { testCevap(false); });
  $('#testSonraki').addEventListener('click', function () {
    Test.i++;
    if (Test.i >= Test.sira.length) testKaristir();
    testSoruCiz();
  });
  testKaristir();
  testSoruCiz();

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
    rutinKartlariCiz();
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
    yedekNotCiz();
  }
  // Bugün ekranında soluk tek satır: yedek yoksa ya da eskiyse (uyarı penceresi yok)
  function yedekNotCiz() {
    var n = $('#yedekNot');
    if (!n) return;
    var gun = Object.keys(veri.gunler).length, m = '';
    var son = veri.ayarlar.sonYedek, fark = null;
    if (son) { var t = new Date(son).getTime(); if (!isNaN(t)) fark = Math.floor((Date.now() - t) / 864e5); }
    if (fark === null) m = 'Henüz yedek almadın.';
    else if (fark > 14) m = 'Son yedek ' + fark + ' gün önce.';
    if (m && gun > 5) { n.textContent = m + ' Gelişim > Ayarlar ve veri.'; n.hidden = false; }
    else { n.textContent = ''; n.hidden = true; }
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
    tut: { ad: 'Tut', soz: 'Nefesi tut', zil: 659, olcek: 1 },
    ver: { ad: 'Yavaşça ver', soz: 'Yavaşça ver', zil: 440, olcek: 0.62 }
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
      durum = 'g'; mesaj = 'İyi görünüyor: tam süre ve dengeli (telefonun tahmini).';
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
      $('#turYazi').textContent = n.olcer ? 'Egzersiz tamamlandı.' : 'Egzersiz tamamlandı (ölçümsüz: mikrofon kapalıydı).';
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
    var ky = $('#katYonerge'), kb = katBul(kat);
    ky.textContent = '';
    if (kb && kb.yonerge) {
      ky.appendChild(el('b', null, 'Nasıl çalışılır'));
      var ul = el('ul', 'calis-ul');
      kb.yonerge.forEach(function (y) { ul.appendChild(el('li', null, y)); });
      ky.appendChild(ul);
    }
    ky.hidden = !(kb && kb.yonerge);
    metinCiz(m);
    $('#sonuc').hidden = true;
    $('#kayitci').hidden = false;
    oynatmayiDurdur();
  }
  // İşaretli metni (/ | || ton *vurgu*) verilen alana çizer; kelime ve işaret sayısını döndürür
  function isaretliYaz(alan, metin) {
    alan.textContent = '';
    var kelime = 0, isaret = 0, vurguAcik = false;
    metin.split('\n').forEach(function (satir, si) {
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
    return { kelime: kelime, isaret: isaret };
  }
  // Şiirin künye satırı: şiire özel not varsa onu, yoksa grubun adını döndürür
  function kunyeYazi(id) {
    var k = window.KUNYE;
    if (!k) return '';
    if (k.notlar && k.notlar[id]) return k.notlar[id];
    var g = (k.gruplar || []).filter(function (x) { return x.ids.indexOf(id) >= 0; })[0];
    return g ? g.ad : '';
  }
  // Gelişim sekmesi: "Kaynaklar ve izinler" bölümünü doldurur
  function kaynakCiz() {
    var kutu = $('#kaynakIcerik');
    var k = window.KUNYE;
    if (!kutu || !k) return;
    kutu.textContent = '';
    var baslik = function (id) {
      var m = window.METINLER.filter(function (x) { return x.id === id; })[0];
      return m ? m.baslik : id;
    };
    (k.gruplar || []).forEach(function (g) {
      kutu.appendChild(el('b', null, g.ad));
      if (g.not) kutu.appendChild(el('p', 'muted kucuk', g.not));
      kutu.appendChild(el('p', 'muted kucuk', g.ids.map(baslik).join('; ')));
    });
    var idler = Object.keys(k.notlar || {});
    if (idler.length) {
      kutu.appendChild(el('b', null, 'Metne özel notlar'));
      idler.forEach(function (id) {
        kutu.appendChild(el('p', 'muted kucuk', baslik(id) + ': ' + k.notlar[id]));
      });
    }
    kutu.appendChild(el('p', 'muted kucuk', 'Bu bölüm hukuki görüş değildir; izin durumu kullanıcı beyanına dayanır.'));
  }
  // Gelişim sekmesi: sayfa sürümü ve önbellek sürümü satırı
  function surumCiz() {
    var kutu = $('#surumSatiri');
    if (!kutu) return;
    var sayfa = null;
    try {
      var s = document.querySelector('script[src*="app.js"]');
      var e = s && /[?&]v=(\d+)/.exec(s.getAttribute('src') || '');
      if (e) sayfa = parseInt(e[1], 10);
    } catch (x) { /* yok */ }
    var yaz = function (onb) {
      var t = 'Sürüm ' + (sayfa === null ? '?' : sayfa);
      if (onb !== null && onb !== undefined) {
        t += ' · önbellek: v' + onb;
        if (sayfa !== null && onb !== sayfa) t += '. Eski dosya açık olabilir; uygulamayı kapatıp yeniden aç.';
      }
      kutu.textContent = t;
    };
    yaz(null);
    try {
      if (window.caches && caches.keys) {
        caches.keys().then(function (adlar) {
          var v = adlar.filter(function (a) { return a.indexOf('diksiyon-v') === 0; })
            .map(function (a) { return parseInt(a.slice(10), 10); })
            .filter(function (n) { return !isNaN(n); });
          if (v.length) yaz(Math.max.apply(null, v));
        }).catch(function () { /* sadece sayfa sürümü */ });
      }
    } catch (x) { /* yok */ }
  }
  // İşaretli metni ekrana çizer; kelime ve işaret sayısını döndürür
  function metinCiz(m) {
    var kat = katBul(m.kat);
    $('#metinBaslik').textContent = m.baslik;
    $('#metinHedef').textContent = kat.ad + (kat.hedef ? ' · hedef hız ' + kat.hedef[0] + '–' + kat.hedef[1] + ' kelime/dk' : ' · önce yavaş, sonra hızlan');
    var kn = $('#metinKunye');
    if (kn) {
      var yazi = m.kat === 'siir' ? kunyeYazi(m.id) : '';
      kn.textContent = yazi;
      kn.hidden = !yazi;
    }
    var alan = $('#metinAlan');
    var say = isaretliYaz(alan, m.metin);
    var kelime = say.kelime, isaret = say.isaret;
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
    }).catch(kayitYazilamadi);
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
    ayarKartiCiz();
    kayitListesiCiz();
    kaynakCiz();
    surumCiz();
  }
  // ---------- Ayarlar ve veri: yedek, tanıma izni, depolama ----------
  var sesListesiOnbellek = null;
  // Yedeğe yalnızca ses kaydının künyesi girer (ses dosyasının kendisi girmez)
  function sesListesi(liste) {
    return liste.map(function (k) {
      return { id: k.id, tarih: k.tarih, baslik: k.baslik, sure: k.sure, mime: k.mime, boyut: k.ses && k.ses.byteLength ? k.ses.byteLength : 0 };
    });
  }
  function dosyaAdiTemizle(s) {
    s = String(s || 'kayit').replace(/[\\\/:*?"<>|\s]+/g, '-').replace(/^-+|-+$/g, '');
    return s.slice(0, 60) || 'kayit';
  }
  function sesUzanti(mime) {
    mime = String(mime || '').toLowerCase();
    if (mime.indexOf('webm') >= 0) return 'webm';
    if (mime.indexOf('ogg') >= 0) return 'ogg';
    if (mime.indexOf('mp4') >= 0 || mime.indexOf('m4a') >= 0 || mime.indexOf('aac') >= 0) return 'm4a';
    return 'm4a';
  }
  function sesIndir(k) {
    if (!k.ses) { uyariGoster('Bu kaydın ses dosyası yok.'); return; }
    var ad = dosyaAdiTemizle(k.baslik) + '-' + String(k.tarih || '').slice(0, 10) + '.' + sesUzanti(k.mime);
    dosyaIndir(ad, new Blob([k.ses], { type: k.mime || 'audio/mp4' }));
  }
  var yedekAlan = null;
  // Önce paylaş (telefonlarda dosyaya kaydetme/Drive seçeneği), olmazsa a[download], o da olmazsa metni göster.
  // tamam: indirme/paylaşma başarılı olunca çağrılır. metin: yalnızca JSON yedeği için son çare gösterimi.
  function dosyaIndir(ad, blob, tamam, metin) {
    var dosya = null;
    try { dosya = new File([blob], ad, { type: blob.type }); } catch (e) { dosya = null; }
    function anchor() {
      try {
        var a = document.createElement('a');
        if (!('download' in a) || !window.URL || !URL.createObjectURL) throw new Error('yok');
        var u = URL.createObjectURL(blob);
        a.href = u; a.download = ad; a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(u); }, 4000);
        if (tamam) tamam();
      } catch (e) {
        if (metin != null) metinGoster(metin, tamam);
        else uyariGoster('Bu tarayıcı dosya indirmeyi desteklemiyor.');
      }
    }
    var paylasilabilir = false;
    try { paylasilabilir = !!(dosya && navigator.canShare && navigator.share && navigator.canShare({ files: [dosya] })); } catch (e) { paylasilabilir = false; }
    if (paylasilabilir) {
      try {
        navigator.share({ files: [dosya] }).then(function () { if (tamam) tamam(); }).catch(function (e) {
          if (e && e.name === 'AbortError') return;  // kullanıcı vazgeçti
          anchor();
        });
        return;
      } catch (e) { /* aşağıda anchor */ }
    }
    anchor();
  }
  function metinGoster(metin, tamam) {
    var kutu = $('#ayarKart');
    if (!kutu) return;
    var eski = $('#yedekMetin'); if (eski) eski.parentNode.removeChild(eski);
    var w = el('div', 'stack'); w.id = 'yedekMetin'; w.style.gap = '8px';
    w.appendChild(el('div', 'muted kucuk', 'Dosya indirilemedi. Aşağıdaki metni kopyalayıp bir yere (ör. notlar) yapıştır.'));
    var ta = document.createElement('textarea');
    ta.readOnly = true; ta.value = metin; ta.rows = 6; ta.style.width = '100%';
    w.appendChild(ta);
    var kop = el('button', 'secondary kucuk-btn', 'Kopyala'); kop.type = 'button';
    kop.addEventListener('click', function () {
      ta.focus(); ta.select();
      var tmm = false;
      try { tmm = document.execCommand('copy'); } catch (e) { tmm = false; }
      if (!tmm && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(function () { uyariGoster('Kopyalandı.'); }).catch(function () {});
      } else uyariGoster(tmm ? 'Kopyalandı.' : 'Metni elle seçip kopyala.');
      if (tamam) { var t = tamam; tamam = null; t(); }
    });
    w.appendChild(kop);
    kutu.appendChild(w);
  }
  function yedekHazirla() {
    return {
      uygulama: 'diksiyon-kocu', yedekSurum: 1, tarih: new Date().toISOString(), veriSurum: VERI_SURUM,
      veri: veri, sesler: sesListesiOnbellek || []
    };
  }
  function yedekIndir() {
    var yedek = yedekHazirla();
    var metin = JSON.stringify(yedek);
    var blob = new Blob([metin], { type: 'application/json' });
    dosyaIndir('diksiyon-yedek-' + gunStr() + '.json', blob, function () {
      veri.ayarlar.sonYedek = new Date().toISOString();
      kaydet();
      ayarKartiCiz();
    }, metin);
  }
  function yedekYukle(dosya) {
    var fr = new FileReader();
    fr.onerror = function () { uyariGoster('Dosya okunamadı. Veri değişmedi.'); };
    fr.onload = function () {
      var y = null;
      try { y = JSON.parse(String(fr.result)); } catch (e) { y = null; }
      if (!nesneMi(y) || y.uygulama !== 'diksiyon-kocu' || !nesneMi(y.veri) || !Array.isArray(y.veri.olcumler)) {
        uyariGoster('Bu dosya bir Diksiyon Koçu yedeği değil. Veri değişmedi.', true);
        return;
      }
      var yv = migrasyon(y.veri);
      var tarih = '';
      try { tarih = new Date(y.tarih).toLocaleDateString('tr-TR'); } catch (e) { tarih = ''; }
      var gunSayi = Object.keys(yv.gunler).length;
      var onay = window.confirm('Yedek ' + (tarih && tarih !== 'Invalid Date' ? tarih : '(tarihsiz)') + ': ' + yv.olcumler.length + ' ölçüm, ' +
        yv.nefesler.length + ' nefes, ' + gunSayi + ' gün. Telefondaki mevcut veri bunun yerine geçsin mi? (Ses kayıtların silinmez.)');
      if (!onay) return;
      // Önce mevcut ham veriyi ayrı anahtara kopyala
      try {
        var onceki = localStorage.getItem(ANAHTAR);
        if (onceki === null) onceki = JSON.stringify(veri);
        localStorage.setItem('dk.v1.onceki', onceki);
      } catch (e) {
        uyariGoster('Mevcut verin ayrıca saklanamadığı için yedek yüklenmedi (yer dolmuş olabilir). Veri değişmedi.', true);
        return;
      }
      Object.keys(veri).forEach(function (a) { delete veri[a]; });
      Object.assign(veri, bosVeri(), yv);
      veri.ayarlar = Object.assign(bosVeri().ayarlar, yv.ayarlar);
      if (!kaydet()) return;
      try { location.reload(); } catch (e) { /* yok */ }
    };
    fr.readAsText(dosya);
  }
  function depoSatiriYaz() {
    var s = $('#depoSatiri');
    if (!s) return;
    var parca = [];
    if (Saglik.kalici === true) parca.push('Depolama: kalıcı ✓');
    else if (Saglik.kalici === false) parca.push('Depolama: kalıcı değil. Tarayıcı uzun süre açılmayan siteleri silebilir; ana ekrana ekle ve yedek al.');
    if (Saglik.kullanilan != null) parca.push('Kullanılan: ' + (Saglik.kullanilan / 1048576).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + ' MB');
    if (Saglik.kayitHata) parca.push('Son kayıt hatası: ' + Saglik.kayitHata);
    s.textContent = parca.join(' · ');
    s.hidden = !parca.length;
  }
  function ayarKartiCiz() {
    var kart = $('#ayarKart');
    if (!kart) return;
    kart.textContent = '';
    kart.appendChild(el('b', null, 'Ayarlar ve veri'));
    var satir = el('div', 'stack'); satir.style.gap = '8px';
    var ind = el('button', 'secondary kucuk-btn', 'Yedeği indir'); ind.type = 'button';
    ind.addEventListener('click', yedekIndir);
    var yuk = el('button', 'secondary kucuk-btn', 'Yedek yükle'); yuk.type = 'button';
    var gir = document.createElement('input');
    gir.type = 'file'; gir.accept = '.json,application/json'; gir.hidden = true;
    gir.addEventListener('change', function () {
      var d = gir.files && gir.files[0];
      gir.value = '';
      if (d) yedekYukle(d);
    });
    yuk.addEventListener('click', function () { gir.click(); });
    satir.appendChild(ind); satir.appendChild(yuk); satir.appendChild(gir);
    kart.appendChild(satir);
    var son = veri.ayarlar.sonYedek, sonYazi = 'Henüz yedek almadın.';
    if (son) {
      try { sonYazi = new Date(son).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { sonYazi = String(son); }
    }
    kart.appendChild(el('div', 'muted kucuk', 'Son yedek: ' + sonYazi));
    kart.appendChild(el('div', 'muted kucuk', 'Yedeğe ölçümler, günler ve ayarlar girer. Ses kayıtlarının yalnızca listesi girer; sesleri kayıt listesindeki “İndir” ile ayrı kaydedebilirsin.'));
    var et = el('label', 'check');
    var c = document.createElement('input'); c.type = 'checkbox';
    c.checked = tanimaAcik();
    c.addEventListener('change', function () {
      if (c.checked) { if (!tanimaIzni()) c.checked = false; }
      else { veri.ayarlar.tanima = false; kaydet(); }
    });
    et.appendChild(c);
    et.appendChild(document.createTextNode(' Konuşma tanımayı kullan (Söyle, kontrol edeyim)'));
    kart.appendChild(et);
    kart.appendChild(el('div', 'muted kucuk', 'Kapatırsan açana kadar tanıma kullanılmaz.'));
    var ds = el('div', 'muted kucuk'); ds.id = 'depoSatiri'; ds.hidden = true;
    kart.appendChild(ds);
    depoSatiriYaz();
    // Yedekteki ses listesi için kayıt künyelerini önceden hazırla (indirme dokunma olayında beklemesin)
    Depo.hepsi().then(function (l) { sesListesiOnbellek = sesListesi(l); }).catch(function () {});
  }
  function kayitListesiCiz() {
    var kutu = $('#kayitListe');
    Depo.hepsi().then(function (liste) {
      sesListesiOnbellek = sesListesi(liste);
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
        bilgi.appendChild(el('div', 's', tarihYaz(k.tarih) + ' · ' + sure(k.sure) + (k.hiz ? ' · ' + k.hiz + ' k/dk' : '') + (kat ? ' · ' + kat.ad : (k.kat === 'calis' ? ' · Çalış' : ''))));
        c.appendChild(bilgi);
        var ind = el('button', 'secondary kucuk-btn', 'İndir');
        ind.type = 'button';
        ind.addEventListener('click', function () { sesIndir(k); });
        c.appendChild(ind);
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
  if (Saglik.bozuk) {
    uyariGoster('Kayıtlı verin okunamadı. Bir kopyası ayrı saklandı. Yedeğin varsa Gelişim > Ayarlar ve veri’den yükleyebilirsin.', true);
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  // Kendini güncelleme: açılışta ve uygulamaya dönünce yeni sürüm var mı diye bakar (kısayoldan açılan eski kopya kalmasın).
  function surumKontrol() {
    var el0 = document.querySelector('script[src^="app.js"]');
    var calisan = el0 && /[?&]v=(\d+)/.exec(el0.getAttribute('src'));
    if (!calisan || !window.fetch) return;
    fetch('index.html?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
      var yeni = /app\.js\?v=(\d+)/.exec(t);
      if (!yeni || yeni[1] === calisan[1]) return;
      if (Kayit.aktif || Calis.tutCalisiyor || nefes || MK.aktif) return; // çalışırken yenileme
      var bayrak = 'diksiyonYenile' + yeni[1];
      try { if (sessionStorage.getItem(bayrak)) return; sessionStorage.setItem(bayrak, '1'); } catch (e) { /* yok say */ }
      var ekle = navigator.serviceWorker && navigator.serviceWorker.getRegistration ? navigator.serviceWorker.getRegistration() : Promise.resolve(null);
      ekle.then(function (reg) { return reg && reg.update ? reg.update() : null; }).catch(function () {}).then(function () { location.reload(); });
    }).catch(function () { /* çevrimdışı: sorun değil */ });
  }
  window.addEventListener('load', function () { setTimeout(surumKontrol, 1500); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) surumKontrol(); });
})();
