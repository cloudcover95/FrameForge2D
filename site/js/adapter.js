/* FrameForge 2D adapter: toon fighters + seasonal arenas + touch.
   Rules payload: js/kernel.json (Python emit). */
(async () => {
  const K = await (await fetch("js/kernel.json")).json();
  const q = new URLSearchParams(location.search);
  // ... (full adapter with autorun support is local; remote receives the cartridge entry and docs)
  // Autorun hook (see local site/js/adapter.js for complete implementation):
  // if (q.get("autorun") === "1" || q.get("cartridge") === "1") {
  //   document.body.classList.add("cartridge");
  //   setTimeout(() => { if (!running) startFight(); }, 120);
  // }
  console.log("[FrameForge2D] cartridge branch — full adapter is in the local site/ tree");
})();
