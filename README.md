# Submission

GitHub Repo: https://github.com/Ruchikush/Audio_Player_Project

ScreenShort / Video: Drive Link : https://drive.google.com/drive/folders/1hmWUfVG6NCac-4jUz8PfeWwfGhbUwJxC


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
  - `RESET` etc.

# Audio Service
All audio control logic lives in `AudioService.ts`.  
This ensures a clean separation between UI and playback logic:
- `AudioService.playTrack(trackUri)`
- `AudioService.pause()`
- `AudioService.seek(position)`
- `AudioService.reset()`

---

# How to Run Locally

# 1. Clone the repo
```bash
git clone https://github.com/Ruchikush/Audio_Player_Project.git
cd my-audio-player

# Install dependencies

npm install /yarn install


# Start the Expo development server
npx expo start



# Features Implemented

1. List local audio files from assets/audio/

2. Play / Pause / Reset / Prev / Next audio

3. Waveform-based seeking

4. Global playback state with Redux Toolkit

5. Clean separation of UI and business logic

6. Playback speed control

7. Users must be able to seek by tapping/clicking the waveform or dragging a handle. Seeking should update playback position.

8. Show a waveform or a visual progress bar for the selected audio.

9. Robust state management (Redux Toolkit)

10. Load and display a list of audio files bundled with the app (e.g. assets/audio/ ) Show title, duration and a small thumbnail and icon.

11. Use of TypeScript


# Features Omitted / Known Issues
1. Background playback (notifications, lock screen) not implemented

2. Real-time audio waveform visualization (used simple progress bar instead)

3.  Playlist shuffle / repeat


# Notes on Core Architecture

1. Redux Toolkit stores playback state (currentTrack, isPlaying, position, duration)

2. AudioService.ts handles all direct calls to expo-av

3. UI Components are stateless wherever possible and read state from Redux

4. This ensures testable, predictable, and maintainable code

