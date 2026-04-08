# Linea

Linea is a modern timeline visualization app built with Next.js, React, TypeScript, Tailwind CSS, and Google integrations. It helps users create, edit, and share event timelines with calendar sync, cloud storage, and export options.

## Key Features

- Google authentication via `next-auth`
- Sync timeline data to Google Drive as a JSON file
- Import Google Calendar events into timelines
- Create, edit, and delete event timelines
- Add point or interval events with optional links, descriptions, and colors
- Export timelines as JSON, Excel, or image
- Embed shared timelines using Vercel KV-backed links
- Client-side timeline navigation with smooth panning and zoom controls

## Tech Stack

- Next.js 16.1.4
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- Zustand for client state management
- next-auth for Google sign-in and session handling
- googleapis for Google Drive and Google Calendar integration
- @vercel/kv for embedded timeline storage
- xlsx-js-style for Excel export
- html-to-image for PNG export

## Project Structure

```text
app/
  layout.tsx             # Root layout and font metadata
  (home)/
    page.tsx             # Main timeline dashboard
    components/         # Timeline UI building blocks
  settings/page.tsx      # Account settings and integrations page
  api/
    auth/[...nextauth]/route.ts   # next-auth Google auth route
    drive/route.ts                # Google Drive data sync API
    calendar/route.ts             # Google Calendar API fetch
    embed/route.ts                # Embed storage API
  embed/[id]/page.tsx    # Embedded timeline viewer
config/env.ts            # Environment validation
data/
  export/index.ts        # Export helpers (JSON, Excel, PNG)
  import/index.ts        # JSON import helper
global/
  components/            # Shared UI components and providers
  constants/             # Shared app constants
  types/                 # Timeline/event type definitions
hooks/
  useDrive.ts            # Drive sync hook
stores/
  timeline-store.ts      # Zustand timeline app state
utils/
  date_methods.ts        # Date helpers
  slider_methods.ts      # Timeline scroll/selection helpers
```

## Pages and Routes

### `/`

Main dashboard for viewing the selected timeline:

- Timeline rendered by `app/(home)/page.tsx`
- Timeline selection and management with `TopicMenu`
- Timeline controls for navigation, zoom, and event creation
- Event detail panels and inline editing via marks

### `/settings`

Account and integrations page:

- Sign in with Google if unauthenticated
- View sync status and last Google Drive update
- Import Google Calendar events
- Sync or wipe stored timeline data
- Theme preview and future theme placeholder

### `/embed/[id]`

Embedded timeline viewer:

- Loads a shared timeline by ID from `/api/embed`
- Uses Vercel KV or local mock KV in development
- Read-only embedded experience with timeline navigation

## API Endpoints

- `app/api/auth/[...nextauth]/route.ts`
  - Google OAuth provider
  - JWT session strategy
  - token refresh for Google access tokens

- `app/api/drive/route.ts`
  - `GET` reads the saved JSON timeline file from Google Drive
  - `POST` creates or updates the Drive JSON file
  - `DELETE` trashes the Drive JSON file

- `app/api/calendar/route.ts`
  - Fetches primary Google Calendar events in a +/-5-year window
  - Converts calendar events into timeline events in the settings panel

- `app/api/embed/route.ts`
  - `POST` stores timeline data in KV and returns an embed ID
  - `GET` retrieves stored embed data by ID

## Data Model

Shared types are defined in `global/types/index.ts`:

- `Timeline`
  - `id: string`
  - `name: string`
  - `events: Event[]`

- `Event`
  - `id: string`
  - `name: string`
  - `initialDate: Date`
  - `endDate?: Date`
  - `link?: string`
  - `description?: string`
  - `color?: string`

- `DateSelection`
  - current year/month selection and UI state

## State Management

`stores/timeline-store.ts` contains the core UI state and interactions:

- current timeline selection
- timeline date range and zoom level
- drag/pan scrolling and wheel navigation
- event modal open/edit state
- last Google Drive sync timestamp
- client-side event creation and editing logic

## Sync and Integration

- Google Drive sync is handled by `hooks/useDrive.ts`
- Timeline data is saved to a single Drive JSON file named by `DRIVE_DATA_FILE_NAME`
- Google Calendar import is triggered from `app/settings/components/SettingsPanel.tsx`
- Authentication is required before reading or writing Drive data

## Import / Export

- JSON import: `data/import/index.ts`
- JSON export: `data/export/index.ts`
- Excel export with styled headers using `xlsx-js-style`
- PNG export using `html-to-image`

## Utilities

- `utils/date_methods.ts`
  - addDays, subtractDays, differenceInDays, differenceInHours
  - checkIfSameDate

- `utils/slider_methods.ts`
  - smooth scroll to a selected month/year
  - update visible date based on scroll position

## Styling and Assets

- Application uses Tailwind CSS via `postcss.config.mjs`
- Fonts loaded with `next/font` in `app/layout.tsx`
- Shared CSS in `app/globals.css`
- Asset directories include images, icons, and theme art

## Environment Variables

Required values:

- `GOOGLE_AUTH_CLIENT_ID`
- `GOOGLE_AUTH_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Optional:

- `DRIVE_DATA_FILE_NAME` (defaults to `Linea_Data`)

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Development Notes

- `app/(home)/components/TopicMenu.tsx` manages timeline creation, rename, import, export, and delete actions.
- `app/(home)/components/EventModal/index.tsx` is the event editor for adding and updating timeline events.
- `app/api/embed/_kv.ts` uses a local mock KV store in development and Vercel KV in production.
- `app/(home)/components/Timeline/index.tsx` renders timeline marks and timeline scroll behavior.

---

For more details on the app internals, inspect the `app/`, `global/`, `stores/`, and `data/` directories.
