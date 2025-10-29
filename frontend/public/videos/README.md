# Video Background Setup Guide

## Location
Place your video files in: `/public/videos/`
Place your placeholder image in: `/public/images/hero-placeholder.jpg`

## Recommended Video Specifications
- **Format**: MP4 (H.264 codec recommended for best browser compatibility)
- **Resolution**: 1920x1080 (Full HD) or higher
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: 50-300MB is fine! (Modern browsers handle large videos well)
- **Orientation**: Landscape (16:9 aspect ratio preferred)

## Multiple Videos Support
You can have multiple videos playing sequentially or randomly:
- **Sequential**: Video 1 → Video 2 → Video 1 (loops)
- **Random**: Randomly pick one video each loop
- **Memory cost**: Same as one video (only one loaded at a time)

## Video Options
1. **Limuru Tea Estates** - `limuru-tea-estates.mp4`
   - Showcases Kenya's natural beauty
   - Professional agricultural landscape
   - Subtle, calming effect

2. **Nairobi Skyline** - `nairobi-skyline.mp4`
   - Urban, professional setting
   - Includes KICC building
   - Shows modern development

3. **Maasai Mara** - `maasai-mara.mp4`
   - Iconic Kenyan landscape
   - Wide, scenic views
   - Natural beauty

## How to Add Your Videos

### Single Video:
1. **Place video file** in `/public/videos/` folder
2. **Open** `/src/app/page.tsx`
3. **Find the video tag** (around line 267)
4. **Uncomment** one of the source tags:
   ```html
   <source src="/videos/your-video-name.mp4" type="video/mp4" />
   ```

### Multiple Videos (Sequential):
1. **Place both videos** in `/public/videos/` folder
2. **Uncomment both source tags**:
   ```html
   <source src="/videos/limuru-tea-estates.mp4" type="video/mp4" />
   <source src="/videos/nairobi-skyline.mp4" type="video/mp4" />
   ```
3. **Videos will play sequentially** (first one, then second, then repeat)

### Placeholder Image:
1. **Place image** in `/public/images/hero-placeholder.jpg`
2. **Image shows** while video loads or if video fails
3. **Recommended size**: 1920x1080 or larger

## Tips for Best Results
- **Test video first** - Ensure it loops smoothly
- **Adjust overlay opacity** - If text is hard to read, modify the overlay opacity in the code (line 290)
- **Optimize video** - Use tools like HandBrake to compress video while maintaining quality
- **Consider motion** - Subtle panning or slow movement works best for backgrounds

## Current Overlay Settings
- **Opacity**: 40-50% (adjustable)
- **Gradient**: Darker at top/bottom, lighter in middle
- **Text Shadow**: Added to all text for readability

## Fallback
If video doesn't load, the section will show a dark gradient background (gray-900 to gray-800).
