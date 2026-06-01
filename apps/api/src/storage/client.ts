import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION ?? "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

if (!endpoint) {
  throw new Error("S3_ENDPOINT is required");
}

if (!accessKeyId) {
  throw new Error("S3_ACCESS_KEY_ID is required");
}

if (!secretAccessKey) {
  throw new Error("S3_SECRET_ACCESS_KEY is required");
}

export const s3 = new S3Client({
  endpoint,
  region,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});