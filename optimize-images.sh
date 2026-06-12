#!/usr/bin/env bash
# Optimize portfolio images: resize down to 1200px wide and re-encode.
# Uses `sips` (preinstalled on macOS) and optionally `cwebp` if available.
# Originals are backed up to ./images-backup/ so you can revert with git anyway.
#
# Usage:   bash optimize-images.sh
# Result:  PNGs in-place, resized to ≤1200px wide (typically 10x smaller).

set -euo pipefail

MAX_W=1200
JPEG_QUALITY=82
BACKUP_DIR="images-backup"

mkdir -p "$BACKUP_DIR"

# Largest images to compress; add more if you like.
targets=(
  "Collabhub.png"
  "Urbanaid.png"
  "Akash_Oracle.png"
  "RDD.png"
  "CNNs.png"
  "Paraclone.png"
  "Quote.png"
  "Teeter.png"
  "bg.jpg"
)

for f in "${targets[@]}"; do
  if [ ! -f "$f" ]; then
    echo "skip: $f (not found)"
    continue
  fi

  echo "→ $f"
  cp -n "$f" "$BACKUP_DIR/$f" || true

  # Resize: only shrinks (sips won't upscale)
  sips --resampleWidth "$MAX_W" "$f" --out "$f" >/dev/null

  case "$f" in
    *.jpg|*.jpeg)
      sips -s formatOptions "$JPEG_QUALITY" "$f" --out "$f" >/dev/null
      ;;
  esac
done

# Optional: produce .webp alongside if cwebp is installed
if command -v cwebp >/dev/null 2>&1; then
  for f in "${targets[@]}"; do
    [ -f "$f" ] || continue
    out="${f%.*}.webp"
    cwebp -q 82 -m 6 "$f" -o "$out" >/dev/null 2>&1 || true
    echo "  +webp: $out"
  done
else
  echo
  echo "Note: install \`cwebp\` (brew install webp) to also generate .webp files,"
  echo "      then wire them in HTML with <picture> + <source type=\"image/webp\">."
fi

echo
echo "Done. Originals saved in $BACKUP_DIR/."
echo "Compare sizes with:  du -sh ./*.png $BACKUP_DIR/*.png"
