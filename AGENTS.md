# AGENTS.md

This file is for Codex or any coding agent continuing work in this repository.

## Mandatory Context Order

Project memory lives in the repository, not in old chat history. Before changing icons or generation behavior, read these files completely in this order:

1. `PROJECT_CONTEXT.md`
2. `ICON_REDRAW_STANDARD.md`
3. `ICON_REDRAW_PROGRESS.md`
4. `HANDOFF.md`
5. this file

For batch work, only process the current group recorded in the progress file, then build, refresh the local preview, and wait for user confirmation. Do not infer completion from automated checks.

## Project Summary

`icon-tool` / `FS后台设计 Icon库` is a deployable internal React tool. Teammates can browse and filter a source-matched AntChain/SDICS line-icon library, copy or download icons, tune size, stroke width, and geometric corner radius, and generate custom SVG icons from text or reference images.

## Stack

- Frontend: Vite, React, TypeScript
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Icons: source-derived editable AntChain/SDICS paths for the base library; `lucide-react` for application chrome
- Cloud state: Firebase Anonymous Auth + Firestore
- AI generation: Vercel Serverless Function calling Google Gemini API
- Hosting: Vercel, connected to GitHub

Important files:

- `src/App.tsx`: app UI, Firebase sync, icon state, AI generation flow, SVG validation.
- `api/generate-icon.ts`: Gemini request and model fallback.
- `api/models.ts`: protected model diagnostics endpoint.
- `firestore.rules`: per-user Firestore security rules.
- `.env.example`: local and Vercel environment variable template.
- `README.md`: setup and deployment instructions.
- `HANDOFF.md`: current continuation notes.
- `CODEX_HANDOFF.md`: older handoff document retained for history.

## Repository

Remote: `https://github.com/yizahu7-rgb/icon-tool.git`

Primary branch: `main`

GitHub is the code sync layer. Project memory belongs in committed Markdown files. Never copy `~/.codex` between machines because it can contain tokens, sessions, caches, and plugin state.

## Architecture Decisions

### Per-user icon libraries

The product requirement is “每个人自己的库”. Firebase Anonymous Auth stores state at:

```text
artifacts/{appId}/users/{user.uid}/icon_app_state/main
```

Do not change this to a shared global collection unless the user explicitly asks.

### Server-side Gemini key

`GEMINI_API_KEY` must exist only in Vercel or the local server environment used by `vercel dev`. Never prefix Gemini secrets with `VITE_` and never commit real keys.

The browser calls `POST /api/generate-icon`; the serverless function calls Gemini.

### Gemini fallback

Default order (keep this synchronized with `api/generate-icon.ts`):

```text
gemini-3.1-flash-lite-preview
gemini-3-flash-preview
gemini-3.1-flash-lite
```

The user prefers Gemini 3-family output and does not want Gemini 2.5 unless they later request it. The server-side `GEMINI_MODELS` variable can override the list with comma-separated model names. One UI action makes one frontend request; the server alone handles fallback.

### Generated SVG trust boundary

Gemini output is untrusted. New generation follows `FS-LINE-2026.09` from `src/icon-generation-standard.ts`: exactly one `<path>`, absolute commands, `fill="none"`, no extra attributes, and geometry contained in the 24×24 viewBox. Do not loosen this contract to accommodate a model response; change the prompt or reject the result. Legacy stored icons intentionally retain the broader safe parser so an upgrade does not hide existing user data.

### Model diagnostics

`GET /api/models` is disabled unless `GEMINI_MODELS_DEBUG_TOKEN` exists and the request sends `Authorization: Bearer <token>`. Do not make this route public by default.

## Local Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Use `vercel dev` when testing API routes locally. The plain Vite development server does not emulate Vercel functions.

## Environment Variables

Client-side Firebase variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_APP_ID=yizalucky-icon-tool
```

Server-side variables:

```env
GEMINI_API_KEY=
GEMINI_MODELS=
GEMINI_MODELS_DEBUG_TOKEN=
```

`.env.local` is ignored and must be recreated on each computer. The Firebase project used during setup was `yizalucky`.

## Product And Design Context

- Audience: internal teammates using the tool during product and engineering work.
- Core jobs: quickly find, inspect, copy, download, tune, and generate icons.
- Tone: practical, dense, clear, and dependable; this is not a marketing site.
- Keep maintenance and deployment simple.
- Preserve light and dark modes and critical mobile functionality.
- Keep model/quota failures understandable; a quota error does not necessarily indicate broken code.

## Development Guidance

- Start with `git status --short` and `git log --oneline -8`.
- Keep changes scoped; avoid large abstractions in this compact app.
- Put provider/model behavior in `api/generate-icon.ts`, not browser code.
- Keep Firestore rules aligned with the document path used by `src/App.tsx`.
- Run `npm run build` before pushing deployable changes.
- If environment variables change, update `.env.example`, `README.md`, `HANDOFF.md`, and deployment instructions together.
- Do not delete unrelated or untracked files without confirming ownership and purpose.

## Deployment

Vercel settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

Pushing `main` should trigger Vercel deployment.

## Suggested Next Improvements

- Add icon library export/import so anonymous users can migrate data across browsers.
- Add real login only if cross-device identity is required.
- Consider a separate shared team library mode without changing the existing personal library default.
- Add automated tests for SVG validation and Gemini fallback behavior.
- Split the Firebase-heavy application bundle if load performance becomes a problem.
