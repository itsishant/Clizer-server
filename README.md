# Clizer Backend

Production-ready TypeScript backend for Clizer, a SaaS product that converts long-form videos into short-form vertical clips.

## Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Zod validation
- bcrypt password hashing
- JWT auth with refresh cookies
- Multer upload pipeline
- BullMQ + Redis optional queue support
- Vitest + Supertest tests

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
  routes/
  middlewares/
  utils/
  modules/
    auth/
      controllers/
      services/
      repository/
      routes/
      validators/
    users/
      controllers/
      services/
      repository/
      routes/
      validators/
    organizations/
      controllers/
      services/
      repository/
      routes/
      validators/
    workspaces/
      controllers/
      services/
      repository/
      routes/
      validators/
    projects/
      controllers/
      services/
      repository/
      routes/
      validators/
    uploads/
      controllers/
      services/
      repository/
      routes/
      validators/
    processing/
      controllers/
      services/
      repository/
      routes/
      validators/
    clips/
      controllers/
      services/
      repository/
      routes/
      validators/
    captions/
      controllers/
      services/
      repository/
      routes/
      validators/
    exports/
      controllers/
      services/
      repository/
      routes/
      validators/
    landing/
      controllers/
      services/
      repository/
      routes/
      validators/
    admin/
      controllers/
      services/
      repository/
      routes/
      validators/
prisma/
  schema.prisma
  seed.ts
  migrations/
```

## Environment Variables

Copy `.env.example` to `.env` and set values.

Required keys:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Auth Flow

- Access token is returned in JSON response
- Refresh token is set in httpOnly cookie at `/api/auth`
- Roles: `super_admin`, `org_admin`, `editor`, `viewer`

## Main API Groups

### Public

- `GET /api/public/landing`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Organizations and Workspaces

- `POST /api/organizations`
- `GET /api/organizations`
- `GET /api/organizations/:id`
- `POST /api/workspaces`
- `GET /api/workspaces/:id`
- `POST /api/workspaces/:id/invite`
- `GET /api/workspaces/:id/members`

### Projects and Videos

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/upload`
- `GET /api/projects/:id/status`

### Processing and Clips

- `POST /api/projects/:id/process`
- `GET /api/projects/:id/jobs`
- `GET /api/projects/:id/clips`
- `GET /api/clips/:id`
- `PATCH /api/clips/:id`
- `POST /api/clips/:id/captions`
- `POST /api/clips/:id/export`
- `GET /api/exports/:id`

### Admin

- `GET /api/admin/landing`
- `PUT /api/admin/landing/hero`
- `PUT /api/admin/landing/marquee`
- `PUT /api/admin/landing/features`
- `PUT /api/admin/landing/workflow`
- `PUT /api/admin/landing/testimonials`
- `PUT /api/admin/landing/stats`
- `GET /api/admin/users`
- `GET /api/admin/projects`
- `GET /api/admin/jobs`

## Landing Response Shape

`GET /api/public/landing` returns the exact frontend-compatible structure with these top-level keys:

- `hero`
- `marquee`
- `features`
- `workflow`
- `testimonials`
- `stats`

Seeded content matches the requested payload for Clizer landing page sections.

## Sample Requests

### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Akash",
  "email": "akash@example.com",
  "password": "StrongPass@123",
  "organizationName": "Akash Media",
  "workspaceName": "Growth Team"
}
```

### Create Project

```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "workspaceId": "workspace_id",
  "title": "Founder Podcast Episode",
  "description": "Repurpose episode into shorts",
  "platformTargets": ["youtube_shorts", "tiktok", "instagram_reels"]
}
```

### Upload Source Video

```http
POST /api/projects/:id/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

video=<binary-file>
```

### Trigger Processing

```http
POST /api/projects/:id/process
Authorization: Bearer <access_token>
```

### Update Landing Hero (Admin)

```http
PUT /api/admin/landing/hero
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "brand": "Clizer",
  "badge": "Built for creators and media teams",
  "title": "Turn Every Long Video Into High-Performing Shorts",
  "subtitle": "From podcasts to webinars, Clizer finds the strongest moments and delivers ready-to-post vertical clips with captions and clean framing.",
  "primaryCta": "Start Free Trial",
  "secondaryCta": "See Product Tour",
  "trustText": "No credit card required. Export in 1080p.",
  "nav": [
    { "label": "Features", "href": "#features" },
    { "label": "Workflow", "href": "#workflow" },
    { "label": "Testimonials", "href": "#testimonials" },
    { "label": "Results", "href": "#pricing" }
  ],
  "clipSource": "founder-podcast-episode-42.mp4",
  "clipCountText": "12 strong short clips detected",
  "clips": [
    "Opening hook at 01:10 - 00:33",
    "Core insight at 12:48 - 00:44",
    "Story segment at 26:14 - 00:52"
  ],
  "metrics": [
    "Cut editing time by 70%",
    "Publish 3x more clips per week",
    "Optimized for Shorts, Reels, and TikTok"
  ]
}
```

## Tests

Run:

```bash
npm test
```

Included baseline tests:

- signup and login endpoints
- public landing endpoint
- admin landing update endpoint
- project creation endpoint
- upload route invalid mime validation
- protected admin route access control
