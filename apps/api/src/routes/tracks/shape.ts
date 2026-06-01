import type { TrackResponse, TrackRow } from "./types";

export function shapeTracks(
  rows: TrackRow[],
  orderedTrackIds: string[],
): TrackResponse[] {
  const tracksById = new Map<string, TrackResponse>();
  const trackArtistOrders = new Map<string, Map<string, number>>();
  const versionArtistOrders = new Map<string, Map<string, number>>();

  for (const row of rows) {
    let track = tracksById.get(row.id);

    if (!track) {
      track = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        musicalKey: row.musicalKey,
        bpm: row.bpm,
        notes: row.notes,
        isPublic: row.isPublic,
        createdAt: row.createdAt.toISOString(),
        artists: [],
        genres: [],
        versions: [],
      };

      tracksById.set(row.id, track);
      trackArtistOrders.set(row.id, new Map());
    }

    if (row.artistName && !track.artists.includes(row.artistName)) {
      track.artists.push(row.artistName);
      trackArtistOrders.get(row.id)?.set(row.artistName, row.artistOrder ?? 0);
    }

    if (row.genreName && !track.genres.includes(row.genreName)) {
      track.genres.push(row.genreName);
    }

    if (row.versionId) {
      let version = track.versions.find((item) => item.id === row.versionId);

      if (!version) {
        version = {
          id: row.versionId,
          name: row.versionName ?? "Main",
          versionNumber: row.versionNumber ?? 1,
          status: row.versionStatus ?? "wip",
          format: row.versionFormat ?? "unknown",
          durationSeconds: row.versionDurationSeconds,
          notes: row.versionNotes,
          artists: [],
        };

        track.versions.push(version);
        versionArtistOrders.set(row.versionId, new Map());
      }

      if (
        row.versionArtistName &&
        !version.artists.includes(row.versionArtistName)
      ) {
        version.artists.push(row.versionArtistName);
        versionArtistOrders
          .get(row.versionId)
          ?.set(row.versionArtistName, row.versionArtistOrder ?? 0);
      }
    }
  }

  for (const track of tracksById.values()) {
    const artistOrder = trackArtistOrders.get(track.id);

    track.artists.sort(
      (a, b) => (artistOrder?.get(a) ?? 0) - (artistOrder?.get(b) ?? 0),
    );

    track.versions.sort((a, b) => a.versionNumber - b.versionNumber);

    for (const version of track.versions) {
      const versionArtistOrder = versionArtistOrders.get(version.id);

      version.artists.sort(
        (a, b) =>
          (versionArtistOrder?.get(a) ?? 0) - (versionArtistOrder?.get(b) ?? 0),
      );
    }
  }

  if (orderedTrackIds.length === 0) {
    return [...tracksById.values()];
  }

  return orderedTrackIds
    .map((id) => tracksById.get(id))
    .filter((track): track is TrackResponse => Boolean(track));
}
