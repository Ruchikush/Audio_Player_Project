
import { Audio } from 'expo-av';

type StatusCallback = (status: any) => void;

class AudioService {
  private sound: Audio.Sound | null = null;
  private onStatusCb: StatusCallback | null = null;
  private lastDispatch = 0;
  private throttleMs = 300;

 
  async loadAsync(
    source: any,
    options?: { startPositionMs?: number; rate?: number; volume?: number }
  ) {
    // unload existing
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch (e) {
     
      }
      this.sound = null;
    }

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      { shouldPlay: false, staysActiveInBackground: false },
      (s: any) => {
        const now = Date.now();
        if (now - this.lastDispatch >= this.throttleMs) {
          this.lastDispatch = now;
          if (this.onStatusCb) this.onStatusCb(s);
        }
      }
    );

    this.sound = sound;

    
    if (options?.rate !== undefined) {
      try {
        await this.sound.setRateAsync(options.rate, true);
      } catch (e) {}
    }
    if (options?.volume !== undefined) {
      try {
        await this.sound.setVolumeAsync(options.volume);
      } catch (e) {}
    }
    if (options?.startPositionMs) {
      try {
        await this.sound.setPositionAsync(options.startPositionMs);
      } catch (e) {}
    }

    const finalStatus = await this.sound.getStatusAsync();
    return finalStatus;
  }

  setOnPlaybackStatusUpdate(cb: StatusCallback | null) {
    this.onStatusCb = cb;
    if (this.sound) {
      this.sound.setOnPlaybackStatusUpdate(cb ?? undefined);
    }
  }

  async playAsync() {
    if (!this.sound) return;
    try {
      await this.sound.playAsync();
    } catch (e) {
      console.warn('AudioService.playAsync error', e);
    }
  }
  async pauseAsync() {
    if (!this.sound) return;
    try {
      await this.sound.pauseAsync();
    } catch (e) {
      console.warn('AudioService.pauseAsync error', e);
    }
  }
  async stopAndResetAsync() {
    if (!this.sound) return;
    try {
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
    } catch (e) {
      console.warn('AudioService.stopAndResetAsync error', e);
    }
  }

  async seekToMillis(ms: number) {
    if (!this.sound) return;
    try {
      await this.sound.setPositionAsync(ms);
    } catch (e) {
      console.warn('AudioService.seek error', e);
    }
  }

  async setRateAsync(rate: number) {
    if (!this.sound) return;
    try {
      await this.sound.setRateAsync(rate, true);
    } catch (e) {
      console.warn('AudioService.setRateAsync error', e);
    }
  }

  async setVolumeAsync(volume: number) {
    if (!this.sound) return;
    try {
      await this.sound.setVolumeAsync(volume);
    } catch (e) {
      console.warn('AudioService.setVolumeAsync error', e);
    }
  }

  async unloadAsync() {
    if (!this.sound) return;
    try {
      await this.sound.unloadAsync();
      this.sound = null;
    } catch (e) {
      
    }
  }
}

export default new AudioService();

