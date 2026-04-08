export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  songs: Song[];
}

export const SONGS: Song[] = [
  { id: "1", title: "Neon Drift", artist: "Ava Lane", duration: 204 },
  { id: "2", title: "City Lights", artist: "North Pulse", duration: 192 },
  { id: "3", title: "After Hours", artist: "Milo Vale", duration: 221 },
  { id: "4", title: "Golden Hour", artist: "Sofia Quinn", duration: 178 },
  { id: "5", title: "Static Bloom", artist: "Kairo Bloom", duration: 214 },
  { id: "6", title: "Late Night Drive", artist: "Luna West", duration: 189 },
  { id: "7", title: "Midnight Signal", artist: "Ryder Finch", duration: 236 },
  { id: "8", title: "Ocean Echo", artist: "Nora Sky", duration: 198 },
  { id: "9", title: "Horizon Line", artist: "Aria Stone", duration: 210 },
  { id: "10", title: "Pulse Check", artist: "Jett Monroe", duration: 183 },
  { id: "11", title: "Soft Launch", artist: "Elio Park", duration: 194 },
  { id: "12", title: "Slow Burn", artist: "Maya Reed", duration: 227 },
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: "p1",
    title: "Focus Flow",
    description: "Steady tracks for study sessions.",
    songs: SONGS.slice(0, 4),
  },
  {
    id: "p2",
    title: "Evening Drive",
    description: "Warm songs for a late ride home.",
    songs: SONGS.slice(4, 8),
  },
  {
    id: "p3",
    title: "Weekend Mix",
    description: "Upbeat tracks for downtime.",
    songs: SONGS.slice(8, 12),
  },
];

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};
