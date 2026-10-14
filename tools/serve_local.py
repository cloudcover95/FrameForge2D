#!/usr/bin/env python3
"""Serve ./site locally for testing the 2D kernel without the FrameForge tree.

Binds 127.0.0.1 only. Stdlib only.
Usage: python3 tools/serve_local.py [--port 8642]
Then open http://127.0.0.1:8642/play.html
"""
import argparse
import functools
import http.server
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".json": "application/json"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--port", type=int, default=8642)
    a = ap.parse_args()
    h = functools.partial(Handler, directory=str(SITE))
    with http.server.ThreadingHTTPServer(("127.0.0.1", a.port), h) as srv:
        print(f"Serving {SITE} at http://127.0.0.1:{a.port}/play.html (Ctrl+C to stop)")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
