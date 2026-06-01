import { sql, type SQL } from "drizzle-orm";
import { tracks } from "../../db/schema";
import type { CursorPayload, TrackOrder } from "./types";

export function encodeCursor(cursor: CursorPayload): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

export function parseCursor(value: string | undefined): CursorPayload | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<CursorPayload>;

    return typeof parsed.id !== "string" ||
      (parsed.order !== "newest" &&
        parsed.order !== "oldest" &&
        parsed.order !== "title")
      ? null
      : (parsed as CursorPayload);
  } catch {
    return null;
  }
}

export function getCursorFilter(
  cursor: CursorPayload,
  order: TrackOrder,
): SQL | undefined {
  if (order === "title") {
    if (!cursor.title) return undefined;

    return sql`
      (${tracks.title}, ${tracks.id})
      > (${cursor.title}, ${cursor.id}::uuid)
    `;
  }

  if (!cursor.createdAt) return undefined;

  if (order === "oldest")
    return sql`
      (${tracks.createdAt}, ${tracks.id})
      > (${cursor.createdAt}::timestamptz, ${cursor.id}::uuid)
    `;

  return sql`
    (${tracks.createdAt}, ${tracks.id})
    < (${cursor.createdAt}::timestamptz, ${cursor.id}::uuid)
  `;
}
