import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const version = {
  version: process.env.APP_VERSION ?? "dev",
  commitSha: process.env.GIT_SHA ?? "unknown",
  environment: process.env.APP_ENV ?? "local",
  buildTime: process.env.BUILD_TIME ?? "unknown",
};

app.get("/version", (c) => {
  return c.json(version);
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "music-api",
  });
});

serve({
  fetch: app.fetch,
  port: 3100,
});

console.log("music-api running on http://localhost:3100");