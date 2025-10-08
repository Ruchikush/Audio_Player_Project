import React, { useEffect, useRef } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './src/store';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import AudioList from './src/components/AudioList';
import PlayerControls from './src/components/PlayerControls';
import AudioService from './src/services/AudioService';
import {
  setPosition,
  setDuration,
  play,
  pause,
  setTrackDuration,
  setLastPositions,
  setPlaylist,
} from './src/store/playbackSlice';
import { TRACKS } from './src/data/tracks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const LAST_POSITIONS_KEY = 'LAST_POSITIONS_V1';

function RootApp() {
  const dispatch = useDispatch<AppDispatch>();
  const lastSavedRef = useRef<number | null>(null);

  useEffect(() => {
    // preload durations sequentially
    const preload = async () => {
      for (const t of TRACKS) {
        try {
          const { sound, status } = await Audio.Sound.createAsync(t.uri, { shouldPlay: false });
          const durSec = status.durationMillis ? Math.round(status.durationMillis / 1000) : 0;
          dispatch(setTrackDuration({ id: t.id, duration: durSec }));
          // unload quickly
          await sound.unloadAsync();
        } catch (e) {
          // ignore individual errors
          console.warn('preload duration failed for', t.id, e);
        }
      }

      // load persisted last positions
      try {
        const raw = await AsyncStorage.getItem(LAST_POSITIONS_KEY);
        if (raw) {
          const map = JSON.parse(raw);
          dispatch(setLastPositions(map));
        }
      } catch (e) {
        console.warn('failed reading last positions', e);
      }

      // set playlist as all tracks
      dispatch(setPlaylist(TRACKS));
    };

    preload();

    // set AudioService status update handler
    AudioService.setOnPlaybackStatusUpdate(async (status: any) => {
      if (!status) return;
      if (status.positionMillis !== undefined) {
        const posSec = Math.round(status.positionMillis / 1000);
        dispatch(setPosition(posSec));
      }
      if (status.durationMillis !== undefined && status.durationMillis > 0) {
        dispatch(setDuration(Math.round(status.durationMillis / 1000)));
      }
      if (status.isPlaying) dispatch(play());
      else dispatch(pause());

      // persist last position every ~5s
      try {
        const state = store.getState();
        const currentId = state.playback.currentTrack?.id;
        if (currentId != null) {
          const now = Date.now();
          if (!lastSavedRef.current || now - lastSavedRef.current > 5000) {
            const newMap = { ...(state.playback.lastPositions || {}), [currentId]: Math.round(status.positionMillis / 1000) };
            await AsyncStorage.setItem(LAST_POSITIONS_KEY, JSON.stringify(newMap));
            dispatch(setLastPositions(newMap));
            lastSavedRef.current = now;
          }
        }
      } catch (e) {
        console.warn('persist last pos error', e);
      }
    });

    return () => {
      AudioService.setOnPlaybackStatusUpdate(null);
    };
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <AudioList />
        <PlayerControls />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
});


