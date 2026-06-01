import { and, asc, desc, eq, ilike, inArray, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../db/client";
import {
  artists,
  genres,
  trackArtists,
  trackGenres,
  tracks,
  trackVersionArtists,
  trackVersions,
} from "../../db/schema";
import { encodeCursor, getCursorFilter } from "./cursor";
import { shapeTracks } from "./shape";
import type {
  PaginationData,
  TrackListQuery,
  TrackOrder,
  TrackResponse,
} from "./types";

const versionArtists = alias(artists, "version_artists");

export async function listTracks(
  query: TrackListQuery,
): Promise<{ pagination: PaginationData; data: TrackResponse[] }> {
  // parse filters, query IDs, query joined rows, return shaped response

  const filters = buildTrackFilters(query);

  const trackIdRows = await db
    .select({
      trackId: tracks.id,
      title: tracks.title,
      createdAt: tracks.createdAt,
    })
    .from(tracks)
    .leftJoin(trackArtists, eq(tracks.id, trackArtists.trackId))
    .leftJoin(artists, eq(trackArtists.artistId, artists.id))
    .leftJoin(trackGenres, eq(tracks.id, trackGenres.trackId))
    .leftJoin(genres, eq(trackGenres.genreId, genres.id))
    .where(filters)
    .groupBy(tracks.id)
    .orderBy(...getOrderBy(query.order))
    .limit(query.limit + 1);

  const pageRows = trackIdRows.slice(0, query.limit);
  const trackIds = pageRows.map((row) => row.trackId);

  if (trackIds.length === 0) {
    return {
      data: [],
      pagination: {
        limit: query.limit,
        hasMore: false,
        nextCursor: null,
      },
    };
  }

  const hasMore = trackIdRows.length > query.limit;

  const rows = await db
    .select({
      id: tracks.id,
      slug: tracks.slug,
      title: tracks.title,
      musicalKey: tracks.musicalKey,
      bpm: tracks.bpm,
      notes: tracks.notes,
      isPublic: tracks.isPublic,
      createdAt: tracks.createdAt,

      artistName: artists.name,
      artistOrder: trackArtists.sortOrder,

      genreName: genres.name,

      versionId: trackVersions.id,
      versionName: trackVersions.name,
      versionNumber: trackVersions.versionNumber,
      versionStatus: trackVersions.status,
      versionFormat: trackVersions.format,
      versionDurationSeconds: trackVersions.durationSeconds,
      versionNotes: trackVersions.notes,

      versionArtistName: versionArtists.name,
      versionArtistOrder: trackVersionArtists.sortOrder,
    })
    .from(tracks)
    .leftJoin(trackArtists, eq(tracks.id, trackArtists.trackId))
    .leftJoin(artists, eq(trackArtists.artistId, artists.id))
    .leftJoin(trackGenres, eq(tracks.id, trackGenres.trackId))
    .leftJoin(genres, eq(trackGenres.genreId, genres.id))
    .leftJoin(trackVersions, eq(tracks.id, trackVersions.trackId))
    .leftJoin(
      trackVersionArtists,
      eq(trackVersions.id, trackVersionArtists.trackVersionId),
    )
    .leftJoin(
      versionArtists,
      eq(trackVersionArtists.artistId, versionArtists.id),
    )
    .where(inArray(tracks.id, trackIds));

  const lastRow = pageRows.at(-1);

  return {
    data: shapeTracks(rows, trackIds),
    pagination: {
      limit: query.limit,
      hasMore,
      nextCursor:
        hasMore && lastRow
          ? encodeCursor({
              order: query.order,
              id: lastRow.trackId,
              title: lastRow.title,
              createdAt: lastRow.createdAt.toISOString(),
            })
          : null,
    },
  };
}

function buildTrackFilters({
  artist,
  genre,
  cursor,
  order,
}: TrackListQuery): SQL | undefined {
  return and(
    artist ? ilike(artists.name, artist) : undefined,
    genre ? ilike(genres.name, genre) : undefined,
    cursor ? getCursorFilter(cursor, order) : undefined,
  );
}

function getOrderBy(order: TrackOrder) {
  if (order === "oldest") {
    return [asc(tracks.createdAt), asc(tracks.id)] as const;
  }

  if (order === "title") {
    return [asc(tracks.title), asc(tracks.id)] as const;
  }

  return [desc(tracks.createdAt), desc(tracks.id)] as const;
}

export async function getTrackBySlug(
  slug: string,
): Promise<TrackResponse | null> {
  const rows = await db
    .select({
      id: tracks.id,
      slug: tracks.slug,
      title: tracks.title,
      musicalKey: tracks.musicalKey,
      bpm: tracks.bpm,
      notes: tracks.notes,
      isPublic: tracks.isPublic,
      createdAt: tracks.createdAt,

      artistName: artists.name,
      artistOrder: trackArtists.sortOrder,

      genreName: genres.name,

      versionId: trackVersions.id,
      versionName: trackVersions.name,
      versionNumber: trackVersions.versionNumber,
      versionStatus: trackVersions.status,
      versionFormat: trackVersions.format,
      versionDurationSeconds: trackVersions.durationSeconds,
      versionNotes: trackVersions.notes,

      versionArtistName: versionArtists.name,
      versionArtistOrder: trackVersionArtists.sortOrder,
    })
    .from(tracks)
    .leftJoin(trackArtists, eq(tracks.id, trackArtists.trackId))
    .leftJoin(artists, eq(trackArtists.artistId, artists.id))
    .leftJoin(trackGenres, eq(tracks.id, trackGenres.trackId))
    .leftJoin(genres, eq(trackGenres.genreId, genres.id))
    .leftJoin(trackVersions, eq(tracks.id, trackVersions.trackId))
    .leftJoin(
      trackVersionArtists,
      eq(trackVersions.id, trackVersionArtists.trackVersionId),
    )
    .leftJoin(
      versionArtists,
      eq(trackVersionArtists.artistId, versionArtists.id),
    )
    .where(eq(tracks.slug, slug));

  const [track] = shapeTracks(rows, []);

  return track ?? null;
}
