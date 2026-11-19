// JazzPlusRedo background helper: finds the "We'll be right back." slate in a
// replay's timeline preview pictures, so commercials can be skipped accurately.
//
// It only ever loads SEG+'s own preview sheets (trickplay JPEGs on SEG+'s video
// server), never anything else, and it only hands back numbers (how much each
// preview frame looks like the slate), never the images themselves.
//
// Each sheet is 1280x288: 2 rows x 5 frames of 256x144, one frame per ~10s.
// The slate's bottom strip (dark bar, "We'll be right back.", team logo) is the
// same every time, while game footage there varies a lot, so the strip alone
// separates the two cleanly.
(() => {
  const api = globalThis.browser || globalThis.chrome;
  const SHEET_RE = /^https:\/\/archive-seg-or\.kiswe\.com\/media\/[\w.-]+\/mix-stream1\/trickplay_256x144\/m_\d+\.jpg$/;
  const TW = 256, TH = 144, STRIP_Y = 122, STRIP_H = 22, BX = 64, BY = 6;
  const SIG = BX * BY;

  // One sheet -> 10 strip signatures (64x6 block-average luminance), or null.
  async function sheetSigs(url) {
    try {
      const r = await fetch(url, { credentials: "omit", cache: "force-cache" });
      if (!r.ok) return null;
      const bmp = await createImageBitmap(await r.blob());
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(bmp, 0, 0);
      const out = new Float32Array(10 * SIG);
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 5; col++) {
          const d = g.getImageData(col * TW, row * TH + STRIP_Y, TW, STRIP_H).data;
          const base = (row * 5 + col) * SIG;
          for (let by = 0; by < BY; by++) {
            const ya = Math.floor((STRIP_H * by) / BY), yb = Math.floor((STRIP_H * (by + 1)) / BY);
            for (let bx = 0; bx < BX; bx++) {
              let s = 0, n = 0;
              for (let y = ya; y < yb; y++) {
                for (let x = bx * 4; x < bx * 4 + 4; x++) {
                  const i = (y * TW + x) * 4;
                  s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; n++;
                }
              }
              out[base + by * BX + bx] = s / n;
            }
          }
        }
      }
      bmp.close && bmp.close();
      return out;
    } catch (e) {
      return null;
    }
  }

  const dist = (a, ai, b, bi) => {
    let s = 0;
    for (let k = 0; k < SIG; k++) s += Math.abs(a[ai + k] - b[bi + k]);
    return s / SIG;
  };

  async function analyze(urls) {
    // Fetch a few at a time so the game's own video keeps its bandwidth.
    const sheets = new Array(urls.length);
    let next = 0;
    const worker = async () => { while (next < urls.length) { const i = next++; sheets[i] = await sheetSigs(urls[i]); } };
    await Promise.all([worker(), worker(), worker()]);
    const n = urls.length * 10;
    const all = new Float32Array(n * SIG);
    const ok = new Uint8Array(n);
    sheets.forEach((s, i) => { if (s) { all.set(s, i * 10 * SIG); ok.fill(1, i * 10, i * 10 + 10); } });
    // The slate is the strip that repeats most: pick the frame with the most
    // close look-alikes (every 3rd frame is plenty of candidates).
    let best = -1, bestCount = 0;
    for (let k = 0; k < n; k += 3) {
      if (!ok[k]) continue;
      let c = 0;
      for (let j = 0; j < n; j++) if (ok[j] && dist(all, k * SIG, all, j * SIG) < 10) c++;
      if (c > bestCount) { bestCount = c; best = k; }
    }
    const d = new Array(n).fill(null);
    if (best >= 0) for (let j = 0; j < n; j++) if (ok[j]) d[j] = Math.round(dist(all, best * SIG, all, j * SIG) * 10) / 10;
    return { dist: d, protoCount: bestCount, sheets: sheets.filter(Boolean).length };
  }

  api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || msg.type !== "segfix-slate") return;
    if (sender && sender.id && sender.id !== api.runtime.id) return;
    const urls = msg.urls;
    if (!Array.isArray(urls) || !urls.length || urls.length > 400 || !urls.every((u) => typeof u === "string" && SHEET_RE.test(u))) {
      sendResponse({ error: "bad request" });
      return;
    }
    analyze(urls).then(sendResponse, (e) => sendResponse({ error: String(e) }));
    return true;   // answer arrives later
  });
})();
