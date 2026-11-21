[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Kopler12/kopler-spot-difference-20261121/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Kopler12/kopler-spot-difference-20261121/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Spot the Difference — Pasar Malam Lampion

Dua gambar nyaris sama, sepuluh perbedaan tersembunyi, tiga dunia untuk ditaklukkan. Cari bedanya sebelum waktu habis — klik salah, waktumu berkurang 5 detik.

**Mainkan:** buka `game/index.html` di desktop Chrome, atau jalankan `node serve.ts` lalu buka http://localhost:8080. Tanpa build step, tanpa network request: semua gambar digambar di canvas, semua suara disintesis WebAudio.

## Tiga dunia, 30 perbedaan

1. **Pasar Malam** — lampion, warung sate, kucing di atap, sepeda dan balon. (10 perbedaan)
2. **Stasiun Orbit-9** — Bumi dari jendela, astronot melayang, robot kecil, kopi yang melayang. (10 perbedaan)
3. **Taman Karang** — ikan, gurita, penyelam, dan peti harta karun. (10 perbedaan)

## Cara main

- Klik perbedaan di gambar **A** atau **B** — keduanya bisa. Perbedaan yang ketemu ditandai cincin emas bernomor di kedua gambar.
- **Timer 2:30 per level** — klik salah memotong 5 detik. Di bawah 30 detik, timer berkedip merah.
- **Petunjuk (H)** — 3× per level, cincin berdenyut menunjukkan satu perbedaan yang belum ketemu (biaya 25 poin).
- **Kombo** — temuan beruntun tanpa salah menaikkan pengali sampai ×3. Selesaikan level untuk bonus waktu (+5 poin/detik sisa).
- **Keyboard:** `H` petunjuk · `M` suara · `R` ulangi level · `Enter` lanjut.
- Menangkan ketiga level untuk layar kemenangan berbintang; skor terbaik tersimpan di browser.

## Struktur kode

| File | Tugas |
| --- | --- |
| `game/index.html` | Kerangka halaman: HUD, dua papan, overlay |
| `game/style.css` | Tampilan: ungu pasar malam, amber lampion |
| `game/src/main.js` | Bootstrap, HUD, overlay, loop frame |
| `game/src/game.js` | State & aturan: level, klik, timer, hint, skor |
| `game/src/render.js` | Menggambar panel, marker, partikel, hint |
| `game/src/scenes.js` | Tiga scene original + 10 perbedaan masing-masing |
| `game/src/helpers.js` | Primitif gambar canvas |
| `game/src/audio.js` | Suara synth WebAudio (tanpa file audio) |
| `game/src/shots.js` | Scene screenshot `?shot=` (memainkan aturan asli) |
| `main.ts` | Program hand-in: menyalin game + screenshot, menulis dossier |
| `vendor/makefun-game.ts` | Library make.fun dari kit (tanpa diubah) |

## Screenshot

`?shot=cover` — level 1, 4 ketemu 6 tersisa · `?shot=level2` — level 2, 2 ketemu · `?shot=hint` — petunjuk aktif · `?shot=win` — layar kemenangan. Lihat `shots.json`.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
