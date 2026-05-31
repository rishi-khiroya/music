CREATE TABLE "artists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "track_artists" (
	"track_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	CONSTRAINT "track_artists_track_id_artist_id_pk" PRIMARY KEY("track_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "track_genres" (
	"track_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	CONSTRAINT "track_genres_track_id_genre_id_pk" PRIMARY KEY("track_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "track_version_artists" (
	"track_version_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	CONSTRAINT "track_version_artists_track_version_id_artist_id_pk" PRIMARY KEY("track_version_id","artist_id")
);
--> statement-breakpoint
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_genres" ADD CONSTRAINT "track_genres_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_genres" ADD CONSTRAINT "track_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_version_artists" ADD CONSTRAINT "track_version_artists_track_version_id_track_versions_id_fk" FOREIGN KEY ("track_version_id") REFERENCES "public"."track_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_version_artists" ADD CONSTRAINT "track_version_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artists_name_idx" ON "artists" USING btree ("name");--> statement-breakpoint
CREATE INDEX "genres_name_idx" ON "genres" USING btree ("name");--> statement-breakpoint
CREATE INDEX "track_artists_artist_id_idx" ON "track_artists" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "track_genres_genre_id_idx" ON "track_genres" USING btree ("genre_id");--> statement-breakpoint
CREATE INDEX "track_version_artists_artist_id_idx" ON "track_version_artists" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "track_versions_track_id_idx" ON "track_versions" USING btree ("track_id");--> statement-breakpoint
CREATE INDEX "track_versions_status_idx" ON "track_versions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "track_versions_version_number_idx" ON "track_versions" USING btree ("version_number");--> statement-breakpoint
CREATE INDEX "tracks_title_idx" ON "tracks" USING btree ("title");--> statement-breakpoint
CREATE INDEX "tracks_bpm_idx" ON "tracks" USING btree ("bpm");--> statement-breakpoint
CREATE INDEX "tracks_musical_key_idx" ON "tracks" USING btree ("musical_key");--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN "artist";--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN "genre";