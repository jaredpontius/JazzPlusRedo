#!/usr/bin/env python3
"""Builds the Chrome and Firefox packages into dist/.

    python3 build.py

Outputs:
  JazzPlusRedo.user.js              userscript (iPhone/iPad/Mac Safari via the Userscripts app,
                                    Chrome/Firefox/Edge via Tampermonkey). Committed, so it can
                                    be installed and auto-updated straight from GitHub.
  dist/chrome/                      unpacked Chrome extension (Load unpacked)
  dist/firefox/                     unpacked Firefox add-on
  dist/JazzPlusRedo-Chrome.zip
  dist/JazzPlusRedo-Firefox.zip
"""
import json
import pathlib
import re
import shutil
import zipfile

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "extension"
DIST = HERE / "dist"
VERSION = (HERE / "VERSION").read_text().strip()

NAME = "JazzPlusRedo"
DESCRIPTION = (
    "Unofficial. A cleaner, smoother SEG+ / Jazz+ player: no chat or clutter, "
    "skip commercials and halftime, team records, From start / Live."
)
MATCHES = ["https://segplus.com/*", "https://www.segplus.com/*"]


KEYFRAME_SEL = re.compile(r"^\s*(from|to|[\d.]+%)(\s*,\s*(from|to|[\d.]+%))*\s*$")


def make_important(css: str) -> str:
    """Make every declaration !important so the site's own styles can't override it.
    Animation keyframes and @property rules can't take !important, so they're left alone."""
    def fix_block(m):
        selector = re.split(r"[{};]", css[:m.start()])[-1]
        selector = re.sub(r"/\*.*?\*/", "", selector, flags=re.S).strip()
        if KEYFRAME_SEL.match(selector) or selector.startswith("@property"):
            return m.group(0)
        parts = m.group(2).split(";")
        out = []
        for p in parts:
            if ":" in p and "!important" not in p and p.strip():
                p = p.rstrip() + " !important"
            out.append(p)
        return m.group(1) + ";".join(out) + "}"
    return re.sub(r"(\{)([^{}]*)\}", fix_block, css)


def manifest(firefox: bool) -> dict:
    m = {
        "manifest_version": 3,
        "name": NAME,
        "version": VERSION,
        "description": DESCRIPTION,
        "host_permissions": MATCHES,
        "content_scripts": [
            {"matches": MATCHES, "css": ["style.css"], "run_at": "document_start"},
            {"matches": MATCHES, "js": ["extras.js"], "run_at": "document_idle", "world": "MAIN"},
        ],
    }
    if firefox:
        m["browser_specific_settings"] = {"gecko": {
            "id": "jazzplusredo@unofficial",
            "strict_min_version": "128.0",
            "data_collection_permissions": {"required": ["none"]},
        }}
    return m


def build(target: str) -> pathlib.Path:
    out = DIST / target
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    (out / "style.css").write_text(make_important((SRC / "content.css").read_text()))
    (out / "extras.js").write_text("window.__segfixQuiet = true;\n" + (SRC / "content.js").read_text())
    (out / "manifest.json").write_text(json.dumps(manifest(target == "firefox"), indent=2) + "\n")
    return out


RAW_USERSCRIPT = "https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/JazzPlusRedo.user.js"


def build_userscript() -> pathlib.Path:
    """One file that does everything the extension does. Styles go in at page
    start; the script runs in the page itself once the page has loaded (same
    timing as the extension)."""
    css = make_important((SRC / "content.css").read_text())
    js = (SRC / "content.js").read_text()
    header = "\n".join([
        "// ==UserScript==",
        f"// @name         {NAME}",
        "// @namespace    https://github.com/jaredpontius/JazzPlusRedo",
        f"// @version      {VERSION}",
        f"// @description  {DESCRIPTION}",
        "// @author       JazzPlusRedo",
        "// @match        https://segplus.com/*",
        "// @match        https://www.segplus.com/*",
        "// @run-at       document-start",
        "// @inject-into  page",
        "// @grant        none",
        "// @noframes",
        f"// @updateURL    {RAW_USERSCRIPT}",
        f"// @downloadURL  {RAW_USERSCRIPT}",
        "// @homepageURL  https://github.com/jaredpontius/JazzPlusRedo",
        "// @supportURL   https://github.com/jaredpontius/JazzPlusRedo/issues",
        "// @license      MIT",
        "// ==/UserScript==",
        "",
        "// Built by build.py from extension/content.css + extension/content.js. Edit those, not this.",
        "",
    ])
    body = (
        "(function () {\n"
        "  if (window.__jazzPlusRedoUserscript) return;\n"
        "  window.__jazzPlusRedoUserscript = true;\n"
        f"  const CSS = {json.dumps(css)};\n"
        "  const addStyle = () => {\n"
        "    const s = document.createElement('style');\n"
        "    s.id = 'jazzplusredo-style';\n"
        "    s.textContent = CSS;\n"
        "    (document.head || document.documentElement).appendChild(s);\n"
        "  };\n"
        "  addStyle();\n"
        "  // Some pages rebuild <head>; put the styles back if they vanish.\n"
        "  new MutationObserver(() => { if (!document.getElementById('jazzplusredo-style')) addStyle(); })\n"
        "    .observe(document.documentElement, { childList: true, subtree: true });\n"
        "  const run = () => {\n"
        "    window.__segfixQuiet = true;\n"
        + js.rstrip() +   # verbatim: indenting would change multi-line strings
        "\n  };\n"
        "  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });\n"
        "  else run();\n"
        "})();\n"
    )
    out = HERE / "JazzPlusRedo.user.js"
    out.write_text(header + body)
    return out


def zip_dir(folder: pathlib.Path, zip_path: pathlib.Path, inner: str = "") -> None:
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(folder.rglob("*")):
            if f.is_file():
                z.write(f, (inner + "/" if inner else "") + str(f.relative_to(folder)))


def main():
    DIST.mkdir(exist_ok=True)
    chrome = build("chrome")
    firefox = build("firefox")
    # Chrome zip unzips to a folder you pick with "Load unpacked".
    zip_dir(chrome, DIST / "JazzPlusRedo-Chrome.zip", inner="JazzPlusRedo")
    # Firefox zip has the add-on files at the top level (the installer unzips it).
    zip_dir(firefox, DIST / "JazzPlusRedo-Firefox.zip")
    build_userscript()
    print(f"Built v{VERSION}: JazzPlusRedo.user.js, dist/chrome, dist/firefox and both zips")


if __name__ == "__main__":
    main()
