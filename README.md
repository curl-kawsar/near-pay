# NearPay

Proximity payments with **Room link** (session code over your network) and **Sound wave** (near-silent audio between devices).

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- [quiet-js](https://github.com/quiet/quiet-js/) for sound-wave mode

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### LAN / mobile testing

```bash
bun run dev          # listens on 0.0.0.0
bun run dev:https      # HTTPS for microphone on phones
```

Add your machine IP to `allowedDevOrigins` in `next.config.ts` if needed.

## Modes

| Mode | Hosting |
|------|---------|
| **Room link** | Next.js server required (API + SSE) |
| **Sound wave** | App must be served to load quiet-js assets; transfer is browser-only |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Development server |
| `bun run dev:https` | Dev with HTTPS |
| `bun run build` | Production build |
| `bun run start` | Production server |
