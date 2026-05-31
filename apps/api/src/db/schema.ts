import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const trackVersionStatus = pgEnum("track_version_status", [
  "wip",
  "demo",
  "id",
  "release_candidate",
  "released",
  "archived",
]);

export const artists = pgTable(
  "artists",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("artists_name_idx").on(table.name)],
);

export const genres = pgTable(
  "genres",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("genres_name_idx").on(table.name)],
);

export const tracks = pgTable(
  "tracks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    musicalKey: varchar("musical_key", { length: 40 }),
    bpm: integer("bpm"),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    isPublic: boolean("is_public").notNull().default(true),
  },
  (table) => [
    index("tracks_title_idx").on(table.title),
    index("tracks_bpm_idx").on(table.bpm),
    index("tracks_musical_key_idx").on(table.musicalKey),
  ],
);

export const trackVersions = pgTable(
  "track_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 120 }).notNull(),
    versionNumber: integer("version_number").notNull(),

    objectKey: text("object_key").notNull(),
    format: varchar("format", { length: 10 }).notNull(),

    status: trackVersionStatus("status").notNull().default("wip"),
    durationSeconds: integer("duration_seconds"),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("track_versions_track_id_idx").on(table.trackId),
    index("track_versions_status_idx").on(table.status),
    index("track_versions_version_number_idx").on(table.versionNumber),
  ],
);

export const trackArtists = pgTable(
  "track_artists",
  {
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),

    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),

    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.trackId, table.artistId] }),
    index("track_artists_artist_id_idx").on(table.artistId),
  ],
);

export const trackGenres = pgTable(
  "track_genres",
  {
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),

    genreId: uuid("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.trackId, table.genreId] }),
    index("track_genres_genre_id_idx").on(table.genreId),
  ],
);

export const trackVersionArtists = pgTable(
  "track_version_artists",
  {
    trackVersionId: uuid("track_version_id")
      .notNull()
      .references(() => trackVersions.id, { onDelete: "cascade" }),

    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),

    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.trackVersionId, table.artistId] }),
    index("track_version_artists_artist_id_idx").on(table.artistId),
  ],
);

export const tracksRelations = relations(tracks, ({ many }) => ({
  versions: many(trackVersions),
  trackArtists: many(trackArtists),
  trackGenres: many(trackGenres),
}));

export const trackVersionsRelations = relations(
  trackVersions,
  ({ one, many }) => ({
    track: one(tracks, {
      fields: [trackVersions.trackId],
      references: [tracks.id],
    }),
    trackVersionArtists: many(trackVersionArtists),
  }),
);

export const artistsRelations = relations(artists, ({ many }) => ({
  trackArtists: many(trackArtists),
  trackVersionArtists: many(trackVersionArtists),
}));

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
  track: one(tracks, {
    fields: [trackArtists.trackId],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [trackArtists.artistId],
    references: [artists.id],
  }),
}));

export const trackVersionArtistsRelations = relations(
  trackVersionArtists,
  ({ one }) => ({
    trackVersion: one(trackVersions, {
      fields: [trackVersionArtists.trackVersionId],
      references: [trackVersions.id],
    }),
    artist: one(artists, {
      fields: [trackVersionArtists.artistId],
      references: [artists.id],
    }),
  }),
);

export const genresRelations = relations(genres, ({ many }) => ({
  trackGenres: many(trackGenres),
}));

export const trackGenresRelations = relations(trackGenres, ({ one }) => ({
  track: one(tracks, {
    fields: [trackGenres.trackId],
    references: [tracks.id],
  }),
  genre: one(genres, {
    fields: [trackGenres.genreId],
    references: [genres.id],
  }),
}));

export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;

export type TrackVersion = typeof trackVersions.$inferSelect;
export type NewTrackVersion = typeof trackVersions.$inferInsert;

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;

export type TrackArtist = typeof trackArtists.$inferSelect;
export type NewTrackArtist = typeof trackArtists.$inferInsert;

export type TrackVersionArtist = typeof trackVersionArtists.$inferSelect;
export type NewTrackVersionArtist = typeof trackVersionArtists.$inferInsert;

export type Genre = typeof genres.$inferSelect;
export type NewGenre = typeof genres.$inferInsert;

export type TrackGenre = typeof trackGenres.$inferSelect;
export type NewTrackGenre = typeof trackGenres.$inferInsert;
