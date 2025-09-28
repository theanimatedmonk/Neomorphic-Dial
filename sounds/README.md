# Dial Audio System

Single audio file system for dial increment feedback.

## Required File:
- `dial-sound.mp3` - Single sound file played on every increment of 2

## How It Works:
- **Increments**: Sound plays at 25, 27, 29, 31, 33, 35... up to 175
- **Range**: Only active between 25-175 on the dial
- **Smart triggering**: Only plays when moving to a new increment of 2
- **No duplicates**: Won't repeat sound on the same increment

## Audio Settings:
- **Format**: MP3 (also supports WAV, OGG)
- **Volume**: Currently set to 0.6 (adjustable in script.js line 27)
- **Preload**: File is preloaded for instant playback

## Notes:
- Audio file should be short (0.1-0.5 seconds recommended) for rapid dial movement
- The system handles audio loading errors gracefully
- Check browser console for loading status: "🎵 Dial sound loaded successfully"
- Console logs each sound trigger: "🔊 Playing dial sound at: [value]"
