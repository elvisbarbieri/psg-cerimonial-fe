# Patricia Garcia Cerimonialista — Website

Marketing site built with **Next.js**. Page content and media come from a backend API. The contact form is submitted on the server so API keys never reach the browser.

## Requirements

- Node.js 20+ (22 recommended)
- npm
- API credentials (provided separately — not in this repo)

## Setup

```bash
git clone <repository-url>
cd cerimonial-psg
npm ci
cp .env.example .env.local
```

Edit `.env.local` with the content and contact API URL and keys you received from the project owner.

Do **not** commit `.env.local`.

## Run locally

```bash
npm run run:local
```

Open http://localhost:3000

Production-like build on your machine:

```bash
npm run run:prod
```

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run run:local` | Free port 3000, clean `.next`, start dev |
| `npm run run:prod` | Free port 3000, clean, build, start |
| `npm run kill` | Free port 3000 if a stale process is stuck |
| `npm run lint` | ESLint |

## Project layout

```text
src/app/          Pages and server actions
src/components/   UI sections
src/lib/          API client and helpers
.env.example      Variable names only (no real keys)
```

Deploy scripts and detailed hosting notes live outside git (`scripts/`, `docs/`). Ask the maintainer for access.

## Security

- Keep API keys in `.env.local` (local) or your host’s environment settings (production).
- Only `.env.example` belongs in version control — placeholders, no real secrets.

## License

Private project — all rights reserved.
