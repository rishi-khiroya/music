CREATE TYPE "public"."track_version_status" AS ENUM('wip', 'demo', 'id', 'release_candidate', 'released', 'archived');--> statement-breakpoint
CREATE TABLE "track_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"track_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"version_number" integer NOT NULL,
	"object_key" text NOT NULL,
	"format" varchar(10) NOT NULL,
	"status" "track_version_status" DEFAULT 'wip' NOT NULL,
	"duration_seconds" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"artist" varchar(120) NOT NULL,
	"genre" varchar(80),
	"musical_key" varchar(40),
	"bpm" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	CONSTRAINT "tracks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "track_versions" ADD CONSTRAINT "track_versions_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;