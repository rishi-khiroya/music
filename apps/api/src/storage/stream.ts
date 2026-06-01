import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";

import { s3 } from "./client.js";

const bucket = process.env.S3_BUCKET;

if (!bucket) {
  throw new Error("S3_BUCKET is required");
}

export type AudioObject = {
  body: Readable;
  contentLength: number | null;
  contentType: string;
};

export async function getAudioObject(objectKey: string): Promise<AudioObject> {
  const result = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
  );

  if (!result.Body) {
    throw new Error(`Object has no body: ${objectKey}`);
  }

  return {
    body: result.Body as Readable,
    contentLength: result.ContentLength ?? null,
    contentType: result.ContentType ?? getContentTypeFromKey(objectKey),
  };
}

function getContentTypeFromKey(objectKey: string): string {
  if (objectKey.endsWith(".wav")) {
    return "audio/wav";
  }

  if (objectKey.endsWith(".mp3")) {
    return "audio/mpeg";
  }

  return "application/octet-stream";
}
