# Tech Stack

| Category | Library / Tool |
|-----------|----------------|
| Framework | Expo (React Native) |
| Language | TypeScript |
| Audio Playback | expo-av |
| State Management | Redux Toolkit |
| Navigation | React Navigation |
| UI Components | React Native Core |
| Animations | React Native Animated API |

---

# Architecture Overview

#  State Management
- Global playback state is handled by Redux Toolkit.
- The `playbackSlice` defines all actions:
  - `LOAD_TRACK`
  - `PLAY`
  - `PAUSE`
  - `RESET`
  - `SEEK`

# Audio Service
All audio control logic lives in `AudioService.ts`.  
This ensures a clean separation between UI and playback logic:
- `AudioService.playTrack(trackUri)`
- `AudioService.pause()`
- `AudioService.seek(position)`
- `AudioService.reset()`

---

# How to Run Locally

# 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/my-audio-player.git
cd my-audio-player
