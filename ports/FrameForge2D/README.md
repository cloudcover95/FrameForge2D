# FrameForge2D — EmuELEC / Edge Port

Local-first 60 Hz Canvas platform fighter. Offline vs CPU, couch, and mirror modes work with no network.

## Install on EmuELEC (microSD)

1. Mount the EmuELEC microSD on a computer (or use the network share).
2. Copy this entire `FrameForge2D` folder to:
   ```
   /storage/roms/ports/FrameForge2D/
   ```
3. Make sure `FrameForge2D.sh` is executable (`chmod +x`).
4. Restart EmuELEC or rescan Ports.
5. Launch **FrameForge2D** from the Ports menu.

The launcher starts a local Python HTTP server on port 8765 and opens a kiosk browser if Chromium/Firefox is available. Otherwise it prints the URL.

## Other open-source edge / IoT emulators

- **Batocera / Recalbox**: same Ports folder layout.
- **LibreELEC / CoreELEC**: drop into a writable path and run the `.sh`.
- **Raspberry Pi OS / Armbian**: `cd FrameForge2D && ./FrameForge2D.sh`
- **Any system with a browser**: open `index.html` directly (file:// works for offline modes) or serve with any static server.

## Offline guarantee

- vs CPU, Couch, Mirror 1v1: zero external network.
- Party mode tries PeerJS from unpkg; falls back cleanly if offline.
- All assets (audio, kernel, sprites) are local.

## Controls

P1: WASD / stick · J attack · K shield · L grab  
P2: arrows · , . /  
Touch pads and gamepads also work.

## Notes

Physics is fixed-step 60 Hz. Render is display-rate. No Unreal required. Stdlib Python only for the optional server.
