// services/deezer.ts
// All Deezer API calls live here.
// Public endpoints (search, chart, playlists) need NO auth.
// User endpoints (my playlists, liked tracks) need an access token.

const BASE = "https://api.deezer.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DeezerArtist {
  id: number;
  name: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  link: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
}

export interface DeezerTrack {
  id: number;
  title: string;
  duration: number; // seconds
  preview: string; // 30s MP3 URL — free, no auth needed
  link: string;
  artist: DeezerArtist;
  album: DeezerAlbum;
  rank?: number;
}

export interface DeezerPlaylist {
  id: number;
  title: string;
  description?: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  nb_tracks: number;
  link: string;
  public: boolean;
  tracks?: { data: DeezerTrack[] };
}

export interface DeezerAlbumFull extends DeezerAlbum {
  artist: DeezerArtist;
  nb_tracks: number;
  tracks?: { data: DeezerTrack[] };
}

export interface DeezerChart {
  tracks: { data: DeezerTrack[] };
  albums: { data: DeezerAlbumFull[] };
  artists: { data: DeezerArtist[] };
  playlists: { data: DeezerPlaylist[] };
}

export interface DeezerSearchResult {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

const fetchDeezer = async <T>(
  path: string,
  token?: string | null,
): Promise<T> => {
  const sep = path.includes("?") ? "&" : "?";
  const authParam = token ? `${sep}access_token=${token}` : "";
  const url = `${BASE}${path}${authParam}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Deezer API error: ${res.status}`);

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Deezer error");

  return data as T;
};

// ─── Public API (no auth needed) ──────────────────────────────────────────────

export const DeezerAPI = {
  // 📈 Charts — great for Home screen "Popular" section
  getChart: () => fetchDeezer<DeezerChart>("/chart"),

  getChartTracks: (limit = 20) =>
    fetchDeezer<{ data: DeezerTrack[] }>(`/chart/0/tracks?limit=${limit}`),

  getChartPlaylists: (limit = 10) =>
    fetchDeezer<{ data: DeezerPlaylist[] }>(
      `/chart/0/playlists?limit=${limit}`,
    ),

  // 🔍 Search
  searchTracks: (q: string, limit = 20) =>
    fetchDeezer<DeezerSearchResult>(
      `/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    ),

  searchArtists: (q: string, limit = 10) =>
    fetchDeezer<{ data: DeezerArtist[] }>(
      `/search/artist?q=${encodeURIComponent(q)}&limit=${limit}`,
    ),

  searchPlaylists: (q: string, limit = 10) =>
    fetchDeezer<{ data: DeezerPlaylist[] }>(
      `/search/playlist?q=${encodeURIComponent(q)}&limit=${limit}`,
    ),

  // 🎵 Tracks
  getTrack: (id: number) => fetchDeezer<DeezerTrack>(`/track/${id}`),

  // 🎤 Artists
  getArtist: (id: number) => fetchDeezer<DeezerArtist>(`/artist/${id}`),

  getArtistTopTracks: (id: number, limit = 10) =>
    fetchDeezer<{ data: DeezerTrack[] }>(`/artist/${id}/top?limit=${limit}`),

  getArtistAlbums: (id: number, limit = 10) =>
    fetchDeezer<{ data: DeezerAlbumFull[] }>(
      `/artist/${id}/albums?limit=${limit}`,
    ),

  // 💿 Albums
  getAlbum: (id: number) => fetchDeezer<DeezerAlbumFull>(`/album/${id}`),

  getAlbumTracks: (id: number) =>
    fetchDeezer<{ data: DeezerTrack[] }>(`/album/${id}/tracks`),

  // 📋 Playlists
  getPlaylist: (id: number) => fetchDeezer<DeezerPlaylist>(`/playlist/${id}`),

  getPlaylistTracks: (id: number, limit = 50) =>
    fetchDeezer<{ data: DeezerTrack[] }>(
      `/playlist/${id}/tracks?limit=${limit}`,
    ),

  // ─── User API (requires access token) ───────────────────────────────────────

  getMe: (token: string) =>
    fetchDeezer<{ id: number; name: string; picture_medium: string }>(
      "/user/me",
      token,
    ),

  getMyPlaylists: (token: string, limit = 25) =>
    fetchDeezer<{ data: DeezerPlaylist[] }>(
      `/user/me/playlists?limit=${limit}`,
      token,
    ),

  getMyFavoriteTracks: (token: string, limit = 50) =>
    fetchDeezer<{ data: DeezerTrack[] }>(
      `/user/me/tracks?limit=${limit}`,
      token,
    ),

  getMyFavoriteAlbums: (token: string, limit = 25) =>
    fetchDeezer<{ data: DeezerAlbumFull[] }>(
      `/user/me/albums?limit=${limit}`,
      token,
    ),

  addFavoriteTrack: async (token: string, trackId: number) => {
    const res = await fetch(
      `${BASE}/user/me/tracks?access_token=${token}&track_id=${trackId}`,
      { method: "POST" },
    );
    return res.json();
  },

  removeFavoriteTrack: async (token: string, trackId: number) => {
    const res = await fetch(
      `${BASE}/user/me/tracks?access_token=${token}&track_id=${trackId}`,
      { method: "DELETE" },
    );
    return res.json();
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Format seconds → "3:45"
export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
