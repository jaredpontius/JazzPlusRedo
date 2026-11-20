# 🎷 JazzPlusRedo

A cleaner, smoother [SEG+](https://www.segplus.com) player for Jazz and Mammoth games. Chrome and Firefox.

> Unofficial fan project. Not affiliated with SEG, Kiswe, the Utah Jazz, the Utah Mammoth, the NBA, the NHL, or ESPN. You still need your own SEG+ subscription.

## What it does

- **Start where you want:** from the beginning, at tip-off or puck drop, or live.
- **Skip breaks:** press **Skip** (or **Enter**) when a commercial starts, or turn on **Auto-skip**. **H** skips halftime or the intermission.
- **Better player:** fullscreen that stays put, a real scoreboard, never starts muted, no "Are you still watching?"
- **No clutter:** chat, pop-ups and banners are gone. Want chat during a live game? Click the chat button.
- **One ⚙ menu:** quality, speed and audio in one place. Your quality pick sticks until you change it.
- **Radio call:** switch to the radio broadcast, lined up with the picture (adjust with **[** and **]**).
- **Jazz only:** hide G League games from the Jazz replays row.

**Keys:** Space play/pause · ←/→ 10s · ↓ last play · S skip · H halftime · G live · M mute · F fullscreen · C chat · A TV/radio

## Install

### Chrome

1. Download **[JazzPlusRedo-Chrome.zip](../../releases/latest/download/JazzPlusRedo-Chrome.zip)** and unzip it. Keep the folder somewhere it won't be deleted.
2. Go to **`chrome://extensions`** and turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose the **JazzPlusRedo** folder.

**Update:** download the new zip, replace the folder, then click **↻** on JazzPlusRedo in `chrome://extensions`.

### Firefox (Mac)

1. Open **Terminal**, paste this, and press Enter:

   ```bash
   curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh
   ```

2. Quit Firefox (**⌘Q**) and open it again.

**Update:** run the same line again.
If macOS says it blocked changes to Firefox, turn on **Terminal** in **System Settings → Privacy & Security → App Management** and run it again.

## Remove

**Chrome:** go to `chrome://extensions` and click **Remove** on JazzPlusRedo.

**Firefox:** paste this into Terminal, then quit (**⌘Q**) and reopen Firefox:

```bash
curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh -s -- --remove
```

## Privacy

Runs only on segplus.com, in your browser. Besides SEG+, it only loads ESPN's public sports data and SEG+'s own replay preview pictures. It collects nothing.

## Developers

`python3 build.py` builds `dist/chrome`, `dist/firefox` and the zips. Source is in `extension/`.

MIT license.
