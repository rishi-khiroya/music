export const DEFAULT_TRACK_LIMIT = 20;
export const MAX_TRACK_LIMIT = 50;

export type TrackOrder = "newest" | "oldest" | "title";

export type CursorPayload = {
  order: TrackOrder;
  id: string;
  createdAt?: string;
  title?: string;
};

export type TrackResponse = {
  id: string;
  slug: string;
  title: string;
  musicalKey: string | null;
  bpm: number | null;
  notes: string | null;
  isPublic: boolean;
  createdAt: string;
  artists: string[];
  genres: string[];
  versions: Array<{
    id: string;
    name: string;
    versionNumber: number;
    status: string;
    format: string;
    durationSeconds: number | null;
    notes: string | null;
    artists: string[];
  }>;
};

export type PaginationData = {
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export type TrackListQuery = {
  artist?: string;
  genre?: string;

  limit: number;
  cursor: CursorPayload | null;

  order: TrackOrder;
};

export type TrackRow = {
  id: string;
  slug: string;
  title: string;
  musicalKey: string | null;
  bpm: number | null;
  notes: string | null;
  isPublic: boolean;
  createdAt: Date;

  artistName: string | null;
  artistOrder: number | null;

  genreName: string | null;

  versionId: string | null;
  versionName: string | null;
  versionNumber: number | null;
  versionStatus: string | null;
  versionFormat: string | null;
  versionDurationSeconds: number | null;
  versionNotes: string | null;

  versionArtistName: string | null;
  versionArtistOrder: number | null;
};
