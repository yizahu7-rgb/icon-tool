# Codex Handoff

This document is the project handoff for continuing the same work on another computer with Codex.

## Project

LucideUI Icon库 is a Vite + React + TypeScript icon library tool.

Main capabilities:

- Browse and copy Lucide-style icons.
- Change icon size and stroke width.
- Generate custom SVG icons with Gemini through a Vercel serverless API.
- Sync each user's own icon library state with Firebase Anonymous Auth + Firestore.

## Repository

GitHub remote:

```bash
https://github.com/yizahu7-rgb/icon-tool.git
```

Main branch:

```bash
main
```

Current important commits:

- `a5f9a93` Create deployable icon tool
- `10e7feb` Use Gemini 3 Flash for icon generation
- `05a6c90` Add Gemini model fallback

## Continue On Another Computer

If the project is not on the other computer yet:

```bash
git clone https://github.com/yizahu7-rgb/icon-tool.git
cd icon-tool
npm install
npm run dev
```

If the project already exists on the other computer:

```bash
cd icon-tool
git pull
npm install
npm run dev
```

Then open the local URL shown by Vite, usually:

```bash
http://127.0.0.1:5173
```

## Local Environment

The file `.env.local` is intentionally not committed to GitHub. Create it on each computer from `.env.example`.

Required variables:

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

For this project, the Firebase project is `yizalucky`. Use the Firebase Web App config from Firebase Console.

`GEMINI_API_KEY` is a server-side secret. Do not commit it and do not add a `VITE_` prefix.

For Vercel production, set it in:

```text
Vercel Project -> Settings -> Environment Variables
```

For local testing of Vercel API routes, install/use Vercel CLI and put `GEMINI_API_KEY` in local env.

## Firebase

Firebase setup used in this project:

- Authentication: Anonymous sign-in enabled.
- Firestore Database enabled.
- Each user has their own private synced library.

Firestore path used by the app:

```text
artifacts/{appId}/users/{user.uid}/icon_app_state/main
```

Firestore rules:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/icon_app_state/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

These rules mean every colleague gets their own icon library state. They do not share one global library.

## Vercel

The project is deployed through Vercel from GitHub.

Expected build settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: ./
```

After pushing to GitHub:

```bash
git push origin main
```

Vercel should automatically deploy the new version.

## Gemini

AI generation is handled by:

```text
api/generate-icon.ts
```

Current model fallback order:

```ts
gemini-3-flash-preview
gemini-3.1-flash-lite-preview
gemini-3.1-flash-lite
```

Reason:

- `Gemini 3.1 Pro` showed `0 / 0` quota in Google AI Studio, so it cannot be called with the current API key.
- `Gemini 3 Flash` has better quality than 2.5 in testing, but a small daily quota.
- `Gemini 3.1 Flash Lite` is used as fallback because the quota is larger.

The frontend sends icon instructions and optional compressed image data to `/api/generate-icon`. The API key stays on Vercel and is never exposed to the browser.

## Common Issues

### Vercel or GitHub says the access token cannot be refreshed

This is a login/session issue, not a code issue.

Fix:

1. Log out of the affected service.
2. Log in again.
3. Retry the action.

### AI says quota exceeded

This usually means the selected Gemini model hit RPM/RPD limits. The backend will now try fallback models automatically, but if all available quotas are exhausted, wait until the quota resets or use a paid/billing-enabled Google AI Studio project.

### Local app opens but sync does not work

Check:

- `.env.local` exists on that computer.
- Firebase variables are filled.
- Firebase Anonymous Auth is enabled.
- Firestore rules are published.

### Local AI endpoint does not work with `npm run dev`

`npm run dev` runs the Vite frontend. Vercel serverless API routes are best tested with:

```bash
vercel dev
```

## How To Work Safely Across Two Computers

Before starting work on either computer:

```bash
git pull
```

After finishing work:

```bash
git add .
git commit -m "Describe the change"
git push
```

Then on the other computer:

```bash
git pull
```

## Note For The Next Codex Session

Read this file first, then inspect the current git status.

```bash
git status --short
git log --oneline -8
```

Do not delete `styles.css` unless the user confirms it is unused. It has appeared as an untracked file in this workspace.
