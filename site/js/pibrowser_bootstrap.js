/* FrameForge2D Pi Browser client. No-op outside Pi Browser. */
(function () {
  if (typeof window === "undefined") return;
  window.FrameForgePi = {
    user: null,
    ready: typeof Pi !== "undefined",
    authenticate: async function () {
      if (typeof Pi === "undefined") {
        console.warn("[PiSDK] not in Pi Browser");
        return null;
      }
      Pi.init({ version: "2.0", sandbox: true });
      const scopes = ["username", "payments"];
      const onIncomplete = function (payment) {
        return fetch("/api/v1/pi/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment: payment })
        });
      };
      const auth = await Pi.authenticate(scopes, onIncomplete);
      this.user = auth.user;
      return auth;
    },
    requestRewardPayment: async function (amount, memo, metadata) {
      if (!this.user) await this.authenticate();
      if (typeof Pi === "undefined") return null;
      return Pi.createPayment(
        { amount: amount, memo: memo, metadata: metadata || {} },
        {
          onReadyForServerApproval: function (paymentId) {
            fetch("/api/v1/pi/approve-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: paymentId })
            });
          },
          onReadyForServerCompletion: function (paymentId, txid) {
            fetch("/api/v1/pi/complete-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId: paymentId, txid: txid })
            });
          },
          onCancel: function () {},
          onError: function (err) { console.error("[PiSDK]", err); }
        }
      );
    }
  };
})();
