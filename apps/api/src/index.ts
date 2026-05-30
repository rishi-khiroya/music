import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

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