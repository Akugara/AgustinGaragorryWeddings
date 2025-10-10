#!/bin/bash

# Image Optimization Script
# This script will:
# 1. Create a backup of original images
# 2. Resize images appropriately
# 3. Convert to WebP format
# 4. Keep original JPGs as fallback

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Image Optimization Script ===${NC}"
echo ""

# Check if required tools are installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp is not installed${NC}"
    echo "Install with: brew install webp"
    exit 1
fi

if ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Install with: brew install imagemagick"
    exit 1
fi

# Create backup directory
BACKUP_DIR="img_backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}Creating backup in: $BACKUP_DIR${NC}"
cp -r img "$BACKUP_DIR"
echo -e "${GREEN}✓ Backup created${NC}"
echo ""

# Function to optimize and convert images
optimize_image() {
    local file="$1"
    local max_width="$2"
    local quality="$3"

    local filename=$(basename "$file")
    local dir=$(dirname "$file")
    local name="${filename%.*}"
    local webp_file="${dir}/${name}.webp"

    # Get original size
    local original_size=$(du -h "$file" | cut -f1)

    # Resize JPG if needed (in-place optimization)
    convert "$file" -resize "${max_width}x>" -quality $quality "$file"

    # Create WebP version
    cwebp -q $quality -resize $max_width 0 "$file" -o "$webp_file" 2>/dev/null

    # Get new sizes
    local new_jpg_size=$(du -h "$file" | cut -f1)
    local webp_size=$(du -h "$webp_file" | cut -f1)

    echo "  $filename: $original_size → JPG: $new_jpg_size, WebP: $webp_size"
}

# Process main carousel images (hero images)
echo -e "${YELLOW}Optimizing main carousel images...${NC}"
if [ -d "img/maincarousel" ]; then
    for img in img/maincarousel/*.jpg; do
        [ -f "$img" ] && optimize_image "$img" 1920 85
    done
fi
echo ""

# Process about me carousel images
echo -e "${YELLOW}Optimizing about me carousel images...${NC}"
if [ -d "img/aboutmecarousel" ]; then
    for img in img/aboutmecarousel/*.jpg; do
        [ -f "$img" ] && optimize_image "$img" 1920 85
    done
fi
echo ""

# Process about me images
echo -e "${YELLOW}Optimizing about me images...${NC}"
if [ -d "img/aboutme" ]; then
    for img in img/aboutme/*.jpg; do
        [ -f "$img" ] && optimize_image "$img" 1920 85
    done
fi
echo ""

# Process gallery images
echo -e "${YELLOW}Optimizing gallery images...${NC}"
if [ -d "img/galeria" ]; then
    for img in img/galeria/*/*.jpg; do
        [ -f "$img" ] && optimize_image "$img" 1600 82
    done
fi
echo ""

# Process Instagram images (smaller)
echo -e "${YELLOW}Optimizing Instagram images...${NC}"
if [ -d "img/instagram" ]; then
    for img in img/instagram/*.jpg; do
        [ -f "$img" ] && optimize_image "$img" 800 80
    done
fi
echo ""

# Calculate total savings
echo -e "${GREEN}=== Optimization Complete ===${NC}"
echo ""
original_size=$(du -sh "$BACKUP_DIR" | cut -f1)
new_size=$(du -sh img | cut -f1)
echo -e "Original size: ${YELLOW}$original_size${NC}"
echo -e "New size: ${GREEN}$new_size${NC}"
echo ""
echo -e "${GREEN}✓ All images optimized!${NC}"
echo -e "${YELLOW}⚠ Original images backed up to: $BACKUP_DIR${NC}"
echo ""
echo "Next steps:"
echo "1. Test your website to ensure images look good"
echo "2. If satisfied, you can delete the backup: rm -rf $BACKUP_DIR"
echo "3. Update HTML to use WebP with JPG fallback (I can help with this)"
