// store/playerStore.ts
// Global state for the music player using Zustand.
// Any screen or component can read or update the player state
// by importing usePlayerStore — no prop drilling needed.

import { create } from "zustand";
import { Audio, AVPlaybackStatus } from "expo-av";
import { DeezerTrack } from "../services/deezer";

// ─── State shape ──────────────────────────────────────────────────────────────

interface PlayerState {
  // Current track
  currentTrack: DeezerTrack | null;
  queue: DeezerTrack[];
  queueIndex: number;

  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number; // current playback position in ms
  durationMs: number; // total duration in ms (usually ~30000 for previews)
  volume: number; // 0.0 – 1.0
  isShuffle: boolean;
  isRepeat: boolean;

  // Internal sound object (not exposed to UI)
  _sound: Audio.Sound | null;

  // ─── Actions ────────────────────────────────────────────────────────────────
  playTrack: (track: DeezerTrack, queue?: DeezerTrack[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: DeezerTrack[], startIndex?: number) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  isLoading: false,
  positionMs: 0,
  durationMs: 30000,
  volume: 1.0,
  isShuffle: false,
  isRepeat: false,
  _sound: null,

  // ─── Play a track ──────────────────────────────────────────────────────────
  playTrack: async (track, queue) => {
    const { _sound } = get();

    // Unload previous sound if exists
    if (_sound) {
      await _sound.unloadAsync();
      set({ _sound: null });
    }

    if (!track.preview) {
      console.warn("No preview URL for track:", track.title);
      return;
    }

    set({
      currentTrack: track,
      isLoading: true,
      isPlaying: false,
      positionMs: 0,
      ...(queue && {
        queue,
        queueIndex: queue.findIndex((t) => t.id === track.id),
      }),
    });

    try {
      // Configure audio session
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.preview },
        { shouldPlay: true, volume: get().volume },
        // Playback status callback — fires frequently with position updates
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          set({
            positionMs: status.positionMillis,
            durationMs: status.durationMillis ?? 30000,
            isPlaying: status.isPlaying,
          });
          // Auto-advance to next track when done
          if (status.didJustFinish) {
            if (get().isRepeat) {
              sound.replayAsync();
            } else {
              get().next();
            }
          }
        },
      );

      set({ _sound: sound, isLoading: false, isPlaying: true });
    } catch (err) {
      console.error("Failed to play track:", err);
      set({ isLoading: false });
    }
  },

  // ─── Toggle play / pause ───────────────────────────────────────────────────
  togglePlay: async () => {
    const { isPlaying, _sound } = get();
    if (!_sound) return;
    isPlaying ? await _sound.pauseAsync() : await _sound.playAsync();
  },

  pause: async () => {
    const { _sound } = get();
    await _sound?.pauseAsync();
  },

  resume: async () => {
    const { _sound } = get();
    await _sound?.playAsync();
  },

  // ─── Skip next ─────────────────────────────────────────────────────────────
  next: async () => {
    const { queue, queueIndex, isShuffle, playTrack } = get();
    if (!queue.length) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }

    set({ queueIndex: nextIndex });
    await playTrack(queue[nextIndex], queue);
  },

  // ─── Skip previous ─────────────────────────────────────────────────────────
  previous: async () => {
    const { queue, queueIndex, positionMs, _sound, playTrack } = get();

    // If more than 3 seconds in, restart current track instead
    if (positionMs > 3000) {
      await _sound?.setPositionAsync(0);
      return;
    }

    if (!queue.length) return;
    const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
    set({ queueIndex: prevIndex });
    await playTrack(queue[prevIndex], queue);
  },

  // ─── Seek ──────────────────────────────────────────────────────────────────
  seekTo: async (positionMs) => {
    const { _sound } = get();
    await _sound?.setPositionAsync(positionMs);
  },

  // ─── Volume ────────────────────────────────────────────────────────────────
  setVolume: async (volume) => {
    const { _sound } = get();
    await _sound?.setVolumeAsync(volume);
    set({ volume });
  },

  // ─── Shuffle / Repeat ──────────────────────────────────────────────────────
  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
  toggleRepeat: () => set((s) => ({ isRepeat: !s.isRepeat })),

  // ─── Set queue without playing ─────────────────────────────────────────────
  setQueue: (tracks, startIndex = 0) =>
    set({ queue: tracks, queueIndex: startIndex }),
}));
// npx expo install expo-av expo-auth-session expo-web-browser expo-secure-store expo-linear-gradient
// npm install zustand
