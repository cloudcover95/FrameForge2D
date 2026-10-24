# FrameForge2D dense option matrix — 2026-10-24

25 boot/role combinations tested against the last-wins query parser and role assignment logic from `site/js/adapter.js`.

## Results

All 25 cases passed.

| Case | n | stocks | locals | fill | roles | status |
|------|---|--------|--------|------|-------|--------|
| cpu 4ffa fill | 4 | 4 | 1 | yes | local+3cpu | OK |
| cpu 1v1 | 2 | 3 | 1 | yes | local+cpu | OK |
| couch 1v1 | 2 | 4 | 2 | no | 2 local | OK |
| couch + 2 cpu | 4 | 4 | 2 | yes | 2local+2cpu | OK |
| full couch 4 | 4 | 4 | 4 | no | 4 local | OK |
| mirror 1v1 | 2 | 4 | 2 | no | 2 local | OK |
| party + fill | 4 | 4 | 1 | yes | local+3cpu | OK |
| stocks 2/5/7/min | 4 | clamped | 1 | yes | local+3cpu | OK |
| fill last-wins | — | — | — | last | correct | OK |
| n last-wins | — | — | — | — | correct | OK |
| all 4 stages | — | — | — | — | OK | OK |
| extras on/off | — | — | — | — | OK | OK |
| cartridge autorun | 4 | 4 | 1 | yes | local+3cpu | OK |
| mirror defaults | 2 | 4 | 2 | no | 2 local | OK |
| party no fill | 2 | 4 | 1 | no | local+idle | OK |

## Wiring checks

- Form pins single `stocks`, `n`, `locals`, `fill`, `dual`, `stage`, `diff`.
- Season radios present for all four arenas.
- `markSpawns()` clamps to main floor half-width.
- Elevator main width 120 + shaft_floor belt.
- `?autorun=1` / `?cartridge=1` skips gate and calls startFight.
- Cartridge entry auto-inserts into default 4-player vs CPU match.

Physics remains fixed-step 60 Hz. Render is display-rate. Offline core modes require no network.
