
import { configureStore } from '@reduxjs/toolkit';
import playbackReducer from './playbackSlice';

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
