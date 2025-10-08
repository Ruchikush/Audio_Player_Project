import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '../data/tracks';

type PlaybackState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number; 
  duration: number; 
  playlist: Track[];
  trackDurations: Record<string, number>;
  lastPositions: Record<string, number>;
  playbackRate: number;
  volume: number;
};

const initialState: PlaybackState = {
  currentTrack: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  playlist: [],
  trackDurations: {},
  lastPositions: {},
  playbackRate: 1.0,
  volume: 1.0,
};

const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    loadTrack(state, action: PayloadAction<Track>) {
      const t = action.payload;
      state.currentTrack = t;
      state.position = state.lastPositions[t.id] ?? 0;
      state.duration = state.trackDurations[t.id] ?? 0;
      state.isPlaying = false;
    },
    setPlaylist(state, action: PayloadAction<Track[]>) {
      state.playlist = action.payload;
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    setPosition(state, action: PayloadAction<number>) {
      state.position = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    reset(state) {
      state.position = 0;
      state.isPlaying = false;
    },
    setTrackDuration(state, action: PayloadAction<{ id: string; duration: number }>) {
      state.trackDurations[action.payload.id] = action.payload.duration;
      if (state.currentTrack?.id === action.payload.id) {
        state.duration = action.payload.duration;
      }
    },
    setLastPositions(state, action: PayloadAction<Record<string, number>>) {
      state.lastPositions = action.payload;
    },
    updateLastPosition(state, action: PayloadAction<{ id: string; position: number }>) {
      state.lastPositions[action.payload.id] = action.payload.position;
    },
    next(state) {
      if (!state.playlist.length) return;
      const currentId = state.currentTrack?.id;
      const idx = state.playlist.findIndex((t) => t.id === currentId);
      const nextIdx = idx === -1 ? 0 : (idx + 1) % state.playlist.length;
      state.currentTrack = state.playlist[nextIdx];
      state.position = state.lastPositions[state.currentTrack.id] ?? 0;
      state.duration = state.trackDurations[state.currentTrack.id] ?? 0;
      state.isPlaying = false;
    },
    prev(state) {
      if (!state.playlist.length) return;
      const currentId = state.currentTrack?.id;
      const idx = state.playlist.findIndex((t) => t.id === currentId);
      const prevIdx = idx === -1 ? 0 : (idx - 1 + state.playlist.length) % state.playlist.length;
      state.currentTrack = state.playlist[prevIdx];
      state.position = state.lastPositions[state.currentTrack.id] ?? 0;
      state.duration = state.trackDurations[state.currentTrack.id] ?? 0;
      state.isPlaying = false;
    },
    setPlaybackRate(state, action: PayloadAction<number>) {
      state.playbackRate = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
  },
});

export const {
  loadTrack,
  setPlaylist,
  play,
  pause,
  setPosition,
  setDuration,
  reset,
  setTrackDuration,
  setLastPositions,
  updateLastPosition,
  next,
  prev,
  setPlaybackRate,
  setVolume,
} = playbackSlice.actions;

export default playbackSlice.reducer;


// // src/store/playbackSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Track } from '../data/tracks';

// type PlaybackState = {
//   currentTrack: Track | null;
//   isPlaying: boolean;
//   position: number; // seconds
//   duration: number; // seconds
// };

// const initialState: PlaybackState = {
//   currentTrack: null,
//   isPlaying: false,
//   position: 0,
//   duration: 0,
// };

// const playbackSlice = createSlice({
//   name: 'playback',
//   initialState,
//   reducers: {
//     loadTrack(state, action: PayloadAction<Track>) {
//       state.currentTrack = action.payload;
//       state.position = 0;
//       state.duration = 0;
//       state.isPlaying = false;
//     },
//     play(state) {
//       state.isPlaying = true;
//     },
//     pause(state) {
//       state.isPlaying = false;
//     },
//     setPosition(state, action: PayloadAction<number>) {
//       state.position = action.payload;
//     },
//     setDuration(state, action: PayloadAction<number>) {
//       state.duration = action.payload;
//     },
//     reset(state) {
//       state.position = 0;
//       state.isPlaying = false;
//     },
//   },
// });

// export const { loadTrack, play, pause, setPosition, setDuration, reset } = playbackSlice.actions;
// export default playbackSlice.reducer;
