"""2D camera follow and clamp helpers for FrameForge2D.

Pure stdlib. A camera is described by its top-left world position and a
viewport size. Helpers smoothly follow a target, keep it inside a dead zone,
clamp to world bounds, and convert between world and screen coordinates.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple

Vec2 = Tuple[float, float]


@dataclass
class Camera2D:
    x: float
    y: float
    view_w: float
    view_h: float

    @property
    def center(self) -> Vec2:
        return (self.x + self.view_w / 2.0, self.y + self.view_h / 2.0)

    def world_to_screen(self, wx: float, wy: float) -> Vec2:
        return (wx - self.x, wy - self.y)

    def screen_to_world(self, sx: float, sy: float) -> Vec2:
        return (sx + self.x, sy + self.y)

    def visible(self, wx: float, wy: float, w: float = 0.0, h: float = 0.0) -> bool:
        """True if the rect (wx, wy, w, h) overlaps the viewport."""
        return (
            wx + w >= self.x
            and wx <= self.x + self.view_w
            and wy + h >= self.y
            and wy <= self.y + self.view_h
        )


def _clamp(v: float, lo: float, hi: float) -> float:
    if hi < lo:  # world smaller than viewport: center it
        return (lo + hi) / 2.0
    return max(lo, min(hi, v))


def clamp_to_world(cam: Camera2D, world_w: float, world_h: float) -> Camera2D:
    """Keep the viewport inside [0, world_w] x [0, world_h]."""
    cam.x = _clamp(cam.x, 0.0, world_w - cam.view_w)
    cam.y = _clamp(cam.y, 0.0, world_h - cam.view_h)
    return cam


def follow(cam: Camera2D, target: Vec2, lerp: float = 1.0,
           dead_w: float = 0.0, dead_h: float = 0.0) -> Camera2D:
    """Move the camera toward ``target``.

    The target may drift inside a centered dead zone of ``dead_w`` x ``dead_h``
    without moving the camera. ``lerp`` in (0, 1] controls smoothing; 1 snaps.
    """
    if not 0.0 < lerp <= 1.0:
        raise ValueError("lerp must be in (0, 1]")
    cx, cy = cam.center
    tx, ty = target
    hw, hh = dead_w / 2.0, dead_h / 2.0
    dx = 0.0
    if tx > cx + hw:
        dx = tx - (cx + hw)
    elif tx < cx - hw:
        dx = tx - (cx - hw)
    dy = 0.0
    if ty > cy + hh:
        dy = ty - (cy + hh)
    elif ty < cy - hh:
        dy = ty - (cy - hh)
    cam.x += dx * lerp
    cam.y += dy * lerp
    return cam


if __name__ == "__main__":
    c = Camera2D(0.0, 0.0, 320.0, 180.0)
    follow(c, (500.0, 300.0))
    assert c.center == (500.0, 300.0), c.center
    clamp_to_world(c, 640.0, 360.0)
    assert (c.x, c.y) == (320.0, 180.0), (c.x, c.y)
    c = Camera2D(0.0, 0.0, 320.0, 180.0)
    follow(c, (170.0, 90.0), dead_w=40.0, dead_h=40.0)
    assert (c.x, c.y) == (0.0, 0.0)
    follow(c, (200.0, 90.0), lerp=0.5, dead_w=40.0, dead_h=40.0)
    assert c.x == 10.0, c.x
    clamp_to_world(c, 100.0, 100.0)
    assert (c.x, c.y) == (-110.0, -40.0), (c.x, c.y)
    c = Camera2D(10.0, 10.0, 100.0, 100.0)
    assert c.world_to_screen(*c.screen_to_world(3.0, 4.0)) == (3.0, 4.0)
    assert c.visible(105.0, 105.0) and not c.visible(200.0, 0.0)
    print("camera_2d smoke ok")
