import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TRACKS, Track } from '../data/tracks';
import { useDispatch, useSelector } from 'react-redux';
import { loadTrack, setDuration, setPosition } from '../store/playbackSlice';
import AudioService from '../services/AudioService';
import { RootState, AppDispatch } from '../store';

export default function AudioList() {
  const dispatch = useDispatch<AppDispatch>();
  const trackDurations = useSelector((s: RootState) => s.playback.trackDurations);
  const lastPositions = useSelector((s: RootState) => s.playback.lastPositions);
  const playbackRate = useSelector((s: RootState) => s.playback.playbackRate);
  const volume = useSelector((s: RootState) => s.playback.volume);

  const onSelect = async (track: Track) => {
    // start position from saved map
    const startSec = lastPositions[track.id] ?? 0;
    const startMs = Math.round(startSec * 1000);

    const status = await AudioService.loadAsync(track.uri, {
      startPositionMs: startMs,
      rate: playbackRate,
      volume,
    });

    const durationSec = status.durationMillis ? Math.round(status.durationMillis / 1000) : 0;
    dispatch(setDuration(durationSec));
    dispatch(loadTrack(track));
    dispatch(setPosition(startSec));
    // auto play
    await AudioService.playAsync();
  };

  const renderItem = ({ item }: { item: Track }) => {
    const dur = trackDurations[item.id];
    const durText = dur ? `${Math.floor(dur / 60)}:${String(dur % 60).padStart(2, '0')}` : '--:--';
    return (
      <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
        <Image source={item.artwork} style={styles.thumb} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.artist} · {durText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={TRACKS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f8f8f8', padding: 8, borderRadius: 8 },
  thumb: { width: 56, height: 56, borderRadius: 6, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666' },
});


