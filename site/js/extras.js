/* Optional rules + fight chrome. Pause / New / P key. */
(() => {
  const q = new URLSearchParams(location.search);
  const on = (k, def) => { const v = q.get(k); if (v === "0") return false; if (v === "1") return true; return !!def; };
  window.FFPaused = false;
  window.FFX = {
    flags: { plats: on("plats", true), parry: on("parry", true), dodge: on("dodge", true), rage: on("rage", true), dashatk: on("dashatk", false) },
    extraPlats() {
      if (!this.flags.plats) return [];
      return [{ x: -28, y: 48, w: 30, h: 3, solid: false }, { x: 28, y: 48, w: 30, h: 3, solid: false }];
    },
    hitMul(atk) { return this.flags.rage && atk && atk.percent >= 100 ? 1.22 : 1; },
    act() {}
  };
  function bindChrome() {
    const btn = document.getElementById("btnPause");
    const toggle = () => {
      window.FFPaused = !window.FFPaused;
      if (btn) btn.textContent = window.FFPaused ? "Play" : "Pause";
    };
    if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); toggle(); });
    const rst = document.getElementById("btnReset");
    if (rst) rst.addEventListener("click", (e) => { e.preventDefault(); location.replace(location.pathname + location.search); });
    addEventListener("keydown", (e) => {
      if (e.key !== "p" && e.key !== "P" && e.key !== "Escape") return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      e.preventDefault(); toggle();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindChrome);
  else bindChrome();
})();
