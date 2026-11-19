// JazzPlusRedo: passes "find the commercials in this replay" requests from the
// page to the background helper (slate-bg.js) and the answer back.
// Only SEG+ preview-sheet addresses are ever forwarded.
(() => {
  const api = globalThis.browser || globalThis.chrome;
  const SHEET_RE = /^https:\/\/archive-seg-or\.kiswe\.com\/media\/[\w.-]+\/mix-stream1\/trickplay_256x144\/m_\d+\.jpg$/;
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || !e.data.__segfixSlate) return;
    const { id, urls } = e.data.__segfixSlate;
    if (typeof id !== "number" || !Array.isArray(urls) || urls.length > 400 || !urls.every((u) => typeof u === "string" && SHEET_RE.test(u))) return;
    const reply = (res) => window.postMessage({ __segfixSlateResult: Object.assign({ id }, res) }, location.origin);
    try {
      Promise.resolve(api.runtime.sendMessage({ type: "segfix-slate", urls }))
        .then((res) => reply(res || { error: "no answer" }), (err) => reply({ error: String(err) }));
    } catch (err) {
      reply({ error: String(err) });
    }
  });
})();
