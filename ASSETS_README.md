# Flappy Bird Mini App - Asset Requirements

This document outlines the required assets for the Flappy Bird Mini App to be featured on Base.

## Required Assets

### 1. App Icon (`/public/icon.png`)
- **Size**: 1024×1024 px
- **Format**: PNG with no transparency
- **Content**: Flappy bird character on solid background
- **Requirements**: Must be readable at 64px size
- **Status**: ✅ Exists (needs update with final design)

### 2. Cover Photo (`/public/cover.png`)
- **Size**: 1200×630 px
- **Format**: PNG or JPG
- **Content**: High-quality gameplay screenshot with score overlay
- **Requirements**: No Base logo or team photos
- **Status**: ⚠️ Placeholder (needs actual screenshot)

### 3. Screenshots (`/public/screenshots/`)
- **Size**: 1284×2778 px (iPhone 14 Pro Max resolution)
- **Format**: PNG
- **Required Screenshots**:
  1. `1.png` - Gameplay with bird mid-flight
  2. `2.png` - Leaderboard with top scores
  3. `3.png` - Profile with statistics
- **Status**: ⚠️ Missing (needs to be created)

### 4. Splash Screen (`/public/splash.png`)
- **Size**: 1284×2778 px
- **Format**: PNG
- **Content**: App icon with loading indicator
- **Background Color**: #0052FF (Base blue)
- **Status**: ✅ Exists (needs update with final design)

### 5. Hero Image (`/public/hero.png`)
- **Size**: 1200×630 px
- **Format**: PNG or JPG
- **Content**: Promotional image for app directory
- **Status**: ✅ Exists (needs update with final design)

## Manifest Configuration

The Farcaster manifest is configured in `/minikit.config.ts` and served at `/.well-known/farcaster.json`.

### Current Configuration:
- **Name**: Flappy Bird
- **Subtitle**: Tap to fly and compete globally onchain
- **Description**: Classic Flappy Bird gameplay with onchain high scores, global leaderboards, and social sharing
- **Primary Category**: game
- **Tags**: game, arcade, onchain, leaderboard, competitive
- **Base Builder Address**: 0x879e4a7d26a0b03D5Aa7b34c0F609cCA93071fD8

## Next Steps

1. **Create Screenshots**:
   - Play the game and capture gameplay screenshot
   - Navigate to leaderboard (once implemented) and capture
   - Navigate to profile (once implemented) and capture
   - Use iPhone 14 Pro Max simulator or similar for correct dimensions

2. **Update Cover Photo**:
   - Take a high-quality gameplay screenshot
   - Add score overlay for context
   - Resize to 1200×630 px

3. **Finalize Icon and Splash**:
   - Design final app icon with flappy bird character
   - Update splash screen with final branding

4. **Sign Manifest**:
   - Once deployed, sign the manifest with Farcaster custody wallet
   - Update `accountAssociation` in minikit.config.ts

## Tools for Creating Assets

- **Screenshots**: Use browser dev tools (iPhone 14 Pro Max viewport)
- **Image Editing**: Figma, Photoshop, or online tools like Canva
- **Icon Design**: Figma, Sketch, or icon generators

## Verification

Before submitting to Base Mini Apps directory:
- [ ] All assets are correct dimensions
- [ ] Icon is readable at small sizes
- [ ] Screenshots show actual app functionality
- [ ] Cover photo is high quality
- [ ] Manifest is signed
- [ ] All URLs are accessible
