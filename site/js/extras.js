/* Optional rules. Loaded before adapter. Legal kernel stays default. */
(() => {
  const q = new URLSearchParams(location.search);
  const on = (k, def) => {
    const v = q.get(k);
    if (v === "0") return false;
    if (v === "1") return true;
    return !!def;
  };
  const F = {
    plats: on("plats", true),
    parry: on("parry", true),
    dodge: on("dodge", true),
    rage: on("rage", true),
    dashatk: on("dashatk", false),
    ult: on("ult", false),
    elev: on("elev", false),
  };
  const edge = Object.create(null);
  function rise(name, held) {
    const p = edge[name];
    edge[name] = held;
    return held && !p;
  }
  window.FFPaused = false;
  window.FFX = {
    flags: F,
    extraPlats() {
      if (F.elev) {
        const shaft = [];
        const floors = [8, 28, 50, 74, 100, 128, 156];
        floors.forEach((y, i) => {
          const side = i % 2 === 0 ? -24 : 24;
          shaft.push({ x: side, y, w: 26, h: 3, solid: false, id: "e" + i });
        });
        shaft.push({ id: "car", x: 0, y: 4, w: 32, h: 3, solid: true, lift: true, y0: -8, y1: 140, spd: 0.22 });
        return shaft;
      }
      if (!F.plats) return [];
      return [
        { x: -28, y: 48, w: 30, h: 3, solid: false },
        { x: 28, y: 48, w: 30, h: 3, solid: false },
      ];
    },
    hitMul(atk) {
      if (F.rage && atk && atk.percent >= 100) return 1.22;
      return 1;
    },
    act(f, input, P, api) {
      if (!f || f.dead) return;
      if (input.down || input.y < -0.6) f.dropThru = 10;
      f.dodgeCd = Math.max(0, (f.dodgeCd || 0) - 1);
      if (F.dodge && !f.grounded && rise("dodge" + P.indexOf(f), input.shield) && f.dodgeCd === 0) {
        f.star = Math.max(f.star || 0, 14);
        f.vx += (f.facing || 1) * 2.4;
        f.vy = Math.max(f.vy, 0.6);
        f.dodgeCd = 50;
      }
      if (F.parry && f.grounded && rise("parry" + P.indexOf(f), input.shield)) {
        for (const o of P) {
          if (o === f || o.dead || o.action !== "attack") continue;
          if (Math.abs(o.x - f.x) < 18 && Math.abs(o.y - f.y) < 14 && o.af <= 10) {
            o.hitstun = Math.max(o.hitstun, 20);
            o.action = "wait";
            o.af = 0;
            f.star = Math.max(f.star || 0, 10);
          }
        }
      }
      if (F.dashatk && input.attack && f.grounded && Math.abs(input.x) > 0.7 && f.action === "attack" && f.af === 0) {
        f.move = { dmg: 11, ang: 361, bkb: 40, kbg: 86, start: 4, end: 8 };
        if (api && api.note) api.note("dashatk");
      }
    },
  };

  function bindChrome() {
    const btn = document.getElementById("btnPause");
    const toggle = () => {
      window.FFPaused = !window.FFPaused;
      if (btn) btn.textContent = window.FFPaused ? "Play" : "Pause";
      const hint = document.getElementById("focusHint");
      if (hint && window.FFPaused) hint.textContent = "Paused — Play or press P";
    };
    if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); toggle(); });
    const rst = document.getElementById("btnReset");
    if (rst) rst.addEventListener("click", (e) => {
      e.preventDefault();
      location.replace(location.pathname + location.search);
    });
    addEventListener("keydown", (e) => {
      if (e.key !== "p" && e.key !== "P" && e.key !== "Escape") return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      e.preventDefault();
      toggle();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindChrome);
  else bindChrome();
})();
