# JazzPlusRedo (unofficial)

A cleaner, smoother way to watch **Utah Jazz** and **Utah Mammoth** games on [SEG+](https://www.segplus.com).
It adds features to the SEG+ website in your browser. You still sign in with your own SEG+ subscription.

> Unofficial fan project. Not affiliated with or endorsed by SEG, Kiswe, the Utah Jazz,
> the Utah Mammoth, the NBA, the NHL, or ESPN.

## What you get

- **Skip commercials with one press:** a *Skip commercial* button pops up during breaks
  (or press **Enter**, **→**, or **S**). One smooth jump straight back to the game.
- **Skip halftime / intermissions** (**H**): jump straight to the second-half tip or the next faceoff.
- **From start** jumps to tip-off / puck drop. **Live** appears whenever you're behind a live game.
- **Score bug:** both teams' logos and current season records at the top of the player.
- **Cleaner page:** no live chat, fan reacts, feedback tab, sponsor banners, language pill, or CC button.
- **Better fullscreen:** the video never shrinks when you move the mouse; the cursor hides.
- **No "Are you still watching?"** interruptions.
- **Keyboard:** Space play/pause · ← / → 10 seconds · M mute · F fullscreen · G live · S skip · H halftime.

---

## Install for Chrome (Mac or Windows)

1. Download **[JazzPlusRedo-Chrome.zip](../../releases/latest/download/JazzPlusRedo-Chrome.zip)** and unzip it.
   Keep the unzipped **JazzPlusRedo** folder somewhere it won't be deleted (like Documents).
2. In Chrome, go to **`chrome://extensions`**
3. Turn on **Developer mode** (top-right switch).
4. Click **Load unpacked** and choose the **JazzPlusRedo** folder.
5. Open or refresh segplus.com. Done!

**To update:** download the new zip, replace the folder's contents, then click the ↻ reload icon on the extension in `chrome://extensions`.

## Install for Firefox (Mac)

Open **Terminal** (press ⌘ Space, type *Terminal*, press Return), paste this line, and press Return:

```bash
curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh
```

Then quit Firefox completely (**⌘Q**) and reopen it. That's it. It loads automatically every time.

- If you see *"macOS blocked changes to Firefox.app"*: open **System Settings → Privacy & Security → App Management**, turn on **Terminal**, and run the command again.
- **To update:** run the same command again (no restart needed, just refresh the SEG+ tab).
- **To uninstall:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh -s -- --remove
  ```

<details>
<summary>Why does Firefox need an installer?</summary>

Firefox only keeps add-ons permanently if Mozilla has signed them. Instead, the installer uses
Firefox's built-in startup-settings feature ("autoconfig") to load this add-on each time Firefox
opens. It only loads this one add-on from
`~/Library/Application Support/JazzPlusRedo/addon`. The uninstall command removes everything.
If a big Firefox update removes the startup files, just run the install command again.
</details>

---

## How commercial skipping works

Everything runs on one clock: the video's own timestamps.

| What you're watching | Where break timing comes from | Accuracy |
|---|---|---|
| A game that's live (even if you started late) | the broadcast's own "commercial starts / game is back" markers in the stream | exact |
| A replay of a game this browser opened while it was live | those markers, saved during the live game | exact |
| Any other Jazz / Mammoth replay | public ESPN play-by-play timestamps | usually within a few seconds |

The button says **Skip commercial** when timing is exact and **Skip to game** when it's estimated
from play-by-play. Salt Lake City Stars (G League) games only get skipping while live, since there's
no public play-by-play for them.

## Privacy

- Runs only on segplus.com, inside your own browser.
- The only outside requests go to ESPN's public sports data (team records, logos, play-by-play).
- Nothing is collected or sent anywhere else. Saved commercial times stay in your browser's local storage.

## For developers

```bash
python3 build.py   # builds dist/chrome, dist/firefox and the two zips
```

Source is in `extension/` (`content.js`, `content.css`). Press **Shift + D** on a game page to see
the break detector's live diagnostics.

## License

MIT
