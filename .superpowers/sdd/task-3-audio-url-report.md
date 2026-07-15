# Task 3 Audio URL Report — 2026-07-15

## Status
**BLOCKED** — No direct MP3 URLs discovered; all known patterns return HTML or require authentication.

## Number of Viable Sources Found
**0** — No source provides a verified, publicly accessible direct MP3 URL that returns `audio/mpeg` via curl with browser UA.

---

## Source Details

### 1. bestdori.com — FAILED
- **URL tested**: `https://bestdori.com/sound/voice/character/1.mp3`
- **curl result**: HTTP/2 200, content-type: **text/html** (not audio/mpeg)
- **API result**: `https://bestdori.com/api/voice/1` → HTTP/2 200, content-type: **text/html**
- **API result**: `https://bestdori.com/api/characters/1` → HTTP/2 200, content-type: **text/html**
- **cdn test**: `https://cdn.bandori.bestdori.com/...` → not reachable
- **Conclusion**: bestdori has removed or protected all voice audio files. All paths return HTML placeholder.

### 2. GitHub — FAILED
- **Search**: `site:github.com "bandori" "voice" "mp3" "raw"`
- **Result**: No repository found containing actual .mp3 voice files
- **Repositories checked**: `BandoriDatabase/bangdream-data-api` (empty data/), `HELPMEEADICE/BANDORI-PET-REV` (no audio), `ReiKohaku/BanG-Player-v2` (no audio files)
- **bestdori resources repo**: `github.com/bestdori/bandori-resources` — timed out / unreachable

### 3. Bilibili — FAILED (automated)
- **API test**: `api.bilibili.com/x/web-interface/search/all/v2?keyword=...` → HTTP/2 405
- **Video page**: `bilibili.com/video/BV14x411y7XU/` → HTTP/2 301 redirect (needs browser cookie)
- **Note**: Videos exist but cannot be fetched via curl; require browser session

### 4. 网易云音乐 — NOT TESTED (not character voice)
- Contains only songs, not character voice clips

### 5. Web Archive — FAILED
- No cached bestdori voice API responses found

---

## Recommendation

**No automated URL discovery succeeded.**

**User's best options (in order):**
1. **Browser-based Bilibili extraction** — Find a BanG Dream character voice collection video on Bilibili, use browser DevTools to extract the media URL, then use FFmpeg to extract audio
2. **bestdori.com/tool/voice in browser** — Open in browser, play a voice, copy the real URL from Network tab before it expires
3. **Game APK extraction** — High difficulty, requires Android emulator + APKTool
4. **Purchase official CD** — Most reliable but requires payment

**Fallback**: https://bestdori.com/tool/voice (user can manually browse in browser)

---

## Guide Document
`/home/ruo/Desktop/LYX/VibeCoding/BangDreamListenAndTest/dev-docs/06-audio-download-guide-2026-07-15.md`
