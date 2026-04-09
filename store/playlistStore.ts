// store/playlistStore.ts
import { create } from "zustand";
import { DeezerTrack } from "../services/deezer";

interface UserPlaylist {
  id: string;
  title: string;
  tracks: DeezerTrack[];
  createdAt: Date;
}

interface PlaylistStore {
  // state
  playlists: UserPlaylist[];

  // actions
  createPlaylist: (title: string) => void;
  deletePlaylist: (id: string) => void;
  addTrack: (id: string, track: DeezerTrack) => void;
  removeTrack: (id: string, trackId: number) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  // initial state + actions here
}));
