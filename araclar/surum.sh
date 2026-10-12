#!/bin/sh
# Sürüm aracı: index.html'deki ?v=N ve sw.js'deki diksiyon-vN değerlerini listeler/eşitler.
# Kullanım:  sh araclar/surum.sh        -> listele ve tutarlılığı kontrol et (tutarsızsa çıkış 1)
#            sh araclar/surum.sh 23     -> hepsini 23 yap, sonra kontrol et
# Dikkat: Bu dosya sw.js önbellek listesinde değildir (çevrimdışı gerekmez).
KOK=$(cd "$(dirname "$0")/.." && pwd)
HTML="$KOK/index.html"
SW="$KOK/sw.js"

if [ -n "$1" ]; then
  case "$1" in
    *[!0-9]*) echo "Hata: sürüm sayı olmalı (ör. 23)"; exit 2 ;;
  esac
  N="$1"
  # sed -i yerine geçici dosya + mv
  sed "s/?v=[0-9][0-9]*/?v=$N/g" "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML" || exit 2
  sed "s/diksiyon-v[0-9][0-9]*/diksiyon-v$N/g" "$SW" > "$SW.tmp" && mv "$SW.tmp" "$SW" || exit 2
fi

echo "index.html:"
grep -o '[A-Za-z0-9_.]*?v=[0-9][0-9]*' "$HTML" | sed 's/^/  /'
echo "sw.js:"
grep -o "diksiyon-v[0-9][0-9]*" "$SW" | sed 's/^/  /'

SAYILAR=$( { grep -o '?v=[0-9][0-9]*' "$HTML" | sed 's/^?v=//'; grep -o 'diksiyon-v[0-9][0-9]*' "$SW" | sed 's/^diksiyon-v//'; } | sort -u )
BENZERSIZ=$(printf '%s\n' "$SAYILAR" | grep -c .)
VSAYI=$(grep -o '?v=[0-9][0-9]*' "$HTML" | grep -c .)
SWSAYI=$(grep -o 'diksiyon-v[0-9][0-9]*' "$SW" | grep -c .)

DURUM=0
if [ "$BENZERSIZ" -ne 1 ]; then echo "TUTARSIZ: farklı sürüm numaraları var"; DURUM=1; fi
if [ "$VSAYI" -ne 4 ]; then echo "TUTARSIZ: ?v= sayısı $VSAYI (4 olmalı)"; DURUM=1; fi
if [ "$SWSAYI" -ne 1 ]; then echo "TUTARSIZ: sw.js'de diksiyon-v sayısı $SWSAYI (1 olmalı)"; DURUM=1; fi
[ "$DURUM" -eq 0 ] && echo "Tamam: hepsi aynı sürüm ($SAYILAR)"
exit $DURUM
