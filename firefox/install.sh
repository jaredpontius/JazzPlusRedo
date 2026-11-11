#!/bin/sh
# JazzPlusRedo (unofficial) - Firefox installer for macOS.
#
# Install or update:
#   curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh
# Uninstall:
#   curl -fsSL https://raw.githubusercontent.com/jaredpontius/JazzPlusRedo/main/firefox/install.sh | sh -s -- --remove
#
# What it does:
#   1. Downloads the latest add-on into ~/Library/Application Support/JazzPlusRedo/addon
#   2. Adds two small startup files to Firefox.app so Firefox loads that add-on every time it opens.
#      (Firefox only allows permanent add-ons that Mozilla has signed; this loader is the
#       no-account alternative. It only loads the folder above.)
set -e

REPO="jaredpontius/JazzPlusRedo"
APP="/Applications/Firefox.app/Contents/Resources"
DEST="$HOME/Library/Application Support/JazzPlusRedo"
RAW="https://raw.githubusercontent.com/$REPO/main/firefox"
ZIP_URL="https://github.com/$REPO/releases/latest/download/JazzPlusRedo-Firefox.zip"

if [ "$1" = "--remove" ]; then
  rm -f "$APP/mozilla.cfg" "$APP/defaults/pref/autoconfig.js"
  rm -rf "$DEST"
  echo "Removed. Quit Firefox (Cmd+Q) and reopen it."
  exit 0
fi

if [ ! -d "$APP" ]; then
  echo "Firefox wasn't found in /Applications. Install Firefox first, then run this again."
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Downloading the latest version..."
curl -fsSL "$ZIP_URL" -o "$TMP/addon.zip"
curl -fsSL "$RAW/mozilla.cfg" -o "$TMP/mozilla.cfg"
curl -fsSL "$RAW/autoconfig.js" -o "$TMP/autoconfig.js"

mkdir -p "$DEST"
rm -rf "$DEST/addon.new"
mkdir "$DEST/addon.new"
unzip -q "$TMP/addon.zip" -d "$DEST/addon.new"
rm -rf "$DEST/addon"
mv "$DEST/addon.new" "$DEST/addon"
# Touch the manifest so an already-running Firefox reloads the add-on.
touch "$DEST/addon/manifest.json"

if ! { mkdir -p "$APP/defaults/pref" && cp "$TMP/autoconfig.js" "$APP/defaults/pref/autoconfig.js" && cp "$TMP/mozilla.cfg" "$APP/mozilla.cfg"; } 2>/dev/null; then
  echo ""
  echo "macOS blocked changes to Firefox.app."
  echo "Open System Settings > Privacy & Security > App Management,"
  echo "turn on Terminal, then run this command again."
  exit 1
fi

echo ""
echo "Done! Quit Firefox completely (Cmd+Q) and reopen it."
echo "To update later, run the same command again."
