// store/playerStore.ts
// Global state for the music player using Zustand.
// Any screen or component can read or update the player state
// by importing usePlayerStore — no prop drilling needed.

import { create } from "zustand";
import { Song } from "../data/songs";

interface PlayerState {
  currentTrack: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;

  playTrack: (track: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (tracks: Song[], startIndex?: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  let playbackTimer: ReturnType<typeof setInterval> | null = null;

  const stopTimer = () => {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    playbackTimer = setInterval(() => {
      const state = get();

      if (!state.currentTrack || !state.isPlaying) {
        return;
      }

      const nextProgress = Math.min(
        state.progress + 100 / Math.max(state.duration, 1),
        100,
      );

      if (nextProgress >= 100) {
        if (state.isRepeat) {
          set({ progress: 0 });
          return;
        }

        if (state.queue.length > 0) {
          const nextIndex =
            state.isShuffle && state.queue.length > 1
              ? Math.floor(Math.random() * state.queue.length)
              : (state.queueIndex + 1) % state.queue.length;

          const nextTrack = state.queue[nextIndex];
          set({ queueIndex: nextIndex });
          state.playTrack(nextTrack, state.queue);
          return;
        }

        stopTimer();
        set({ progress: 100, isPlaying: false });
        return;
      }

      set({ progress: nextProgress });
    }, 1000);
  };

  const beginTrack = (track: Song, queue: Song[], queueIndex: number) => {
    set({
      currentTrack: track,
      queue,
      queueIndex,
      isPlaying: true,
      progress: 0,
      duration: track.duration,
    });
    startTimer();
  };

  return {
    currentTrack: null,
    queue: [],
    queueIndex: 0,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.8,
    isShuffle: false,
    isRepeat: false,

    playTrack: (track, queue) => {
      const tracks = queue && queue.length > 0 ? queue : [track];
      const nextIndex = Math.max(
        tracks.findIndex((item) => item.id === track.id),
        0,
      );
      beginTrack(track, tracks, nextIndex);
    },

    togglePlay: () => {
      const { currentTrack, isPlaying } = get();
      if (!currentTrack) {
        return;
      }

      if (isPlaying) {
        get().pause();
      } else {
        get().resume();
      }
    },

    pause: () => {
      stopTimer();
      set({ isPlaying: false });
    },

    resume: () => {
      const { currentTrack } = get();
      if (!currentTrack) {
        return;
      }

      set({ isPlaying: true });
      startTimer();
    },

    next: () => {
      const { queue, queueIndex, isShuffle } = get();
      if (!queue.length) {
        return;
      }

      const nextIndex =
        isShuffle && queue.length > 1
          ? Math.floor(Math.random() * queue.length)
          : (queueIndex + 1) % queue.length;

      const nextTrack = queue[nextIndex];
      beginTrack(nextTrack, queue, nextIndex);
    },

    previous: () => {
      const { queue, queueIndex, progress, currentTrack } = get();
      if (!currentTrack) {
        return;
      }

      if (progress > 5) {
        set({ progress: 0 });
        startTimer();
        return;
      }

      if (!queue.length) {
        return;
      }

      const prevIndex = queueIndex === 0 ? queue.length - 1 : queueIndex - 1;
      const prevTrack = queue[prevIndex];
      beginTrack(prevTrack, queue, prevIndex);
    },

    seekTo: (progress) => {
      const nextProgress = Math.max(0, Math.min(progress, 100));
      set({ progress: nextProgress });
    },

    setVolume: (volume) => {
      const nextVolume = Math.max(0, Math.min(volume, 1));
      set({ volume: nextVolume });
    },

    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
    toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),

    setQueue: (tracks, startIndex = 0) => {
      set({ queue: tracks, queueIndex: startIndex });
    },
  };
});
