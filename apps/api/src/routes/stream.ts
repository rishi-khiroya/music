import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { stream } from "hono/streaming";
import { db } from "../db/client.js";
import { trackVersions } from "../db/schema.js";
import { getAudioObject } from "../storage/stream.js";

const streamRoutes = new Hono();

streamRoutes.get("/:versionId", async (c) => {
  const versionId = c.req.param("versionId");

  const [version] = await db
    .select({
      id: trackVersions.id,
      objectKey: trackVersions.objectKey,
      format: trackVersions.format,
    })
    .from(trackVersions)
    .where(eq(trackVersions.id, versionId))
    .limit(1);

  if (!version) {
    return c.json({ error: "Track version not found" }, 404);
  }

  const audio = await getAudioObject(version.objectKey);

  c.header("Content-Type", audio.contentType);
  c.header("Accept-Ranges", "bytes");
  c.header("Cache-Control", "private, max-age=3600");

  if (audio.contentLength !== null) {
    c.header("Content-Length", audio.contentLength.toString());
  }

  return stream(c, async (stream) => {
    for await (const chunk of audio.body) {
      await stream.write(toStreamChunk(chunk));
    }
  });
});

function toStreamChunk(chunk: unknown): string | Uint8Array {
  if (typeof chunk === "string") {
    return chunk;
  }

  if (chunk instanceof Uint8Array) {
    return chunk;
  }

  if (chunk instanceof ArrayBuffer) {
    return new Uint8Array(chunk);
  }

  throw new Error("Unsupported stream chunk type");
}

export default streamRoutes;
