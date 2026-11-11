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

**⏭️ Skips commercials. With one button.**
When an ad break starts, a big *Skip commercial* button pops up. Press it (or just hit
**Enter** or **→**) and *poof*, you're back at the game. One smooth jump, no
fast-forward guessing.

**🦓 Skips ref reviews, too (often).**
You know when the refs huddle around a monitor for four minutes to decide whose foot
touched the line? It often catches those long coach's-challenge and replay-review
stoppages and lets you skip right past them. You're welcome.

**🥱 Skips halftime.**
Halftime show? Hit **H** and jump straight to the second-half tip. (Hockey fans: it skips
intermissions too.)

**⏮️ "From start" actually means the start.**
It takes you to **tip-off**, not 30 minutes of pregame. And a **Live** button shows up
whenever you're behind a live game and want to catch up.

**📺 Fullscreen that stays fullscreen.**
The video doesn't shrink every time you move your mouse anymore. The cursor hides itself.
Controls look clean.

**🏀 A real scoreboard at the top.**
Both team logos plus current records, styled like a TV broadcast. Very fancy. Very purple.

**🧹 All the clutter, gone.**
No live chat (aka the spoiler machine). No fan-react videos. No feedback pop-ups. No
sponsor banners. No language pill. No CC button.

**😴 Never asks "Are you still watching?"**
Yes. Yes we are. It answers for you.

**⌨️ Keyboard shortcuts for the couch:**
Space = play/pause · ← / → = 10 seconds · **S** = skip commercial · **H** = skip halftime ·
**G** = go live · **M** = mute · **F** = fullscreen

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
python3 build.py   # builds dist/chrome, dist/firefox and both zips
```

Code lives in `extension/` (`content.js`, `content.css`). Press **Shift + D** on a game to see the
commercial detector think out loud.

## 📄 License

MIT. Go wild.
