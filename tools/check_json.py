#!/usr/bin/env python3
"""Validate that every tracked *.json file in the repo parses cleanly.

Usage: python3 tools/check_json.py [root]
Exits non-zero and lists offending files if any JSON is malformed.
Stdlib only; no network, no servers.
"""
import json
import sys
from pathlib import Path

SKIP_DIRS = {".git", "node_modules"}


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent)
    bad, count = [], 0
    for p in sorted(root.rglob("*.json")):
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        count += 1
        try:
            json.loads(p.read_text(encoding="utf-8"))
        except (ValueError, UnicodeDecodeError) as e:
            bad.append((p.relative_to(root), e))
    for path, err in bad:
        print(f"FAIL {path}: {err}")
    print(f"{count - len(bad)}/{count} JSON files OK")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
