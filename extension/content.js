// SEG+ Better Player — extras: keyboard shortcuts + idle cursor hiding.
// All the visual changes live in content.css; this file is optional.
(() => {
  // ---- Takeover: when the add-on updates, the newest copy in a tab wins -----
  // Every timer and handler below checks it still belongs to the current copy,
  // so an older copy left running in an open tab goes quiet on its own.
  const SEGFIX_ID = Math.random().toString(36).slice(2);
  window.__segfixToken = SEGFIX_ID;
  window.__segfixLoaded = true;
  const alive = () => window.__segfixToken === SEGFIX_ID;
  const setInterval = (fn, ms) => window.setInterval(() => { if (alive()) fn(); }, ms);
  const onDoc = (type, fn, opts) => document.addEventListener(type, (e) => { if (alive()) return fn(e); }, opts);
  const onWin = (type, fn, opts) => window.addEventListener(type, (e) => { if (alive()) return fn(e); }, opts);
  // Clear anything an older copy left on the page.
  for (const el of document.querySelectorAll("#segfix-chooser, #segfix-cover, #segfix-skipbox, #segfix-chatbtn, #segfix-chatframe, #segfix-chatcol, #segfix-settings, #segfix-chatbar, .segfix-rowfilter, #segfix-toast, #segfix-modebtn, .segfix-mode, #segfix-diag, .segfix-starts, .segfix-matchup, .segfix-skipbreak")) el.remove();
  for (const el of document.querySelectorAll("[data-segfix]")) delete el.dataset.segfix;
  for (const el of document.querySelectorAll(".segfix-modal-row")) el.classList.remove("segfix-modal-row");

  const root = document.documentElement;
  const IDLE_MS = 2500;
  let idleTimer = null;

  // ---- Idle cursor (CSS only hides it while fullscreen) ------------------
  onDoc(
    "mousemove",
    () => {
      root.classList.remove("segfix-idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => root.classList.add("segfix-idle"), IDLE_MS);
    },
    { passive: true }
  );

  // ---- Toast --------------------------------------------------------------
  const ICONS = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M11 6.5v11a.8.8 0 0 1-1.3.62L3.2 12.62a.8.8 0 0 1 0-1.24l6.5-5.5A.8.8 0 0 1 11 6.5zm9 0v11a.8.8 0 0 1-1.3.62l-6.5-5.5a.8.8 0 0 1 0-1.24l6.5-5.5A.8.8 0 0 1 20 6.5z"/></svg>',
    fwd: '<svg viewBox="0 0 24 24"><path d="M13 6.5v11a.8.8 0 0 0 1.3.62l6.5-5.5a.8.8 0 0 0 0-1.24l-6.5-5.5A.8.8 0 0 0 13 6.5zm-9 0v11a.8.8 0 0 0 1.3.62l6.5-5.5a.8.8 0 0 0 0-1.24l-6.5-5.5A.8.8 0 0 0 4 6.5z"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M3 9.5v5c0 .55.45 1 1 1h3l4.3 3.8c.64.57 1.7.11 1.7-.75V5.45c0-.86-1.06-1.32-1.7-.75L7 8.5H4c-.55 0-1 .45-1 1zm13.3-.8 1.4-1.4L20 9.6l2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3z"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M3 9.5v5c0 .55.45 1 1 1h3l4.3 3.8c.64.57 1.7.11 1.7-.75V5.45c0-.86-1.06-1.32-1.7-.75L7 8.5H4c-.55 0-1 .45-1 1zM16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z"/></svg>',
  };
  // In fullscreen the browser only shows the fullscreen element, so floating
  // UI (toasts, Skip buttons) must live inside it while fullscreen is on.
  function overlayLayer() {
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs && fs.tagName !== "VIDEO") return fs;
    return document.body;
  }
  function keepInLayer(el) {
    if (!el) return;
    const layer = overlayLayer();
    if (el.parentElement !== layer) layer.appendChild(el);
  }
  onDoc("fullscreenchange", () => {
    keepInLayer(document.getElementById("segfix-toast"));
  });

  let toastTimer = null;
  function toast(html, side = "center") {
    let el = document.getElementById("segfix-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "segfix-toast";
    }
    keepInLayer(el);
    el.innerHTML = html;
    el.classList.remove("left", "right", "show");
    if (side !== "center") el.classList.add(side);
    void el.offsetWidth; // restart the pop-in animation
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 650);
  }
  window.__segfixToast = toast;

  // ---- Keyboard shortcuts (they press the player's own buttons) ----------
  const q = (sel) => document.querySelector(sel);
  function clickFirst(...sels) {
    for (const s of sels) {
      const el = q(s);
      if (el) { el.click(); return el; }
    }
    return null;
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) {
      clickFirst('[aria-label="Exit Fullscreen"]') || document.exitFullscreen();
    } else {
      clickFirst('[aria-label="Enter Fullscreen"]') ||
        document.getElementById("primaryViewer")?.requestFullscreen();
    }
  }

  // Double-click the picture to go fullscreen / back (like YouTube).
  onDoc("dblclick", (e) => {
    const t = e.target;
    if (!(t instanceof Element) || !t.closest("#videoPlayer, #primaryViewer")) return;
    if (t.closest("button, a, input, select, [role=slider], [role=menu], .player-controls .py-1\\.5, .right-side, .left-side, [class*=progress], [class*=seek], [class*=scrub], #segfix-chooser, #segfix-skipbox, .segfix-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    toggleFullscreen();
  }, true);

  const actions = {
    " ": () => {
      const b = q(".play-pause-btn");
      if (!b) return;
      const wasPlay = b.getAttribute("aria-label") === "Play";
      b.click();
      toast(wasPlay ? ICONS.play : ICONS.pause);
    },
    k:   () => actions[" "](),
    ArrowLeft:  () => clickFirst('[aria-label="Rewind 10 Seconds"]') && toast(ICONS.back + "10", "left"),
    j:          () => actions.ArrowLeft(),
    ArrowRight: () => clickFirst('[aria-label="Forward 10 Seconds"]') && toast("10" + ICONS.fwd, "right"),
    l:          () => actions.ArrowRight(),
    m: () => {
      const b = q('[aria-label="Mute"]') || q('[aria-label="Unmute"]');
      if (!b) return;
      const wasMute = b.getAttribute("aria-label") === "Mute";
      b.click();
      toast(wasMute ? ICONS.muted : ICONS.sound);
    },
    f: () => toggleFullscreen(),
    g: () => { const b = findLiveButton(); if (b) { b.click(); toast('<span class="live-dot"></span>LIVE'); } },
  };

  onDoc(
    "keydown",
    (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!document.getElementById("primaryViewer")) return;
      const key = e.shiftKey && /^d$/i.test(e.key) ? "D" : e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const fn = actions[key === " " ? " " : key];
      if (chooserOpen() && (key === "Enter" || key === "Escape" || key === "ArrowUp" || key === "ArrowDown")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (key === "ArrowUp") chooserMove(-1);
        else if (key === "ArrowDown") chooserMove(1);
        else if (key === "Enter") chooseStart(chooserSelected());
        else closeChooser(true);
        return;
      }
      if (!fn) return;
      // Enter only belongs to us while a Skip button is on screen.
      if (key === "Enter") { const b = document.getElementById("segfix-skipbox"); if (!b || !b.classList.contains("show")) return; }
      e.preventDefault();
      e.stopImmediatePropagation();
      fn();
    },
    true
  );

  // ---- Start position: From start / Live -------------------------------
  // Uses the player's own seek commands. "From start" goes to tip-off / puck
  // drop when the play-by-play is known (otherwise the very start). "Live" is
  // only offered while the game is actually live.
  const WATCH_RE = /^\/(events\/[^/]+\/show\/watch|video\/)/;
  const PENDING_KEY = "segfix-pending-start";

  function getRouter() {
    const el = document.getElementById("app-wrapper");
    return el && el.__vue_app__ && el.__vue_app__.config.globalProperties.$router;
  }
  function installGuard() {} // kept for older callers

  function findStartOver() {
    return q('.player-controls button[title="START OVER"]') || q('button[title="START OVER"]');
  }
  function playerLiveButton() {
    const scope = q(".player-controls") || document.getElementById("primaryViewer");
    if (!scope) return null;
    for (const el of scope.querySelectorAll("button, div, span")) {
      if (el.closest(".segfix-starts")) continue;
      if (el.children.length === 0 && el.textContent.trim().toUpperCase() === "LIVE") {
        return el.closest("button") || el;
      }
    }
    return null;
  }
  function findLiveButton() { return playerLiveButton(); }

  // From start: the very beginning of the video (includes the pregame show).
  function goFromStart() {
    const p = bmPlayer();
    if (p) {
      try {
        if (p.isLive()) p.timeShift(p.getMaxTimeShift() + 1);
        else p.seek(0);
        return true;
      } catch (e) {}
    }
    const b = findStartOver();
    if (b) { b.click(); toast("From start"); return true; }
    return false;
  }
  // From tip-off: ~3 seconds before the opening tip / puck drop (from play-by-play).
  const TIP_LEAD = 3;
  function goTipOff() {
    const tip = gameStartEpoch();
    if (bmPlayer() && tip != null && seekEpoch(tip - TIP_LEAD)) return true;
    // No tip-off time (game hasn't tipped yet, or no play-by-play): a live game
    // that hasn't started -> live is right before tip-off; otherwise the start.
    if (isLiveNow()) return goLive();
    return goFromStart();
  }
  function goLive() {
    const p = bmPlayer();
    try { if (p && p.isLive()) { p.timeShift(0); return true; } } catch (e) {}
    const b = playerLiveButton();
    if (b) { b.click(); toast('<span class="live-dot"></span>LIVE'); return true; }
    return false;
  }
  function doStart(sp) { coveredJump(sp === "tip" ? "tip" : sp === "0" ? "start" : "live"); return true; }

  // ---- Covered jumps: hide the video until it's playing at the right spot --
  function coverPlayer(label) {
    const host = document.getElementById("videoPlayer") || document.getElementById("primaryViewer");
    if (!host) return null;
    let c = document.getElementById("segfix-cover");
    if (!c) {
      c = document.createElement("div");
      c.id = "segfix-cover";
      c.innerHTML = '<div class="cv-spin"></div><div class="cv-label"></div>';
      host.appendChild(c);
    }
    c.classList.remove("leaving");
    c.querySelector(".cv-label").textContent = label || "";
    return c;
  }
  function uncoverPlayer() {
    const c = document.getElementById("segfix-cover");
    if (!c) return;
    c.classList.add("leaving");
    setTimeout(() => c.remove(), 350);
  }
  // Where the player's own clock should end up for each choice, or null if unknown.
  function targetFor(action) {
    const p = bmPlayer();
    if (!p) return null;
    try {
      if (p.isLive()) {
        const liveEdge = p.getCurrentTime() - p.getTimeShift();
        if (action === "tip") { const tip = gameStartEpoch(); return tip != null ? tip - TIP_LEAD : liveEdge; }
        if (action === "start") return liveEdge + p.getMaxTimeShift() + 1;
        if (action === "live") return liveEdge;
      } else {
        if (action === "tip") { const tip = gameStartEpoch(); const at = tip != null ? playbackFromEpoch(tip - TIP_LEAD, false) : null; if (at != null) return at; }
        if (action === "tip" || action === "start") return 0;
      }
    } catch (e) {}
    return null;
  }
  // Start playback and make sure it stays playing (SEG+'s own UI can lag
  // behind or re-pause): press its play button if needed, for up to ~4s.
  async function ensurePlaying() {
    let playing = 0;
    for (let i = 0; i < 16 && playing < 6; i++) {
      const p = bmPlayer();
      let paused = true;
      try { paused = p.isPaused(); } catch (e) {}
      if (!paused) playing++;
      else {
        playing = 0;
        const b = q(".play-pause-btn");
        if (b && b.getAttribute("aria-label") === "Play") b.click();
        else {
          try { await p.play(); }
          catch (e) { try { await document.querySelector("#primaryViewer video")?.play(); } catch (_) {} }
        }
      }
      await sleep(250);
    }
  }
  // Pause, jump, wait until the picture is really at the target, then reveal + play.
  async function coveredJump(action) {
    const labels = { tip: pbp.hockey ? "Heading to puck drop…" : "Heading to tip-off…", start: "Going to the start…", live: "Going live…" };
    coverPlayer(labels[action] || "Loading…");
    const p = bmPlayer();
    try { if (p.isMuted()) p.unmute(); if (p.getVolume() < 5) p.setVolume(60); } catch (e) {}
    try { p.pause(); } catch (e) {}
    if (action === "tip") for (let i = 0; i < 30 && gameStartEpoch() == null; i++) await sleep(400); // up to 12s for play-by-play
    const ok = action === "tip" ? goTipOff() : action === "start" ? goFromStart() : action === "live" ? goLive() : true;
    const target = targetFor(action);
    const v = document.querySelector("#primaryViewer video");
    for (let i = 0; i < 60; i++) {           // up to ~12s
      await sleep(200);
      let now = null;
      try { now = bmPlayer().getCurrentTime(); } catch (e) {}
      const arrived = target == null || (now != null && Math.abs(now - target) < 4);
      if (ok && arrived && v && !v.seeking && v.readyState >= 3) break;
    }
    try { await bmPlayer().play(); } catch (e) {}
    await sleep(350);                        // let the first frames paint
    uncoverPlayer();
    ensurePlaying();
  }

  // After opening a game from a card, wait until the player is ready, then go.
  function playerReady() {
    const p = bmPlayer();
    try { return !!(p && (p.isLive() || p.getDuration() > 0) && q(".play-pause-btn")); } catch (e) { return false; }
  }
  let pendingRunning = false;
  async function runPendingStart() {
    if (pendingRunning || !WATCH_RE.test(location.pathname)) return;
    let p;
    try { p = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null"); } catch (e) {}
    if (!p || Date.now() - p.t > 60000) return;
    pendingRunning = true;
    try {
      // Cover right away so the old spot never shows, and keep it paused.
      for (let i = 0; i < 60 && !coverPlayer(p.sp === "tip" ? (p.hockey ? "Heading to puck drop…" : "Heading to tip-off…") : p.sp === "0" ? "Going to the start…" : "Going live…"); i++) await sleep(100);
      for (let i = 0; i < 120 && !playerReady(); i++) { try { bmPlayer()?.pause(); } catch (e) {} await sleep(250); }
      await coveredJump(p.sp === "tip" ? "tip" : p.sp === "0" ? "start" : "live");
    } finally {
      try { sessionStorage.removeItem(PENDING_KEY); } catch (e) {}
      pendingRunning = false;
    }
  }

  const START_LABELS = /^(resume|watch|watch now|watch live|play|reanudar|ver|ver ahora)$/i;

  function makeStartRow(onPick, withLive) {
    const row = document.createElement("div");
    row.className = "segfix-starts";
    row.innerHTML =
      '<button type="button" data-sp="0" title="The very beginning (includes pregame)">' +
      '<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 6.2v11.6a1 1 0 0 1-1.55.83L10 12.83a1 1 0 0 1 0-1.66l8.45-5.8A1 1 0 0 1 20 6.2z"/></svg>From start</button>' +
      '<button type="button" data-sp="tip" title="Right at the opening tip">' +
      '<svg viewBox="0 0 24 24"><path d="M5 4h14v2.5H5zM6.2 20h11.6a1 1 0 0 0 .83-1.55L12.83 9.7a1 1 0 0 0-1.66 0l-5.8 8.75A1 1 0 0 0 6.2 20z"/></svg>From tip-off</button>' +
      '<button type="button" data-sp="-1" title="Jump to live" class="segfix-live-btn"><span class="live-dot"></span>Live</button>';
    if (!withLive) row.querySelector(".segfix-live-btn").remove();
    row.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-sp]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      onPick(b.dataset.sp);
    });
    return row;
  }

  // Hockey or basketball wording for a start row: "puck drop" vs "tip-off".
  function setStartRowSport(row, hockey) {
    const b = row && row.querySelector('button[data-sp="tip"]');
    if (!b || b.dataset.hockey === String(hockey)) return;
    b.dataset.hockey = String(hockey);
    b.title = hockey ? "Right at the opening face-off" : "Right at the opening tip";
    b.lastChild.nodeValue = hockey ? "From puck drop" : "From tip-off";
  }
  // Is this card a Mammoth game? (multiview cards that also show the Jazz stay basketball)
  function cardIsHockey(btn) {
    const card = btn.closest(".schedule-tile-preview, .schedule-tile, tr, [class*='tile']") || btn.parentElement;
    let t = "";
    for (let el = card, i = 0; el && i < 4; el = el.parentElement, i++) {
      t = el.textContent || "";
      if (/Mammoth|Jazz|Stars/i.test(t) || (el.matches && el.matches(".schedule-tile-preview, .schedule-tile"))) break;
    }
    return /Mammoth/i.test(t) && !/Jazz/i.test(t);
  }

  // Is this card for a game that's live right now? (it shows a LIVE badge)
  function cardIsLive(btn) {
    const card = btn.closest(".schedule-tile-preview, .schedule-tile, tr, [class*='tile']") || btn.parentElement;
    for (let el = card, i = 0; el && i < 4; el = el.parentElement, i++) {
      for (const t of el.querySelectorAll("div, span, p")) {
        if (t.children.length === 0 && t.textContent.trim().toUpperCase() === "LIVE" && !t.closest(".segfix-starts")) return true;
      }
      if (el.matches && el.matches(".schedule-tile-preview, .schedule-tile")) break;
    }
    return false;
  }

  // Is this button inside a pop-up fixed over the page (not the hover card)?
  function modalPanelFor(btn) {
    let fixed = null;
    for (let el = btn.parentElement; el && el !== document.body; el = el.parentElement) {
      if (getComputedStyle(el).position === "fixed") { fixed = el; break; }
    }
    if (!fixed || fixed.closest("#primaryViewer")) return null;
    // The visible panel: the first ancestor much wider than the button's column.
    const holder = btn.parentElement;
    let prevW = holder.getBoundingClientRect().width;
    const path = [];
    for (let el = holder.parentElement; el && el !== fixed.parentElement; el = el.parentElement) {
      const w = el.getBoundingClientRect().width;
      if (w > prevW * 1.4 && w > 500) return { panel: el, path };
      path.push(el);
      prevW = Math.max(prevW, w);
    }
    return null;
  }
  function layoutModal(btn) {
    const holder = btn.parentElement;
    const row = holder && (holder.nextElementSibling?.classList.contains("segfix-starts") ? holder.nextElementSibling : holder.querySelector(":scope > .segfix-starts"));
    if (!row || holder.classList.contains("segfix-modal-row")) return;
    const found = modalPanelFor(btn);
    if (!found) return;
    // Let every wrapper between the buttons and the panel use the full width.
    for (const el of found.path) { el.style.width = "100%"; el.style.maxWidth = "none"; el.style.flex = "1 1 auto"; }
    holder.classList.add("segfix-modal-row");
    holder.appendChild(row);         // same row as Watch
    row.classList.add("segfix-in-modal");
    // Match our buttons' height to Watch Now (once it's back on one line).
    requestAnimationFrame(() => {
      const h = Math.round(btn.getBoundingClientRect().height);
      if (h >= 32 && h <= 64) row.style.setProperty("--sf-watch-h", h + "px");
    });
  }

  // Game cards / schedule rows: add the buttons under Resume / Watch.
  function decorateCards() {
    for (const btn of document.querySelectorAll("button:not([data-segfix])")) {
      if (btn.closest("#primaryViewer, .segfix-starts")) continue;
      if (!START_LABELS.test(btn.textContent.trim())) continue;
      btn.dataset.segfix = "1";
      const holder = btn.parentElement;
      if (!holder || holder.querySelector(":scope > .segfix-starts") || holder.nextElementSibling?.classList.contains("segfix-starts")) continue; // already has buttons
      const hockey = cardIsHockey(btn);
      const row = makeStartRow((sp) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ sp, t: Date.now(), hockey })); } catch (e) {}
        toast(sp === "tip" ? (hockey ? "Opening at puck drop…" : "Opening at tip-off…") : sp === "0" ? "Opening from the start…" : "Opening live…");
        btn.click();
      }, cardIsLive(btn));
      setStartRowSport(row, hockey);
      holder.insertAdjacentElement("afterend", row);
    }
    // The enlarged game pop-up (click a card without hovering first): put
    // Watch / From start / From tip-off (/ Live) in one full-width row.
    for (const btn of document.querySelectorAll("button[data-segfix]")) layoutModal(btn);
    // Live games: the site's "Watch Now" button reads "Watch Live".
    for (const btn of document.querySelectorAll("button[data-segfix]")) {
      if (!cardIsLive(btn)) continue;
      const walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT);
      let tn;
      while ((tn = walker.nextNode())) {
        if (/^\s*watch now\s*$/i.test(tn.nodeValue)) tn.nodeValue = tn.nodeValue.replace(/watch now/i, "Watch Live");
      }
    }
    // LIVE badges can appear after the buttons were added: keep Live in sync.
    for (const row of document.querySelectorAll(".segfix-starts:not(.segfix-starts-top)")) {
      const main = row.parentElement.querySelector(":scope > button[data-segfix]") ||
        (row.previousElementSibling && row.previousElementSibling.querySelector("button[data-segfix]"));
      if (main) setLiveButton(row, cardIsLive(main));
    }
  }

  // Watch page: same buttons in the top bar. Live only while the game is live.
  function decorateWatchPage() {
    if (!WATCH_RE.test(location.pathname)) return;
    const pip = document.querySelector(".nav-pip-selector");
    if (!pip) return;
    let row = pip.parentElement.querySelector(".segfix-starts");
    if (!row) {
      row = makeStartRow((sp) => {
        if (!doStart(sp)) toast(sp === "0" ? "Start isn't available here" : "Already live");
      }, false);
      row.classList.add("segfix-starts-top");
      pip.insertAdjacentElement("afterend", row);
    }
    setStartRowSport(row, pbp.hockey);
    const p = bmPlayer();
    let live = false, behind = false;
    try { live = !!(p && p.isLive()); behind = live && p.getTimeShift() < -20; } catch (e) {}
    setLiveButton(row, behind);
  }
  // Add or remove the Live button (removed, not hidden, so no stylesheet can show it).
  function setLiveButton(row, on) {
    const lb = row.querySelector(".segfix-live-btn");
    if (on && !lb) {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.sp = "-1"; b.title = "Jump to live"; b.className = "segfix-live-btn";
      b.innerHTML = '<span class="live-dot"></span>Live';
      row.appendChild(b);
    } else if (!on && lb) lb.remove();
  }

  // ---- Auto-answer "Are you still watching?" ----------------------------
  const STILL_RE = /still watching|sigo viendo|seguir viendo|todav[ií]a/i;
  function dismissStillWatching() {
    for (const b of document.querySelectorAll("button")) {
      if (b.offsetParent !== null && STILL_RE.test(b.textContent)) {
        b.click();
        toast("Still watching ✓");
      }
    }
  }

  // ---- Team records (spoiler-safe: only games before this game's date) ----
  const NBA = {
    hawks: "atl", celtics: "bos", nets: "bkn", hornets: "cha", bulls: "chi", cavaliers: "cle",
    mavericks: "dal", mavs: "dal", nuggets: "den", pistons: "det", warriors: "gs", rockets: "hou",
    pacers: "ind", clippers: "lac", lakers: "lal", grizzlies: "mem", heat: "mia", bucks: "mil",
    timberwolves: "min", wolves: "min", pelicans: "no", knicks: "ny", thunder: "okc", magic: "orl",
    "76ers": "phi", sixers: "phi", suns: "phx", trailblazers: "por", blazers: "por", kings: "sac",
    spurs: "sa", raptors: "tor", jazz: "utah", wizards: "wsh",
  };
  const NHL = {
    ducks: "ana", bruins: "bos", sabres: "buf", flames: "cgy", hurricanes: "car", blackhawks: "chi",
    avalanche: "col", bluejackets: "cbj", stars: "dal", redwings: "det", oilers: "edm", panthers: "fla",
    kings: "la", wild: "min", canadiens: "mtl", predators: "nsh", devils: "nj", islanders: "nyi",
    rangers: "nyr", senators: "ott", flyers: "phi", penguins: "pit", sharks: "sj", kraken: "sea",
    blues: "stl", lightning: "tb", mapleleafs: "tor", leafs: "tor", canucks: "van",
    goldenknights: "vgk", capitals: "wsh", jets: "wpg", mammoth: "utah",
  };

  // Works on a page slug ("heat_jazz_261110") or a title ("Miami Heat at Utah Jazz").
  function parseMatchup(slug, dateOverride) {
    const m = slug.match(/(\d{2})(\d{2})(\d{2})$/);
    const date = dateOverride || (m ? new Date(2000 + +m[1], +m[2] - 1, +m[3]) : new Date());
    const base = slug.replace(/[_-]?\d{6}$/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    let sport, table;
    if (base.includes("mammoth")) { sport = "hockey/nhl"; table = NHL; }
    else if (base.includes("jazz")) { sport = "basketball/nba"; table = NBA; }
    else return null; // G League etc.: no public records feed
    const hits = [];
    for (const [nick, abbr] of Object.entries(table)) {
      const i = base.indexOf(nick);
      if (i >= 0 && !hits.some((h) => h.abbr === abbr || (i >= h.i && i < h.i + h.nick.length))) {
        hits.push({ nick, abbr, i });
      }
    }
    hits.sort((a, b) => a.i - b.i);
    if (hits.length < 2) return null;
    return { sport, date, teams: hits.slice(0, 2), hockey: sport.startsWith("hockey") };
  }

  // Each team's current season record (same as ESPN shows today).
  async function teamRecord(sport, abbr, before, hockey) {
    const key = `segfix-rec4:${sport}:${abbr}:${new Date().toDateString()}`;
    try { const c = sessionStorage.getItem(key); if (c) return JSON.parse(c); } catch (e) {}
    const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${abbr}/schedule`);
    const j = await r.json();
    const parts = String(j.team.recordSummary || "0-0").split("-").map((x) => parseInt(x, 10) || 0);
    const [w, l, otl] = [parts[0] || 0, parts[1] || 0, parts[2] || 0];
    let color = "#" + (j.team.color || "888888");
    // Very dark team colors (e.g. black) disappear on the dark bar: lighten them.
    const hex = color.slice(1);
    const lum = (0.2126 * parseInt(hex.slice(0, 2), 16) + 0.7152 * parseInt(hex.slice(2, 4), 16) + 0.0722 * parseInt(hex.slice(4, 6), 16)) / 255;
    if (!(lum > 0.06)) color = "#5b6475";
    const out = {
      abbr: j.team.abbreviation,
      name: j.team.name || j.team.abbreviation,
      logo: j.team.logo || "",
      color,
      w, l, otl,
      rec: hockey ? `${w}-${l}-${otl}` : `${w}-${l}`,
    };
    try { sessionStorage.setItem(key, JSON.stringify(out)); } catch (e) {}
    return out;
  }

  let recordsFor = null;
  async function decorateRecords() {
    const host = document.querySelector("#primaryViewer > div:has(.nav-pip-selector)");
    if (!WATCH_RE.test(location.pathname) || !host) return;
    const slug = gameSlug() || (playerProps().title ? "title:" + playerProps().title : null);
    if (!slug) return;
    const existing = host.querySelector(":scope > .segfix-matchup");
    if (existing && existing.dataset.slug === slug) return;
    if (recordsFor === slug) return; // fetch already in flight
    existing?.remove();
    const info = currentMatchup();
    if (!info) return;
    recordsFor = slug;
    try {
      const [away, home] = await Promise.all(
        info.teams.map((t) => teamRecord(info.sport, t.abbr, info.date, info.hockey))
      );
      const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      const rec = (t) => info.hockey
        ? `<em>${esc(t.w)}</em>&ndash;${esc(t.l)}&ndash;${esc(t.otl)}`
        : `<em>${esc(t.w)}</em>&ndash;${esc(t.l)}`;
      const team = (t, side) =>
        `<div class="sb-team ${side}" style="--tc:${esc(t.color)}">` +
          `<span class="sb-logo">${t.logo ? `<img src="${esc(t.logo.replace("/500/", "/500-dark/"))}" data-fallback="${esc(t.logo)}" alt="">` : ""}</span>` +
          `<span class="sb-name"><b>${esc(t.name)}</b></span>` +
        `</div>`;
      const el = document.createElement("div");
      el.className = "segfix-matchup";
      el.dataset.slug = slug;
      el.title = "";
      el.style.setProperty("--away", away.color);
      el.style.setProperty("--home", home.color);
      el.innerHTML = team(away, "away") + `<div class="sb-vs">AT</div>` + team(home, "home");
      // Dark-background logo first; fall back to the regular logo, then to nothing.
      el.querySelectorAll(".sb-logo img").forEach((img) => {
        img.addEventListener("error", () => {
          if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback;
          else img.remove();
        });
      });
      const target = document.querySelector("#primaryViewer > div:has(.nav-pip-selector)");
      if (target && (gameSlug() || ("title:" + playerProps().title)) === slug) {
        target.querySelector(":scope > .segfix-matchup")?.remove();
        target.appendChild(el);
      }
    } catch (e) {
      // Records are a nice-to-have; fail quietly.
    } finally {
      recordsFor = null;
    }
  }

  // ---- Skip the commercial break ----------------------------------------
  // SEG+ splices commercials into the stream and knows each break's start/end.
  // It passes an "inAdBreak" flag to its player component; we read that same
  // flag and keep pressing the player's own +10s button until the break is over.
  // If the break list and the current time are known, we jump most of the way at once.

  // 1) Find the player component (the one that receives the inAdBreak prop).
  let playerInst = null;
  function findPlayerInstance() {
    if (playerInst && playerInst.isMounted && !playerInst.isUnmounted) return playerInst;
    playerInst = null;
    const root = document.getElementById("app-wrapper");
    if (!root || !root._vnode) return null;
    const seen = new Set();
    const stack = [root._vnode];
    while (stack.length) {
      const vn = stack.pop();
      if (!vn || typeof vn !== "object") continue;
      const c = vn.component;
      if (c && !seen.has(c)) {
        seen.add(c);
        if (c.props && Object.prototype.hasOwnProperty.call(c.props, "inAdBreak")) {
          playerInst = c;
          return c;
        }
        stack.push(c.subTree);
      }
      if (Array.isArray(vn.children)) for (const ch of vn.children) stack.push(ch);
      if (vn.suspense) stack.push(vn.suspense.activeBranch);
    }
    return null;
  }

  // 2) Track the player's current time by listening to its own timeUpdate event.
  let lastPlayerTime = null;
  function hookTimeUpdates(inst) {
    const vp = inst && inst.vnode && inst.vnode.props;
    if (!vp || !vp.onTimeUpdate || vp.onTimeUpdate.__segfix) return;
    const orig = vp.onTimeUpdate;
    const wrapped = function (t, ...rest) { if (typeof t === "number") lastPlayerTime = t; return orig.call(this, t, ...rest); };
    wrapped.__segfix = true;
    vp.onTimeUpdate = wrapped;
  }

  // 3) Capture the ad-break list ("avails") when the site downloads it.
  let breaks = [];
  function noteAvails(text) {
    if (!text || text.indexOf('"avails"') < 0) return;
    try {
      const j = JSON.parse(text);
      if (Array.isArray(j.avails)) {
        breaks = j.avails.map((a) => ({ start: a.startTimeInSeconds, end: a.startTimeInSeconds + a.durationInSeconds }));
      }
    } catch (e) {}
  }
  // Also look inside the stream's playlists for broadcast ad cues (SCTE-35),
  // and remember a little of what we saw for the diagnostics panel (Shift+D).
  const diag = { manifests: 0, cueSamples: [], cueCount: 0, adJson: [], lastManifestUrl: "" };
  const CUE_RE = /#EXT-X-CUE-OUT[^\n]*|#EXT-X-CUE-IN[^\n]*|#EXT-X-CUE-OUT-CONT[^\n]*|#EXT-X-DATERANGE[^\n]*|#EXT-OATCLS-SCTE35[^\n]*|#EXT-X-SCTE35[^\n]*|#EXT-X-ASSET[^\n]*|<EventStream[^>]*>|<Event [^>]*>/g;
  function noteResponse(url, text) {
    if (typeof text !== "string" || !text) return;
    noteAvails(text);
    const head = text.slice(0, 200);
    if (/\.m3u8|\.mpd/i.test(url) || head.startsWith("#EXTM3U") || head.includes("<MPD")) {
      diag.manifests++;
      if (text.includes("<MPD")) { diag.lastMpd = text.length < 3e6 ? text : text.slice(0, 3e6); onPlayerManifest(url, text); }
      diag.lastManifestUrl = url.split("?")[0].slice(-80);
      const cues = text.match(CUE_RE);
      if (cues) {
        diag.cueCount += cues.length;
        for (const c of cues.slice(0, 3)) {
          if (!diag.cueSamples.includes(c)) diag.cueSamples.push(c.slice(0, 160));
        }
        diag.cueSamples = diag.cueSamples.slice(-4);
      }
    } else if (/avail|"ads"|adBreak|vast|tracking/i.test(head)) {
      diag.adJson.push(url.split("?")[0].slice(-70));
      diag.adJson = diag.adJson.slice(-3);
    }
  }
  // =========================================================================
  //  STREAM TIMELINE: one clock for everything
  //  Every game segment (DASH Period) carries the broadcast clock in its video
  //  timestamps (presentationTimeOffset / timescale, seconds since 1970). That
  //  holds for live streams, finished recordings and ad-stitched streams, so
  //  break times are kept on that clock ("stream time") and converted to the
  //  player's own position per segment, never with one global offset.
  //  Inserted-ad Periods carry no stamp: they sit where the game stopped.
  // =========================================================================
  const isoDur = (d) => {
    const m = /PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?/.exec(d || "");
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  };
  // Our own requests use the untouched fetch and are remembered, so they can
  // never be mistaken for the player's manifest.
  const rawFetch = window.fetch.bind(window);
  const ownUrls = new Set();
  function ownFetch(url) { ownUrls.add(url); return rawFetch(url); }
  // The raw broadcast-origin path (/media/<recording>/...) is only ever
  // fetched by us (any copy of this script); the player uses /v1/dash/ or archive-.
  const isOwnManifest = (url) => ownUrls.has(url) || /^https:\/\/video-[a-z0-9-]+\.kiswe\.com\/media\//.test(String(url));
  const recIdOf = (url) => (String(url || "").match(/\/media\/(kiswe_[A-Za-z0-9_]+)\//) || [])[1] || null;
  // Parse an MPD into: segments [{rel, epoch, ad}] (rel = position in this
  // manifest's own timeline), exact breaks [{start, end|null}] on the stream
  // clock, and whether it's a finished recording.
  function parseManifest(xml) {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const mpd = doc.documentElement;
    if (!mpd || !/mpd/i.test(mpd.localName || "") || doc.getElementsByTagName("parsererror").length) return null;
    const isStatic = mpd.getAttribute("type") === "static";
    const ast = isStatic ? 0 : Date.parse(mpd.getAttribute("availabilityStartTime") || "1970-01-01T00:00:00Z") / 1000;
    const isAd = (pe) => /_\d+$/.test(pe.getAttribute("id") || "") ||
      [...pe.getElementsByTagNameNS("*", "BaseURL")].some((bu) => /\/dashsegment\//.test(bu.textContent || ""));
    const stamp = (pe) => {
      for (const as of pe.getElementsByTagNameNS("*", "AdaptationSet")) {
        if (!/video/.test(as.getAttribute("contentType") || as.getAttribute("mimeType") || "")) continue;
        for (const st of as.getElementsByTagNameNS("*", "SegmentTemplate")) {
          if (st.hasAttribute("presentationTimeOffset")) return +st.getAttribute("presentationTimeOffset") / +(st.getAttribute("timescale") || 1);
        }
      }
      return null;
    };
    const segs = [], events = [];
    let anchor = null;   // last stamped segment {rel, epoch}
    for (const pe of doc.getElementsByTagNameNS("*", "Period")) {
      const rel = (isStatic ? 0 : ast) + isoDur(pe.getAttribute("start"));
      const ad = isAd(pe);
      const s = ad ? null : stamp(pe);
      // Live manifests: position == stream clock. Recordings: use the stamp.
      const epoch = !isStatic ? rel : s != null ? s : anchor ? anchor.epoch + (rel - anchor.rel) : null;
      if (!ad && epoch != null) anchor = { rel, epoch };
      segs.push({ rel, epoch, ad, id: pe.getAttribute("id") || "" });
      if (ad || epoch == null) continue;
      for (const es of pe.getElementsByTagNameNS("*", "EventStream")) {
        if (!/scte35/i.test(es.getAttribute("schemeIdUri") || "")) continue;
        const ts = +(es.getAttribute("timescale") || 1);
        const pto = +(es.getAttribute("presentationTimeOffset") || 0);
        for (const ev of es.getElementsByTagNameNS("*", "Event")) {
          const ins = ev.getElementsByTagNameNS("*", "SpliceInsert")[0];
          if (!ins || ins.getAttribute("spliceEventCancelIndicator") === "true") continue;
          const pt = +(ev.getAttribute("presentationTime") || 0);
          const off = (pt - pto) / ts;
          if (!(off >= -1 && off < 86400)) continue;          // stamps on another clock: ignore
          events.push({ at: epoch + off, out: ins.getAttribute("outOfNetworkIndicator") === "true",
            dur: ev.hasAttribute("duration") ? +ev.getAttribute("duration") / ts : null });
        }
      }
    }
    // Breaks: marker pairs (out -> in) and runs of inserted-ad segments.
    const raw = [];
    events.sort((a, b) => a.at - b.at);
    let open = null;
    for (const e of events) {
      if (e.out) { if (open == null) open = e.at; }
      else if (open != null) { raw.push({ start: open, end: e.at }); open = null; }
    }
    // A finished recording that ends inside a break: the break ends with it.
    let recEnd = null;
    if (isStatic && anchor) {
      // Prefer the last segment's own duration (the overall length isn't
      // always consistent with the segment starts).
      const pes = doc.getElementsByTagNameNS("*", "Period"), lastPe = pes[pes.length - 1], last = segs[segs.length - 1];
      if (lastPe && lastPe.hasAttribute("duration") && last.epoch != null) recEnd = last.epoch + isoDur(lastPe.getAttribute("duration"));
      else recEnd = anchor.epoch + (isoDur(mpd.getAttribute("mediaPresentationDuration")) - anchor.rel);
    }
    if (open != null) raw.push({ start: open, end: recEnd != null && recEnd > open ? recEnd : null });
    for (let i = 0; i < segs.length; i++) {
      if (!segs[i].ad) continue;
      let j = i;
      while (j + 1 < segs.length && segs[j + 1].ad) j++;
      const prev = segs.slice(0, i).reverse().find((x) => !x.ad && x.epoch != null);
      let start = prev ? prev.epoch + (segs[i].rel - prev.rel) : null;
      // The splicer starts its ads at the next segment boundary, 2-4s into the
      // break; the ad segment's id ("<epoch>_<n>") holds the real break start.
      const idAt = +((segs[i].id || "").match(/^(\d{9,11})_\d+$/) || [])[1];
      if (start != null && idAt && idAt <= start && start - idAt < 10 && (!prev || idAt >= prev.epoch)) start = idAt;
      const next = segs[j + 1];
      if (start != null) raw.push({ start, end: next && next.epoch != null ? next.epoch : recEnd });
      i = j;
    }
    return { isStatic, segs, breaks: mergeBreaks(raw) };
  }
  // Sort, join overlapping / back-to-back pieces (< 2s apart), drop nonsense.
  function mergeBreaks(list) {
    const out = [];
    for (const b of list.filter((x) => x && isFinite(x.start)).sort((x, y) => x.start - y.start)) {
      const last = out[out.length - 1];
      if (last && (last.end == null || b.start <= last.end + 2)) {
        last.end = last.end == null || b.end == null ? null : Math.max(last.end, b.end);
      } else out.push({ start: b.start, end: b.end });
    }
    return out.filter((b) => b.end == null || (b.end - b.start >= 5 && b.end - b.start <= 1200));
  }

  // ---- The player's own manifest -----------------------------------------
  const tl = { url: "", recId: null, isStatic: false, segs: [], liveBreaks: [] };
  let mediaEpoch0 = null;   // stream clock at playback position 0 (recordings)
  let mpdIsStatic = false;
  let scte = [];            // kept for the diagnostics panel
  function onPlayerManifest(url, xml) {
    if (isOwnManifest(url)) return;
    let r = null;
    try { r = parseManifest(xml); } catch (e) {}
    if (!r || !r.segs.length) return;
    const rec = recIdOf(url);
    if (rec && rec !== tl.recId) { tl.liveBreaks = []; }      // a different recording
    tl.url = url; tl.recId = rec || tl.recId; tl.isStatic = r.isStatic; tl.segs = r.segs;
    mpdIsStatic = r.isStatic;
    mediaEpoch0 = r.isStatic && r.segs[0].epoch != null ? r.segs[0].epoch - r.segs[0].rel : null;
    if (!r.isStatic) {
      // Live: keep breaks that rolled out of the manifest window.
      tl.liveBreaks = mergeBreaks(tl.liveBreaks.filter((b) => b.end != null).concat(r.breaks));
      learnOrigin(url);
    }
    scte = r.breaks.map((b) => ({ at: b.start, out: "true", dur: b.end != null ? b.end - b.start : null }));
    if (r.isStatic && tl.recId) loadOriginBreaks(tl.recId);
  }
  // Player position <-> stream clock, segment by segment.
  function epochFromPlayback(t, live) {
    if (live) return t;
    let seg = null;
    for (const s of tl.segs) { if (s.rel <= t + 1e-6) seg = s; else break; }
    if (!seg || seg.ad || seg.epoch == null) return null;
    return seg.epoch + (t - seg.rel);
  }
  function playbackFromEpoch(e, live) {
    if (live) return e;
    for (let i = 0; i < tl.segs.length; i++) {
      const s = tl.segs[i], n = tl.segs[i + 1];
      if (s.ad || s.epoch == null) continue;
      const len = n ? n.rel - s.rel : Infinity;
      if (e >= s.epoch - 0.01 && e < s.epoch + len) return s.rel + (e - s.epoch);
    }
    return null;
  }

  // Which manifest is the player using right now? (watch every .mpd request)
  let lastMpdSeen = "";
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (/\.mpd(\?|$)/.test(e.name) && !isOwnManifest(e.name)) lastMpdSeen = e.name;
    }).observe({ type: "resource", buffered: true });
  } catch (e) {}
  const noQuery = (u) => String(u || "").split("?")[0];
  // Switching games: forget the old clock at once (never map with a stale one).
  let tlPath = location.pathname;
  function resetTimeline() {
    tl.url = ""; tl.recId = null; tl.isStatic = false; tl.segs = []; tl.liveBreaks = [];
    mediaEpoch0 = null; mpdIsStatic = false; scte = [];
  }
  // If the player's manifest isn't the one we parsed (or we missed it, e.g. it
  // loaded before this script), fetch it ourselves.
  let manifestFetching = false;
  setInterval(async () => {
    if (location.pathname !== tlPath) { tlPath = location.pathname; resetTimeline(); }
    if (!WATCH_RE.test(location.pathname) || manifestFetching || !bmPlayer() || !lastMpdSeen) return;
    if (noQuery(lastMpdSeen) === noQuery(tl.url) && tl.segs.length) return;
    manifestFetching = true;
    try {
      const url = lastMpdSeen;
      const r = await rawFetch(url);
      if (r.ok && url === lastMpdSeen) onPlayerManifest(url, await r.text());
    } catch (e) {} finally { manifestFetching = false; }
  }, 1500);

  // ---- Replays: the broadcast's original manifest (exact markers) --------
  // The live origin keeps a finished game's full manifest for about a day.
  // Fetch it once when a replay opens, and save the breaks for good.
  const ORIGINS_KEY = "segfix-origins";
  function learnOrigin(url) {
    const host = (String(url).match(/^https:\/\/(video-[a-z0-9-]+\.kiswe\.com)\//) || [])[1];
    if (!host) return;
    try {
      const list = JSON.parse(localStorage.getItem(ORIGINS_KEY) || "[]");
      if (!list.includes(host)) localStorage.setItem(ORIGINS_KEY, JSON.stringify([host, ...list].slice(0, 6)));
    } catch (e) {}
  }
  function originHosts() {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(ORIGINS_KEY) || "[]"); } catch (e) {}
    return [...new Set([...list, "video-jazz.kiswe.com", "video-mammoth.kiswe.com"])];
  }
  const originTried = new Set();
  async function loadOriginBreaks(recId) {
    if (originTried.has(recId)) return;
    originTried.add(recId);
    const saved = readSaved(SAVE_PREFIX + "rec:" + recId);
    if (saved && saved.source === "origin") return;          // already have the complete list
    const file = (tl.url.match(/\/([^/?]+\.mpd)/) || [])[1] || "mix-stream1.mpd";
    for (const host of originHosts()) {
      try {
        const r = await ownFetch(`https://${host}/media/${recId}/${file}`);
        if (!r.ok) continue;
        const res = parseManifest(await r.text());
        const closed = res ? res.breaks.filter((b) => b.end != null) : [];
        if (!res || !res.isStatic || !closed.length) continue;
        writeSaved([SAVE_PREFIX + "rec:" + recId], closed, "origin");
        return;
      } catch (e) {}
    }
  }


  (function hookNetwork() {
    const XO = XMLHttpRequest.prototype.open;
    const XS = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.__segfixUrl = String(u || ""); return XO.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", () => {
        try {
          if (!this.responseType || this.responseType === "text") noteResponse(this.__segfixUrl, this.responseText);
          else if (this.responseType === "json") noteResponse(this.__segfixUrl, JSON.stringify(this.response));
          else if (this.responseType === "arraybuffer" && /\.m3u8|\.mpd/i.test(this.__segfixUrl)) noteResponse(this.__segfixUrl, new TextDecoder().decode(this.response));
        } catch (e) {}
      });
      return XS.apply(this, arguments);
    };
    const F = window.fetch;
    window.fetch = function (input) {
      const url = String((input && input.url) || input || "");
      return F.apply(this, arguments).then((r) => {
        try {
          const ct = r.headers.get("content-type") || "";
          if (/json|mpegurl|dash|xml|text/i.test(ct) || /\.m3u8|\.mpd/i.test(url)) r.clone().text().then((t) => noteResponse(url, t)).catch(() => {});
        } catch (e) {}
        return r;
      });
    };
  })();

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ---- Diagnostics (Shift+D panel, and the temporary debug link) ---------
  const fmt = (o, n = 300) => { try { return JSON.stringify(o).slice(0, n); } catch (e) { return String(o); } };
  function diagSnapshot() {
    const inst = findPlayerInstance();
    const pr = inst ? inst.props : null;
    const vids = [...document.querySelectorAll("#primaryViewer video, video")];
    const v = document.querySelector("#primaryViewer video");
    return {
      t: new Date().toISOString().slice(11, 19),
      path: location.pathname + location.search,
      playerFound: !!inst,
      inAdBreak: pr ? pr.inAdBreak : null,
      playerTime: lastPlayerTime,
      breaks: breaks.slice(0, 6),
      midRolls: pr ? pr.midRolls : null,
      adBreaks: pr ? pr.adBreaks : null,
      preRoll: pr ? !!pr.preRollAdTag : null,
      videos: vids.map((x) => ({ t: +x.currentTime.toFixed(2), dur: x.duration, paused: x.paused, ready: x.readyState, vis: x.offsetParent !== null, w: x.videoWidth })),
      liveLabel: !!(typeof playerLiveButton === "function" && playerLiveButton()),
      shortAdClips: adVideos().length,
      manifests: diag.manifests,
      epochNow: (() => { try { return epochNow(); } catch (e) { return null; } })(),
      lastManifest: diag.lastManifestUrl,
      cueCount: diag.cueCount,
      cueSamples: diag.cueSamples,
      adJson: diag.adJson,
      inBreakDecision: inBreak(),
      bmPlayer: !!bmPlayer(),
      guard: { skips: guardSkips, edgeCovered, exactBreaks: exactBreaks().length },
      halftimeNow: halftimeAt(playheadNow()),
      isLive: (() => { try { return bmPlayer().isLive(); } catch (e) { return null; } })(),
      savedMarkerBreaks: savedMarkerBreaks().length,
      pbp: { event: pbp.eventId, windows: pbp.windows.length, sport: pbp.sport, delay: pbp.sport ? streamDelay(pbp.sport) : null, tip: gameStartEpoch() },
      breaksNow: (() => { const a = allBreaks(); const n = epochNow(); return { exact: a.exact, ads: a.ads.length, halves: a.halves.length, epoch: n, nextAd: n && a.ads.filter((b) => b.end > n).slice(0, 2).map((b) => [+(b.start - n).toFixed(0), +(b.end - n).toFixed(0)]) }; })(),
      mediaEpoch0, mpdIsStatic,
      breakNow: scteBreakAt(playheadNow()),
      scteTotal: scte.length,
      scteNear: (() => { const v0 = document.querySelector("#primaryViewer video"); const now = v0 ? v0.currentTime : 0; return scte.filter((e) => Math.abs(e.at - now) < 900).slice(0, 12).map((e) => ({ ...e, rel: +(e.at - now).toFixed(1) })); })(),
      overlayText: [...document.querySelectorAll("#primaryViewer .player-controls, #primaryViewer [class*='ad'], #videoPlayer > div")]
        .map((e) => (e.innerText || "").trim().replace(/\s+/g, " ")).filter(Boolean).join(" | ").slice(0, 300),
    };
  }

  let diagTimer = null;
  function toggleDiag() {
    let el = document.getElementById("segfix-diag");
    if (el) { el.remove(); clearInterval(diagTimer); return; }
    el = document.createElement("pre");
    el.id = "segfix-diag";
    el.style.cssText = "position:fixed;left:16px;top:80px;z-index:2147483647;max-width:46vw;max-height:70vh;overflow:auto;margin:0;padding:12px 14px;border-radius:10px;background:rgba(0,0,0,.88);color:#b8f7c4;font:12px/1.45 ui-monospace,Menlo,monospace;white-space:pre-wrap;pointer-events:none";
    document.body.appendChild(el);
    const render = () => { el.textContent = "SEG+ Better Player diagnostics (Shift+D to close)\n" + JSON.stringify(diagSnapshot(), null, 1); };
    render();
    diagTimer = setInterval(render, 500);
  }


  // =========================================================================
  //  BREAK ENGINE: knows when a commercial / halftime is on, for any game.
  //  Everything runs on one real-world clock ("stream time"):
  //    - live:   the player's own clock already is stream time
  //    - replay: stream time = player time + the replay's built-in start time
  //  Sources, best first:
  //    1. the stream's own commercial markers (live games)          -> exact
  //    2. markers saved while this game was live (replays)          -> exact
  //    3. NBA/NHL play-by-play timestamps (any game, live or replay) -> within seconds
  // =========================================================================

  function bmPlayer() {
    const v = document.querySelector("#primaryViewer video");
    const p = v && v.parentElement && v.parentElement.player;
    return p && typeof p.getCurrentTime === "function" ? p : null;
  }
  function isLiveNow() {
    const p = bmPlayer();
    try { return !!(p && p.isLive()); } catch (e) { return false; }
  }
  // Current position as stream time (seconds since 1970), or null if unknown.
  function epochNow() {
    const p = bmPlayer();
    if (!p) return null;
    try {
      const live = p.isLive();
      if (!live && (!tl.isStatic || (lastMpdSeen && noQuery(lastMpdSeen) !== noQuery(tl.url)))) return null;   // recording's clock not known yet
      return epochFromPlayback(p.getCurrentTime(), live);
    } catch (e) { return null; }
  }
  function playheadNow() { return epochNow(); }
  // One clean jump to a stream time.
  function seekEpoch(t) {
    const p = bmPlayer();
    if (!p || t == null) return false;
    try {
      if (p.isLive()) p.timeShift(Math.min(0, p.getTimeShift() + (t - p.getCurrentTime())));
      else {
        const pos = playbackFromEpoch(t, false);
        if (pos == null) return false;
        p.seek(Math.max(0, pos));
      }
      return true;
    } catch (e) { return false; }
  }

  // ---- Exact breaks: live manifest, saved breaks, replay origin ------------
  const SAVE_PREFIX = "segfix-breaks:";
  const gameSlug = () => (location.pathname.match(/^\/events\/([^/]+)\//) || [])[1] || null;
  function playerProps() { const i = findPlayerInstance(); return i ? i.props : {}; }
  function readSaved(k) {
    try {
      const d = JSON.parse(localStorage.getItem(k) || "null");
      return d && Array.isArray(d.breaks) ? d : null;
    } catch (e) { return null; }
  }
  function writeSaved(keys, breaks, source) {
    try {
      let old = null;
      for (const k of keys) old = old || readSaved(k);
      if (old && old.source === "origin" && source !== "origin") return;   // never downgrade a complete list
      const merged = mergeBreaks(((old && old.breaks) || []).map(([a, b]) => ({ start: a, end: b }))
        .concat(breaks.filter((b) => b.end != null)));
      const json = JSON.stringify({ breaks: merged.map((b) => [+b.start.toFixed(2), +b.end.toFixed(2)]), source, saved: Date.now() });
      for (const k of keys) localStorage.setItem(k, json);
    } catch (e) {}
  }
  function gameKeys() {
    const pr = playerProps();
    const keys = [];
    if (tl.recId) keys.push(SAVE_PREFIX + "rec:" + tl.recId);      // the recording itself: best key
    const slug = gameSlug();
    if (slug) keys.push(SAVE_PREFIX + slug);
    if (pr.videoId) keys.push(SAVE_PREFIX + "vid:" + pr.videoId);
    if (pr.title) keys.push(SAVE_PREFIX + "title:" + pr.title);
    return keys;
  }
  function saveMarkers() {
    if (!isLiveNow() || !tl.liveBreaks.some((b) => b.end != null)) return;
    const keys = gameKeys();
    if (keys.length) writeSaved(keys, tl.liveBreaks, "live");
  }
  setInterval(saveMarkers, 15000);
  // Saved breaks for this recording. Each break must sit inside this video
  // (on the stream clock), so a list saved for another game can't apply.
  function savedMarkerBreaks() {
    const p = bmPlayer();
    if (!p || !tl.segs.length) return [];
    let dur = 0;
    try { dur = p.getDuration(); } catch (e) {}
    const inside = (e) => playbackFromEpoch(e, false) != null && playbackFromEpoch(e, false) <= dur + 1;
    for (const k of gameKeys()) {
      const d = readSaved(k);
      if (!d || !d.breaks.length) continue;
      const list = d.breaks.map(([a, b]) => ({ start: a, end: b })).filter((b) => inside(b.start) || inside(b.end));
      if (list.length) return list;
    }
    return [];
  }
  function liveMarkerBreaks() { return tl.liveBreaks; }
  // Every break whose timing is exact (stream clock), for this video.
  function exactBreaks() {
    if (isLiveNow()) return tl.liveBreaks.map((b) => ({ start: b.start, end: b.end, closed: b.end != null }));
    if (!tl.isStatic || mediaEpoch0 == null) return [];        // recording's clock unknown: nothing is exact
    return savedMarkerBreaks().map((b) => ({ ...b, closed: true }));
  }

  // ---- Source 3: play-by-play (works for any NBA / NHL game) --------------
  // Stream time runs slightly behind real time (broadcast delay). Default from
  // measurement; refined automatically whenever live markers are available.
  const DEFAULT_DELAY = -29;
  const delayKey = (sport) => "segfix-delay:" + sport;
  function streamDelay(sport) {
    try { const v = parseFloat(localStorage.getItem(delayKey(sport))); if (isFinite(v) && Math.abs(v) < 600) return v; } catch (e) {}
    return DEFAULT_DELAY;
  }
  const NBA_DEAD = /substitution|timeout|end period|end of|end game|challenge|replay|review|ejection|delay of game|official|jump ball violation/i;

  // Estimated break windows (in REAL time) from plays: the commercial starts
  // ~60-90s after the play that stopped the game, and the broadcast returns
  // about when the next play is logged. ESTIMATES ONLY (the broadcast delay
  // varies by tens of seconds between games): they power the manual "Skip to
  // game" pop-up when no exact timing exists, and never skip on their own.
  function pbpWindows(plays, hockey) {
    const wc = (pl) => Date.parse(pl.wallclock) / 1000;
    const pts = plays.filter((pl) => pl.wallclock);
    const raw = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = wc(pts[i]), b = wc(pts[i + 1]);
      if (b - a < 75) continue;
      if (/end game|end of game|game end/i.test(pts[i].type.text)) continue;
      // Find the play where the game actually resumes.
      let j = i + 1;
      if (hockey) { while (j < pts.length && !/face ?off/i.test(pts[j].type.text)) j++; }
      else { while (j < pts.length && NBA_DEAD.test(pts[j].type.text)) j++; }
      if (j >= pts.length) continue;
      const resume = wc(pts[j]);
      const long = resume - a >= 420;               // halftime / intermission
      const lead = long ? (hockey ? 25 : 20) : (hockey ? 12 : 3);
      const into = long ? 90 : (hockey ? 25 : 60);   // when the commercial itself usually starts
      raw.push({ start: a + into, end: resume - lead, kind: long ? "half" : "ad", resumeReal: resume });
    }
    // Merge overlapping windows (one break can produce several gaps) and drop
    // pauses too short to be a commercial.
    raw.sort((x, y) => x.start - y.start);
    const out = [];
    for (const w of raw) {
      const last = out[out.length - 1];
      if (last && w.start < last.end) {
        last.end = Math.max(last.end, w.end);
        last.resumeReal = Math.max(last.resumeReal, w.resumeReal);
        if (w.kind === "half") last.kind = "half";
      } else out.push({ ...w });
    }
    return out.filter((w) => w.end - w.start >= (w.kind === "half" ? 300 : 40));
  }

  // Which ESPN game is this? (teams from the page, date from the stream)
  const pbp = { key: null, loading: false, windows: [], plays: [], sport: null, hockey: false, tipReal: null, fetched: 0, eventId: null };
  function currentMatchup() {
    const slug = gameSlug();
    if (slug) { const m = parseMatchup(slug); if (m) return m; }
    const title = playerProps().title;
    // Replays: the recording's start (before tip-off), never the current spot,
    // so records can't include this game's result.
    const ref = !isLiveNow() && mediaEpoch0 ? mediaEpoch0 : epochNow();
    if (title) return parseMatchup(title, ref ? new Date(ref * 1000) : new Date());
    return null;
  }
  // All of a team's games: regular season, preseason and playoffs (cached).
  const scheduleCache = new Map();
  async function teamGames(sport, abbr) {
    const key = sport + ":" + abbr;
    if (scheduleCache.has(key)) return scheduleCache.get(key);
    const base = `https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${abbr}/schedule`;
    const lists = await Promise.all(["2", "1", "3"].map((t) =>
      fetch(base + "?seasontype=" + t).then((r) => r.json()).then((j) => j.events || []).catch(() => [])));
    const seen = new Set(), out = [];
    for (const ev of lists.flat()) { if (!seen.has(ev.id)) { seen.add(ev.id); out.push(ev); } }
    scheduleCache.set(key, out);
    return out;
  }
  const sameTeam = (espnAbbr, ours) => {
    const a = String(espnAbbr || "").toLowerCase(), b = String(ours || "").toLowerCase();
    return a === b || a.slice(0, 3) === b.slice(0, 3);
  };
  // Find this game on ESPN: home team's schedule, right opponent, closest date.
  async function findEspnEvent(m, refSec) {
    const [away, home] = m.teams;
    const games = await teamGames(m.sport, home.abbr);
    const vsOpp = games.filter((ev) =>
      (ev.competitions?.[0]?.competitors || []).some((c) => sameTeam(c.team?.abbreviation, away.abbr)));
    const pool = vsOpp.length ? vsOpp : games;
    let best = null;
    if (refSec != null) {
      for (const ev of pool) {
        const diff = Math.abs(Date.parse(ev.date) / 1000 - refSec);
        if (diff < 36 * 3600 && (!best || diff < best.diff)) best = { id: ev.id, diff, date: Date.parse(ev.date) / 1000 };
      }
    }
    if (!best) {   // no usable date: the most recent game against this opponent that has started
      const nowSec = Date.now() / 1000;
      for (const ev of pool) {
        const d = Date.parse(ev.date) / 1000;
        if (d <= nowSec + 3600 && (!best || d > best.date)) best = { id: ev.id, date: d };
      }
    }
    return best ? best.id : null;
  }
  // The moment to match the game by: live = now, replay = when the recording
  // started, game page = the date in its address. null = not known yet.
  function matchupRefSec(m) {
    if (isLiveNow()) return epochNow();
    if (mediaEpoch0) return mediaEpoch0;
    if (gameSlug()) return m.date.getTime() / 1000 + 12 * 3600;
    return null;
  }
  async function ensurePbp() {
    const m = currentMatchup();
    if (!m || pbp.loading) return;
    const p = bmPlayer();
    const refSec = matchupRefSec(m);
    if (refSec == null && !p) return;            // wait until the player says live vs replay
    if (refSec == null && !(Date.now() - (pbp.waitSince || (pbp.waitSince = Date.now())) > 4000)) return; // give the replay's date a moment
    const key = m.sport + ":" + m.teams.map((t) => t.abbr).join("-") + ":" + (refSec ? Math.round(refSec / 21600) : "latest");
    const stale = isLiveNow() && Date.now() - pbp.fetched > 6000; // keep live games fresh
    if (pbp.key === key && !stale && pbp.eventId) return;
    if (pbp.key === key && !pbp.eventId && Date.now() - pbp.fetched < 20000) return; // retry a miss every 20s
    pbp.loading = true;
    try {
      if (pbp.key !== key || !pbp.eventId) {
        pbp.eventId = await findEspnEvent(m, refSec);
        pbp.windows = []; pbp.plays = []; pbp.tipReal = null;
      }
      pbp.key = key; pbp.sport = m.sport; pbp.hockey = m.hockey; pbp.fetched = Date.now();
      if (!pbp.eventId) return;
      const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${m.sport}/summary?event=${pbp.eventId}`);
      const j = await r.json();
      const plays = j.plays || [];
      pbp.windows = pbpWindows(plays, m.hockey);
      // Live-action plays (real time), for "replay last play".
      pbp.plays = playMoments(plays, m.hockey);
      const first = plays.find((pl) => pl.wallclock && (m.hockey ? /face ?off/i.test(pl.type.text) : true));
      pbp.tipReal = first ? Date.parse(first.wallclock) / 1000 : null;
      calibrate();
    } catch (e) {
    } finally {
      pbp.loading = false;
    }
  }
  setInterval(() => { if (WATCH_RE.test(location.pathname)) ensurePbp(); }, 3000);

  // When both live markers and play-by-play exist, learn the exact broadcast delay.
  function calibrate() {
    if (!pbp.sport || !pbp.windows.length) return;
    const marks = liveMarkerBreaks();
    if (marks.length < 3) return;
    const d = streamDelay(pbp.sport);
    const res = [];
    for (const w of pbp.windows) {
      if (w.kind !== "ad") continue;
      const m = marks.find((mk) => Math.abs(mk.end - (w.resumeReal + d)) < 60);
      if (m) res.push(m.end - w.resumeReal);
    }
    if (res.length < 3) return;
    res.sort((x, y) => x - y);
    const med = res[Math.floor(res.length / 2)];
    try { localStorage.setItem(delayKey(pbp.sport), String(Math.round(med * 10) / 10)); } catch (e) {}
  }
  function gameStartEpoch() {
    if (pbp.tipReal == null) return null;
    return pbp.tipReal + streamDelay(pbp.sport);
  }

  // ---- Source 2b: the replay's own preview pictures (replays) ----------------
  // On replays SEG+ swaps every commercial for a "We'll be right back." slate.
  // The background helper (slate-bg.js) reads the timeline preview sheets (one
  // frame every 10s) and scores how much each frame looks like that slate; here
  // the scores become break windows on the video's own timeline. Far more
  // accurate than play-by-play estimates (which also flag timeouts that had no
  // commercial). Saved per recording, so it's done once per replay.
  const SLATE_KEY = "segfix-slate1:";
  const SLATE_STEP = 10;                    // seconds between preview frames
  const slate = { rec: null, state: "idle", runs: [], at: 0 };
  let slateReqId = 0;
  const slateWaits = new Map();
  onWin("message", (e) => {
    if (e.source !== window || !e.data || !e.data.__segfixSlateResult) return;
    const r = e.data.__segfixSlateResult;
    const w = slateWaits.get(r.id);
    if (w) { slateWaits.delete(r.id); w(r); }
  });
  function requestSlate(urls) {
    return new Promise((resolve) => {
      const id = ++slateReqId;
      const timer = window.setTimeout(() => { slateWaits.delete(id); resolve({ error: "timeout" }); }, 180000);
      slateWaits.set(id, (r) => { window.clearTimeout(timer); resolve(r); });
      window.postMessage({ __segfixSlate: { id, urls } }, location.origin);
    });
  }
  function slateBase() {
    // Radio / Spanish are mix-stream2/3 of the same recording: same picture,
    // so the main stream's preview sheets work for them too.
    const m = /^(https:\/\/archive-seg-or\.kiswe\.com\/media\/[\w.-]+\/)mix-stream\d+\.mpd$/.exec(noQuery(tl.url));
    return m ? m[1] + "mix-stream1/trickplay_256x144/" : null;
  }
  // Scores -> [[startSec, endSec], ...]: runs of 2+ slate frames. The cut-off is
  // the widest gap in the scores (slate frames sit far below everything else).
  function slateRuns(d, protoCount) {
    if (!(protoCount >= 12)) return [];                 // this replay has no slate
    const vals = d.filter((x) => x != null).sort((a, b) => a - b);
    let cut = null, gap = 0;
    for (let i = 0; i + 1 < vals.length; i++) {
      if (vals[i] < 4 || vals[i] > 25) continue;
      if (vals[i + 1] - vals[i] > gap) { gap = vals[i + 1] - vals[i]; cut = (vals[i] + vals[i + 1]) / 2; }
    }
    if (cut == null || gap < 1.5) return [];
    const runs = [];
    for (let i = 0; i < d.length;) {
      if (d[i] != null && d[i] < cut) {
        let j = i;
        while (j + 1 < d.length && d[j + 1] != null && d[j + 1] < cut) j++;
        if (j > i) runs.push([i * SLATE_STEP, (j + 1) * SLATE_STEP]);   // first slate frame .. first game frame
        i = j + 1;
      } else i++;
    }
    return runs;
  }
  async function ensureSlate() {
    if (!WATCH_RE.test(location.pathname) || !tl.isStatic) return;
    const base = slateBase();
    if (!base) return;
    const rec = tl.recId || base;
    if (slate.rec === rec && (slate.state === "done" || slate.state === "busy")) return;
    if (slate.rec === rec && slate.state === "failed" && Date.now() - slate.at < 120000) return;
    slate.rec = rec; slate.runs = [];
    try {
      const c = JSON.parse(localStorage.getItem(SLATE_KEY + rec) || "null");
      if (c && Array.isArray(c.runs)) { slate.runs = c.runs; slate.state = "done"; diag.slate = { runs: c.runs.length, saved: true }; return; }
    } catch (e) {}
    let dur = 0;
    try { dur = bmPlayer().getDuration(); } catch (e) {}
    if (!(dur > 600)) return;
    slate.state = "busy"; slate.at = Date.now();
    const n = Math.min(Math.ceil(dur / (SLATE_STEP * 10)), 400);
    const res = await requestSlate(Array.from({ length: n }, (_, i) => base + "m_" + i + ".jpg"));
    if (slate.rec !== rec) return;                      // switched games meanwhile
    slate.at = Date.now();
    if (!res || res.error || !Array.isArray(res.dist)) { slate.state = "failed"; diag.slate = (res && res.error) || "no answer"; return; }
    slate.runs = slateRuns(res.dist, res.protoCount);
    slate.state = "done";
    diag.slate = { runs: slate.runs.length, proto: res.protoCount, sheets: res.sheets };
    try { localStorage.setItem(SLATE_KEY + rec, JSON.stringify({ runs: slate.runs, t: Date.now() })); } catch (e) {}
  }
  setInterval(() => { ensureSlate(); }, 3000);
  // Slate runs -> breaks on the stream clock. Skips start ~5s into the slate's
  // 10s window and land ~3s before the first game frame (the broadcast's return).
  function slateBreaks() {
    if (slate.state !== "done" || !slate.runs.length || !tl.isStatic) return null;
    const v = document.querySelector("#primaryViewer video");
    const toEpoch = (t) => {
      const e = epochFromPlayback(t, false);
      if (e != null) return e;
      const now = epochNow();
      return now != null && v ? now - v.currentTime + t : null;
    };
    const list = [];
    for (const [a, b] of slate.runs) {
      const s = toEpoch(Math.max(0, a - 5)), e = toEpoch(b - 3);
      if (s != null && e != null && e - s > 15) list.push({ start: s, end: e });
    }
    if (!list.length) return null;
    // Halftime / intermission: slate breaks close together around the end of
    // the half. The play-by-play says where the half ended, when it's known.
    let halves = clusterHalves(list);
    if (pbp.sport && pbp.windows.length) {
      const d = streamDelay(pbp.sport);
      const halfWins = pbp.windows.filter((w) => w.kind === "half").map((w) => ({ start: w.start + d - 600, end: w.end + d + 600 }));
      halves = halves.filter((h) => halfWins.some((w) => w.start < h.end && h.start < w.end));
      // A confirmed halftime / intermission the clustering missed: span the
      // slate breaks inside it, first to last.
      for (const w of halfWins) {
        if (halves.some((h) => w.start < h.end && h.start < w.end)) continue;
        // Only +-2 min around the play-by-play break, so a normal commercial
        // shortly before the period ended can't be swallowed (with its game play).
        const inside = list.filter((b) => b.start >= w.start + 480 && b.end <= w.end - 480);
        if (inside.length >= 2) halves.push({ start: inside[0].start, end: inside[inside.length - 1].end });
      }
      halves.sort((a, b) => a.start - b.start);
    }
    return { ads: list, halves, exact: false, slate: true };
  }

  // ---- Combine sources -----------------------------------------------------
  // Returns { ads: [{start,end}], halves: [{start,end}], exact: bool } in stream time.
  // At most 4 min of studio show between halftime breaks. NHL intermissions
  // (~18 min) run longer studio segments between their commercials, so allow 7.
  const HALFTIME_GAP = 240, INTERMISSION_GAP = 420;
  const HALFTIME_MIN = 150;   // halftime breaks run longer than normal timeouts
  function clusterHalves(list) {
    const halves = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].end - list[i].start < HALFTIME_MIN) continue;
      let j = i;
      const gap = pbp.hockey ? INTERMISSION_GAP : HALFTIME_GAP;
      while (j + 1 < list.length && list[j + 1].start - list[j].end < gap) j++;
      if (j > i) { halves.push({ start: list[i].start, end: list[j].end }); i = j; }
    }
    return halves;
  }
  function allBreaks() {
    const markers = exactBreaks().filter((b) => b.closed);
    const d = pbp.sport ? streamDelay(pbp.sport) : DEFAULT_DELAY;
    const fromPbp = pbp.windows.map((w) => ({ start: w.start + d, end: w.end + d, kind: w.kind }));
    const pbpHalves = fromPbp.filter((w) => w.kind === "half");
    if (markers.length) {
      // Exact commercials; halftime from the marker pattern or the play-by-play.
      const halves = exactHalves();
      for (const h of pbpHalves) if (!halves.some((x) => x.start < h.end && h.start < x.end)) halves.push(h);
      return { ads: markers, halves, exact: true };
    }
    // Replays: the slate in the preview pictures beats play-by-play guesses.
    const sl = slateBreaks();
    if (sl) return sl;
    return { ads: fromPbp.filter((w) => w.kind === "ad"), halves: pbpHalves, exact: false };
  }
  // Halftime / intermission from exact breaks only (for Auto-skip mode).
  // Halftime / intermission for Auto-skip: a cluster of exact breaks that the
  // play-by-play confirms (it overlaps the end of the half, and no game action
  // was logged inside it: two ordinary timeouts close together always have
  // plays logged between them, so they can never pass as halftime).
  // Without play-by-play there's no confirmation, so nothing is skipped.
  function exactHalves() {
    if (!pbp.sport || !pbp.windows.length) return [];
    const d = streamDelay(pbp.sport);
    const halfWins = pbp.windows.filter((w) => w.kind === "half").map((w) => ({ start: w.start + d, end: w.end + d }));
    if (!halfWins.length) return [];
    const action = (pbp.plays || []).map((pl) => pl.t + d);
    return clusterHalves(exactBreaks().filter((b) => b.closed)).filter((h) =>
      halfWins.some((w) => w.start < h.end && h.start < w.end) &&
      !action.some((t) => t > h.start + 30 && t < h.end - 30));
  }
  function scteBreakAt(now) {
    if (now == null) return null;
    return allBreaks().ads.find((b) => now >= b.start - 0.5 && now < b.end) || null;
  }
  function halftimeAt(now) {
    if (now == null) return null;
    return allBreaks().halves.find((b) => now >= b.start - 0.5 && now < b.end) || null;
  }
  function inBreak() {
    const now = epochNow();
    if (scteBreakAt(now) || halftimeAt(now)) return true;
    const inst = findPlayerInstance();
    if (inst && inst.props.inAdBreak) return true;
    return adVideos().length > 0;
  }
  function currentBreakEnd() {
    if (lastPlayerTime == null) return null;
    const b = breaks.find((x) => lastPlayerTime >= x.start - 1 && lastPlayerTime <= x.end);
    return b ? b.end : null;
  }

  // Short inserted ad clips (client-side ads), as a backup detector.
  const AD_MAX_SECONDS = 180;
  let longContentPath = null;
  function playerVideos() { return [...document.querySelectorAll("#primaryViewer video, #videoPlayer video")]; }
  function noteLongContent() {
    for (const v of playerVideos()) {
      if (v.readyState > 0 && (!isFinite(v.duration) || v.duration > AD_MAX_SECONDS)) longContentPath = location.pathname;
    }
  }
  function adVideos() {
    if (longContentPath !== location.pathname) return [];
    return playerVideos().filter((v) => {
      const d = v.duration;
      return v.offsetParent !== null && isFinite(d) && d > 0 && d <= AD_MAX_SECONDS && v.currentTime < d - 0.5;
    });
  }
  function skipAdClips() {
    let n = 0;
    for (const v of adVideos()) { try { v.currentTime = Math.max(0, v.duration - 0.1); n++; } catch (e) {} }
    return n;
  }

  // ---- Break guard (Auto-skip mode only): never show a commercial when its exact timing is known ----
  // Runs every 150ms on the player's real position. It only ever acts on exact
  // breaks (never play-by-play estimates), and only once the position is
  // settled (not mid-seek). Decisions (pure, so they can be tested):
  //   - inside a finished break  -> jump to its end (behind the cover)
  //   - rewound into a break from after it -> jump to just before it instead
  //   - at the live edge (end not out yet) -> cover + mute until it ends
  const GUARD_LOOKAHEAD = 0.4;
  function guardDecision(s) {
    // s: { pos, prevPos, seeking, live, liveEdge, breaks, halves }
    if (s.pos == null || s.seeking) return { act: "none" };
    const all = (s.breaks || []).concat(s.halves || []);
    const b = all.find((x) => s.pos >= x.start - GUARD_LOOKAHEAD && (x.end == null || s.pos < x.end));
    if (!b) return { act: "none" };
    if (b.end != null && s.prevPos != null && s.prevPos >= b.end - 0.5 && s.pos < s.prevPos - 1) {
      return { act: "back", target: Math.max(b.start - 6, 0), brk: b };
    }
    if (b.end == null && !s.live) return { act: "none" };       // only a live break can be unfinished
    const ready = b.end != null && (!s.live || (s.liveEdge != null && b.end < s.liveEdge - 1.5));
    if (ready) return { act: "skip", target: b.end + 0.3, brk: b };
    return { act: "cover", brk: b };
  }
  let guardBusy = false, edgeCovered = false, edgeMuted = false, guardSkips = 0, guardPrev = null;
  function liftEdgeCover() {
    if (!edgeCovered) return;
    edgeCovered = false;
    uncoverPlayer();
    if (edgeMuted) { try { bmPlayer().unmute(); } catch (e) {} edgeMuted = false; }
  }
  async function breakGuard() {
    // Normal mode: never skip, cover or mute on our own. The Skip button
    // still pops up and the viewer decides.
    if (watchMode !== "auto") { liftEdgeCover(); guardPrev = null; return; }
    if (guardBusy || !WATCH_RE.test(location.pathname) || chooserOpen()) { guardPrev = null; return; }
    const p = bmPlayer();
    const v = document.querySelector("#primaryViewer video");
    const pos = epochNow();
    if (!p || pos == null) { liftEdgeCover(); guardPrev = null; return; }
    if (document.getElementById("segfix-cover") && !edgeCovered) { guardPrev = null; return; }   // another jump is running
    let live = false, liveEdge = null;
    try { live = p.isLive(); if (live) liveEdge = p.getCurrentTime() - p.getTimeShift(); } catch (e) {}
    const d = guardDecision({
      pos, prevPos: guardPrev, seeking: !!(v && v.seeking), live, liveEdge,
      breaks: exactBreaks(), halves: exactHalves(),
    });
    guardPrev = v && v.seeking ? guardPrev : pos;
    if (d.act === "none") { liftEdgeCover(); return; }
    if (d.act === "cover") {
      if (!edgeCovered) {
        edgeCovered = true;
        coverPlayer("Commercial break");
        try { if (!p.isMuted()) { p.mute(); edgeMuted = true; } } catch (e) {}
      }
      const lbl = document.querySelector("#segfix-cover .cv-label");
      if (lbl) lbl.textContent = d.brk.end != null ? `Commercial break · back in ${mmss(Math.max(0, Math.round(d.brk.end - pos)))}` : "Commercial break · back soon";
      return;
    }
    // "skip" or "back": one jump, behind the cover, so not a frame shows.
    guardBusy = true;
    const wasEdge = edgeCovered;
    edgeCovered = false;
    try {
      coverPlayer("");
      seekEpoch(d.target);
      for (let i = 0; i < 40; i++) {
        await sleep(150);
        const t = epochNow();
        if (t != null && Math.abs(t - d.target) < 3 && v && !v.seeking) break;
      }
      guardSkips++;
      guardPrev = epochNow();
    } finally {
      if (wasEdge && edgeMuted) { try { bmPlayer().unmute(); } catch (e) {} edgeMuted = false; }
      uncoverPlayer();
      guardBusy = false;
    }
  }
  setInterval(breakGuard, 150);

  // ---- Skipping -------------------------------------------------------------
  let skipping = false;
  async function jumpTo(epoch, doneMsg) {
    if (skipping) return;
    skipping = true;
    try {
      if (seekEpoch(epoch)) { await sleep(400); toast(doneMsg); }
      else toast("Couldn't jump here");
    } finally {
      skipping = false;
    }
  }
  const halfName = () => (pbp.hockey ? "intermission" : "halftime");
  async function skipBreak() {
    if (skipping) return;
    if (skipAdClips()) { toast("Skipping ad…"); return; }
    const now = epochNow();
    const ht0 = halftimeAt(now);
    if (ht0) return jumpTo(ht0.end + 0.3, pbp.hockey ? "Next period ▶" : "Second half ▶");
    const brk = scteBreakAt(now);
    if (brk) return jumpTo(brk.end + 0.3, "Back to the game ▶");
    const ht = halftimeAt(now);
    if (ht) return jumpTo(ht.end + 0.3, pbp.hockey ? "Next period ▶" : "Second half ▶");
    toast("No commercial right now");
  }
  async function skipHalftime() {
    const ht = halftimeAt(epochNow());
    if (ht) return jumpTo(ht.end + 0.3, pbp.hockey ? "Next period ▶" : "Second half ▶");
    return skipBreak();
  }

  // Floating buttons: "Skip commercial" and, at halftime/intermission, "Skip halftime".
  const SKIP_ICON = '<svg viewBox="0 0 24 24"><path d="M5 6.2v11.6a1 1 0 0 0 1.55.83L15 12.83a1 1 0 0 0 0-1.66L6.55 5.37A1 1 0 0 0 5 6.2zM17 5h2v14h-2z"/></svg>';
  function getSkipButton() {
    let box = document.getElementById("segfix-skipbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "segfix-skipbox";
      box.innerHTML =
        `<button type="button" class="segfix-skipbtn main"><span class="lbl">Skip commercial</span><span class="left"></span>${SKIP_ICON}<span class="prog"></span></button>` +
        `<button type="button" class="segfix-skipbtn ht"><span class="lbl">Skip ${halfName()}</span>${SKIP_ICON}<kbd class="segfix-key">H</kbd></button>`;
      box.querySelector(".main").addEventListener("click", (e) => { e.stopPropagation(); e.currentTarget.dataset.mode === "half" ? skipHalftime() : skipBreak(); });
      box.querySelector(".ht").addEventListener("click", (e) => { e.stopPropagation(); skipHalftime(); });
    }
    // Inside the video area (so it's part of fullscreen and never over the page's menus).
    const host = document.getElementById("videoPlayer") || document.getElementById("primaryViewer");
    if (host && box.parentElement !== host) host.appendChild(box);
    else if (!host) keepInLayer(box);
    return box;
  }
  const autoSkipped = new Set();   // estimated breaks Auto-skip already jumped over (this page)
  const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  setInterval(() => {
    if (!document.getElementById("primaryViewer")) {
      document.getElementById("segfix-skipbox")?.classList.remove("show", "halftime");
      return;
    }
    noteLongContent();
    hookTimeUpdates(findPlayerInstance());
    decorateWatchPage();
    const box = getSkipButton();
    const now = epochNow();
    const all = allBreaks();
    const brk = now == null ? null : all.ads.find((b) => now >= b.start - 0.5 && now < b.end);
    const ht = now == null ? null : all.halves.find((b) => now >= b.start - 0.5 && now < b.end);
    // Only one button: during halftime it skips the whole halftime.
    // Auto-skip on estimated (play-by-play) breaks: jump once, exactly like
    // pressing Skip. Exact breaks are already handled by the break guard.
    // A break that was skipped once is left alone if you rewind into it.
    if (watchMode === "auto" && !all.exact && !skipping && (brk || ht)) {
      const span0 = ht || brk;
      const key = (ht ? "h" : "a") + Math.round(span0.start);
      let playing = false;
      try { playing = bmPlayer().isPlaying(); } catch (e) {}
      if (playing && !autoSkipped.has(key) && span0.end - now > 3) {
        autoSkipped.add(key);
        jumpTo(span0.end + 0.3, ht ? (pbp.hockey ? "Skipped intermission ▶" : "Skipped halftime ▶") : "Skipped commercial ▶");
      }
    }
    // In Auto-skip the guard handles exact breaks itself, so no button for those.
    const guarded = watchMode === "auto" && !!brk && exactBreaks().some((x) => now >= x.start - 0.6 && (x.end == null || now < x.end));
    box.classList.toggle("show", (!!brk && !guarded) || !!ht || adVideos().length > 0);
    box.classList.remove("halftime");
    const mainBtn = box.querySelector(".main");
    const word = all.exact || all.slate ? "Skip commercial" : "Skip to game";
    const span = ht || brk;
    mainBtn.querySelector(".lbl").textContent = ht ? `Skip ${halfName()}` : word;
    box.querySelector(".ht .lbl").textContent = `Skip ${halfName()}`;
    mainBtn.querySelector(".left").textContent = span ? mmss(Math.max(0, Math.round(span.end - now))) : "";
    // Progress line: how much of the break has gone by.
    const frac = span ? Math.min(1, Math.max(0, (now - span.start) / Math.max(1, span.end - span.start))) : 0;
    mainBtn.style.setProperty("--done", (frac * 100).toFixed(1) + "%");
    mainBtn.dataset.mode = ht ? "half" : "ad";
  }, 500);
  actions.s = () => skipBreak();
  // While a Skip button is showing, Enter or the right arrow skips too.
  const skipShowing = () => { const b = document.getElementById("segfix-skipbox"); return !!(b && b.classList.contains("show")); };
  const halftimeShowing = () => { const b = document.getElementById("segfix-skipbox"); return !!(b && b.classList.contains("halftime")); };
  const normalRight = actions.ArrowRight;
  actions.ArrowRight = () => (skipShowing() ? (halftimeShowing() && !scteBreakAt(epochNow()) ? skipHalftime() : skipBreak()) : normalRight());
  actions.Enter = () => { if (skipShowing()) return halftimeShowing() && !scteBreakAt(epochNow()) ? skipHalftime() : skipBreak(); };
  actions.l = () => actions.ArrowRight();
  actions.h = () => skipHalftime();
  actions.D = () => toggleDiag(); // Shift+D

  // Group play-by-play events into "moments": a shot plus its rebound, a foul plus
  // its free-throw setup, or anything logged within 2 seconds of each other.
  // "Lauri Markkanen makes 26-foot three point jumper (Keyonte George assists)"
  //  -> "Markkanen makes 26-foot three point jumper" (no scores in these texts).
  function shortPlayText(pl) {
    let t = String(pl.text || pl.shortDescription || pl.type?.text || "");
    t = t.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
    const parts = t.split(" ");
    if (parts.length > 2 && /^[A-Z]/.test(parts[1])) parts.shift();   // drop first name
    t = parts.join(" ");
    return t.length > 46 ? t.slice(0, 44) + "…" : t;
  }
  function playMoments(plays, hockey) {
    const dead = hockey ? /stoppage|period (start|end)|game end|end of game|shootout (start|end)/i : NBA_DEAD;
    const ev = plays
      .filter((pl) => pl.wallclock && !dead.test(pl.type.text))
      .map((pl) => ({ t: Date.parse(pl.wallclock) / 1000, type: pl.type.text, txt: shortPlayText(pl) }));
    const out = [];
    for (const e of ev) {
      const last = out[out.length - 1];
      const followUp = /rebound/i.test(e.type) && last && e.t - last.end <= 6;
      if (last && (e.t - last.end <= 2 || followUp)) { last.end = e.t; continue; }
      out.push({ t: e.t, end: e.t, type: e.type, txt: e.txt });
    }
    return out;
  }

  // ---- ↓ "What just happened?": jump back to the start of the last play ----
  // Plays are logged when they happen (the shot, the foul...). The action that
  // led to it starts around the previous logged play, so we land just before that.
  // Press again within a few seconds to go back one more play.
  let replayChain = { idx: null, at: 0 };
  function lastPlayIndex(now, d) {
    let idx = -1;
    for (let i = 0; i < pbp.plays.length; i++) { if (pbp.plays[i].t + d <= now - 2) idx = i; else break; }
    return idx;
  }
  function replayStart(idx, d) {
    const play = pbp.plays[idx].t + d;
    const prevEnd = idx > 0 ? pbp.plays[idx - 1].end + d : null;
    let start = prevEnd != null ? prevEnd - 1 : play - 12;
    start = Math.max(start, play - 14);   // never more than 14s before the play
    start = Math.min(start, play - 6);    // always at least 6s of build-up
    return start;
  }
  async function replayLastPlay() {
    // Live games: grab the newest plays first so "last play" is really the last one.
    if (isLiveNow() && Date.now() - pbp.fetched > 5000 && !pbp.loading) {
      pbp.fetched = 0;
      await Promise.race([ensurePbp(), sleep(2000)]);
    }
    for (let i = 0; i < 10 && pbp.loading; i++) await sleep(200);
    const now = epochNow();
    if (now == null || !pbp.plays.length) {
      q('[aria-label="Rewind 10 Seconds"]')?.click();
      toast("No play-by-play for this game · back 10s", "left");
      return;
    }
    const d = streamDelay(pbp.sport);
    const again = replayChain.idx != null && Date.now() - replayChain.at < 6000;
    const idx = again ? replayChain.idx - 1 : lastPlayIndex(now, d);
    if (idx < 0) { toast("No earlier play"); return; }
    if (seekEpoch(replayStart(idx, d))) {
      replayChain = { idx, at: Date.now() };
      toast(again ? "↺ One more play back" : "↺ Last play", "left");
    }
  }
  actions.ArrowDown = () => replayLastPlay();

  // =========================================================================
  //  WATCH MODES: Normal · Auto-skip   (remembered between games)
  // =========================================================================
  const MODE_KEY = "segfix-mode";
  let watchMode = (() => { try { const m = localStorage.getItem(MODE_KEY); return m === "auto" ? "auto" : "normal"; } catch (e) { return "normal"; } })();
  function setMode(m) {
    watchMode = m;
    try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
    updateModeButton();
    toast(m === "auto" ? "Auto-skip on: breaks skip themselves" : "Normal: press Skip when you want");
  }

  // Normal:    nothing skips on its own; the Skip button appears for every
  //            break and halftime, and you choose.
  // Auto-skip: the break guard skips exact commercials AND exact halftimes by
  //            itself; on replays without exact markers, breaks estimated from
  //            play-by-play are skipped once each (same jump as the button).


  // ---- Watch-mode picker: icon + name + drop-down (control bar & start chooser) ----
  const MODES = [
    { id: "normal", name: "Normal", desc: "A Skip button pops up. You choose when to skip.",
      icon: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>' },
    { id: "auto", name: "Auto-skip", desc: "Skips commercials and halftime or intermissions for you, hands-free, on live games and replays.",
      icon: '<svg viewBox="0 0 24 24"><path d="M4 6.2v11.6a1 1 0 0 0 1.55.83L13 13.2v4.6a1 1 0 0 0 1.55.83l7.2-5.8a1 1 0 0 0 0-1.66l-7.2-5.8A1 1 0 0 0 13 6.2v4.6L5.55 5.37A1 1 0 0 0 4 6.2z"/></svg>' },
  ];
  const CHEVRON = '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function modeInfo(id) { return MODES.find((m) => m.id === id) || MODES[0]; }
  function buildModePicker(extraClass) {
    const wrap = document.createElement("div");
    wrap.className = "segfix-mode " + (extraClass || "");
    wrap.innerHTML =
      '<button type="button" class="mode-trigger" title="Watch mode"><span class="mi"></span><span class="ml"></span><span class="mc">' + CHEVRON + "</span></button>" +
      '<div class="mode-menu" role="menu">' +
        '<div class="mode-head">Watch mode</div>' +
        MODES.map((m) => `<button type="button" class="mode-opt" data-mode="${m.id}"><span class="oi">${m.icon}</span><span class="mt"><span class="t">${m.name}</span><span class="s">${m.desc}</span></span><span class="ck">✓</span></button>`).join("") +
      "</div>";
    wrap.querySelector(".mode-trigger").addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      wrap.classList.toggle("open");
      if (wrap.classList.contains("open") && typeof closeSettings === "function") closeSettings();   // one menu at a time
    });
    wrap.querySelectorAll(".mode-opt").forEach((o) => o.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.remove("open");
      const inChooser = !!wrap.closest("#segfix-chooser");
      if (inChooser) {                       // in the start chooser: just remember the choice
        watchMode = o.dataset.mode;
        try { localStorage.setItem(MODE_KEY, watchMode); } catch (err) {}
        updateModeButton();
      } else if (o.dataset.mode !== watchMode) {
        setMode(o.dataset.mode);
      }
    }));
    onDoc("click", (e) => { if (!wrap.contains(e.target)) wrap.classList.remove("open"); });
    return wrap;
  }
  function updateModeButton() {
    const m = modeInfo(watchMode);
    for (const w of document.querySelectorAll(".segfix-mode")) {
      w.querySelector(".mi").innerHTML = m.icon;
      w.querySelector(".ml").textContent = m.name;
      w.classList.toggle("on", watchMode !== "normal");
      w.querySelectorAll(".mode-opt").forEach((o) => o.classList.toggle("active", o.dataset.mode === watchMode));
    }
  }
  function decorateModeButton() {
    if (!WATCH_RE.test(location.pathname)) return;
    const right = q(".player-controls .right-side") || (q('[aria-label="Enter Fullscreen"], [aria-label="Exit Fullscreen"]') || {}).parentElement;
    if (!right || right.querySelector("#segfix-modebtn")) return;
    const wrap = buildModePicker("in-bar");
    wrap.id = "segfix-modebtn";
    right.insertBefore(wrap, right.firstChild);
    updateModeButton();
  }
  setInterval(decorateModeButton, 1000);

  function decorateControls() {
    const fwd = q('[aria-label="Forward 10 Seconds"]');
    if (!fwd || fwd.parentElement.querySelector(".segfix-skipbreak")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "segfix-skipbreak";
    b.title = "Skip the commercial break (S)";
    b.innerHTML = 'Skip break<svg viewBox="0 0 24 24"><path d="M5 6.2v11.6a1 1 0 0 0 1.55.83L15 12.83a1 1 0 0 0 0-1.66L6.55 5.37A1 1 0 0 0 5 6.2zM17 5h2v14h-2z"/></svg>';
    b.addEventListener("click", (e) => { e.stopPropagation(); skipBreak(); });
    const vol = fwd.parentElement.querySelector(".volume-controls");
    fwd.parentElement.insertBefore(b, vol || fwd.nextSibling);
  }

  // ---- Start chooser: every time a game is opened -------------------------
  // Pauses and shows a matchup intro card with two big choices:
  // Start at tip-off / Start live (on replays: Keep watching).
  let chooserFor = null;
  // A chooser that is fading out (after a pick) no longer counts as open.
  function chooserOpen() { const el = document.getElementById("segfix-chooser"); return !!el && !el.classList.contains("closing"); }
  function closeChooser(play) {
    const el = document.getElementById("segfix-chooser");
    if (el) { el.classList.add("closing"); setTimeout(() => el.remove(), 250); }
    if (play) { uncoverPlayer(); ensurePlaying(); }
  }
  async function chooseStart(action) {
    if (action === "resume") {
      closeChooser(false);
      uncoverPlayer();
      try { const p = bmPlayer(); if (p.isMuted()) p.unmute(); if (p.getVolume() < 5) p.setVolume(60); } catch (e) {}
      ensurePlaying();
      return;
    }
    coverPlayer("");                 // cover first, so nothing shows as the card fades
    closeChooser(false);
    await coveredJump(action);
  }
  const escHtml = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  async function fillChooserMatchup(el) {
    const info = currentMatchup();
    const box = el.querySelector(".ch-matchup");
    const eyebrowDate = el.querySelector(".ch-date");
    if (info && eyebrowDate) {
      eyebrowDate.textContent = info.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    }
    if (!info) {
      const t = playerProps().title;
      if (t) box.innerHTML = `<span class="ch-plain">${escHtml(t)}</span>`;
      return;
    }
    try {
      const [away, home] = await Promise.all(info.teams.map((t) => teamRecord(info.sport, t.abbr, info.date, info.hockey)));
      const logo = (t) => t.logo ? `<img src="${escHtml(t.logo.replace("/500/", "/500-dark/"))}" data-fallback="${escHtml(t.logo)}" alt="">` : "";
      const team = (t) => `<span class="ch-team">${logo(t)}<span class="nm">${escHtml(t.name)}</span></span>`;
      box.innerHTML = team(away) + '<span class="ch-at">@</span>' + team(home);
      box.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => {
        if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback; else img.remove();
      }));
    } catch (e) {}
  }

  // Keyboard selection inside the chooser (↑ / ↓, Enter).
  function chooserMove(delta) {
    const el = document.getElementById("segfix-chooser");
    if (!el) return;
    const rows = [...el.querySelectorAll(".ch-opt")];
    let i = rows.findIndex((r) => r.classList.contains("sel"));
    i = Math.max(0, Math.min(rows.length - 1, i + delta));
    rows.forEach((r, k) => r.classList.toggle("sel", k === i));
  }
  function chooserSelected() {
    const r = document.querySelector("#segfix-chooser .ch-opt.sel");
    return r ? r.dataset.a : "tip";
  }
  let earlyCovered = null, earlyCoveredAt = 0;
  function maybeStartChooser() {
    if (!WATCH_RE.test(location.pathname)) { closeChooser(false); chooserFor = null; earlyCovered = null; return; }
    if (chooserOpen()) { try { const p = bmPlayer(); if (p && !p.isPaused()) p.pause(); } catch (e) {} return; }
    const decided = (chooserFor || "").startsWith(location.pathname + "|");
    // Cover the video the moment a game page opens, so the old spot never shows.
    if (earlyCovered !== location.pathname && !(chooserFor || "").startsWith(location.pathname + "|")) {
      if (coverPlayer("")) { earlyCovered = location.pathname; earlyCoveredAt = Date.now(); }
    }
    // No video after 15s (e.g. a game that hasn't started): don't leave the cover up.
    if (earlyCovered === location.pathname && !decided && !playerReady() && Date.now() - earlyCoveredAt > 15000) { uncoverPlayer(); return; }
    // Keep it paused only until the chooser has been shown for this game.
    if (earlyCovered === location.pathname && !decided && !chooserOpen()) { try { const p = bmPlayer(); if (p && !p.isPaused()) p.pause(); } catch (e) {} }
    if (!playerReady()) return;
    const key = location.pathname + "|" + (playerProps().videoId || "");
    if (chooserFor === key) return;            // already asked for this game visit
    chooserFor = key;
    try { if (sessionStorage.getItem(PENDING_KEY)) return; } catch (e) {} // a card button already chose (it uncovers itself)
    const host = document.getElementById("videoPlayer") || document.getElementById("primaryViewer");
    if (!host) { uncoverPlayer(); return; }
    try { bmPlayer().pause(); } catch (e) {}
    const live = isLiveNow();
    const el = document.createElement("div");
    el.id = "segfix-chooser";
    const opt = (a, icon, title, sub, key, sel) =>
      `<button type="button" class="ch-opt${sel ? " sel" : ""}" data-a="${a}"><span class="ic">${icon}</span>` +
      `<span class="tx"><span class="t">${title}</span><span class="s">${sub}</span></span>` +
      `<span class="k">Enter</span></button>`;
    el.innerHTML =
      '<div class="ch-card" role="dialog" aria-label="Choose your starting point">' +
        '<div class="ch-top">' +
          '<div class="ch-eyebrow">' + (live ? '<span class="ch-live">Live</span>' : '<span>Replay</span>') + '<span class="ch-date"></span></div>' +
          '<div class="ch-matchup"></div>' +
        "</div>" +
        '<h2 class="ch-h">Choose your starting point</h2>' +
        '<div class="ch-list">' +
          opt("start", '<svg viewBox="0 0 24 24"><path d="M5 5h2.5v14H5zM19.5 6.2v11.6a1 1 0 0 1-1.55.83L9.5 12.83a1 1 0 0 1 0-1.66l8.45-5.8a1 1 0 0 1 1.55.83z"/></svg>', "From the beginning", "Includes the pregame show", "", false) +
          opt("tip", '<svg viewBox="0 0 24 24"><path d="M5 4h14v2.5H5zM6.2 20h11.6a1 1 0 0 0 .83-1.55L12.83 9.7a1 1 0 0 0-1.66 0l-5.8 8.75A1 1 0 0 0 6.2 20z"/></svg>', (pbp.hockey ? "At puck drop" : "At tip-off"), (pbp.hockey ? "Starts moments before the opening face-off" : "Starts moments before the opening tip"), "Enter", true) +
          (live ? opt("live", '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>', "Live", "Jump to the current moment", "", false) : "") +
        "</div>" +
        '<div class="ch-foot">' +
          '<button type="button" class="ch-continue" data-a="resume">Continue from current position</button>' +
        "</div>" +
      "</div>";
    el.querySelectorAll(".ch-opt").forEach((r) => r.addEventListener("mouseenter", () => {
      el.querySelectorAll(".ch-opt").forEach((x) => x.classList.toggle("sel", x === r));
    }));
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]");
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      chooseStart(b.dataset.a);
    });
    host.appendChild(el);
    fillChooserMatchup(el);
  }
  setInterval(maybeStartChooser, 200);
  // The game pop-up animates open; re-check its layout until it settles.
  setInterval(() => { for (const btn of document.querySelectorAll("button[data-segfix]")) layoutModal(btn); }, 500);

  // ---- Close SEG+'s "end cards" carousel (suggested videos) automatically ----
  function closeEndCards() {
    if (!WATCH_RE.test(location.pathname)) return;
    const root = document.getElementById("app-wrapper");
    if (!root || !root._vnode) return;
    const seen = new Set(); const stack = [root._vnode];
    while (stack.length) {
      const vn = stack.pop(); if (!vn || typeof vn !== "object") continue;
      const c = vn.component;
      if (c && !seen.has(c)) {
        seen.add(c);
        if ((c.type.__name || c.type.name) === "EndCardCarousel" && c.isMounted && !c.isUnmounted) {
          const close = c.vnode.props && (c.vnode.props.onClose || c.vnode.props.onSelectionMade);
          try { if (close) close(); } catch (e) {}
          if (c.subTree && c.subTree.el && c.subTree.el.style) c.subTree.el.style.display = "none";
        }
        stack.push(c.subTree);
      }
      if (Array.isArray(vn.children)) for (const ch of vn.children) stack.push(ch);
      if (vn.suspense) stack.push(vn.suspense.activeBranch);
    }
  }
  setInterval(closeEndCards, 700);

  // ---- Never start muted ----------------------------------------------------
  // Browsers sometimes make players start muted. Once per game visit, as soon as
  // it's playing (and you've clicked something, which browsers require), unmute.
  let unmutedFor = null;
  function ensureSound() {
    const p = bmPlayer();
    if (!p || !WATCH_RE.test(location.pathname)) return;
    const key = location.pathname + "|" + (playerProps().videoId || "");
    if (unmutedFor === key) return;
    try {
      if (p.isPaused()) return;
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      if (p.isMuted()) p.unmute();
      if (p.getVolume() < 5) p.setVolume(60);
      if (!p.isMuted()) unmutedFor = key;
    } catch (e) {}
  }
  setInterval(ensureSound, 700);

  // ---- Sharp picture: hold 1080p ---------------------------------------------
  // The player's automatic quality is timid and often sits at a blurry level.
  // Lock the best rendition up to 1080p. If the connection really can't keep up
  // (real buffering, not our own jumps), hand control back to automatic for a
  // few minutes, then try 1080p again (waiting longer after each failure).
  const MAX_H = 1080;
  const hq = { player: null, stalls: [], stallAt: 0, seekAt: 0, backoffUntil: 0, backoffMs: 180000, lockedAt: 0 };
  // The viewer's own pick in SEG+'s quality menu wins until they pick again:
  // { h: 720 } = hold that size, { auto: true } = let the player adapt. With no
  // pick, the best size up to 1080p is held (backing off on a weak connection).
  const QPICK_KEY = "segfix-quality";
  let qPick = (() => { try { return JSON.parse(localStorage.getItem(QPICK_KEY) || "null"); } catch (e) { return null; } })();
  function topHeight(p) {
    let list = [];
    try { list = p.getAvailableVideoQualities() || []; } catch (e) {}
    return Math.max(0, ...list.map((q) => (q && q.height) || 0).filter((h) => h <= MAX_H));
  }
  function hqTarget(p) {
    let list = [];
    try { list = p.getAvailableVideoQualities() || []; } catch (e) {}
    const cap = qPick && qPick.h ? qPick.h : MAX_H;
    const ok = list.filter(q => q && q.id != null && (q.height || 0) <= cap);
    if (!ok.length) return null;
    ok.sort((a, b) => (b.height || 0) - (a.height || 0) || (b.bitrate || 0) - (a.bitrate || 0));
    return ok[0];
  }
  function hqGiveUp() {
    const p = bmPlayer();
    hq.backoffUntil = Date.now() + hq.backoffMs;
    hq.backoffMs = Math.min(hq.backoffMs * 2, 15 * 60000);
    hq.stalls = [];
    try { p && p.setVideoQuality("auto"); } catch (e) {}
  }
  function hqAttach(p) {
    if (hq.player === p) return;
    hq.player = p; hq.stalls = []; hq.stallAt = 0; hq.lockedAt = 0;
    const onSeek = () => { hq.seekAt = Date.now(); };
    try {
      p.on("seek", onSeek); p.on("timeshift", onSeek);
      p.on("stallstarted", () => {
        // Buffering right after a jump is normal; only count real stalls.
        if (Date.now() - hq.seekAt < 5000 || Date.now() < hq.backoffUntil) return;
        hq.stallAt = Date.now();
      });
      p.on("stallended", () => {
        if (!hq.stallAt) return;
        const len = Date.now() - hq.stallAt;
        hq.stallAt = 0;
        if (len < 400) return;
        hq.stalls = hq.stalls.filter(t => Date.now() - t < 90000).concat(Date.now());
        if (hq.stalls.length >= 3) hqGiveUp();
      });
    } catch (e) {}
  }
  function holdQuality() {
    const p = bmPlayer();
    if (!p || !WATCH_RE.test(location.pathname)) return;
    hqAttach(p);
    if (qPick && qPick.auto) return;                      // viewer chose AUTO: hands off
    if (qPick && qPick.h) {                               // viewer chose a size: keep it, no back-off
      const t = hqTarget(p);
      let cur = null;
      try { cur = p.getVideoQuality(); } catch (e) {}
      if (t && !(cur && cur.id === t.id)) { try { p.setVideoQuality(t.id); } catch (e) {} }
      return;
    }
    // One long freeze (still buffering after 4s) also means the line is too slow.
    if (hq.stallAt && Date.now() - hq.stallAt > 4000) { hq.stallAt = 0; hqGiveUp(); return; }
    if (Date.now() < hq.backoffUntil) return;
    // Held 1080p for 10 calm minutes: next failure backs off only briefly again.
    if (hq.lockedAt && Date.now() - hq.lockedAt > 600000) hq.backoffMs = 180000;
    const t = hqTarget(p);
    if (!t) return;
    let cur = null;
    try { cur = p.getVideoQuality(); } catch (e) {}
    if (cur && cur.id === t.id) { if (!hq.lockedAt) hq.lockedAt = Date.now(); return; }
    try { p.setVideoQuality(t.id); hq.lockedAt = 0; } catch (e) {}
  }
  setInterval(holdQuality, 1000);

  // Picks in SEG+'s quality menu (AUTO / 1080P / 720P ...). Anything below the
  // top size needs a second click within 4s ("Sure?"), so a stray click can't
  // drop the picture; the confirmed pick is then locked until changed.
  let qConfirm = null;
  const clearQConfirm = () => {
    if (qConfirm) qConfirm.btn.classList.remove("segfix-qconfirm");
    document.getElementById("segfix-qtip")?.remove();
    qConfirm = null;
  };
  // Small floating tag just outside the menu, beside the row waiting for a
  // second click. It's a child of SEG+'s popup (so it opens and closes with it)
  // but positioned outside it, so the menu itself never changes size.
  function showQTip(row, text) {
    const pop = row.parentElement;
    const tip = document.createElement("div");
    tip.id = "segfix-qtip";
    tip.setAttribute("role", "button");
    tip.textContent = text;
    tip.style.top = Math.round(row.offsetTop + row.offsetHeight / 2) + "px";
    tip.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); row.click(); });
    pop.appendChild(tip);
  }
  onDoc("click", (e) => {
    const b = e.target instanceof Element ? e.target.closest(".menu-wrap > div.bottom-12 > button") : null;
    if (!b || !b.parentElement.parentElement.querySelector(':scope > [aria-label="Quality Settings"]')) return;
    const label = (b.textContent || "").trim().toUpperCase();
    const m = /^(\d{3,4})P/.exec(label);
    const auto = /^AUTO/.test(label);
    if (!m && !auto) return;
    const h = m ? +m[1] : null;
    const p = bmPlayer();
    const isTop = h != null && p && h >= topHeight(p);
    if (!isTop && !(qConfirm && qConfirm.btn === b && Date.now() - qConfirm.at < 4000)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      clearQConfirm();
      b.classList.add("segfix-qconfirm");
      showQTip(b, auto ? "Confirm Auto" : `Confirm ${h}p`);
      const mine = { btn: b, at: Date.now() };
      qConfirm = mine;
      window.setTimeout(() => { if (qConfirm === mine) clearQConfirm(); }, 4000);
      return;
    }
    clearQConfirm();
    qPick = auto ? { auto: true } : isTop ? null : { h };
    try { qPick ? localStorage.setItem(QPICK_KEY, JSON.stringify(qPick)) : localStorage.removeItem(QPICK_KEY); } catch (err) {}
    hq.backoffUntil = 0; hq.lockedAt = 0; hq.stalls = [];
    toast(auto ? "Quality: Auto" : isTop ? `Quality: ${h}p` : `Quality locked: ${h}p`);
  }, true);


  // =========================================================================
  //  CHAT TOGGLE: a small "Chat" button (bottom right) opens SEG+'s live chat
  //  in a floating panel you can drag by its header and resize from any edge.
  //  The chat itself stays SEG+'s own (we only move and restyle it), and the
  //  panel's position, size and open/closed state are remembered.
  // =========================================================================
  const CHAT_KEY = "segfix-chat";
  const CHAT_HEAD = 40;          // panel header height (px)
  const CHAT_MIN = { w: 300, h: 260 };
  const chat = { open: false, x: null, y: null, w: 360, h: 520 };
  try { Object.assign(chat, JSON.parse(localStorage.getItem(CHAT_KEY) || "{}")); } catch (e) {}
  const saveChat = () => { try { localStorage.setItem(CHAT_KEY, JSON.stringify(chat)); } catch (e) {} };
  // SEG+'s chat column. Tagged once found, because in fullscreen it can be
  // carried into the fullscreen view (and then it's no longer under #topSplit).
  const chatEl = () => document.querySelector(".segfix-chat-el") || document.querySelector("#topSplit > .activity-container");
  let chatHome = null;     // where the chat lives normally, while it's borrowed for fullscreen
  function placeChatEl() {
    const el = chatEl();
    if (!el) return;
    el.classList.add("segfix-chat-el");
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    // In fullscreen SEG+ stacks the player above the area the chat lives in, so
    // the chat is lifted to the top level of the fullscreen view (and put back after).
    if (chat.open && fs && fs.tagName !== "VIDEO" && el.parentElement !== fs) {
      if (!chatHome) chatHome = { parent: el.parentElement, next: el.nextSibling };
      fs.appendChild(el);
    } else if (chatHome && (!fs || !chat.open || el.parentElement !== fs)) {
      const { parent, next } = chatHome;
      chatHome = null;
      if (parent && parent.isConnected) parent.insertBefore(el, next && next.parentNode === parent ? next : null);
    }
  }

  // "Chat" column on SEG+'s quality popup (AUTO / 1080P / ...): ON / OFF.
  // It lives INSIDE the popup box (pinned to its left edge), so it opens,
  // fades and closes exactly together with SEG+'s own menu.
  // ---- Audio: TV, Spanish or radio call -------------------------------------
  // SEG+ carries these as separate streams of the same game in its own
  // "Streams" menu (top bar). We click SEG+'s own buttons; playback keeps its
  // place. The choice is remembered for the next game.
  const AUDIO_KEY = "segfix-audio";
  let audioPref = (() => { try { return localStorage.getItem(AUDIO_KEY) || ""; } catch (e) { return ""; } })();
  let audioApplied = "";                           // page where the saved choice was applied
  const audioName = (t) => (/^english$/i.test(t) ? "TV" : t);
  function audioFeeds() {
    const cur = document.querySelector('#primaryViewer [aria-label="Individual Streams"]');
    const menu = cur && cur.parentElement;
    if (!menu) return null;
    const opts = [...menu.querySelectorAll("button:not([aria-label])")]
      .map((b) => ({ b, name: (b.textContent || "").trim() }))
      .filter((o) => o.name && o.name.length < 24);
    if (opts.length < 2) return null;
    return { opts, current: (cur.textContent || "").trim() };
  }
  function setAudioFeed(name, quiet) {
    const f = audioFeeds();
    const o = f && f.opts.find((x) => x.name === name);
    if (!o) return;
    audioPref = name;
    try { localStorage.setItem(AUDIO_KEY, name); } catch (e) {}
    if (f.current !== name) o.b.click();
    if (!quiet) toast(name === "Radio" ? "Radio call" : name === "English" ? "TV audio" : audioName(name) + " audio");
  }
  // Use the saved choice once per game, after the game has started playing.
  function keepAudioPref() {
    if (!audioPref || audioApplied === location.pathname) return;
    const f = audioFeeds();
    if (!f) return;
    let playing = false;
    try { playing = bmPlayer().isPlaying(); } catch (e) {}
    if (!playing) return;
    audioApplied = location.pathname;
    if (f.current !== audioPref && f.opts.some((o) => o.name === audioPref)) setAudioFeed(audioPref, true);
  }

  // ---- Radio sync -----------------------------------------------------------
  // SEG+'s radio call runs a little ahead of the picture. While Radio is on,
  // the sound goes through a short delay line so the call lands with the play.
  // Adjustable ([ and ] or the Audio menu); remembered.
  const RDELAY_KEY = "segfix-radio-delay";
  let radioDelay = (() => { try { const v = parseFloat(localStorage.getItem(RDELAY_KEY)); return isFinite(v) ? v : 3; } catch (e) { return 3; } })();
  const radioOn = () => { const f = audioFeeds(); return !!f && f.current === "Radio"; };
  // How: SEG+'s streams are copy-protected, so the sound itself can't be
  // touched. Instead, on the radio stream every video frame is placed slightly
  // earlier on the timeline (the player's video buffer gets a small time
  // offset), so the picture runs ahead by the delay and the call lines up.
  // The shift is fixed when a stream loads; changing it reloads the stream
  // in place.
  (() => {
    const MS = window.MediaSource;
    const SB = window.SourceBuffer;
    if (!MS || !SB) return;
    const tso = Object.getOwnPropertyDescriptor(SB.prototype, "timestampOffset");
    if (!tso || MS.prototype.__segfixShift) return;          // patched once per page; newest copy sets the hook
    const orig = MS.prototype.addSourceBuffer;
    MS.prototype.__segfixShift = true;
    MS.prototype.addSourceBuffer = function (type) {
      const sb = orig.call(this, type);
      try {
        const shift = /^video\//i.test(String(type)) && typeof window.__segfixVideoShift === "function" ? +window.__segfixVideoShift() || 0 : 0;
        if (shift > 0) {
          Object.defineProperty(sb, "timestampOffset", {
            configurable: true,
            get() { return tso.get.call(this) + shift; },
            set(v) { tso.set.call(this, v - shift); },
          });
          tso.set.call(sb, -shift);
          sb.__segfixShift = shift;
        }
      } catch (e) {}
      return sb;
    };
  })();
  let appliedShift = 0;                      // the shift the current stream loaded with
  window.__segfixVideoShift = () => {
    appliedShift = radioOn() ? radioDelay : 0;
    return appliedShift;
  };
  let reloadTimer = 0;
  const reloadTries = new Map();             // delay -> reloads tried (never loop if the player won't take it)
  function syncRadioDelay() {
    const want = radioOn() ? radioDelay : 0;
    if (Math.abs(want - appliedShift) < 0.01) return;
    const key = location.pathname + ":" + want;
    if ((reloadTries.get(key) || 0) >= 2) return;
    if (reloadTimer) return;
    // Reload the same stream at the same spot so the new shift takes effect.
    reloadTimer = setTimeout(async () => {
      reloadTimer = 0;
      const want2 = radioOn() ? radioDelay : 0;
      if (Math.abs(want2 - appliedShift) < 0.01) return;
      const key2 = location.pathname + ":" + want2;
      reloadTries.set(key2, (reloadTries.get(key2) || 0) + 1);
      const p = bmPlayer();
      if (!p || !radioOn()) return;
      try {
        const src = p.getSource();
        const t = p.getCurrentTime();
        const playing = p.isPlaying();
        const live = p.isLive();
        src.options = Object.assign({}, src.options, live ? {} : { startOffset: t });
        await p.load(src);
        if (playing) p.play().catch(() => {});
      } catch (e) {}
    }, 900);
  }
  function nudgeRadioDelay(step) {
    if (!radioOn()) return toast("Radio sync works while Radio is on");
    radioDelay = Math.round(Math.min(8, Math.max(0, radioDelay + step)) * 4) / 4;
    try { localStorage.setItem(RDELAY_KEY, String(radioDelay)); } catch (e) {}
    syncRadioDelay();
    toast(`Radio delay ${radioDelay.toFixed(2)}s`);
    renderSettings();
  }
  actions["["] = () => nudgeRadioDelay(-0.25);
  actions["]"] = () => nudgeRadioDelay(0.25);

  // ---- One settings menu (replaces SEG+'s Quality and Speed buttons) -------
  // Hover the gear: Quality / Speed / Audio, each with its current value.
  // Hover a row: its choices open beside it; click one to pick.
  // SEG+'s Speed button's spot holds a Chat button on live games.
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const GEAR = '<svg viewBox="0 0 24 24"><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7.3 7.3 0 0 0-1.7-1l-.4-2.6a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.6a7.3 7.3 0 0 0-1.7 1l-2.4-1a.5.5 0 0 0-.6.2L2.5 8.8a.5.5 0 0 0 .1.6l2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h3.8c.3 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1c.2.1.5 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';
  const CHAT_ICON = '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6A.5.5 0 0 1 5 19.2V16a2.5 2.5 0 0 1-1-2V5.5z"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const speedName = (x) => (x === 1 ? "Normal" : x + "x");
  function qualityChoices() {
    const p = bmPlayer();
    let list = [];
    try { list = p.getAvailableVideoQualities() || []; } catch (e) {}
    const hs = [...new Set(list.map((x) => (x && x.height) || 0).filter((h) => h > 0 && h <= MAX_H))].sort((a, b) => b - a);
    return hs;
  }
  function qualityNow() {
    if (qPick && qPick.auto) return "Auto";
    if (qPick && qPick.h) return qPick.h + "p";
    const t = topHeight(bmPlayer());
    return t ? t + "p" : "Auto";
  }
  function pickQuality(v) {           // v: height or "auto"
    const auto = v === "auto";
    const h = auto ? null : +v;
    const isTop = !auto && h >= topHeight(bmPlayer());
    qPick = auto ? { auto: true } : isTop ? null : { h };
    try { qPick ? localStorage.setItem(QPICK_KEY, JSON.stringify(qPick)) : localStorage.removeItem(QPICK_KEY); } catch (err) {}
    hq.backoffUntil = 0; hq.lockedAt = 0; hq.stalls = [];
    try { auto && bmPlayer().setVideoQuality("auto"); } catch (e) {}
    holdQuality();
    toast(auto ? "Quality: Auto" : isTop ? `Quality: ${h}p` : `Quality locked: ${h}p`);
  }
  function speedNow() { try { return bmPlayer().getPlaybackSpeed() || 1; } catch (e) { return 1; } }

  let setOpenRow = "";          // which row's choices are showing
  let setConfirm = null;        // { v, at } waiting for a second click (lower quality)
  function settingsRows() {
    const rows = [{ id: "q", name: "Quality", val: qualityNow() }, { id: "s", name: "Speed", val: speedName(speedNow()) }];
    const f = audioFeeds();
    if (f) rows.push({ id: "a", name: "Audio", val: audioName(f.current) });
    return rows;
  }
  function settingsChoices(id) {
    if (id === "q") {
      const top = topHeight(bmPlayer());
      const cur = qualityNow();
      return [...qualityChoices().map((h) => ({ v: String(h), t: h + "p", on: cur === h + "p", sure: h < top })),
        { v: "auto", t: "Auto", on: cur === "Auto", sure: true }];
    }
    if (id === "s") { const cur = speedNow(); return SPEEDS.map((x) => ({ v: String(x), t: speedName(x), on: Math.abs(cur - x) < 0.01 })); }
    if (id === "a") { const f = audioFeeds(); return f ? f.opts.map((o) => ({ v: o.name, t: audioName(o.name), on: o.name === f.current })) : []; }
    return [];
  }
  function chooseSetting(id, c, row) {
    if (id === "q") {
      if (c.sure && !(setConfirm && setConfirm.v === c.v && Date.now() - setConfirm.at < 4000)) {
        setConfirm = { v: c.v, at: Date.now() };
        renderSettings();
        const mine = setConfirm;
        setTimeout(() => { if (setConfirm === mine) { setConfirm = null; renderSettings(); } }, 4000);
        return;
      }
      setConfirm = null;
      pickQuality(c.v);
    } else if (id === "s") {
      try { bmPlayer().setPlaybackSpeed(+c.v); } catch (e) {}
      toast("Speed: " + c.t);
    } else if (id === "a") {
      setAudioFeed(c.v);
      setTimeout(syncRadioDelay, 50);
    }
    closeSettings();
  }
  function renderSettings() {
    const w = document.getElementById("segfix-settings");
    if (!w) return;
    const rows = settingsRows();
    if (setOpenRow && !rows.some((r) => r.id === setOpenRow)) setOpenRow = "";
    const panel = w.querySelector(".st-panel");
    panel.innerHTML = rows.map((r) =>
      `<div class="st-row${r.id === setOpenRow ? " open" : ""}" data-row="${r.id}"><span class="st-arrow">${ARROW}</span><span class="st-name">${r.name}</span><span class="st-val">${r.val}</span></div>`).join("");
    const sub = w.querySelector(".st-sub");
    if (!setOpenRow) { sub.classList.remove("show"); sub.innerHTML = ""; return; }
    const choices = settingsChoices(setOpenRow);
    const head = { q: "Quality", s: "Speed", a: "Audio" }[setOpenRow];
    sub.innerHTML = `<div class="st-head">${head}</div>` + choices.map((c) => {
      const waiting = setOpenRow === "q" && setConfirm && setConfirm.v === c.v;
      return `<button type="button" class="st-opt${c.on ? " on" : ""}${waiting ? " confirm" : ""}" data-v="${c.v}"><span class="st-ck">✓</span><span>${c.t}</span>` +
        (waiting ? `<span class="st-tag">Click again to confirm</span>` : "") + "</button>";
    }).join("") +
      (setOpenRow === "a" && radioOn() ? `<div class="st-sync"><span>Radio delay</span><button type="button" data-n="-1" aria-label="Less delay">−</button><b>${radioDelay.toFixed(2)}s</b><button type="button" data-n="1" aria-label="More delay">+</button></div>` : "");
    sub.classList.add("show");
    // Line the choices up with their row.
    const rowEl = panel.querySelector(`.st-row[data-row="${setOpenRow}"]`);
    if (rowEl) {
      const gap = panel.getBoundingClientRect().bottom - rowEl.getBoundingClientRect().bottom;
      // Bottom-align with the row, but never hang below the panel's bottom.
      sub.style.setProperty("--st-row-bottom", Math.max(0, Math.round(gap - 6)) + "px");
    }
    for (const b of sub.querySelectorAll(".st-opt")) {
      b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); const c = choices.find((x) => x.v === b.dataset.v); if (c) chooseSetting(setOpenRow, c, b); });
    }
    for (const b of sub.querySelectorAll(".st-sync button")) {
      b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); nudgeRadioDelay(+b.dataset.n * 0.25); });
    }
  }
  let setCloseTimer = 0;
  function openSettings() {
    const w = document.getElementById("segfix-settings");
    if (!w) return;
    clearTimeout(setCloseTimer);
    // Only one menu at a time: opening settings closes the Watch mode menu.
    for (const m of document.querySelectorAll(".segfix-mode.open")) m.classList.remove("open");
    if (!w.classList.contains("open")) { setOpenRow = ""; setConfirm = null; w.classList.add("open"); renderSettings(); }
  }
  function closeSettings() {
    const w = document.getElementById("segfix-settings");
    clearTimeout(setCloseTimer);
    setOpenRow = ""; setConfirm = null;
    if (w) { w.classList.remove("open"); renderSettings(); }
  }
  function buildSettings() {
    const w = document.createElement("div");
    w.id = "segfix-settings";
    w.dataset.owner = SEGFIX_ID;
    w.innerHTML = `<button type="button" class="st-gear" aria-label="Settings" title="Settings">${GEAR}</button>` +
      '<div class="st-menu"><div class="st-sub"></div><div class="st-panel" role="menu"></div></div>';
    w.addEventListener("mouseenter", openSettings);
    w.addEventListener("mouseleave", () => { clearTimeout(setCloseTimer); setCloseTimer = setTimeout(closeSettings, 280); });
    w.querySelector(".st-gear").addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); w.classList.contains("open") ? closeSettings() : openSettings(); });
    w.querySelector(".st-panel").addEventListener("mouseover", (e) => {
      const r = e.target instanceof Element && e.target.closest(".st-row");
      if (r && r.dataset.row !== setOpenRow) { setOpenRow = r.dataset.row; setConfirm = null; renderSettings(); }
    });
    w.querySelector(".st-panel").addEventListener("click", (e) => {
      e.stopPropagation();
      const r = e.target instanceof Element && e.target.closest(".st-row");
      if (r) { setOpenRow = r.dataset.row; renderSettings(); }
    });
    onDoc("click", (e) => { if (!w.contains(e.target)) closeSettings(); });
    return w;
  }
  function buildChatButton() {
    const b = document.createElement("button");
    b.type = "button";
    b.id = "segfix-chatbar";
    b.dataset.owner = SEGFIX_ID;
    b.innerHTML = CHAT_ICON;
    b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleChat(); });
    return b;
  }
  // Keep the gear and the chat button in SEG+'s control bar.
  function syncChatColumn(hasChat) {
    document.getElementById("segfix-chatcol")?.remove();       // (older layout)
    const qb = document.querySelector('#primaryViewer [aria-label="Quality Settings"]');
    const sp = document.querySelector('#primaryViewer [aria-label="Playback Speed"]');
    const qBox = qb && qb.closest(".tooltip-box");
    const sBox = sp && sp.closest(".tooltip-box");
    let w = document.getElementById("segfix-settings");
    if (w && w.dataset.owner !== SEGFIX_ID) { w.remove(); w = null; }
    if (!qBox) { if (w) w.remove(); document.getElementById("segfix-chatbar")?.remove(); return; }
    qBox.classList.add("segfix-hidden-ctl");
    if (sBox) sBox.classList.add("segfix-hidden-ctl");
    if (!w) w = buildSettings();
    if (w.previousElementSibling !== qBox) qBox.insertAdjacentElement("afterend", w);
    // Chat button: live games only, where Speed used to be.
    let cb = document.getElementById("segfix-chatbar");
    if (cb && cb.dataset.owner !== SEGFIX_ID) { cb.remove(); cb = null; }
    if (!hasChat) { if (cb) cb.remove(); }
    else {
      if (!cb) cb = buildChatButton();
      const after = sBox || w;
      if (cb.previousElementSibling !== after) after.insertAdjacentElement("afterend", cb);
      cb.classList.toggle("on", chat.open);
      cb.title = chat.open ? "Hide chat (C)" : "Show chat (C)";
      cb.setAttribute("aria-label", cb.title);
      cb.setAttribute("aria-pressed", String(chat.open));
    }
    // Keep shown values fresh while the menu is open (quality settles, speed keys...).
    if (w.classList.contains("open") && !setConfirm) {
      const sig = JSON.stringify([settingsRows(), setOpenRow && settingsChoices(setOpenRow), radioDelay]);
      if (w.dataset.sig !== sig) { w.dataset.sig = sig; renderSettings(); }
    }
    syncRadioDelay();
  }

  function placeChat() {
    const vw = innerWidth, vh = innerHeight, m = 8;
    chat.w = Math.round(Math.min(Math.max(chat.w, CHAT_MIN.w), vw - 2 * m));
    chat.h = Math.round(Math.min(Math.max(chat.h, CHAT_MIN.h), vh - 2 * m));
    if (chat.x == null || chat.y == null) { chat.x = vw - chat.w - 20; chat.y = vh - chat.h - 72; }
    chat.x = Math.round(Math.min(Math.max(chat.x, m), vw - chat.w - m));
    chat.y = Math.round(Math.min(Math.max(chat.y, m), vh - chat.h - m));
    root.style.setProperty("--sf-chat-x", chat.x + "px");
    root.style.setProperty("--sf-chat-y", chat.y + "px");
    root.style.setProperty("--sf-chat-w", chat.w + "px");
    root.style.setProperty("--sf-chat-h", chat.h + "px");
    root.style.setProperty("--sf-chat-head", CHAT_HEAD + "px");
  }

  function getChatFrame() {
    let f = document.getElementById("segfix-chatframe");
    if (f) return f;
    f = document.createElement("div");
    f.id = "segfix-chatframe";
    f.innerHTML =
      '<div class="cf-head">' +
        '<span class="cf-grip" aria-hidden="true"></span>' +
        '<span class="cf-title"><i class="cf-dot"></i>Live chat</span>' +
        '<button type="button" class="cf-btn cf-reset" title="Move back to the corner" aria-label="Reset position">' +
          '<svg viewBox="0 0 24 24"><path d="M4 14h6v6H8v-2.6l-3.3 3.3-1.4-1.4L6.6 16H4zm16-4h-6V4h2v2.6l3.3-3.3 1.4 1.4L17.4 8H20z"/></svg></button>' +
        '<button type="button" class="cf-btn cf-close" title="Hide chat (C)" aria-label="Hide chat">' +
          '<svg viewBox="0 0 24 24"><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"/></svg></button>' +
      "</div>" +
      ["n", "e", "s", "w", "ne", "nw", "se", "sw"].map((d) => `<span class="cf-rz cf-${d}" data-dir="${d}"></span>`).join("");
    f.querySelector(".cf-close").addEventListener("click", (e) => { e.stopPropagation(); toggleChat(false); });
    f.querySelector(".cf-reset").addEventListener("click", (e) => {
      e.stopPropagation();
      chat.x = chat.y = null; chat.w = 360; chat.h = 520;
      placeChat(); saveChat();
    });
    // Drag by the header, resize from any edge or corner (mouse, pen or touch).
    const startDrag = (e, dir) => {
      if (e.button !== 0) return;
      e.preventDefault(); e.stopPropagation();
      const s = { px: e.clientX, py: e.clientY, x: chat.x, y: chat.y, w: chat.w, h: chat.h };
      root.classList.add("segfix-chat-moving");
      const move = (ev) => {
        const dx = ev.clientX - s.px, dy = ev.clientY - s.py;
        if (!dir) { chat.x = s.x + dx; chat.y = s.y + dy; }
        else {
          if (dir.includes("e")) chat.w = s.w + dx;
          if (dir.includes("s")) chat.h = s.h + dy;
          if (dir.includes("w")) { chat.w = Math.max(CHAT_MIN.w, s.w - dx); chat.x = s.x + s.w - chat.w; }
          if (dir.includes("n")) { chat.h = Math.max(CHAT_MIN.h, s.h - dy); chat.y = s.y + s.h - chat.h; }
        }
        placeChat();
      };
      const up = () => {
        root.classList.remove("segfix-chat-moving");
        removeEventListener("pointermove", move, true);
        removeEventListener("pointerup", up, true);
        removeEventListener("pointercancel", up, true);
        saveChat();
      };
      addEventListener("pointermove", move, true);
      addEventListener("pointerup", up, true);
      addEventListener("pointercancel", up, true);
    };
    f.querySelector(".cf-head").addEventListener("pointerdown", (e) => { if (!e.target.closest(".cf-btn")) startDrag(e, null); });
    f.querySelector(".cf-head").addEventListener("dblclick", (e) => { if (!e.target.closest(".cf-btn")) f.querySelector(".cf-reset").click(); });
    for (const h of f.querySelectorAll(".cf-rz")) h.addEventListener("pointerdown", (e) => startDrag(e, h.dataset.dir));
    return f;
  }

  function toggleChat(force) {
    if (!chatEl() || !isLiveNow()) { toast("Chat is only on live games"); return; }
    chat.open = typeof force === "boolean" ? force : !chat.open;
    saveChat();
    syncChat();
    toast(chat.open ? "Chat on" : "Chat off");
  }

  function syncChat() {
    const onWatch = WATCH_RE.test(location.pathname) && !!document.getElementById("primaryViewer");
    const frame = document.getElementById("segfix-chatframe");
    document.getElementById("segfix-chatbtn")?.remove();     // (old corner button; the toggle lives in the quality menu now)
    // Chat is a live-game thing: replays never get the option.
    const hasChat = onWatch && !!chatEl() && isLiveNow();
    if (onWatch) keepAudioPref();
    syncChatColumn(hasChat);
    if (!hasChat) {
      if (frame) frame.remove();
      root.classList.remove("segfix-chat-open");
      placeChatEl();
      return;
    }
    root.classList.toggle("segfix-chat-open", chat.open);
    placeChatEl();
    if (chat.open) { placeChat(); keepInLayer(getChatFrame()); }
    else if (frame) frame.remove();
  }
  actions.c = () => toggleChat();
  // A: flip between TV and the radio call.
  actions.a = () => {
    const f = audioFeeds();
    if (!f || !f.opts.some((o) => o.name === "Radio")) return toast("No radio call for this game");
    setAudioFeed(f.current === "Radio" ? (f.opts.find((o) => o.name === "English") || f.opts[0]).name : "Radio");
  };
  onWin("resize", () => { if (chat.open) { placeChat(); saveChat(); } });
  onDoc("fullscreenchange", () => setTimeout(syncChat, 50));
  setInterval(syncChat, 250);

  // =========================================================================
  //  REPLAYS ROW FILTER: "All games / Jazz only" next to a replays row title.
  //  Jazz only hides the Salt Lake City Stars (G League affiliate) games and
  //  tells the carousel to re-measure, so arrows and spacing stay right.
  //  The choice is remembered.
  // =========================================================================
  const STARS_KEY = "segfix-jazz-only";
  const STARS_RE = /Salt Lake City Stars/i;
  let jazzOnly = (() => { try { return localStorage.getItem(STARS_KEY) === "1"; } catch (e) { return false; } })();
  function decorateReplayFilter(reset) {
    for (const h of document.querySelectorAll(".content-slider h2")) {
      if (!/Replays/i.test(h.textContent || "")) continue;
      const row = h.closest(".content-slider");
      const slides = [...row.querySelectorAll(".swiper-slide")];
      const stars = slides.filter((s) => STARS_RE.test(s.textContent || ""));
      if (!stars.length) continue;                       // nothing to filter in this row
      let seg = row.querySelector(":scope .segfix-rowfilter");
      if (!seg) {
        seg = document.createElement("div");
        seg.className = "segfix-rowfilter";
        seg.setAttribute("role", "group");
        seg.setAttribute("aria-label", "Show games");
        seg.innerHTML = '<button type="button" data-v="all">All games</button><button type="button" data-v="jazz">Jazz only</button>';
        for (const b of seg.querySelectorAll("button")) {
          b.addEventListener("click", (e) => {
            e.preventDefault(); e.stopPropagation();
            jazzOnly = b.dataset.v === "jazz";
            try { localStorage.setItem(STARS_KEY, jazzOnly ? "1" : "0"); } catch (err) {}
            decorateReplayFilter(true);
          });
        }
        h.parentElement.appendChild(seg);
      }
      for (const b of seg.querySelectorAll("button")) b.classList.toggle("on", (b.dataset.v === "jazz") === jazzOnly);
      let changed = false;
      for (const s of slides) {
        const hide = jazzOnly && STARS_RE.test(s.textContent || "");
        if (s.classList.contains("segfix-hide-slide") !== hide) { s.classList.toggle("segfix-hide-slide", hide); changed = true; }
      }
      if (changed) {
        const sw = row.querySelector(".swiper") && row.querySelector(".swiper").swiper;
        // Re-measure only. Jump back to the newest game only when the user
        // flips the switch, never while they are paging with the arrows
        // (SEG+ loads more games as you page, which also lands here).
        try { if (sw) { sw.update(); if (reset === true) sw.slideTo(0, 0); } } catch (e) {}
      }
    }
  }
  setInterval(() => decorateReplayFilter(), 1000);

  // ---- Run on every page change -------------------------------------------
  let scheduled = false;
  const onDomChange = () => {
    if (scheduled) return;
    scheduled = true;
    // A plain timer (not requestAnimationFrame) so it also runs in background tabs.
    setTimeout(() => {
      scheduled = false;
      if (!alive()) return;
      for (const fn of [installGuard, decorateCards, decorateWatchPage, runPendingStart, decorateRecords, dismissStillWatching, decorateReplayFilter]) {
        try { fn(); } catch (e) {}  // one failing step never blocks the others
      }
    }, 60);
  };
  new MutationObserver(() => { if (alive()) onDomChange(); }).observe(document.documentElement, { childList: true, subtree: true });
  onDomChange();

})();
