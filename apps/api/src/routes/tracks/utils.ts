import type { TrackOrder } from "./types";

export function parsePositiveInt(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return !Number.isFinite(parsed) || parsed < 1 ? fallback : parsed;
}

export function parseTrackOrder(value: string | undefined): TrackOrder {
  return value === "oldest" || value === "title" ? value : "newest";
}

export const cleanQueryValue = (
  value: string | undefined,
): string | undefined => value?.replace(/^"|"$/g, "");
