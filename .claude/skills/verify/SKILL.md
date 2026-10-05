---
name: verify
description: Build, serve and drive the partners-competition-app SPA in a browser to confirm a change works at runtime.
---

# Verify partners-competition-app

Static React SPA, no backend. Surface = the rendered page.

## Launch

```bash
npm run build                                  # ~1s, outputs /build
npx vite preview --port 4173 --strictPort &    # serves http://localhost:4173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/   # expect 200
```

Stop with `lsof -ti tcp:4173 | xargs kill`. Use Node 24 (`.nvmrc`).

## Drive (Claude in Chrome)

- Console on load should show only `[INFO] Partners Competition App started` and `[EVENT] app_mounted`.
- Header controls: `Season`/`Summer Tournament`, `2025`/`2026` (season view only), `EN`/`DA`, theme toggle.
- Expected data: 2026 = 11 games, leader Gitte 26; 2025 = 18 games, leader Gitte 39, plus a "Final Results" champion banner; tournament = 8 players, 40 games, leader Lotte 32.
- Default language is Danish, default year 2026.

## Gotchas

- `read_page` reports the real viewport (e.g. 2226x1284) while screenshots are downscaled, so coordinate clicks miss. Click by `ref` from `find` / `read_page filter=interactive` instead. Year buttons only get refs in season view.
- `read_console_messages` only tracks from its first call, so call it before navigating or reload afterwards.
