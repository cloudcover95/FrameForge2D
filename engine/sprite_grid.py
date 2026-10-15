"""Sprite-sheet grid math for FrameForge2D (stdlib only, no I/O, no network).

Slices a sprite sheet into frame rectangles given frame size, margin and
spacing, and maps a frame index back to its rectangle.

Run ``python3 sprite_grid.py`` to execute the built-in self-check.
"""

from __future__ import annotations

from typing import List, NamedTuple


class Rect(NamedTuple):
    x: int
    y: int
    w: int
    h: int


def grid_dims(sheet_w: int, sheet_h: int, frame_w: int, frame_h: int,
              margin: int = 0, spacing: int = 0) -> tuple:
    """Return (columns, rows) of whole frames that fit on the sheet.

    >>> grid_dims(128, 64, 32, 32)
    (4, 2)
    >>> grid_dims(70, 34, 32, 32, margin=1, spacing=2)
    (2, 1)
    """
    for name, v in (("sheet_w", sheet_w), ("sheet_h", sheet_h),
                    ("frame_w", frame_w), ("frame_h", frame_h)):
        if v <= 0:
            raise ValueError(f"{name} must be positive, got {v}")
    if margin < 0 or spacing < 0:
        raise ValueError("margin and spacing must be non-negative")
    usable_w = sheet_w - 2 * margin
    usable_h = sheet_h - 2 * margin
    cols = (usable_w + spacing) // (frame_w + spacing) if usable_w >= frame_w else 0
    rows = (usable_h + spacing) // (frame_h + spacing) if usable_h >= frame_h else 0
    return cols, rows


def frame_rect(index: int, cols: int, frame_w: int, frame_h: int,
               margin: int = 0, spacing: int = 0) -> Rect:
    """Rectangle for frame ``index`` in row-major order.

    >>> frame_rect(5, 4, 32, 32)
    Rect(x=32, y=32, w=32, h=32)
    """
    if cols <= 0:
        raise ValueError("cols must be positive")
    if index < 0:
        raise ValueError("index must be non-negative")
    col, row = index % cols, index // cols
    return Rect(margin + col * (frame_w + spacing),
                margin + row * (frame_h + spacing), frame_w, frame_h)


def slice_sheet(sheet_w: int, sheet_h: int, frame_w: int, frame_h: int,
                margin: int = 0, spacing: int = 0) -> List[Rect]:
    """All frame rectangles on the sheet, row-major."""
    cols, rows = grid_dims(sheet_w, sheet_h, frame_w, frame_h, margin, spacing)
    return [frame_rect(i, cols, frame_w, frame_h, margin, spacing)
            for i in range(cols * rows)]


def _self_check() -> None:
    import doctest
    failures, _ = doctest.testmod(verbose=False)
    assert failures == 0, f"{failures} doctest failure(s)"
    rects = slice_sheet(70, 34, 32, 32, margin=1, spacing=2)
    assert rects == [Rect(1, 1, 32, 32), Rect(35, 1, 32, 32)], rects
    for r in slice_sheet(100, 50, 16, 16, margin=2, spacing=3):
        assert r.x >= 2 and r.y >= 2
        assert r.x + r.w <= 100 - 2 and r.y + r.h <= 50 - 2, r
    assert grid_dims(10, 10, 32, 32) == (0, 0)
    assert slice_sheet(10, 10, 32, 32) == []
    for bad in ((0, 10, 1, 1), (10, 10, -1, 1)):
        try:
            grid_dims(*bad)
        except ValueError:
            pass
        else:
            raise AssertionError(f"expected ValueError for {bad}")
    print("sprite_grid self-check: OK")


if __name__ == "__main__":
    _self_check()
