import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PLAYLISTS, Playlist, Song } from "./songs";

const PLAYLISTS_KEY = "soundwave:playlists";
const RECENTLY_PLAYED_KEY = "soundwave:recently-played";

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadPlaylists(): Promise<Playlist[]> {
  const stored = await AsyncStorage.getItem(PLAYLISTS_KEY);
  if (!stored) {
    await savePlaylists(DEFAULT_PLAYLISTS);
    return DEFAULT_PLAYLISTS;
  }

  return readJson<Playlist[]>(PLAYLISTS_KEY, DEFAULT_PLAYLISTS);
}

export async function savePlaylists(playlists: Playlist[]): Promise<void> {
  await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
}

export async function loadRecentlyPlayed(): Promise<Song[]> {
  return readJson<Song[]>(RECENTLY_PLAYED_KEY, []);
}

export async function saveRecentlyPlayed(songs: Song[]): Promise<void> {
  await AsyncStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(songs));
}

export async function addRecentlyPlayed(song: Song): Promise<Song[]> {
  const current = await loadRecentlyPlayed();
  const next = [song, ...current.filter((item) => item.id !== song.id)].slice(
    0,
    8,
  );
  await saveRecentlyPlayed(next);
  return next;
}

export async function resetDemoData(): Promise<void> {
  await Promise.all([savePlaylists(DEFAULT_PLAYLISTS), saveRecentlyPlayed([])]);
}
