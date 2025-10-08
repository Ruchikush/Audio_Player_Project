
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  position: number; 
  duration: number; 
  onSeek: (sec: number) => void;
};

function formatTime(sec: number) {
  if (!sec && sec !== 0) return '--:--';
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Waveform({ position, duration, onSeek }: Props) {
  const [local, setLocal] = useState<number | null>(null);

  const displayValue = local !== null ? local : position;

  return (
    <View style={styles.container}>
      <Slider
        style={{ width: '100%', height: 40 }}
        value={displayValue}
        minimumValue={0}
        maximumValue={duration || 1}
        onValueChange={(val) => setLocal(val)}
        onSlidingComplete={(val) => {
          setLocal(null);
          onSeek(val);
        }}
      />
      <View style={styles.times}>
        <Text>{formatTime(displayValue || 0)}</Text>
        <Text>{formatTime(duration || 0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  times: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
});
