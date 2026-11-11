#!/usr/bin/env python3
"""Builds the Chrome and Firefox packages into dist/.

    python3 build.py

Outputs:
  dist/chrome/                      unpacked Chrome extension (Load unpacked)
  dist/firefox/                     unpacked Firefox add-on
  dist/Better-Player-for-SEG-Chrome.zip
  dist/Better-Player-for-SEG-Firefox.zip
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

NAME = "Better Player for SEG+"
DESCRIPTION = (
    "Unofficial. A cleaner, smoother SEG+ / Jazz+ player: no chat or clutter, "
    "skip commercials and halftime, team records, From start / Live."
)
MATCHES = ["https://segplus.com/*", "https://www.segplus.com/*"]


def make_important(css: str) -> str:
    """Make every declaration !important so the site's own styles can't override it."""
    def fix_block(m):
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
            "id": "better-player-for-segplus@unofficial",
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
    zip_dir(chrome, DIST / "Better-Player-for-SEG-Chrome.zip", inner="Better-Player-for-SEG")
    # Firefox zip has the add-on files at the top level (the installer unzips it).
    zip_dir(firefox, DIST / "Better-Player-for-SEG-Firefox.zip")
    print(f"Built v{VERSION}: dist/chrome, dist/firefox and both zips")


if __name__ == "__main__":
    main()
