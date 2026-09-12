/* FrameForge2D BitnetCloud sidecar. Do not rewrite the canvas kernel.
 * Not a Nintendo product.
 */
export async function pollIntent(url) {
  const r = await fetch(url);
  const j = await r.json();
  return {
    roster: j.roster || 'Forge',
    lx: Number(j.lx) || 0,
    ly: Number(j.ly) || 0,
    buttons: j.buttons | 0,
    trit: j.trit | 0,
    profile: j.profile || 'generic_iot',
    role: 'cpu_intent_pad',
    sidecar: 'bitnetCloud',
    legal: 'not a nintendo product',
  };
}

export function mergePad(base, guest) {
  const out = Object.assign({}, base || {});
  if (!guest) return out;
  if (guest.trit) {
    out.lx = guest.lx;
    out.ly = guest.ly;
    out.buttons = guest.buttons;
    out.cpuIntent = guest.trit;
  }
  return out;
}
