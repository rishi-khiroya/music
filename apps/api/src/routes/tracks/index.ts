import { Hono } from "hono";
import { parseCursor } from "./cursor";
import { getTrackBySlug, listTracks } from "./queries";
import {
  DEFAULT_TRACK_LIMIT,
  MAX_TRACK_LIMIT,
  type TrackListQuery,
} from "./types";
import { cleanQueryValue, parsePositiveInt, parseTrackOrder } from "./utils";

export const tracks = new Hono();

tracks.get("/", async (c) => {
  const query: TrackListQuery = {
    artist: cleanQueryValue(c.req.query("artist")) ?? undefined,
    genre: cleanQueryValue(c.req.query("genre")) ?? undefined,

    limit: Math.min(
      parsePositiveInt(c.req.query("limit"), DEFAULT_TRACK_LIMIT),
      MAX_TRACK_LIMIT,
    ),
    cursor: parseCursor(c.req.query("cursor")),
    order: parseTrackOrder(c.req.query("order")),
  };

  return c.json(await listTracks(query));
});

tracks.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const track = await getTrackBySlug(slug);

  if (!track) {
    return c.json({ error: "Track not found" }, 404);
  }
  return c.json(track);
});

export default tracks;
