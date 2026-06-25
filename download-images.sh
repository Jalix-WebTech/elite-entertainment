#!/bin/bash
# ============================================================
# VERTEX CONSULT — Image Downloader
# Run this ONCE from the project root:
#   bash download-images.sh
# Requires: curl (pre-installed on Mac/Linux) or WSL on Windows
# ============================================================

set -e
mkdir -p assets/images

echo "========================================="
echo " Vertex Consult — Downloading images"
echo "========================================="
echo ""

# Map of local filename => Pexels URL
# Using Pexels CDN direct links (no authentication needed)
declare -A IMAGES=(
  # Hero (landscape 2000x1200)
  ["assets/images/hero.jpg"]="https://images.pexels.com/photos/35142390/pexels-photo-35142390.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000"

  # About (portrait 800x1000)
  ["assets/images/about.jpg"]="https://images.pexels.com/photos/18273251/pexels-photo-18273251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800"

  # CEO portrait (portrait 900x1200)
  ["assets/images/ceo.jpg"]="https://images.pexels.com/photos/29995605/pexels-photo-29995605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"

  # Portfolio — 16 projects (mixed orientations for masonry effect)
  ["assets/images/project-1.jpg"]="https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-2.jpg"]="https://images.pexels.com/photos/33719016/pexels-photo-33719016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-3.jpg"]="https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-4.jpg"]="https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-5.jpg"]="https://images.pexels.com/photos/18506889/pexels-photo-18506889.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-6.jpg"]="https://images.pexels.com/photos/7546611/pexels-photo-7546611.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-7.jpg"]="https://images.pexels.com/photos/12836765/pexels-photo-12836765.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-8.jpg"]="https://images.pexels.com/photos/33719770/pexels-photo-33719770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-9.jpg"]="https://images.pexels.com/photos/8092431/pexels-photo-8092431.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-10.jpg"]="https://images.pexels.com/photos/3709404/pexels-photo-3709404.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-11.jpg"]="https://images.pexels.com/photos/36713682/pexels-photo-36713682.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-12.jpg"]="https://images.pexels.com/photos/7722168/pexels-photo-7722168.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-13.jpg"]="https://images.pexels.com/photos/8141957/pexels-photo-8141957.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-14.jpg"]="https://images.pexels.com/photos/16473129/pexels-photo-16473129.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
  ["assets/images/project-15.jpg"]="https://images.pexels.com/photos/14989324/pexels-photo-14989324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
  ["assets/images/project-16.jpg"]="https://images.pexels.com/photos/37149144/pexels-photo-37149144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
)

TOTAL=${#IMAGES[@]}
COUNT=0
FAIL=0

for DEST in "${!IMAGES[@]}"; do
  COUNT=$((COUNT + 1))
  URL="${IMAGES[$DEST]}"
  NAME=$(basename "$DEST")
  echo -ne "  [$COUNT/$TOTAL] Downloading $NAME ... "

  if curl -fsSL -o "$DEST" "$URL" --max-time 30 --retry 2; then
    SIZE=$(du -h "$DEST" | cut -f1)
    echo "OK ($SIZE)"
  else
    echo "FAILED"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "========================================="
if [ "$FAIL" -eq 0 ]; then
  echo " ✓ All $TOTAL images downloaded successfully."
else
  echo " ! $FAIL downloads failed out of $TOTAL. Re-run the script to retry."
fi
echo "========================================="
echo "You can now open index.html in your browser."
