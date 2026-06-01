import { Hono } from "hono";

export const version = new Hono();

version.get("/", (c) => {
  return c.json({
    version: process.env.APP_VERSION ?? "dev",
    commitSha: process.env.GIT_SHA ?? "unknown",
    environment: process.env.APP_ENV ?? "local",
    buildTime: process.env.BUILD_TIME ?? "unknown",
  });
});

export default version;