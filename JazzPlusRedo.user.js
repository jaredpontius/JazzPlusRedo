// ==UserScript==
// @name         JazzPlusRedo
// @namespace    https://github.com/jaredpontius/JazzPlusRedo
// @version      4.1.0
// @description  Unofficial. A cleaner, smoother SEG+ / Jazz+ player: no chat or clutter, skip commercials and halftime, team records, From start / Live.
// @author       JazzPlusRedo
// @match        https://segplus.com/*
// @match        https://www.segplus.com/*
// @run-at       document-start
// @inject-into  page
// @grant        none
// @noframes
// @updateURL    https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js
// @downloadURL  https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js
// @homepageURL  https://github.com/jaredpontius/JazzPlusRedo
// @supportURL   https://github.com/jaredpontius/JazzPlusRedo/issues
// @license      MIT
// ==/UserScript==

// Built by build.py from extension/content.css + extension/content.js. Edit those, not this.
(function () {
  if (window.__jazzPlusRedoUserscript) return;
  window.__jazzPlusRedoUserscript = true;
  const CSS = "/* ==========================================================================\n   SEG+ Better Player \u2014 \"Jazz Night\" theme\n   ========================================================================== */\n\nhtml {\n  --sf-purple: #7c4dff !important;\n  --sf-purple-deep: #2a1060 !important;\n  --sf-gold: #ffc83d !important;\n  --sf-glass: rgba(16, 10, 30, 0.55) !important;\n  --sf-ease: cubic-bezier(0.22, 1, 0.36, 1) !important;\n  /* Re-color the site's own player accent (progress fill, hover time bubble). */\n  --color-player-accent-color: var(--sf-purple) !important;\n}\n\n/* --------------------------------------------------------------------------\n   1. Remove the clutter: live chat, fan reacts, feedback tab\n   -------------------------------------------------------------------------- */\n\n/* Live chat column + its open/close tab + \"chat paused\" banner */\n#topSplit > .activity-container,\n#topSplit > button.absolute.right-0,\n#topSplit > div.absolute.right-0,\ndiv.fixed.z-50:has(> div.backdrop-blur-lg),\n/* \"Switch to Full Width\" only toggled the chat column */\nbutton[aria-label=\"Switch to Full Width\"],\nbutton[aria-label=\"Exit Full Width\"],\n/* Fan reacts: the strip under the player, its button, any recorder */\n#primaryViewer > .bottom-area,\n#primaryViewer .fan-react-output,\n#primaryViewer [class*=\"fan-react\"],\n/* Qualtrics \"Provide Feedback\" tab */\n[class^=\"QSICustomHTML\"],\n[id^=\"QSICustomHTML\"],\n[id^=\"QSIFeedbackButton\"] {\n  display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   2. Cinematic page layout (normal, non-fullscreen view)\n   -------------------------------------------------------------------------- */\n\n#primaryViewer {\n  background:\n    radial-gradient(1200px 600px at 50% 45%, rgba(124, 77, 255, 0.22), transparent 70%),\n    radial-gradient(900px 500px at 85% 110%, rgba(255, 200, 61, 0.08), transparent 70%),\n    linear-gradient(180deg, #0b0716 0%, #120a26 55%, #07050e 100%) !important;\n}\n\n#topSplit {\n  flex: 1 1 auto !important;\n  height: auto !important;\n  min-height: 0 !important;\n}\n\n#videoDisplay {\n  flex: 1 1 auto !important;\n  height: 100% !important;\n  padding: 8px 32px 32px !important;\n  justify-content: center !important;\n  align-items: center !important;\n}\n\n#video-container {\n  /* As big as fits: full width, but never taller than the space available. */\n  width: min(100%, calc((100vh - 120px) * 16 / 9)) !important;\n  height: auto !important;\n  aspect-ratio: 16 / 9 !important;\n  flex: 0 0 auto !important;\n}\n\n#video-container > .player-shadow {\n  border-radius: 18px !important;\n  overflow: hidden !important;\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.06),\n    0 30px 80px -20px rgba(0, 0, 0, 0.9),\n    0 0 120px -10px rgba(124, 77, 255, 0.45) !important;\n  transition: border-radius 0.4s var(--sf-ease), box-shadow 0.4s var(--sf-ease) !important;\n}\n\n/* Top bar: transparent so the backdrop shows through */\n#primaryViewer > div:has(.nav-pip-selector) {\n  background: transparent !important;\n}\n\n/* Streams / English pill: frosted glass instead of flat light blue */\n.nav-pip-selector .multiview-option {\n  background: rgba(255, 255, 255, 0.08) !important;\n  border: 1px solid rgba(255, 255, 255, 0.12) !important;\n  backdrop-filter: blur(14px) saturate(140%) !important;\n  -webkit-backdrop-filter: blur(14px) saturate(140%) !important;\n  color: #fff !important;\n}\n.nav-pip-selector .multiview-option * {\n  color: #fff !important;\n  background-color: transparent !important;\n}\n.nav-pip-selector .multiview-option select option {\n  background: #1a1030 !important;\n}\n.nav-pip-selector .multiview-option img {\n  filter: brightness(0) invert(1) !important;\n}\n\n/* --------------------------------------------------------------------------\n   3. Player controls \u2014 frosted glass, slim progress bar\n   -------------------------------------------------------------------------- */\n\n/* Softer, taller scrim behind the controls */\n.player-controls > div > div.absolute.bottom-0[style*=\"linear-gradient\"] {\n  background: linear-gradient(0deg,\n    rgba(8, 4, 20, 0.92) 0%,\n    rgba(8, 4, 20, 0.55) 40%,\n    rgba(8, 4, 20, 0) 100%) !important;\n  height: 180% !important;\n}\n\n.player-controls > div > .py-1\\.5 {\n  padding: 10px 22px 14px !important;\n}\n\n/* Smoother show/hide than the site's default */\n.player-controls .fade-enter-active,\n.player-controls .fade-leave-active,\n.player-controls > div.fade-enter-active,\n.player-controls > div.fade-leave-active {\n  transition: opacity 0.35s var(--sf-ease), transform 0.35s var(--sf-ease) !important;\n}\n.player-controls > div.fade-enter-from,\n.player-controls > div.fade-leave-to {\n  opacity: 0 !important;\n  transform: translateY(8px) !important;\n}\n\n/* Time text */\n.player-controls .time-text {\n  font-variant-numeric: tabular-nums !important;\n  font-weight: 600 !important;\n  letter-spacing: 0.02em !important;\n  color: rgba(255, 255, 255, 0.85) !important;\n}\n\n/* Seek track: thin, grows on hover */\n.player-controls .time-bar .content > div > div.rounded-full.h-3,\n.player-controls .time-bar .content > div > div.absolute.rounded-full {\n  height: 4px !important;\n  top: 6px !important;\n  transition: height 0.2s var(--sf-ease), top 0.2s var(--sf-ease) !important;\n}\n.player-controls .time-bar .content > div > div.bg-gray-800\\/90 {\n  background: rgba(255, 255, 255, 0.18) !important;\n}\n.player-controls .time-bar:hover .content > div > div.rounded-full.h-3,\n.player-controls .time-bar:hover .content > div > div.absolute.rounded-full {\n  height: 8px !important;\n  top: 4px !important;\n}\n/* Progress fill: purple \u2192 gold */\n.player-controls .time-bar .content .bg-player-accent {\n  background: linear-gradient(90deg, var(--sf-purple), #b06bff 60%, var(--sf-gold)) !important;\n  box-shadow: 0 0 12px rgba(124, 77, 255, 0.7) !important;\n}\n/* Scrub knob: hidden until hover */\n.player-controls .time-bar .content button.rounded-full {\n  width: 14px !important;\n  height: 14px !important;\n  top: 1px !important;\n  margin-left: -1px !important;\n  background: #fff !important;\n  border: 0 !important;\n  box-shadow: 0 0 0 4px rgba(124, 77, 255, 0.35), 0 2px 8px rgba(0, 0, 0, 0.6) !important;\n  transform: scale(0) !important;\n  transition: transform 0.2s var(--sf-ease) !important;\n}\n.player-controls .time-bar:hover .content button.rounded-full,\n.player-controls .time-bar .content button.rounded-full:focus {\n  transform: scale(1) !important;\n}\n/* Hover time bubble */\n.player-controls .time-bar .bg-player-accent.bottom-7 {\n  background: var(--sf-glass) !important;\n  backdrop-filter: blur(10px) !important;\n  -webkit-backdrop-filter: blur(10px) !important;\n  border: 1px solid rgba(255, 255, 255, 0.12) !important;\n  border-radius: 8px !important;\n}\n.player-controls .time-bar .bg-player-accent.bottom-7 .arrow-down {\n  display: none !important;\n}\n\n/* Buttons: soft circular glow on hover instead of jumpy scale */\n.player-controls button.w-8.h-8,\n.player-controls .play-pause-btn {\n  border-radius: 999px !important;\n  transition: background-color 0.2s var(--sf-ease), transform 0.2s var(--sf-ease), opacity 0.2s !important;\n  opacity: 0.88 !important;\n}\n.player-controls button.w-8.h-8:hover,\n.player-controls .play-pause-btn:hover {\n  transform: scale(1.08) !important;\n  background-color: rgba(255, 255, 255, 0.12) !important;\n  opacity: 1 !important;\n}\n.player-controls .play-pause-btn {\n  background: rgba(255, 255, 255, 0.1) !important;\n  width: 40px !important;\n  height: 40px !important;\n}\n\n/* Small menus (speed, quality, captions) \u2192 glass */\n.player-controls [class*=\"bg-black\"],\n.player-controls [class*=\"bg-gray-9\"] {\n  backdrop-filter: blur(16px) !important;\n  -webkit-backdrop-filter: blur(16px) !important;\n}\n\n/* --------------------------------------------------------------------------\n   4. Fullscreen: edge to edge, no shrinking when the mouse moves\n   -------------------------------------------------------------------------- */\n\n:root:has(:fullscreen, body.fullscreen) #primaryViewer {\n  background: #000 !important;\n}\n\n/* Top bar floats over the video instead of pushing it down */\n:root:has(:fullscreen, body.fullscreen) #primaryViewer > div:has(.nav-pip-selector) {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  z-index: 60 !important;\n  padding-bottom: 36px !important;\n  background: linear-gradient(to bottom, rgba(8, 4, 20, 0.8), rgba(8, 4, 20, 0)) !important;\n  opacity: 0 !important;\n  transform: translateY(-10px) !important;\n  pointer-events: auto !important;\n  transition: opacity 0.35s var(--sf-ease), transform 0.35s var(--sf-ease) !important;\n}\n/* Only reveal it when the mouse is over the top strip of the screen */\n:root:has(:fullscreen, body.fullscreen) #primaryViewer > div:has(.nav-pip-selector):hover {\n  opacity: 1 !important;\n  transform: none !important;\n}\n\n:root:has(:fullscreen, body.fullscreen) #topSplit {\n  height: 100% !important;\n}\n:root:has(:fullscreen, body.fullscreen) #videoDisplay {\n  padding: 0 !important;\n  transition: none !important;\n}\n:root:has(:fullscreen, body.fullscreen) #video-container {\n  width: 100% !important;\n  height: 100% !important;\n  aspect-ratio: auto !important;\n  transition: none !important;\n}\n:root:has(:fullscreen, body.fullscreen) #video-container > .player-shadow {\n  border-radius: 0 !important;\n  box-shadow: none !important;\n}\n\n/* Hide the cursor when the mouse is idle (needs the optional shortcuts bookmark) */\nhtml.segfix-idle:has(:fullscreen),\nhtml.segfix-idle:has(:fullscreen) * {\n  cursor: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   5. On-screen feedback bubble for keyboard shortcuts\n   -------------------------------------------------------------------------- */\n\n#segfix-toast {\n  position: fixed !important;\n  top: 50% !important;\n  left: 50% !important;\n  z-index: 2147483647 !important;\n  min-width: 84px !important;\n  height: 84px !important;\n  padding: 0 22px !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 8px !important;\n  border-radius: 999px !important;\n  background: var(--sf-glass) !important;\n  border: 1px solid rgba(255, 255, 255, 0.14) !important;\n  backdrop-filter: blur(18px) saturate(150%) !important;\n  -webkit-backdrop-filter: blur(18px) saturate(150%) !important;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 77, 255, 0.35) !important;\n  color: #fff !important;\n  font: 700 17px/1 system-ui, -apple-system, \"Segoe UI\", sans-serif !important;\n  letter-spacing: 0.02em !important;\n  opacity: 0 !important;\n  transform: translate(-50%, -50%) scale(0.8) !important;\n  pointer-events: none !important;\n  transition: opacity 0.25s var(--sf-ease), transform 0.35s var(--sf-ease) !important;\n}\n#segfix-toast.left  { left: 22% !important; }\n#segfix-toast.right { left: 78% !important; }\n#segfix-toast.show {\n  opacity: 1 !important;\n  transform: translate(-50%, -50%) scale(1) !important;\n}\n#segfix-toast svg {\n  width: 30px !important;\n  height: 30px !important;\n  fill: currentColor !important;\n}\n#segfix-toast .live-dot {\n  width: 10px !important;\n  height: 10px !important;\n  border-radius: 50% !important;\n  background: #ff3b5c !important;\n  box-shadow: 0 0 10px #ff3b5c !important;\n}\n\n/* --------------------------------------------------------------------------\n   6. \"From start\" / \"Live\" buttons (added by the SEG+ extras bookmark)\n   -------------------------------------------------------------------------- */\n\n.segfix-starts {\n  display: flex !important;\n  gap: 8px !important;\n  margin-top: 8px !important;\n  width: 100% !important;\n}\n.segfix-starts button {\n  flex: 1 1 0 !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 7px !important;\n  padding: 8px 12px !important;\n  border-radius: 999px !important;\n  border: 1px solid rgba(255, 255, 255, 0.16) !important;\n  background: rgba(124, 77, 255, 0.18) !important;\n  color: #fff !important;\n  font: 700 14px/1 system-ui, -apple-system, sans-serif !important;\n  white-space: nowrap !important;\n  cursor: pointer !important;\n  transition: background-color 0.2s var(--sf-ease), transform 0.2s var(--sf-ease) !important;\n}\n.segfix-starts button:hover {\n  background: rgba(124, 77, 255, 0.45) !important;\n  transform: translateY(-1px) !important;\n}\n.segfix-starts svg {\n  width: 15px !important;\n  height: 15px !important;\n  fill: currentColor !important;\n}\n.segfix-starts .live-dot {\n  width: 8px !important;\n  height: 8px !important;\n  border-radius: 50% !important;\n  background: #ff3b5c !important;\n  box-shadow: 0 0 8px #ff3b5c !important;\n}\n/* Compact version in the player's top bar */\n.segfix-starts-top {\n  width: auto !important;\n  margin: 0 0 0 10px !important;\n  align-self: center !important;\n}\n.segfix-starts-top button {\n  flex: 0 0 auto !important;\n  padding: 7px 12px !important;\n  font-size: 13px !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n  backdrop-filter: blur(14px) !important;\n  -webkit-backdrop-filter: blur(14px) !important;\n}\n\n/* --------------------------------------------------------------------------\n   7. Remove \"Presented by Balance of Nature\" sponsor branding\n   -------------------------------------------------------------------------- */\n\n.sponsor-logo,\n.branding > :not(:first-child) > *,\n.branding .divider,\nimg[src*=\"balance\" i],\nimg[alt*=\"balance\" i],\nimg[src*=\"BalanceOfNature\" i],\n/* Home page \"SEG+ | Balance of Nature\" hero banner */\ndiv:has(> .swiper img[src*=\"2400x600\"]) {\n  display: none !important;\n}\n\n/* --------------------------------------------------------------------------\n   8. Matchup score bug: team records, broadcast style (added by the extras)\n   -------------------------------------------------------------------------- */\n\n#primaryViewer > div:has(.nav-pip-selector) {\n  position: relative !important;\n}\n.segfix-matchup {\n  --away: #888 !important;\n  --home: #888 !important;\n  position: absolute !important;\n  left: 50% !important;\n  top: 50% !important;\n  transform: translate(-50%, -50%) !important;\n  z-index: 5 !important;\n  display: grid !important;\n  grid-template-columns: auto auto auto !important;\n  align-items: stretch !important;\n  height: 46px !important;\n  padding: 0 !important;\n  color: #fff !important;\n  font-family: Roboto, \"Helvetica Neue\", Arial, sans-serif !important;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0) 55%),\n    rgba(12, 9, 20, 0.78) !important;\n  backdrop-filter: blur(18px) saturate(160%) !important;\n  -webkit-backdrop-filter: blur(18px) saturate(160%) !important;\n  clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 100%, 0 100%) !important;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.10) !important;\n  pointer-events: auto !important;\n  user-select: none !important;\n}\n/* Two-tone accent line along the bottom edge */\n.segfix-matchup::after {\n  content: \"\" !important;\n  position: absolute !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  height: 3px !important;\n  background: linear-gradient(90deg, var(--away) 0 50%, var(--home) 50% 100%) !important;\n}\n.segfix-matchup .sb-team {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  padding: 0 18px 3px !important;\n}\n.segfix-matchup .sb-team.away { padding-left: 8px !important; }\n.segfix-matchup .sb-team.home { padding-right: 8px !important; flex-direction: row-reverse !important; }\n\n/* Slanted team-color panel holding the logo */\n.segfix-matchup .sb-logo {\n  position: relative !important;\n  width: 58px !important;\n  height: 100% !important;\n  display: grid !important;\n  place-items: center !important;\n}\n.segfix-matchup .sb-logo::before {\n  content: \"\" !important;\n  position: absolute !important;\n  inset: 0 0 3px 0 !important;\n  background: linear-gradient(115deg, var(--tc) 0%, color-mix(in srgb, var(--tc) 55%, #0c0914) 100%) !important;\n  clip-path: polygon(16px 0, 100% 0, calc(100% - 12px) 100%, 0 100%) !important;\n}\n.segfix-matchup .sb-team.home .sb-logo::before {\n  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 100%, 12px 100%) !important;\n}\n.segfix-matchup .sb-logo img {\n  position: relative !important;\n  width: 32px !important;\n  height: 32px !important;\n  object-fit: contain !important;\n  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.55)) !important;\n}\n.segfix-matchup .sb-name {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: center !important;\n  line-height: 1 !important;\n  gap: 4px !important;\n}\n.segfix-matchup .sb-team.home .sb-name { align-items: flex-end !important; }\n.segfix-matchup .sb-name b {\n  font-weight: 900 !important;\n  font-size: 17px !important;\n  letter-spacing: 0.06em !important;\n  text-transform: uppercase !important;\n}\n.segfix-matchup .sb-name i {\n  font-style: normal !important;\n  font-weight: 500 !important;\n  font-size: 11.5px !important;\n  letter-spacing: 0.08em !important;\n  color: rgba(255, 255, 255, 0.62) !important;\n  font-variant-numeric: tabular-nums !important;\n}\n.segfix-matchup .sb-name i em {\n  font-style: normal !important;\n  font-weight: 800 !important;\n  color: #fff !important;\n}\n/* Center \"AT\" divider between two slanted hairlines */\n.segfix-matchup .sb-vs {\n  display: flex !important;\n  align-items: center !important;\n  gap: 10px !important;\n  padding: 0 4px 3px !important;\n  font-size: 10px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.24em !important;\n  color: rgba(255, 255, 255, 0.45) !important;\n}\n.segfix-matchup .sb-vs::before,\n.segfix-matchup .sb-vs::after {\n  content: \"\" !important;\n  width: 1px !important;\n  height: 24px !important;\n  background: rgba(255, 255, 255, 0.18) !important;\n  transform: skewX(-18deg) !important;\n}\n/* Gentle entrance */\n@keyframes segfix-bug-in {\n  from { opacity: 0; transform: translate(-50%, -38%); }\n  to   { opacity: 1; transform: translate(-50%, -50%); }\n}\n.segfix-matchup { animation: segfix-bug-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both !important; }\n\n/* --------------------------------------------------------------------------\n   9. Skip commercial / Skip halftime buttons (added by the extras)\n   -------------------------------------------------------------------------- */\n\n#segfix-skipbox {\n  position: fixed !important;\n  right: 28px !important;\n  bottom: 110px !important;\n  z-index: 2147483646 !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: flex-end !important;\n  gap: 10px !important;\n  pointer-events: none !important;\n}\n.segfix-skipbtn {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 10px !important;\n  padding: 14px 22px !important;\n  border-radius: 999px !important;\n  font: 800 17px/1 system-ui, -apple-system, sans-serif !important;\n  font-variant-numeric: tabular-nums !important;\n  cursor: pointer !important;\n  opacity: 0 !important;\n  transform: translateY(12px) scale(0.96) !important;\n  pointer-events: none !important;\n  transition: opacity 0.3s var(--sf-ease), transform 0.3s var(--sf-ease), filter 0.2s !important;\n}\n.segfix-skipbtn * { cursor: pointer !important; }\n.segfix-skipbtn svg { width: 20px !important; height: 20px !important; fill: currentColor !important; }\n.segfix-skipbtn.main {\n  order: 2 !important;\n  border: 1px solid rgba(255, 255, 255, 0.2) !important;\n  background: linear-gradient(90deg, var(--sf-purple), #b06bff 60%, var(--sf-gold)) !important;\n  color: #120a26 !important;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 77, 255, 0.55) !important;\n}\n.segfix-skipbtn.ht {\n  order: 1 !important;\n  border: 1px solid rgba(255, 255, 255, 0.18) !important;\n  background: rgba(16, 10, 30, 0.72) !important;\n  backdrop-filter: blur(16px) !important;\n  -webkit-backdrop-filter: blur(16px) !important;\n  color: #fff !important;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;\n}\n#segfix-skipbox.show .segfix-skipbtn.main,\n#segfix-skipbox.show.halftime .segfix-skipbtn.ht {\n  opacity: 1 !important;\n  transform: none !important;\n  pointer-events: auto !important;\n}\n.segfix-skipbtn:hover { filter: brightness(1.08) !important; transform: scale(1.04) !important; }\n/* Between halftime breaks (studio show): the main button just labels it */\n.segfix-skipbtn.main.muted {\n  background: rgba(16, 10, 30, 0.55) !important;\n  color: rgba(255, 255, 255, 0.7) !important;\n  box-shadow: none !important;\n}\n#segfix-skipbox.halftime .segfix-skipbtn.ht {\n  background: linear-gradient(90deg, var(--sf-purple), #b06bff 60%, var(--sf-gold)) !important;\n  color: #120a26 !important;\n}\n\n/* --------------------------------------------------------------------------\n   10. More removals: ad slots (Balance of Nature), Streams/English, CC\n   -------------------------------------------------------------------------- */\n\n.gpt-ad-slot,\ndiv:has(> .gpt-ad-slot),\n.flex-col:has(> div > .gpt-ad-slot),\n[id^=\"google_ads_iframe\"],\n.nav-pip-selector,\n.player-controls .caption-selector,\nbutton[aria-label=\"Subtitles\"] {\n  display: none !important;\n}\n\n/* \"Skip break\" button in the player's control bar */\n.segfix-skipbreak {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n  height: 32px !important;\n  padding: 0 12px !important;\n  border-radius: 999px !important;\n  border: 1px solid rgba(255, 255, 255, 0.18) !important;\n  background: rgba(124, 77, 255, 0.28) !important;\n  color: #fff !important;\n  font: 700 13px/1 system-ui, -apple-system, sans-serif !important;\n  white-space: nowrap !important;\n  cursor: pointer !important;\n  transition: background-color 0.2s var(--sf-ease), transform 0.2s var(--sf-ease) !important;\n}\n.segfix-skipbreak:hover {\n  background: rgba(124, 77, 255, 0.6) !important;\n  transform: scale(1.05) !important;\n}\n.segfix-skipbreak svg {\n  width: 14px !important;\n  height: 14px !important;\n  fill: currentColor !important;\n}\n\n/* --------------------------------------------------------------------------\n   11. Player top bar: \"Presented by Balance of Nature\" sponsor logo / ad spot\n   -------------------------------------------------------------------------- */\n\n.top-bar-contents .divider,\n.top-bar-contents .top-ad-spot,\n.top-bar-contents img.cursor-pointer,\n.top-bar-contents div:has(> img.cursor-pointer) {\n  display: none !important;\n}\n\n/* Hidden buttons stay hidden (e.g. \"Live\" on replays) */\n.segfix-starts button[hidden] {\n  display: none !important;\n}\n\n/* Top-bar From start / Live: pinned to the right, clear of the centered score bug */\n#primaryViewer > div:has(.nav-pip-selector) .segfix-starts-top {\n  position: absolute !important;\n  right: 64px !important;\n  top: 50% !important;\n  transform: translateY(-50%) !important;\n  margin: 0 !important;\n  z-index: 6 !important;\n}\n\n/* Key hint on the Skip buttons */\n.segfix-skipbtn .segfix-key {\n  display: inline-grid !important;\n  place-items: center !important;\n  min-width: 24px !important;\n  height: 22px !important;\n  padding: 0 6px !important;\n  margin-left: 2px !important;\n  border-radius: 6px !important;\n  border: 1px solid currentColor !important;\n  font: 700 12px/1 system-ui, -apple-system, sans-serif !important;\n  opacity: 0.75 !important;\n}\n\n/* --------------------------------------------------------------------------\n   13. Cover while jumping to tip-off / start / live (no spoilers, no flashes)\n   -------------------------------------------------------------------------- */\n\n#segfix-cover {\n  position: absolute !important;\n  inset: 0 !important;\n  z-index: 19990 !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 16px !important;\n  background:\n    radial-gradient(50% 50% at 50% 50%, rgba(124, 77, 255, 0.22), transparent 70%),\n    #07040f !important;\n  transition: opacity 0.35s var(--sf-ease) !important;\n}\n#segfix-cover.leaving { opacity: 0 !important; pointer-events: none !important; }\n#segfix-cover .cv-spin {\n  width: 44px !important;\n  height: 44px !important;\n  border-radius: 50% !important;\n  border: 3px solid rgba(255, 255, 255, 0.12) !important;\n  border-top-color: var(--sf-gold) !important;\n  border-right-color: var(--sf-purple) !important;\n  animation: cv-spin 0.9s linear infinite !important;\n}\n@keyframes cv-spin { to { transform: rotate(360deg); } }\n#segfix-cover .cv-label {\n  color: rgba(255, 255, 255, 0.75) !important;\n  font: 600 15px/1 system-ui, -apple-system, sans-serif !important;\n  letter-spacing: 0.02em !important;\n}\n#segfix-cover .cv-label:empty { display: none !important; }\n\n\n\n/* --------------------------------------------------------------------------\n   14. Player controls centered at the bottom (keeps the score area clear)\n   -------------------------------------------------------------------------- */\n\n.player-controls .left-side {\n  position: absolute !important;\n  left: 50% !important;\n  transform: translateX(-50%) !important;\n  width: auto !important;\n  flex: 0 0 auto !important;\n  justify-content: center !important;\n  padding-left: 0 !important;\n  z-index: 2 !important;\n}\n.player-controls div:has(> .left-side) {\n  position: relative !important;\n  justify-content: flex-end !important;\n  min-height: 48px !important;\n}\n\n/* Bar order: \u23ee \u00b7 \u21ba10 \u00b7 \u25b6 \u00b7 \u21bb10 \u00b7 volume, evenly spaced, play in the middle */\n.player-controls .left-side {\n  gap: 18px !important;\n  align-items: center !important;\n}\n.player-controls .left-side > * {\n  margin: 0 !important;\n}\n.player-controls .left-side > button[title=\"START OVER\"] { order: 1 !important; }\n.player-controls .left-side > button[aria-label=\"Rewind 10 Seconds\"] { order: 2 !important; }\n.player-controls .left-side > .play-pause-btn { order: 3 !important; width: 48px !important; height: 48px !important; }\n.player-controls .left-side > button[aria-label=\"Forward 10 Seconds\"] { order: 4 !important; }\n.player-controls .left-side > .volume-controls { order: 5 !important; }\n.player-controls .left-side > .play-pause-btn svg,\n.player-controls .left-side > .play-pause-btn img { transform: scale(1.15) !important; }\n\n/* Skip break no longer lives in the bar: the pop-up handles it */\n.segfix-skipbreak { display: none !important; }\n\n/* Volume: fixed footprint; the slider floats out to the right, so showing /\n   hiding it (hover, mute) never shifts the centered controls */\n.player-controls .left-side > .volume-controls {\n  position: relative !important;\n  width: 32px !important;\n  flex: 0 0 32px !important;\n}\n.player-controls .left-side > .volume-controls > div {\n  position: absolute !important;\n  left: calc(100% + 10px) !important;\n  top: 50% !important;\n  transform: translateY(-50%) !important;\n  width: 96px !important;\n  margin: 0 !important;\n}\n\n/* --------------------------------------------------------------------------\n   15. Skip pop-up: inside the video, right side, above the controls & menus\n   -------------------------------------------------------------------------- */\n\n#segfix-skipbox {\n  position: absolute !important;\n  right: 28px !important;\n  bottom: 30% !important;\n  top: auto !important;\n  left: auto !important;\n  z-index: 10001 !important;\n}\n.segfix-skipbtn.main {\n  position: relative !important;\n  overflow: hidden !important;\n  gap: 12px !important;\n  padding: 14px 18px 16px 22px !important;\n  border-radius: 16px !important;\n  border: 1.5px solid transparent !important;\n  background:\n    linear-gradient(180deg, rgba(24, 16, 44, 0.86), rgba(10, 6, 22, 0.92)) padding-box,\n    linear-gradient(120deg, var(--sf-purple), #b06bff 55%, var(--sf-gold)) border-box !important;\n  backdrop-filter: blur(14px) !important;\n  -webkit-backdrop-filter: blur(14px) !important;\n  color: #fff !important;\n  font: 800 17px/1 system-ui, -apple-system, sans-serif !important;\n  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55), 0 0 30px rgba(124, 77, 255, 0.35) !important;\n}\n.segfix-skipbtn.main:hover {\n  filter: none !important;\n  transform: translateY(-2px) !important;\n  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 44px rgba(255, 200, 61, 0.35) !important;\n}\n.segfix-skipbtn.main svg {\n  width: 18px !important;\n  height: 18px !important;\n  color: var(--sf-gold) !important;\n}\n.segfix-skipbtn.main .left {\n  padding: 4px 8px !important;\n  border-radius: 8px !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n  font: 700 13px/1 ui-monospace, Menlo, monospace !important;\n  color: rgba(255, 255, 255, 0.85) !important;\n  font-variant-numeric: tabular-nums !important;\n}\n.segfix-skipbtn.main .left:empty { display: none !important; }\n/* progress line across the bottom: how much of the break has passed */\n.segfix-skipbtn.main .prog {\n  position: absolute !important;\n  left: 0 !important;\n  bottom: 0 !important;\n  height: 3px !important;\n  width: var(--done, 0%) !important;\n  background: linear-gradient(90deg, var(--sf-purple), #b06bff 60%, var(--sf-gold)) !important;\n  transition: width 0.5s linear !important;\n}\n.segfix-skipbtn.main.muted {\n  background:\n    linear-gradient(180deg, rgba(24, 16, 44, 0.86), rgba(10, 6, 22, 0.92)) padding-box,\n    linear-gradient(120deg, var(--sf-purple), #b06bff 55%, var(--sf-gold)) border-box !important;\n  color: #fff !important;\n}\n@media (max-width: 700px) {\n  #segfix-skipbox { right: 14px !important; bottom: 26% !important; }\n  .segfix-skipbtn.main { font-size: 15px !important; padding: 11px 14px 13px 16px !important; }\n}\n\n/* --------------------------------------------------------------------------\n   12. Start chooser \u2014 compact, restrained dialog\n       \"Choose your starting point\": beginning \u00b7 tip-off \u00b7 live\n   -------------------------------------------------------------------------- */\n\n#segfix-chooser {\n  --ch-bg: #141416 !important;\n  --ch-line: rgba(255, 255, 255, 0.08) !important;\n  --ch-text: #f2f2f4 !important;\n  --ch-dim: rgba(242, 242, 244, 0.56) !important;\n  --ch-faint: rgba(242, 242, 244, 0.36) !important;\n  --ch-accent: #7c4dff !important;\n  position: absolute !important;\n  inset: 0 !important;\n  z-index: 20000 !important;\n  display: grid !important;\n  place-items: center !important;\n  padding: 16px !important;\n  background: rgba(0, 0, 0, 0.94) !important;   /* opaque: nothing from the video shows through */\n  font-family: -apple-system, \"SF Pro Text\", system-ui, \"Segoe UI\", Roboto, sans-serif !important;\n  animation: ch-in 0.22s ease-out both !important;\n}\n#segfix-chooser.closing { animation: ch-out 0.16s ease-in both !important; }\n@keyframes ch-in { from { opacity: 0; } to { opacity: 1; } }\n@keyframes ch-out { to { opacity: 0; } }\n\n#segfix-chooser .ch-card {\n  width: min(440px, 100%) !important;\n  border-radius: 14px !important;\n  background: var(--ch-bg) !important;\n  border: 1px solid var(--ch-line) !important;\n  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55) !important;\n  color: var(--ch-text) !important;\n  overflow: hidden !important;\n  animation: ch-card-in 0.26s cubic-bezier(0.2, 0.8, 0.2, 1) both !important;\n}\n@keyframes ch-card-in { from { opacity: 0; transform: translateY(6px) scale(0.985); } to { opacity: 1; transform: none; } }\n\n/* Header: eyebrow + one-line matchup */\n#segfix-chooser .ch-top {\n  padding: 18px 22px 14px !important;\n  border-bottom: 1px solid var(--ch-line) !important;\n}\n#segfix-chooser .ch-eyebrow {\n  display: flex !important;\n  align-items: center !important;\n  gap: 8px !important;\n  margin-bottom: 10px !important;\n  color: var(--ch-faint) !important;\n  font-size: 11px !important;\n  font-weight: 600 !important;\n  letter-spacing: 0.08em !important;\n  text-transform: uppercase !important;\n}\n#segfix-chooser .ch-eyebrow .ch-date:not(:empty)::before { content: \"\u00b7\" !important; margin-right: 8px !important; }\n#segfix-chooser .ch-live { color: #ff453a !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; }\n#segfix-chooser .ch-live::before {\n  content: \"\" !important;\n  width: 6px !important;\n  height: 6px !important;\n  border-radius: 50% !important;\n  background: #ff453a !important;\n}\n#segfix-chooser .ch-matchup {\n  display: flex !important;\n  align-items: center !important;\n  gap: 12px !important;\n  min-height: 24px !important;\n}\n#segfix-chooser .ch-team { display: inline-flex !important; align-items: center !important; gap: 8px !important; }\n#segfix-chooser .ch-team img { width: 24px !important; height: 24px !important; object-fit: contain !important; }\n#segfix-chooser .ch-team .nm { font-size: 15px !important; font-weight: 600 !important; letter-spacing: -0.01em !important; }\n#segfix-chooser .ch-team .rec { font-size: 13px !important; color: var(--ch-faint) !important; font-variant-numeric: tabular-nums !important; }\n#segfix-chooser .ch-at { color: var(--ch-faint) !important; font-size: 13px !important; }\n#segfix-chooser .ch-plain { font-size: 15px !important; font-weight: 600 !important; }\n\n/* Heading */\n#segfix-chooser .ch-h {\n  margin: 0 !important;\n  padding: 18px 22px 8px !important;\n  color: var(--ch-text) !important;\n  font-size: 19px !important;\n  font-weight: 650 !important;\n  letter-spacing: -0.015em !important;\n  line-height: 1.2 !important;\n}\n\n/* Options list */\n#segfix-chooser .ch-list { padding: 4px 10px 8px !important; }\n#segfix-chooser .ch-opt {\n  position: relative !important;\n  display: grid !important;\n  grid-template-columns: 32px 1fr auto !important;\n  align-items: center !important;\n  gap: 12px !important;\n  width: 100% !important;\n  padding: 12px 12px !important;\n  border: 0 !important;\n  border-radius: 9px !important;\n  background: transparent !important;\n  color: var(--ch-text) !important;\n  text-align: left !important;\n  cursor: pointer !important;\n  transition: background-color 0.12s ease !important;\n}\n#segfix-chooser .ch-opt + .ch-opt::before {\n  content: \"\" !important;\n  position: absolute !important;\n  left: 56px !important;\n  right: 12px !important;\n  top: 0 !important;\n  height: 1px !important;\n  background: var(--ch-line) !important;\n}\n#segfix-chooser .ch-opt.sel { background: rgba(255, 255, 255, 0.06) !important; }\n#segfix-chooser .ch-opt.sel::after {\n  content: \"\" !important;\n  position: absolute !important;\n  left: 0 !important;\n  top: 10px !important;\n  bottom: 10px !important;\n  width: 3px !important;\n  border-radius: 2px !important;\n  background: var(--ch-accent) !important;\n}\n#segfix-chooser .ch-opt.sel + .ch-opt::before,\n#segfix-chooser .ch-opt.sel::before { opacity: 0 !important; }\n#segfix-chooser .ch-opt .ic {\n  display: grid !important;\n  place-items: center !important;\n  width: 32px !important;\n  height: 32px !important;\n  color: var(--ch-dim) !important;\n}\n#segfix-chooser .ch-opt.sel .ic { color: var(--ch-text) !important; }\n#segfix-chooser .ch-opt .ic svg { width: 18px !important; height: 18px !important; fill: currentColor !important; }\n#segfix-chooser .ch-opt .tx { display: flex !important; flex-direction: column !important; gap: 3px !important; min-width: 0 !important; }\n#segfix-chooser .ch-opt .t { font-size: 15px !important; font-weight: 600 !important; letter-spacing: -0.01em !important; }\n#segfix-chooser .ch-opt .s { font-size: 12.5px !important; color: var(--ch-dim) !important; }\n#segfix-chooser .ch-opt .k {\n  color: var(--ch-faint) !important;\n  font-size: 11px !important;\n  font-weight: 600 !important;\n  letter-spacing: 0.04em !important;\n}\n#segfix-chooser .ch-opt .k:empty { display: none !important; }\n\n/* Footer */\n#segfix-chooser .ch-foot {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  gap: 12px !important;\n  padding: 12px 22px 14px !important;\n  border-top: 1px solid var(--ch-line) !important;\n}\n#segfix-chooser .ch-continue {\n  padding: 0 !important;\n  border: 0 !important;\n  background: none !important;\n  color: var(--ch-dim) !important;\n  font: inherit !important;\n  font-size: 13px !important;\n  font-weight: 500 !important;\n  cursor: pointer !important;\n}\n#segfix-chooser .ch-continue:hover { color: var(--ch-text) !important; }\n#segfix-chooser .ch-keys { color: var(--ch-faint) !important; font-size: 11.5px !important; white-space: nowrap !important; }\n#segfix-chooser .ch-keys kbd {\n  display: inline-block !important;\n  min-width: 18px !important;\n  margin: 0 2px !important;\n  padding: 1px 5px !important;\n  border-radius: 4px !important;\n  border: 1px solid var(--ch-line) !important;\n  background: rgba(255, 255, 255, 0.04) !important;\n  color: var(--ch-dim) !important;\n  font: 600 10.5px/1.5 -apple-system, system-ui, sans-serif !important;\n  text-align: center !important;\n}\n@media (max-width: 520px) {\n  #segfix-chooser .ch-keys { display: none !important; }\n}\n\n#segfix-chooser .ch-matchup:empty { display: none !important; }\n#segfix-chooser .ch-top:has(.ch-matchup:empty) .ch-eyebrow { margin-bottom: 0 !important; }\n\n\n/* --------------------------------------------------------------------------\n   16. Watch-mode picker (control bar + start chooser), same look as the dialog\n   -------------------------------------------------------------------------- */\n\n#segfix-chooser .ch-card { overflow: visible !important; }\n\n.segfix-mode {\n  --m-bg: #141416 !important;\n  --m-line: rgba(255, 255, 255, 0.08) !important;\n  --m-text: #f2f2f4 !important;\n  --m-dim: rgba(242, 242, 244, 0.56) !important;\n  --m-faint: rgba(242, 242, 244, 0.36) !important;\n  position: relative !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  font-family: -apple-system, \"SF Pro Text\", system-ui, \"Segoe UI\", Roboto, sans-serif !important;\n}\n.segfix-mode .mode-trigger {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 7px !important;\n  height: 30px !important;\n  padding: 0 8px 0 9px !important;\n  border-radius: 7px !important;\n  border: 1px solid var(--m-line) !important;\n  background: rgba(255, 255, 255, 0.04) !important;\n  color: var(--m-dim) !important;\n  font: 600 12.5px/1 -apple-system, system-ui, sans-serif !important;\n  cursor: pointer !important;\n  transition: color 0.15s, background-color 0.15s, border-color 0.15s !important;\n}\n.segfix-mode .mode-trigger:hover,\n.segfix-mode.open .mode-trigger { color: var(--m-text) !important; background: rgba(255, 255, 255, 0.08) !important; border-color: rgba(255, 255, 255, 0.14) !important; }\n.segfix-mode.on .mode-trigger { color: var(--m-text) !important; }\n.segfix-mode .mi svg { width: 14px !important; height: 14px !important; fill: currentColor !important; display: block !important; }\n.segfix-mode.on .mi { color: #a98bff !important; }\n.segfix-mode .mc svg { width: 14px !important; height: 14px !important; display: block !important; opacity: 0.7 !important; transition: transform 0.15s !important; }\n.segfix-mode.open .mc svg { transform: rotate(180deg) !important; }\n\n.segfix-mode .mode-menu {\n  position: absolute !important;\n  bottom: calc(100% + 8px) !important;\n  width: 280px !important;\n  padding: 6px !important;\n  border-radius: 12px !important;\n  background: var(--m-bg) !important;\n  border: 1px solid var(--m-line) !important;\n  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55) !important;\n  opacity: 0 !important;\n  transform: translateY(4px) !important;\n  pointer-events: none !important;\n  transition: opacity 0.14s ease, transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1) !important;\n  z-index: 10002 !important;\n}\n.segfix-mode.in-bar .mode-menu { right: 0 !important; }\n.segfix-mode.in-chooser .mode-menu { left: -6px !important; }\n.segfix-mode.open .mode-menu { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }\n.segfix-mode .mode-head {\n  padding: 8px 10px 6px !important;\n  color: var(--m-faint) !important;\n  font: 600 10.5px/1 -apple-system, system-ui, sans-serif !important;\n  letter-spacing: 0.08em !important;\n  text-transform: uppercase !important;\n}\n.segfix-mode .mode-opt {\n  position: relative !important;\n  display: grid !important;\n  grid-template-columns: 26px 1fr 14px !important;\n  align-items: center !important;\n  gap: 10px !important;\n  width: 100% !important;\n  padding: 9px 10px !important;\n  border: 0 !important;\n  border-radius: 8px !important;\n  background: transparent !important;\n  color: var(--m-text) !important;\n  text-align: left !important;\n  cursor: pointer !important;\n}\n.segfix-mode .mode-opt:hover { background: rgba(255, 255, 255, 0.05) !important; }\n.segfix-mode .mode-opt.active { background: rgba(255, 255, 255, 0.06) !important; }\n.segfix-mode .mode-opt.active::after {\n  content: \"\" !important;\n  position: absolute !important;\n  left: 0 !important;\n  top: 9px !important;\n  bottom: 9px !important;\n  width: 3px !important;\n  border-radius: 2px !important;\n  background: #7c4dff !important;\n}\n.segfix-mode .mode-opt .oi { display: grid !important; place-items: center !important; color: var(--m-dim) !important; }\n.segfix-mode .mode-opt.active .oi { color: var(--m-text) !important; }\n.segfix-mode .mode-opt .oi svg { width: 16px !important; height: 16px !important; fill: currentColor !important; }\n.segfix-mode .mode-opt .mt { display: flex !important; flex-direction: column !important; gap: 3px !important; min-width: 0 !important; }\n.segfix-mode .mode-opt .t { font: 600 13.5px/1.15 -apple-system, system-ui, sans-serif !important; letter-spacing: -0.01em !important; }\n.segfix-mode .mode-opt .s { font: 400 12px/1.25 -apple-system, system-ui, sans-serif !important; color: var(--m-dim) !important; }\n.segfix-mode .mode-opt .ck { color: var(--m-text) !important; font-size: 12px !important; font-weight: 700 !important; visibility: hidden !important; }\n.segfix-mode .mode-opt.active .ck { visibility: visible !important; }\n\n/* In the control bar: same picker, a touch smaller */\n.segfix-mode.in-bar { margin-right: 10px !important; }\n.segfix-mode.in-bar .mode-trigger { height: 28px !important; background: rgba(0, 0, 0, 0.25) !important; }\n@media (max-width: 760px) { .segfix-mode.in-bar .ml { display: none !important; } }\n\n/* The \"Enter\" hint follows the highlighted row */\n#segfix-chooser .ch-opt .k { visibility: hidden !important; }\n#segfix-chooser .ch-opt.sel .k { visibility: visible !important; }\n\n/* Start card footer: just \"Continue from current position\" */\n#segfix-chooser .ch-foot { justify-content: flex-start !important; }\n/* Scoreboard without records: names centered vertically */\n.segfix-matchup .sb-name { justify-content: center !important; }\n\n/* Start card: centered, slightly larger matchup */\n#segfix-chooser .ch-top { text-align: center !important; padding: 20px 22px 18px !important; }\n#segfix-chooser .ch-eyebrow { justify-content: center !important; margin-bottom: 14px !important; }\n#segfix-chooser .ch-matchup { justify-content: center !important; gap: 18px !important; min-height: 36px !important; }\n#segfix-chooser .ch-team { gap: 10px !important; }\n#segfix-chooser .ch-team img { width: 36px !important; height: 36px !important; }\n#segfix-chooser .ch-team .nm { font-size: 19px !important; font-weight: 650 !important; letter-spacing: -0.015em !important; }\n#segfix-chooser .ch-at { font-size: 14px !important; }\n\n/* --------------------------------------------------------------------------\n   Phone remote (touch screens, e.g. AirPlaying from iPhone Safari)\n   -------------------------------------------------------------------------- */\n#segfix-remote {\n  position: fixed !important;\n  left: 0 !important; right: 0 !important; bottom: 0 !important;\n  z-index: 2147483000 !important;\n  padding: 14px 16px calc(14px + env(safe-area-inset-bottom)) !important;\n  display: flex !important; flex-direction: column !important; gap: 14px !important;\n  background: linear-gradient(180deg, rgba(20, 12, 40, 0.92), rgba(10, 6, 22, 0.98)) !important;\n  -webkit-backdrop-filter: blur(18px) !important; backdrop-filter: blur(18px) !important;\n  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;\n  border-radius: 22px 22px 0 0 !important;\n  color: #fff !important;\n  font: 600 15px/1.2 system-ui, -apple-system, sans-serif !important;\n  -webkit-user-select: none !important; user-select: none !important;\n  -webkit-tap-highlight-color: transparent !important;\n}\nhtml.segfix-phone body { padding-bottom: 300px !important; }\n/* The in-video Skip pill is replaced by the big one in the remote. */\nhtml.segfix-phone #segfix-skipbox { display: none !important; }\n#segfix-remote button {\n  font: inherit !important; color: inherit !important; border: 0 !important; cursor: pointer !important;\n  -webkit-tap-highlight-color: transparent !important; touch-action: manipulation !important;\n}\n#segfix-remote svg { width: 26px !important; height: 26px !important; fill: currentColor !important; }\n#segfix-remote .r-top { display: flex !important; align-items: center !important; justify-content: space-between !important; }\n#segfix-remote .r-where { color: #b9add6 !important; font-size: 14px !important; display: flex !important; align-items: center !important; gap: 8px !important; }\n#segfix-remote.on-tv .r-where { color: #fff !important; }\n#segfix-remote .r-where .dot { width: 8px !important; height: 8px !important; border-radius: 50% !important; background: #3ddc84 !important; box-shadow: 0 0 10px #3ddc84 !important; }\n#segfix-remote .r-air {\n  display: flex !important; align-items: center !important; gap: 6px !important;\n  padding: 8px 14px !important; border-radius: 999px !important; background: rgba(255, 255, 255, 0.1) !important;\n}\n#segfix-remote .r-air svg { width: 20px !important; height: 20px !important; }\n#segfix-remote.on-tv .r-air { background: rgba(61, 220, 132, 0.18) !important; color: #3ddc84 !important; }\n#segfix-remote .r-skip {\n  display: none !important; position: relative !important; overflow: hidden !important;\n  align-items: center !important; justify-content: center !important; gap: 10px !important;\n  min-height: 64px !important; border-radius: 18px !important;\n  background: linear-gradient(90deg, var(--sf-purple), #b06bff 60%, var(--sf-gold)) !important;\n  color: #120a26 !important; font-size: 20px !important; font-weight: 800 !important;\n  box-shadow: 0 0 30px rgba(124, 77, 255, 0.45) !important;\n}\n#segfix-remote .r-skip.show { display: flex !important; }\n#segfix-remote .r-skip::after {\n  content: \"\" !important; position: absolute !important; left: 0 !important; bottom: 0 !important; height: 4px !important;\n  width: var(--done, 0%) !important; background: rgba(18, 10, 38, 0.55) !important;\n}\n#segfix-remote .r-skip .left { font-variant-numeric: tabular-nums !important; opacity: 0.7 !important; font-weight: 700 !important; font-size: 16px !important; }\n#segfix-remote .r-pad { display: flex !important; align-items: center !important; justify-content: space-around !important; }\n#segfix-remote .r-btn {\n  width: 72px !important; height: 72px !important; border-radius: 50% !important;\n  display: grid !important; place-items: center !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n}\n#segfix-remote .r-btn:active, #segfix-remote .r-row button:active, #segfix-remote .r-skip:active { transform: scale(0.94) !important; }\n#segfix-remote .r-btn svg { width: 34px !important; height: 34px !important; }\n#segfix-remote .r-play { width: 88px !important; height: 88px !important; background: #fff !important; color: #120a26 !important; }\n#segfix-remote .r-play svg { width: 40px !important; height: 40px !important; }\n#segfix-remote .r-row { display: flex !important; gap: 10px !important; }\n#segfix-remote .r-row button {\n  flex: 1 !important; min-height: 46px !important; border-radius: 14px !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n  display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important;\n}\n#segfix-remote .r-row button.hide { display: none !important; }\n#segfix-remote .live-dot { width: 8px !important; height: 8px !important; border-radius: 50% !important; background: #ff3b5c !important; }\n";
  const addStyle = () => {
    const s = document.createElement('style');
    s.id = 'jazzplusredo-style';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  };
  addStyle();
  // Some pages rebuild <head>; put the styles back if they vanish.
  new MutationObserver(() => { if (!document.getElementById('jazzplusredo-style')) addStyle(); })
    .observe(document.documentElement, { childList: true, subtree: true });
  const run = () => {
    window.__segfixQuiet = true;
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
  for (const el of document.querySelectorAll("#segfix-chooser, #segfix-cover, #segfix-skipbox, #segfix-toast, #segfix-modebtn, .segfix-mode, #segfix-diag, .segfix-starts, .segfix-matchup, .segfix-skipbreak")) el.remove();
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
      for (let i = 0; i < 60 && !coverPlayer(p.sp === "tip" ? "Heading to tip-off…" : p.sp === "0" ? "Going to the start…" : "Going live…"); i++) await sleep(100);
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
  }

  // Game cards / schedule rows: add the buttons under Resume / Watch.
  function decorateCards() {
    for (const btn of document.querySelectorAll("button:not([data-segfix])")) {
      if (btn.closest("#primaryViewer, .segfix-starts")) continue;
      if (!START_LABELS.test(btn.textContent.trim())) continue;
      btn.dataset.segfix = "1";
      const holder = btn.parentElement;
      if (!holder || holder.querySelector(":scope > .segfix-starts") || holder.nextElementSibling?.classList.contains("segfix-starts")) continue; // already has buttons
      const row = makeStartRow((sp) => {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ sp, t: Date.now() })); } catch (e) {}
        toast(sp === "tip" ? "Opening at tip-off…" : sp === "0" ? "Opening from the start…" : "Opening live…");
        btn.click();
      }, cardIsLive(btn));
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
        ? `<em>${t.w}</em>&ndash;${t.l}&ndash;${t.otl}`
        : `<em>${t.w}</em>&ndash;${t.l}`;
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
      else if (head.startsWith("#EXTM3U") && text.includes("#EXTINF")) onPlayerPlaylist(url, text);
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
  const tl = { url: "", recId: null, isStatic: false, segs: [], liveBreaks: [], liveShift: 0 };
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
    tl.liveShift = 0; hlsState.url = "";            // DASH is the player's stream: it always wins
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
    if (live) return t + (tl.liveShift || 0);
    let seg = null;
    for (const s of tl.segs) { if (s.rel <= t + 1e-6) seg = s; else break; }
    if (!seg || seg.ad || seg.epoch == null) return null;
    return seg.epoch + (t - seg.rel);
  }
  function playbackFromEpoch(e, live) {
    if (live) return e - (tl.liveShift || 0);
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
    tl.url = ""; tl.recId = null; tl.isStatic = false; tl.segs = []; tl.liveBreaks = []; tl.liveShift = 0; hlsState.url = ""; hlsState.next = 0;
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


  // =========================================================================
  //  HLS (Safari on iPhone / iPad, and AirPlay): the player plays an HLS
  //  stream instead of DASH. Each content segment carries the wall clock
  //  (#EXT-X-PROGRAM-DATE-TIME), which runs exactly 22s behind the DASH
  //  broadcast clock (measured on several games), so everything is mapped
  //  onto the same stream clock and the break engine works unchanged.
  //  Inserted ads are segments with no clock of their own.
  // =========================================================================
  const HLS_CLOCK_SHIFT = 22;
  const hlsState = { url: "", next: 0, variant: "" };
  const absUrl = (u, base) => { try { return new URL(u, base).href; } catch (e) { return u; } };
  function parsePlaylist(text) {
    const lines = text.split(/\r?\n/);
    const segs = [], events = [];
    let pos = 0, pdt = null, groupNew = true, anchor = null, dur = 0, isStatic = false, uriAd = false;
    const isAdUri = (u) => /\/segment\/|dashsegment|\/ads?\/|tm-|-ad-/i.test(u);
    const epochAt = (at) => (anchor ? anchor.epoch + (at - anchor.rel) : null);
    for (const raw of lines) {
      const ln = raw.trim();
      if (!ln) continue;
      if (ln.startsWith("#EXT-X-ENDLIST")) isStatic = true;
      else if (ln.startsWith("#EXT-X-PLAYLIST-TYPE:VOD")) isStatic = true;
      else if (ln.startsWith("#EXT-X-DISCONTINUITY") && !ln.startsWith("#EXT-X-DISCONTINUITY-SEQUENCE")) groupNew = true;
      else if (ln.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
        const t = Date.parse(ln.slice(25));
        if (isFinite(t)) pdt = t / 1000 + HLS_CLOCK_SHIFT;
      } else if (ln.startsWith("#EXTINF:")) dur = parseFloat(ln.slice(8)) || 0;
      else if (/^#EXT-X-CUE-OUT(?!-CONT)/.test(ln)) {
        const d = parseFloat((ln.match(/DURATION=([\d.]+)/i) || ln.match(/CUE-OUT:([\d.]+)/) || [])[1]);
        events.push({ rel: pos, out: true, dur: isFinite(d) ? d : null });
      } else if (ln.startsWith("#EXT-X-CUE-IN")) events.push({ rel: pos, out: false });
      else if (ln.startsWith("#EXT-X-DATERANGE") && /SCTE35-OUT|SCTE35-IN|CUE/i.test(ln)) {
        const st = Date.parse((ln.match(/START-DATE="([^"]+)"/) || [])[1] || "");
        const d = parseFloat((ln.match(/(?:PLANNED-)?DURATION=([\d.]+)/) || [])[1]);
        if (isFinite(st)) events.push({ at: st / 1000 + HLS_CLOCK_SHIFT, out: !/SCTE35-IN/.test(ln), dur: isFinite(d) ? d : null });
      } else if (!ln.startsWith("#")) {
        const ad = isAdUri(ln) || (groupNew && pdt == null && uriAd);
        if (pdt != null && !isAdUri(ln)) {
          const ep = pdt;
          // Only start a new piece when the clock jumps (or after a discontinuity).
          const expect = epochAt(pos);
          if (groupNew || !anchor || expect == null || Math.abs(expect - ep) > 0.5 || segs[segs.length - 1].ad) {
            segs.push({ rel: pos, epoch: ep, ad: false, id: "" });
          }
          anchor = { rel: pos, epoch: ep };
        } else if (groupNew || !segs.length || !segs[segs.length - 1].ad !== !ad) {
          segs.push({ rel: pos, epoch: ad ? null : epochAt(pos), ad, id: "" });
        }
        uriAd = true;
        groupNew = false; pdt = null;
        pos += dur; dur = 0;
      }
    }
    // Markers -> breaks on the stream clock (a marker's time comes from the
    // content piece it sits in, or the one just before an ad).
    const epochAtRel = (r) => {
      let best = null;
      for (const sg of segs) if (sg.rel <= r + 1e-6 && !sg.ad && sg.epoch != null) best = sg;
      return best ? best.epoch + (r - best.rel) : null;
    };
    const raw = [];
    let open = null;
    for (const e of events) {
      const at = e.at != null ? e.at : epochAtRel(e.rel);
      if (at == null) continue;
      if (e.out) { if (e.dur) raw.push({ start: at, end: at + e.dur }); else if (open == null) open = at; }
      else if (open != null) { raw.push({ start: open, end: at }); open = null; }
    }
    if (open != null) raw.push({ start: open, end: null });
    for (let i = 0; i < segs.length; i++) {
      if (!segs[i].ad) continue;
      let j = i;
      while (j + 1 < segs.length && segs[j + 1].ad) j++;
      const prev = segs.slice(0, i).reverse().find((x) => !x.ad && x.epoch != null);
      const next = segs[j + 1];
      if (prev) raw.push({ start: prev.epoch + (segs[i].rel - prev.rel), end: next && next.epoch != null ? next.epoch : null });
      i = j;
    }
    return { isStatic, segs, breaks: mergeBreaks(raw), length: pos };
  }
  function onPlayerPlaylist(url, text) {
    let r = null;
    try { r = parsePlaylist(text); } catch (e) {}
    if (!r || !r.segs.some((s) => s.epoch != null)) return;
    const rec = recIdOf(url) || recIdOf(hlsState.url);
    if (rec && rec !== tl.recId) tl.liveBreaks = [];
    tl.url = hlsState.url || url; tl.recId = rec || tl.recId; tl.isStatic = r.isStatic; tl.segs = r.segs;
    tl.liveShift = HLS_CLOCK_SHIFT;
    mpdIsStatic = r.isStatic;
    const first = r.segs.find((s) => s.epoch != null);
    mediaEpoch0 = r.isStatic && first ? first.epoch - first.rel : null;
    if (!r.isStatic) tl.liveBreaks = mergeBreaks(tl.liveBreaks.filter((b) => b.end != null).concat(r.breaks));
    scte = r.breaks.map((b) => ({ at: b.start, out: "true", dur: b.end != null ? b.end - b.start : null }));
    diag.hls = { segs: r.segs.length, ads: r.segs.filter((s) => s.ad).length, breaks: r.breaks.length, static: r.isStatic };
    if (tl.recId) loadOriginBreaks(tl.recId);
  }
  // The player tells us which HLS stream it plays; read it ourselves
  // (Safari's own video engine fetches it, so the hooks never see it).
  async function pollHls() {
    const p = bmPlayer();
    let src = null;
    try { src = p && p.getSource && p.getSource(); } catch (e) {}
    const url = src && src.hls;
    if (!url || lastMpdSeen || diag.lastMpd) return;      // the player is on DASH: nothing to do here
    const appleTouch = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    if (src.dash && !appleTouch && !isHlsPlaying()) return;
    if (url !== hlsState.url) { hlsState.url = url; hlsState.variant = ""; hlsState.next = 0; }
    if (Date.now() < hlsState.next) return;
    hlsState.next = Date.now() + (tl.isStatic && tl.segs.length ? 600000 : 6000);
    try {
      if (!hlsState.variant) {
        const m = await (await ownFetch(url)).text();
        if (m.includes("#EXTINF")) { hlsState.variant = url; onPlayerPlaylist(url, m); return; }
        const v = m.split(/\r?\n/).find((l) => l && !l.startsWith("#"));
        if (!v) return;
        hlsState.variant = absUrl(v.trim(), url);
      }
      onPlayerPlaylist(hlsState.variant, await (await ownFetch(hlsState.variant)).text());
    } catch (e) {}
  }
  function isHlsPlaying() {
    const v = document.querySelector("#primaryViewer video");
    return !!(v && /\.m3u8/i.test(v.currentSrc || v.src || ""));
  }
  setInterval(pollHls, 2000);

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
      hls: diag.hls || null,
      hlsUrl: hlsState.url ? hlsState.url.split("?")[0].slice(-70) : null,
      onTv: (() => { try { return onTv(); } catch (e) { return null; } })(),
      epochNow: (() => { try { return epochNow(); } catch (e) { return null; } })(),
      liveShift: tl.liveShift,
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
  function deepProbe() {
    const inst = findPlayerInstance();
    const out = { props: {}, adLikeProps: [] };
    if (inst) {
      for (const k of Object.keys(inst.props)) {
        const val = inst.props[k];
        out.props[k] = typeof val === "object" ? fmt(val, 400) : val;
      }
    }
    // Any component prop whose name mentions ads/breaks, anywhere in the app.
    const root = document.getElementById("app-wrapper");
    const seen = new Set(); const stack = root && root._vnode ? [root._vnode] : [];
    while (stack.length && out.adLikeProps.length < 40) {
      const vn = stack.pop(); if (!vn || typeof vn !== "object") continue;
      const c = vn.component;
      if (c && !seen.has(c)) {
        seen.add(c);
        for (const k of Object.keys(c.props || {})) {
          if (/ad|break|avail|cue|scte|commercial/i.test(k) && !/^(load|head|read|upload|thread|shadow|gradient|badge|radius|padding|add)/i.test(k)) {
            out.adLikeProps.push((c.type.__name || c.type.name || "?") + "." + k + " = " + fmt(c.props[k], 200));
          }
        }
        stack.push(c.subTree);
      }
      if (Array.isArray(vn.children)) for (const ch of vn.children) stack.push(ch);
      if (vn.suspense) stack.push(vn.suspense.activeBranch);
    }
    return out;
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

  // Temporary debug link (only in debug builds): the add-on's bridge script
  // forwards snapshots to a receiver on this Mac and passes test commands back.
  if (window.__segfixDebug) {
    const send = (kind, data) => window.postMessage({ __segfixOut: kind, data }, "*");
    setInterval(() => { if (document.getElementById("primaryViewer")) send("snap", diagSnapshot()); }, 2000);
    onWin("message", async (e) => {
      if (e.source !== window || !e.data || !e.data.__segfixCmd) return;
      const cmd = String(e.data.__segfixCmd);
      const before = diagSnapshot();
      let result = "ok";
      try {
        if (cmd === "skip") await skipBreak();
        else if (cmd === "fwd") q('[aria-label="Forward 10 Seconds"]')?.click();
        else if (cmd === "back") q('[aria-label="Rewind 10 Seconds"]')?.click();
        else if (cmd === "startover") result = doStart("0");
        else if (cmd === "live") result = doStart("-1");
        else if (cmd === "playpause") q(".play-pause-btn")?.click();
        else if (cmd === "probe") result = deepProbe();
        else if (cmd === "mpd") { const t = diag.lastMpd || ""; const i = t.indexOf("<EventStream"); result = { head: t.slice(0, 1500), events: i >= 0 ? t.slice(i, i + 6000) : "none" }; }
        else if (cmd.startsWith("js:")) { const code = atob(cmd.slice(3)); result = await (new Function("ctx", "return (async () => {" + code + "})()"))({ scte, diag, findPlayerInstance, q, skipBreak, doStart, exactBreaks, pbp, tl, epochNow, guardDecision, savedMarkerBreaks, allBreaks }); }
        else result = "unknown command";
      } catch (err) { result = "error: " + err; }
      await sleep(1500);
      send("cmd", { cmd, result, before, after: diagSnapshot() });
    });
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
      if (/end game/i.test(pts[i].type.text)) continue;
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

  // ---- Combine sources -----------------------------------------------------
  // Returns { ads: [{start,end}], halves: [{start,end}], exact: bool } in stream time.
  const HALFTIME_GAP = 240;   // at most 4 min of studio show between halftime breaks
  const HALFTIME_MIN = 150;   // halftime breaks run longer than normal timeouts
  function clusterHalves(list) {
    const halves = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].end - list[i].start < HALFTIME_MIN) continue;
      let j = i;
      while (j + 1 < list.length && list[j + 1].start - list[j].end < HALFTIME_GAP) j++;
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

  // ---- Break guard: never show a commercial when its exact timing is known ----
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
      breaks: exactBreaks(), halves: watchMode === "auto" ? exactHalves() : [],
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
        `<button type="button" class="segfix-skipbtn ht"><span class="lbl">Skip halftime</span>${SKIP_ICON}<kbd class="segfix-key">H</kbd></button>`;
      box.querySelector(".main").addEventListener("click", (e) => { e.stopPropagation(); e.currentTarget.dataset.mode === "half" ? skipHalftime() : skipBreak(); });
      box.querySelector(".ht").addEventListener("click", (e) => { e.stopPropagation(); skipHalftime(); });
    }
    // Inside the video area (so it's part of fullscreen and never over the page's menus).
    const host = document.getElementById("videoPlayer") || document.getElementById("primaryViewer");
    if (host && box.parentElement !== host) host.appendChild(box);
    else if (!host) keepInLayer(box);
    return box;
  }
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
    const guarded = !!brk && exactBreaks().some((x) => now >= x.start - 0.6 && (x.end == null || now < x.end));
    box.classList.toggle("show", (!!brk && !guarded) || !!ht || adVideos().length > 0);
    box.classList.remove("halftime");
    const mainBtn = box.querySelector(".main");
    const word = all.exact ? "Skip commercial" : "Skip to game";
    const span = ht || brk;
    mainBtn.querySelector(".lbl").textContent = ht ? `Skip ${halfName()}` : word;
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
    const dead = hockey ? /stoppage|period (start|end)|game end/i : NBA_DEAD;
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
    toast(m === "auto" ? "Auto-skip on" : "Normal mode");
  }

  // Auto-skip mode: the break guard also skips exact halftimes (see breakGuard).
  // Play-by-play estimates never skip on their own.


  // ---- Watch-mode picker: icon + name + drop-down (control bar & start chooser) ----
  const MODES = [
    { id: "normal", name: "Normal", desc: "Commercials skip themselves when timing is exact",
      icon: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>' },
    { id: "auto", name: "Auto-skip", desc: "Also skips halftime when timing is exact",
      icon: '<svg viewBox="0 0 24 24"><path d="M4 6.2v11.6a1 1 0 0 0 1.55.83L13 13.2v4.6a1 1 0 0 0 1.55.83l7.2-5.8a1 1 0 0 0 0-1.66l-7.2-5.8A1 1 0 0 0 13 6.2v4.6L5.55 5.37A1 1 0 0 0 4 6.2z"/></svg>' },
  ];
  const MODE_NEUTRAL_ICON = '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="16" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const CHEVRON = '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function modeInfo(id) { return MODES.find((m) => m.id === id) || MODES[0]; }
  function buildModePicker(extraClass) {
    const wrap = document.createElement("div");
    wrap.className = "segfix-mode " + (extraClass || "");
    wrap.innerHTML =
      '<button type="button" class="mode-trigger" title="Watch mode"><span class="mi"></span><span class="ml"></span><span class="mc">' + CHEVRON + "</span></button>" +
      '<div class="mode-menu" role="menu">' +
        '<div class="mode-head">Watch mode</div>' +
        MODES.filter((m) => !(extraClass === "in-chooser" && m.id === "normal"))
          .map((m) => `<button type="button" class="mode-opt" data-mode="${m.id}"><span class="oi">${m.icon}</span><span class="mt"><span class="t">${m.name}</span><span class="s">${m.desc}</span></span><span class="ck">✓</span></button>`).join("") +
      "</div>";
    wrap.querySelector(".mode-trigger").addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); wrap.classList.toggle("open"); });
    wrap.querySelectorAll(".mode-opt").forEach((o) => o.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.remove("open");
      const inChooser = !!wrap.closest("#segfix-chooser");
      if (inChooser) {                       // in the start chooser: just remember the choice
        // No "Normal" here: picking the active mode again turns it off.
        watchMode = o.dataset.mode === watchMode ? "normal" : o.dataset.mode;
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
      const neutral = watchMode === "normal" && w.classList.contains("in-chooser");
      w.querySelector(".mi").innerHTML = neutral ? MODE_NEUTRAL_ICON : m.icon;
      w.querySelector(".ml").textContent = neutral ? "Watch mode" : m.name;
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
          opt("tip", '<svg viewBox="0 0 24 24"><path d="M5 4h14v2.5H5zM6.2 20h11.6a1 1 0 0 0 .83-1.55L12.83 9.7a1 1 0 0 0-1.66 0l-5.8 8.75A1 1 0 0 0 6.2 20z"/></svg>', (pbp.hockey ? "At puck drop" : "At tip-off"), "Starts moments before the opening tip", "Enter", true) +
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
  function hqTarget(p) {
    let list = [];
    try { list = p.getAvailableVideoQualities() || []; } catch (e) {}
    const ok = list.filter(q => q && q.id != null && (q.height || 0) <= MAX_H);
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


  // =========================================================================
  //  PHONE REMOTE (touch screens only): when the game is AirPlayed to a TV the
  //  phone becomes the remote. Big buttons, skip, start/live, keeps the screen
  //  awake so skipping keeps working.
  // =========================================================================
  const isTouch = () => matchMedia("(hover: none) and (pointer: coarse)").matches;
  const RICON = {
    back: '<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/><text x="12" y="16.2" text-anchor="middle" font-size="6.5" font-weight="800" font-family="system-ui">10</text></svg>',
    fwd: '<svg viewBox="0 0 24 24"><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/><text x="12" y="16.2" text-anchor="middle" font-size="6.5" font-weight="800" font-family="system-ui">10</text></svg>',
    tv: '<svg viewBox="0 0 24 24"><path d="M3 4h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4l-1.4-1.6H20V6H4v9.4h3.4L6 17H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm9 9 6 7H6z"/></svg>',
    skip: '<svg viewBox="0 0 24 24"><path d="M5 6.2v11.6a1 1 0 0 0 1.55.83L15 12.83a1 1 0 0 0 0-1.66L6.55 5.37A1 1 0 0 0 5 6.2zM17 5h2v14h-2z"/></svg>',
  };
  let wakeLock = null;
  async function keepAwake() {
    if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    if (wakeLock && !wakeLock.released) return;
    try { wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
  }
  function mainVideo() { return document.querySelector("#primaryViewer video"); }
  function onTv() { const v = mainVideo(); return !!(v && v.webkitCurrentPlaybackTargetIsWireless); }
  function isPlaying() {
    const p = bmPlayer();
    try { if (p) return p.isPlaying(); } catch (e) {}
    const v = mainVideo();
    return !!(v && !v.paused);
  }
  function togglePlay() {
    const p = bmPlayer();
    try { if (p) { p.isPlaying() ? p.pause() : p.play(); return; } } catch (e) {}
    actions[" "]();
  }
  function getRemote() {
    let el = document.getElementById("segfix-remote");
    if (el) return el;
    el = document.createElement("div");
    el.id = "segfix-remote";
    el.innerHTML =
      `<div class="r-top"><span class="r-where"></span><button type="button" class="r-air" aria-label="AirPlay">${RICON.tv}<span>AirPlay</span></button></div>` +
      `<button type="button" class="r-skip">${RICON.skip}<span class="lbl">Skip commercial</span><span class="left"></span></button>` +
      `<div class="r-pad">` +
        `<button type="button" class="r-btn r-back" aria-label="Back 10 seconds">${RICON.back}</button>` +
        `<button type="button" class="r-btn r-play" aria-label="Play or pause"></button>` +
        `<button type="button" class="r-btn r-fwd" aria-label="Forward 10 seconds">${RICON.fwd}</button>` +
      `</div>` +
      `<div class="r-row"><button type="button" data-go="start">From start</button><button type="button" data-go="tip">Tip-off</button><button type="button" data-go="live" class="r-live"><span class="live-dot"></span>Live</button></div>`;
    const tap = (sel, fn) => el.querySelector(sel).addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); keepAwake(); fn(e); });
    // Five quick taps on the status line open the diagnostics panel (no keyboard on a phone).
    let taps = [];
    el.querySelector(".r-where").addEventListener("click", () => {
      taps = taps.filter((t) => Date.now() - t < 2000).concat(Date.now());
      if (taps.length >= 5) { taps = []; toggleDiag(); }
    });
    tap(".r-air", () => { const v = mainVideo(); try { v && v.webkitShowPlaybackTargetPicker(); } catch (e) {} });
    tap(".r-skip", () => (el.querySelector(".r-skip").dataset.mode === "half" ? skipHalftime() : skipBreak()));
    tap(".r-back", () => clickFirst('[aria-label="Rewind 10 Seconds"]'));
    tap(".r-fwd", () => clickFirst('[aria-label="Forward 10 Seconds"]'));
    tap(".r-play", () => togglePlay());
    for (const b of el.querySelectorAll("[data-go]")) b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation(); keepAwake();
      const go = b.dataset.go;
      go === "start" ? goFromStart() : go === "tip" ? goTipOff() : goLive();
    });
    document.body.appendChild(el);
    return el;
  }
  setInterval(() => {
    const show = isTouch() && WATCH_RE.test(location.pathname) && !!document.getElementById("primaryViewer");
    root.classList.toggle("segfix-phone", show);
    const old = document.getElementById("segfix-remote");
    if (!show) { if (old) old.remove(); return; }
    const el = getRemote();
    keepAwake();
    const tv = onTv();
    el.classList.toggle("on-tv", tv);
    el.querySelector(".r-where").innerHTML = tv ? '<i class="dot"></i>Playing on TV' : "Playing on this phone";
    el.querySelector(".r-play").innerHTML = isPlaying() ? ICONS.pause : ICONS.play;
    // Mirror the Skip button's state.
    const box = document.getElementById("segfix-skipbox");
    const main = box && box.querySelector(".main");
    const sk = el.querySelector(".r-skip");
    const showSkip = !!(box && box.classList.contains("show"));
    sk.classList.toggle("show", showSkip);
    if (main) {
      sk.querySelector(".lbl").textContent = main.querySelector(".lbl").textContent;
      sk.querySelector(".left").textContent = main.querySelector(".left").textContent;
      sk.dataset.mode = main.dataset.mode || "ad";
      sk.style.setProperty("--done", main.style.getPropertyValue("--done") || "0%");
    }
    el.querySelector(".r-live").classList.toggle("hide", !isLiveNow());
  }, 500);
  onDoc("visibilitychange", () => { if (document.visibilityState === "visible" && root.classList.contains("segfix-phone")) keepAwake(); });

  // ---- Run on every page change -------------------------------------------
  let scheduled = false;
  const onDomChange = () => {
    if (scheduled) return;
    scheduled = true;
    // A plain timer (not requestAnimationFrame) so it also runs in background tabs.
    setTimeout(() => {
      scheduled = false;
      if (!alive()) return;
      for (const fn of [installGuard, decorateCards, decorateWatchPage, runPendingStart, decorateRecords, dismissStillWatching]) {
        try { fn(); } catch (e) {}  // one failing step never blocks the others
      }
    }, 60);
  };
  new MutationObserver(() => { if (alive()) onDomChange(); }).observe(document.documentElement, { childList: true, subtree: true });
  onDomChange();

})();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
