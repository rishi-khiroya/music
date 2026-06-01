import "./env";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import health from "./routes/health";
import tracks from "./routes/tracks";
import version from "./routes/version";

const app = new Hono();

app.route("/health", health);
app.route("/version", version);
app.route("/tracks", tracks);

serve({
  fetch: app.fetch,
  port: 3100,
});

console.log("music-api running on http://localhost:3100");
