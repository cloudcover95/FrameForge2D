# FrameForge2D Cartridge (auto-run)

Hosted-cartridge style entry for local and edge use.

## Launch

Open `site/cartridge.html` (or serve the folder and visit `/cartridge.html`).

It auto-inserts after ~800 ms into a default match:

- mode=cpu · n=4 · stocks=4 · fill=1 · stage=alpine_glass
- P1 Vesper vs CPU Quill / Relay / Forge
- autorun=1 skips the gate and starts the fight

Query override still works: `cartridge.html` redirects to `play.html` with the params above. Append `&elev=1` or change stage by editing the redirect if needed.

## Edge / mSD / EmuELEC

See `ports/FrameForge2D/`. The launcher starts a local server and can open the cartridge entry.

## Offline

Core modes require no network. Physics stays fixed-step 60 Hz; render is display-rate.
