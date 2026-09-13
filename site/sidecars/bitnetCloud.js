/* SPDX-License-Identifier: MIT
 * Copyright (c) 2026 JuniorCloud LLC and FrameForge contributors.
 * BitNet scores CPU intent only. Does not rewrite the canvas kernel.
 * Not a Nintendo product.
 */
export function mergeIntent(base, guest) {
  const out = Object.assign({}, base || {});
  if (!guest) return out;
  if (guest.scale_knockback) guest = Object.assign({}, guest, { scale_knockback: false });
  out.cpu_intent = guest;
  if (guest.quant) out.quant = guest.quant;
  const pad = guest.pad || guest;
  if (pad && pad.trit) {
    if (pad.lx != null) out.lx = pad.lx;
    if (pad.ly != null) out.ly = pad.ly;
  }
  return out;
}
