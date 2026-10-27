"""Hit-stop (freeze-frame) timing helpers for 2D action games.

Pure-Python, no dependencies. Additive module for FrameForge2D.
Computes how many frames to freeze on impact and tracks the countdown.
"""
from __future__ import annotations

from dataclasses import dataclass


def hitstop_frames(damage: float, base: int = 2, per_damage: float = 0.35,
                   max_frames: int = 20) -> int:
    """Return freeze frames for a hit of the given damage (clamped)."""
    if damage < 0:
        raise ValueError("damage must be non-negative")
    if base < 0 or max_frames < 0 or per_damage < 0:
        raise ValueError("parameters must be non-negative")
    frames = base + int(damage * per_damage)
    return max(0, min(frames, max_frames))


@dataclass
class HitStop:
    """Tracks a freeze countdown; tick() returns True while frozen."""
    remaining: int = 0

    def trigger(self, frames: int) -> None:
        if frames < 0:
            raise ValueError("frames must be non-negative")
        # Overlapping hits keep the longer freeze rather than stacking.
        self.remaining = max(self.remaining, frames)

    def tick(self) -> bool:
        if self.remaining > 0:
            self.remaining -= 1
            return True
        return False

    @property
    def frozen(self) -> bool:
        return self.remaining > 0


def _self_check() -> None:
    assert hitstop_frames(0) == 2
    assert hitstop_frames(10) == 5
    assert hitstop_frames(1000) == 20
    hs = HitStop()
    hs.trigger(3)
    hs.trigger(1)
    assert hs.remaining == 3
    assert [hs.tick() for _ in range(4)] == [True, True, True, False]
    assert not hs.frozen
    try:
        hitstop_frames(-1)
    except ValueError:
        pass
    else:
        raise AssertionError("negative damage accepted")


if __name__ == "__main__":
    _self_check()
    print("hitstop_2d self-check OK")
