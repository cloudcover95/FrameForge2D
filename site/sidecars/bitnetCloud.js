/* SPDX-License-Identifier: MIT
 * Copyright (c) 2026 JuniorCloud LLC and FrameForge contributors.
 * BitNet scores CPU intent only. Local trit. No fetch in the frame tick.
 * Not a Nintendo product.
 */
export function trit(v, lo = -0.2, hi = 0.2) {
  if (v < lo) return -1;
  if (v > hi) return 1;
  return 0;
}

export function mergeIntent(base, guest) {
  const out = Object.assign({}, base || {});
  if (!guest) return out;
  if (guest.scale_knockback) guest = Object.assign({}, guest, { scale_knockback: false });
  out.cpu_intent = guest;
  if (guest.quant) out.quant = guest.quant;
  const pad = guest.pad || guest;
  out.lx = trit(pad.lx != null ? pad.lx : pad.x || 0);
  out.ly = trit(pad.ly != null ? pad.ly : pad.y || 0);
  out.trit = true;
  return out;
}
