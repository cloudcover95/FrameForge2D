/* Host-authoritative PeerJS party. Room code + up to 4 fighters. */
(function (w) {
  const PREFIX = "ff2d-";
  const MAX = 4;
  const idle = () => ({ x: 0, y: 0, jump: false, attack: false, shield: false, grab: false });
  w.FFNet = w.FFNet || {};
  function code4() {
    const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
    return s;
  }
  Object.assign(w.FFNet, {
    makeCode: code4, enabled: false, host: false, room: "", slot: 0, n: 1,
    ids: ["vesper", "quill", "relay", "forge"],
    remote: [idle(), idle(), idle(), idle()], conns: [], status: "off",
    boot(opts) {
      this.room = (opts.room || "").toUpperCase();
      this.host = !!opts.host;
      if (!this.room || typeof Peer === "undefined") { this.status = "offline"; return Promise.resolve(false); }
      this.enabled = true;
      return this.host ? this._host() : this._join();
    },
    sendInput(inp) {
      if (!this.enabled || this.host) return;
      const c = this.conns[0];
      if (c && c.open) c.send(JSON.stringify({ t: "in", s: this.slot, i: inp }));
    },
    broadcastState(payload) {
      if (!this.host) return;
      const msg = JSON.stringify({ t: "st", ...payload });
      for (const c of this.conns) if (c && c.open) c.send(msg);
    },
    _host() {
      const self = this;
      return new Promise((resolve) => {
        const peer = new Peer(PREFIX + self.room, { debug: 0 });
        self.peer = peer;
        peer.on("open", () => { self.status = "host"; self.slot = 0; resolve(true); });
        peer.on("error", () => resolve(false));
        peer.on("connection", (conn) => {
          if (self.n >= MAX) { conn.close(); return; }
          const slot = self.n; self.n += 1; self.conns.push(conn);
          conn.on("open", () => conn.send(JSON.stringify({ t: "hi", slot, n: self.n, ids: self.ids })));
          conn.on("data", (raw) => self._on(raw, slot));
        });
      });
    },
    _join() {
      const self = this;
      return new Promise((resolve) => {
        const peer = new Peer({ debug: 0 });
        self.peer = peer;
        peer.on("open", () => {
          const conn = peer.connect(PREFIX + self.room, { reliable: true });
          self.conns = [conn];
          conn.on("data", (raw) => self._on(raw, 0));
        });
        self._joinResolve = resolve;
      });
    },
    _on(raw) {
      let msg; try { msg = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (_) { return; }
      if (msg.t === "hi") { this.slot = msg.slot; this.n = msg.n; if (this._joinResolve) this._joinResolve(true); }
      if (msg.t === "in" && this.host) this.remote[msg.s|0] = Object.assign(idle(), msg.i || {});
      if (msg.t === "st" && !this.host) this.lastState = msg;
    }
  });
})(window);
