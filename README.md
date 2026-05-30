# music

Personal music hosting app for demos, WIPs, and versioned tracks.

This is not a social platform. It is a small full-stack app for uploading WAV/MP3 files, managing track versions, and sharing private/public streaming links.

## Stack

- Frontend: SolidJS + Vite + TypeScript
- Backend: Hono + TypeScript
- Monorepo: Turborepo + pnpm
- Future database: Postgres + Drizzle
- Future object storage: MinIO

## Workspace

```text
apps/
  web/   Solid frontend
  api/   Hono API

packages/
  eslint-config/
  typescript-config/
  shared/
  db/
```

## Development

Install dependencies:

```
pnpm install
```

Run all apps:

```
pnpm dev
```

Run only the web app:

```
pnpm dev --filter=web
```

Run only the API:

```
pnpm dev --filter=@music/api
```

## API

Health check:

```
curl http://localhost:3100/health
```

Expected response:

```
{
  "status": "ok",
  "service": "music-api"
}
```

## Initial Scope
- Tracks
- Track versions
- WAV/MP3 upload
- Audio streaming
- Share links
- Private admin area

## Not in Scope Yet
- Comments
- Likes
- Public user accounts
- Playlists
- Stems
- Project files
- Social/discovery features