import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { play, pause, reset, setPosition, setPlaybackRate, setVolume } from '../store/playbackSlice';
import AudioService from '../services/AudioService';
import Waveform from './Waveform';
import Slider from '@react-native-community/slider';
import { TRACKS } from '../data/tracks';
import { store } from '../store';
import { loadTrack } from '../store/playbackSlice';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PlayerControls() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTrack, isPlaying, position, duration, playbackRate, volume } = useSelector((s: RootState) => s.playback);

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16 }}>No track selected</Text>
      </View>
    );
  }

  const onPlayPause = async () => {
    if (isPlaying) {
      await AudioService.pauseAsync();
      dispatch(pause());
    } else {
      await AudioService.playAsync();
      dispatch(play());
    }
  };

  const onReset = async () => {
    await AudioService.stopAndResetAsync();
    dispatch(reset());
    dispatch(setPosition(0));
  };

  const onSeek = async (sec: number) => {
    await AudioService.seekToMillis(Math.round(sec * 1000));
    dispatch(setPosition(sec));
  };

  const onNext = async () => {
    const state = store.getState();
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % TRACKS.length;
    const nextTrack = TRACKS[nextIdx];
    const startPos = state.playback.lastPositions[nextTrack.id] ?? 0;
    await AudioService.loadAsync(nextTrack.uri, { startPositionMs: Math.round(startPos * 1000), rate: playbackRate, volume });
    dispatch(loadTrack(nextTrack));
    await AudioService.playAsync();
    dispatch(play());
  };

  const onPrev = async () => {
    const state = store.getState();
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + TRACKS.length) % TRACKS.length;
    const prevTrack = TRACKS[prevIdx];
    const startPos = state.playback.lastPositions[prevTrack.id] ?? 0;
    await AudioService.loadAsync(prevTrack.uri, { startPositionMs: Math.round(startPos * 1000), rate: playbackRate, volume });
    dispatch(loadTrack(prevTrack));
    await AudioService.playAsync();
    dispatch(play());
  };

  const changeSpeed = async (dir: 'up' | 'down') => {
    const curIndex = SPEEDS.indexOf(playbackRate) >= 0 ? SPEEDS.indexOf(playbackRate) : 2;
    const nextIndex = dir === 'up' ? Math.min(SPEEDS.length - 1, curIndex + 1) : Math.max(0, curIndex - 1);
    const next = SPEEDS[nextIndex];
    dispatch(setPlaybackRate(next));
    await AudioService.setRateAsync(next);
  };

  const onVolumeChange = async (val: number) => {
    dispatch(setVolume(val));
    await AudioService.setVolumeAsync(val);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentTrack.title}</Text>

      <Waveform position={position} duration={duration} onSeek={onSeek} />

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={onPrev}><Text style={styles.btnText}>Prev</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onPlayPause}><Text style={styles.btnText}>{isPlaying ? 'Pause' : 'Play'}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onReset}><Text style={styles.btnText}>Reset</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onNext}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text>Speed: {playbackRate}x</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
          <TouchableOpacity style={styles.smallBtn} onPress={() => changeSpeed('down')}><Text>-</Text></TouchableOpacity>
          <TouchableOpacity style={styles.smallBtn} onPress={() => changeSpeed('up')}><Text>+</Text></TouchableOpacity>
        </View>

        <Text>Volume</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={onVolumeChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#007AFF', borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  smallBtn: { padding: 8, borderRadius: 6, backgroundColor: '#eee' },
});


