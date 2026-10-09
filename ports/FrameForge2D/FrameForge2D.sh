#!/bin/bash
# FrameForge2D Port launcher for EmuELEC / LibreELEC / CoreELEC / similar
# Drop this folder into /storage/roms/ports/ and launch from the Ports menu.

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8765
URL="http://127.0.0.1:${PORT}/cartridge.html"

cd "$DIR"

# Kill any previous server on this port
if command -v fuser >/dev/null 2>&1; then
  fuser -k ${PORT}/tcp 2>/dev/null || true
fi

# Start stdlib HTTP server (Python 3 is available on most EmuELEC builds or can be added)
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server ${PORT} --bind 127.0.0.1 >/tmp/frameforge2d-server.log 2>&1 &
  SERVER_PID=$!
  sleep 0.8
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer ${PORT} >/tmp/frameforge2d-server.log 2>&1 &
  SERVER_PID=$!
  sleep 0.8
else
  echo "No Python found. Copy the folder to a USB and open index.html in a browser, or install python3."
  exit 1
fi

# Prefer a kiosk browser if present
BROWSER=""
if command -v chromium-browser >/dev/null 2>&1; then
  BROWSER="chromium-browser --kiosk --disable-infobars --no-first-run --disable-translate ${URL}"
elif command -v chromium >/dev/null 2>&1; then
  BROWSER="chromium --kiosk --disable-infobars ${URL}"
elif command -v firefox >/dev/null 2>&1; then
  BROWSER="firefox --kiosk ${URL}"
fi

if [ -n "$BROWSER" ]; then
  eval "$BROWSER" || true
else
  echo "FrameForge2D is running at ${URL}"
  echo "Open it in any browser on this device."
  # Keep server alive until interrupted
  wait $SERVER_PID
fi

# Cleanup
kill $SERVER_PID 2>/dev/null || true
