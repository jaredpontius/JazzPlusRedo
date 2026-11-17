# 🎷 JazzPlusRedo

### Watch the Jazz (and the Mammoth) without yelling at your screen.

You pay for SEG+. You deserve better than a tiny video that shrinks every time you
nudge the mouse, a chat full of spoilers, and the same mattress commercial for the
ninth time this quarter.

**JazzPlusRedo fixes all of that.** Install it once, open [SEG+](https://www.segplus.com)
like normal, and it's just... better. No settings. No account. No nonsense.

> 🙋 Unofficial fan project, made by a fan for fans. Not affiliated with SEG, Kiswe, the
> Utah Jazz, the Utah Mammoth, the NBA, the NHL, or ESPN. You still need your own SEG+
> subscription.

---

## ✨ What it does

- 🎬 **Pick how you start, every game.** A slick matchup card asks: from the beginning, at tip-off, or live.
- 🏀 **Tip-off means tip-off.** Lands ~3 seconds before the jump ball. No pregame.
- 🙈 **No spoilers while it loads.** The video stays covered until it's at the right spot.
- ⏭️ **Skips commercials.** A button pops up when a break starts. Press it (or **Enter**). Poof, back to the game.
- 🦓 **Skips ref reviews** too, often. Bye, four-minute monitor huddles.
- 🥱 **Skips halftime** with **H**. Intermissions too, hockey fans.
- ⬇️ **"Wait, what happened?"** Press **↓** to rewatch the last play.
- 📺 **Fullscreen that stays fullscreen.** No more shrinking video.
- 🏀 **A real scoreboard** with logos and records. Very purple.
- 🔊 **Never starts muted.**
- 🧹 **Zero clutter.** No spoiler chat, pop-ups, sponsor banners, or random video carousels.
- 😴 **Never asks "Are you still watching?"** Yes. Yes we are.
- 📱 **AirPlay remote.** On iPhone/iPad, a big-button remote with Skip, so watching on the Apple TV is easy.

**Shortcuts:** Space play/pause · ←/→ 10s · **↓** last play · **Enter** / **S** skip break · **H** halftime · **G** live · **M** mute · **F** fullscreen

---

## 🚀 Install it (takes about 2 minutes)

### 🟡 Chrome (Mac or Windows)

1. **Download** 👉 **[JazzPlusRedo-Chrome.zip](../../releases/latest/download/JazzPlusRedo-Chrome.zip)**
   and double-click it to unzip.
   Move the **JazzPlusRedo** folder somewhere safe (like Documents). Chrome needs it to stay put.
2. In Chrome, type **`chrome://extensions`** in the address bar and press Enter.
3. Flip on **Developer mode** (switch in the top-right corner).
4. Click **Load unpacked** and pick the **JazzPlusRedo** folder.
5. Open SEG+ and enjoy. 🎉

*Updating later?* Download the new zip, swap the folder's contents, then click the little ↻ on
JazzPlusRedo in `chrome://extensions`.

### 🦊 Firefox (Mac)

1. Open **Terminal** (press **⌘ Space**, type **Terminal**, hit Enter).
2. Copy this line, paste it in, and press Enter:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh
   ```

3. Quit Firefox all the way (**⌘Q**) and open it again. Done! It turns on by itself every time. 🎉

**Stuff that might come up:**
- *"macOS blocked changes to Firefox.app"*? Totally normal. Open **System Settings → Privacy &
  Security → App Management**, switch on **Terminal**, and run the line again.
- *Updating later?* Just run the same line again. No restart needed; refresh SEG+.
- *Want it gone?* Run this and it cleans up after itself:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh -s -- --remove
  ```

<details>
<summary>🤓 Why does Firefox need a Terminal command?</summary>

Firefox only keeps add-ons around permanently if Mozilla has signed them. Instead of making you
create a developer account, the installer uses Firefox's built-in startup-settings feature
("autoconfig") to load JazzPlusRedo every time Firefox opens. It only loads this one add-on, from
`~/Library/Application Support/JazzPlusRedo/addon`. The uninstall line removes everything. If a big
Firefox update ever wipes it, just run the install line again.
</details>

### ✨ New: iPhone, iPad, and one-click installs

Same JazzPlusRedo as a single file (a *userscript*). Use this for **iPhone / iPad**, **Mac Safari**, or if you'd rather skip the Chrome folder / Terminal steps above. It **updates itself**.

👉 **[Install link](https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js)** (open it *after* setting up the free helper app below)

#### 📱 iPhone / iPad

Perfect for **AirPlaying games to your Apple TV**: your phone turns into a big-button remote
with **Skip commercial**, ⟲10 / ⟳10, From start, Tip-off and Live, and it keeps the screen awake
so skipping keeps working.

1. Get the free **[Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** app from
   the App Store. Open it once and tap **Set Userscripts Directory** (any folder is fine).
2. In **Safari**, tap the **page menu** (the icon at the left of the address bar) →
   **Manage Extensions** → turn on **Userscripts**.
3. Still in Safari, open the **[install link](https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js)**.
   Tap the page menu → **Userscripts** → **Install**.
4. Go to **[segplus.com](https://www.segplus.com)**, tap the page menu → **Userscripts**, and choose
   **Always Allow on This Website**.
5. Start a game, tap **AirPlay** on the remote, pick your TV. 🎉

> Safari only. Chrome on iPhone can't run add-ons (Apple's rule, not ours).

#### 💻 Mac (Safari)

1. Get **[Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** from the Mac App Store
   and open it once.
2. Safari → **Settings → Extensions** → tick **Userscripts**.
3. Open the **[install link](https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js)**,
   click the Userscripts icon in the toolbar → **Install**.
4. On segplus.com, click the Userscripts icon and allow it for the site.

#### 🧩 Chrome, Edge, Firefox, Brave (userscript way)

1. Add **[Tampermonkey](https://www.tampermonkey.net/)** to your browser
   (Firefox fans: **[Violentmonkey](https://violentmonkey.github.io/)** works great too).
2. **Chrome / Edge / Brave only:** right-click the Tampermonkey icon → **Manage extension** →
   turn on **Allow User Scripts**. (Newer Chrome requires this switch.)
3. Click the **[install link](https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js)**
   and press **Install**.
4. Open SEG+ and enjoy. 🎉

**Updating:** nothing to do. The helper app checks for new versions on its own.
**Removing:** delete JazzPlusRedo from the helper's list of scripts.

---

## 🧠 How does it know when a commercial is on?

Fair question! Two tricks:

1. **Live games:** TV broadcasts quietly mark every commercial with a hidden "ad starts here" and
   "game's back" signal. JazzPlusRedo reads those, so skips are **exact**. It also remembers them,
   so if you watch the replay later on the same computer, those are exact too.
2. **Replays:** those hidden signals get stripped out, so it uses ESPN's play-by-play instead. Every
   play is timestamped, so a long quiet gap after a timeout = commercial (or a ref review 👀), and the
   next play = game's back. These skips are **usually within a few seconds**.

The button says **Skip commercial** when it's exact and **Skip to game** when it's working from the
play-by-play. Salt Lake City Stars (G League) games only get skipping while live, since there's no
public play-by-play for them.

---

## 🔒 Privacy

- Only runs on segplus.com, only in your browser.
- The only other thing it talks to is ESPN's public sports data (logos, records, play-by-play).
- It doesn't collect anything, track anything, or send your info anywhere. Ever.

## 🛠️ For the nerds

```bash
python3 build.py   # builds JazzPlusRedo.user.js, dist/chrome, dist/firefox and both zips
```

Code lives in `extension/` (`content.js`, `content.css`). Press **Shift + D** on a game (or tap the remote's
status line 5 times on a phone) to see the commercial detector think out loud.

## 📄 License

MIT. Go wild.
