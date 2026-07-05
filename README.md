# ResuMind — ATS Resume Platform

> Build, score, optimize, and tailor ATS-ready resumes with deterministic scoring, AI-assisted improvements, LaTeX rendering, and server-side PDF export.

**By Pallavi Thakur | All Rights Reserved**

Copyright (c) 2024 Pallavi Thakur. All rights reserved.

This source code is the proprietary property of Pallavi Thakur. Unauthorized copying, modification, or distribution is prohibited.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [PDF Generation](#pdf-generation)
- [Font System](#font-system)
- [LaTeX Compilation](#latex-compilation)
- [ATS Scoring Engine](#ats-scoring-engine)
- [Export Formats](#export-formats)
- [Page Sizes](#page-sizes)
- [Deployment on Vercel](#deployment-on-vercel)
- [Notes & Limitations](#notes--limitations)
- [License](#license)

---

## Overview

ResuMind is a production-grade ATS (Applicant Tracking System) resume platform. It combines a **deterministic scoring engine** (AI explains scores but never invents them) with **AI-assisted content optimization**, real LaTeX compilation, and server-side PDF rendering — all in a single Next.js application.

The app is designed to run on Vercel's serverless platform, using `@sparticuz/chromium` + `puppeteer-core` for headless PDF generation without the full Puppeteer download.

---

## Features

### Resume Builder
- 8 ATS-friendly templates (modern, professional, minimal, academic, engineer, pm, datasci, designer)
- Live preview with instant updates
- Drag-and-drop section reordering (powered by @dnd-kit)
- 4 font families (Inter, Geist, Serif/Lora, Mono/JetBrains Mono)
- 3 spacing modes (compact, normal, relaxed)
- Customizable accent colors

### ATS Checker
- **100% deterministic scoring** — AI explains scores, never invents them
- 6 weighted sub-scores (keyword, formatting, sections, semantic, readability, grammar)
- Section-by-section pass/warn/fail checks
- Missing keyword detection
- Action verb and weak phrase analysis
- Quantified bullet counting
- Readability grade level

### Job Matcher
- Keyword matching against job descriptions
- Semantic similarity scoring
- Required technology detection
- Seniority and experience level matching
- Skill gap analysis

### AI Optimizer
- Rewrite professional summaries
- Improve bullet points (STAR method + metrics)
- Tailor resume to specific job descriptions
- Cover letter generation (multiple tones)

### LaTeX Studio
- Real LaTeX source generation (3 variants: Jake's, ModernCV, AltaCV)
- Server-side PDF compilation
- Overleaf-ready `.tex` export
- Syntax-highlighted code preview

### PDF Export
- Server-side rendering via `@sparticuz/chromium` + `puppeteer-core`
- 6 page sizes (US Letter, A4, US Legal, A3, Tabloid, Executive)
- Google Fonts embedding (Lora, JetBrains Mono, Inter, Geist)
- ATS-friendly single-column layout

### Resume Management
- Create, rename, duplicate, delete resumes
- 20 sample templates (B.Tech, B.Sc, BBA, MBA, LLB, MCA, B.Com, B.Arch, MBBS, B.Des, and more)
- PDF import — upload a PDF resume and AI structures it into editable fields
- Version manager — save and restore snapshots
- Application tracker — track job applications (saved, applied, interview, offer, rejected)

### UX
- Command palette (⌘K) for quick navigation
- Dark/light theme with system detection
- Keyboard shortcuts (number keys to switch views)
- Toast notifications
- Responsive design

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Database** | PostgreSQL (Neon) via Prisma ORM |
| **AI** | Hugging Face Router (`openai/gpt-oss-120b:cerebras`) via OpenAI SDK |
| **PDF Rendering** | `puppeteer-core` + `@sparticuz/chromium` (Vercel-compatible) |
| **LaTeX Compilation** | Remote `pdflatex` API (latexonline.net) + Chromium-rendered fallback |
| **PDF Text Extraction** | `unpdf` |
| **State Management** | Zustand (persisted to localStorage) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Theming** | next-themes |

---

## Project Structure

```
resumind/
├── prisma/
│   └── schema.prisma              # Prisma schema (User, Resume, ATSReport, JobDescription, etc.)
├── public/
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/route.ts        # AI endpoints (optimize, structure, chat, cover letter)
│   │   │   ├── ats/route.ts       # Deterministic ATS scoring + AI explanation
│   │   │   ├── latex-pdf/route.ts # LaTeX → PDF (remote pdflatex + Chromium fallback)
│   │   │   ├── match/route.ts     # Job description matching
│   │   │   ├── pdf/route.ts       # HTML → PDF (Chromium)
│   │   │   ├── resumes/route.ts   # Resume CRUD
│   │   │   └── upload/route.ts    # PDF upload + text extraction + AI structuring
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main entry — renders views based on store state
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── utils/
│   │   ├── views/                 # 10 feature views
│   │   │   ├── dashboard.tsx
│   │   │   ├── builder.tsx
│   │   │   ├── ats-checker.tsx
│   │   │   ├── matcher.tsx
│   │   │   ├── optimizer.tsx
│   │   │   ├── cover-letter.tsx
│   │   │   ├── versions.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── latex.tsx
│   │   │   └── applications.tsx
│   │   ├── app-shell.tsx          # Layout + sidebar + keyboard shortcuts
│   │   ├── export-bar.tsx
│   │   ├── export-modal.tsx       # 5 export formats + 6 page sizes
│   │   ├── resume-preview.tsx     # 8 template renderers
│   │   ├── resume-manager.tsx
│   │   ├── sample-gallery.tsx     # 20 sample templates
│   │   ├── command-palette.tsx
│   │   ├── score-gauge.tsx
│   │   ├── hydration-gate.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── ai.ts                  # HF Router AI client (JSON mode)
│   │   ├── ats.ts                 # Deterministic scoring engine
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── export.ts              # LaTeX, PDF (HTML), JSON, DOCX exports + font config
│   │   ├── pdf.ts                 # puppeteer-core + @sparticuz/chromium PDF generation
│   │   ├── store.ts               # Zustand store (persisted)
│   │   ├── sample-data.ts
│   │   ├── sample-resumes.ts      # 20 branch-specific samples
│   │   ├── types.ts               # Domain types
│   │   └── utils.ts               # cn() helper
│   └── hooks/
│       ├── use-mobile.ts
│       └── use-toast.ts
├── next.config.ts                 # serverExternalPackages for Chromium
├── vercel.json                    # Function memory + duration config
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json                # shadcn/ui config
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1.0+
- A PostgreSQL database (recommended: [Neon](https://neon.tech/) — free tier)
- A Hugging Face access token (for AI features)

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
HF_TOKEN="hf_<your-huggingface-token>"
```

> **Note:** `DATABASE_URL` must start with `postgresql://` or `postgres://`.

### 3. Set up the database

```bash
bun run db:push
```

This creates all tables defined in `prisma/schema.prisma`.

### 4. Start the development server

```bash
bun run dev
```

The app runs at `http://localhost:3000`.

### 5. (Optional) Install a local Chrome/Chromium for development

In development, the PDF engine prefers a local Chrome/Chromium installation for the full feature set (fonts, GPU). If none is found, it automatically falls back to `@sparticuz/chromium`.

- **Linux:** `sudo apt install chromium` or install Google Chrome
- **macOS:** Install Google Chrome from [google.com/chrome](https://www.google.com/chrome/)
- **Windows:** Install Google Chrome

You can also force a specific executable path:

```env
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (must start with `postgresql://`) |
| `HF_TOKEN` | Yes | Hugging Face access token for AI features |
| `PUPPETEER_EXECUTABLE_PATH` | No | Override the local Chrome/Chromium path in development |
| `CHROME_PATH` | No | Alias for `PUPPETEER_EXECUTABLE_PATH` |

> On Vercel, `VERCEL` and `VERCEL_ENV` are set automatically by the platform — no manual configuration needed.

---

## Database

The app uses Prisma ORM with PostgreSQL. The schema includes:

| Model | Description |
|-------|-------------|
| `User` | User accounts (email, name, avatar, role) |
| `Resume` | Resume documents with JSON-serialized `ResumeData` |
| `ResumeVersion` | Saved snapshots of resume data |
| `ATSReport` | ATS scoring reports (6 sub-scores + details JSON) |
| `JobDescription` | Saved job descriptions for matching |
| `CoverLetter` | AI-generated cover letters |
| `AIConversation` | Chat conversation history |
| `ActivityLog` | User activity audit trail |

To modify the schema, edit `prisma/schema.prisma` and run:

```bash
bun run db:push     # Push schema changes
bun run db:generate # Regenerate Prisma Client
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start the development server (port 3000) |
| `bun run build` | Build for production (standalone output) |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push schema to database |
| `bun run db:generate` | Generate Prisma Client |
| `bun run db:migrate` | Create and apply a migration |
| `bun run db:reset` | Reset the database (destructive) |

---

## API Reference

All API routes use the Next.js App Router and run on the Node.js runtime.

### `POST /api/pdf`
Generates an ATS-friendly PDF from a resume document.

**Request body:**
```json
{
  "doc": ResumeDocument,
  "pageSize": "letter" | "a4" | "legal" | "a3" | "tabloid" | "executive"
}
```

**Response:** `application/pdf` binary

**Runtime:** Node.js, `maxDuration: 60s`

---

### `POST /api/latex-pdf`
Generates a PDF from the LaTeX (Jake's template) source.

**Request body:**
```json
{
  "doc": ResumeDocument,
  "variant": "jake" | "moderncv" | "altacv",
  "pageSize": "letter"
}
```

**Response:** `application/pdf` binary

**Headers:** `X-LaTeX-Compiled: pdflatex` (remote) or `X-LaTeX-Compiled: rendered` (Chromium fallback)

**Runtime:** Node.js, `maxDuration: 120s`

---

### `POST /api/ats`
Runs deterministic ATS scoring on a resume (optionally against a job description).

**Request body:**
```json
{
  "doc": ResumeDocument,
  "jobDesc": "optional job description text"
}
```

**Response:** `ATSReport` JSON with 6 sub-scores + AI explanation

---

### `POST /api/match`
Matches a resume against a job description.

**Request body:**
```json
{
  "doc": ResumeDocument,
  "jobDesc": "job description text"
}
```

**Response:** `MatchResult` JSON (overall match %, keyword match, semantic similarity, missing skills, recommendations)

---

### `POST /api/ai`
AI-powered features (optimize, structure, chat, cover letter).

**Request body:**
```json
{
  "action": "optimize" | "structure" | "chat" | "coverLetter",
  "doc": ResumeDocument,
  "jobDesc": "...",
  "messages": [...]
}
```

---

### `POST /api/upload`
Uploads a PDF resume, extracts text, and optionally structures it into editable fields via AI.

**Request:** `multipart/form-data` with `file` (PDF) and optional `structure=true`

**Response:** Extracted text + optional structured `ResumeData`

---

### `GET|POST /api/resumes`
CRUD operations for resume documents.

---

## PDF Generation

ResuMind uses `puppeteer-core` + `@sparticuz/chromium` instead of the full `puppeteer` package. This makes it compatible with Vercel's serverless environment, which doesn't allow downloading a full Chromium binary at runtime.

### How it works

| Environment | Browser | Lifecycle |
|-------------|---------|-----------|
| **Production (Vercel)** | `@sparticuz/chromium` binary | Per-request launch + close |
| **Development (local Chrome found)** | System Chrome/Chromium | Warm singleton (reused across requests) |
| **Development (no local Chrome)** | `@sparticuz/chromium` binary | Per-request launch + close |

### Configuration

The launch logic in `src/lib/pdf.ts`:

```typescript
// Production: use @sparticuz/chromium
puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});

// Development: prefer local Chrome, fall back to @sparticuz/chromium
```

The `next.config.ts` marks these packages as `serverExternalPackages` so Webpack doesn't try to bundle the 58 MB Chromium binary:

```typescript
serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]
```

### Font loading

Before generating a PDF, the engine waits for `document.fonts.ready` to ensure all Google Fonts are fully loaded. This guarantees the selected font (serif, mono, etc.) is applied correctly in the output.

---

## Font System

The app supports 4 font families, each backed by a Google Font (with a DejaVu fallback for headless environments):

| Selection | Google Font | Fallback Stack |
|-----------|-------------|----------------|
| **Inter** (default) | Inter | DejaVu Sans, sans-serif |
| **Geist** | Geist | Inter, DejaVu Sans, sans-serif |
| **Serif** | Lora | DejaVu Serif, Times New Roman, serif |
| **Mono** | JetBrains Mono | DejaVu Sans Mono, Courier New, monospace |

The font configuration lives in `src/lib/export.ts` (`FONT_CONFIG` map). Google Fonts are loaded via `<link>` tags in the PDF HTML, and the rendering engine waits for `document.fonts.ready` before producing the PDF.

---

## LaTeX Compilation

The `/api/latex-pdf` endpoint uses a **two-tier strategy** to compile LaTeX to PDF without requiring a local LaTeX binary (which isn't available on Vercel):

### Tier 1 — Remote `pdflatex` (primary, works on Vercel)

The `.tex` source is POSTed to the [latexonline.net](https://latexonline.net) API, which runs real `pdflatex` in the cloud. Vercel functions have outbound internet access, so this produces genuine LaTeX-typeset PDFs with proper kerning, ligatures, and Jake's template styling.

Response header: `X-LaTeX-Compiled: pdflatex`

### Tier 2 — Chromium-rendered LaTeX-style HTML (fallback)

If the remote API is unreachable (network issues, API downtime), the endpoint falls back to `toLatexStyleHTML()` — an HTML rendering that visually mimics Jake's LaTeX template (centered name, small-caps section headers with horizontal rules, serif typography) and renders it via the `@sparticuz/chromium` pipeline.

Response header: `X-LaTeX-Compiled: rendered`

This ensures the LaTeX → PDF export **always works**, even without a real LaTeX compiler.

> **LaTeX Source export** (`.tex` file) is always available and works offline — it generates the raw LaTeX source for use in Overleaf or any local LaTeX installation. Three variants are supported: Jake's, ModernCV, and AltaCV.

---

## ATS Scoring Engine

Scores are **100% deterministic** — the AI only explains them, never invents them.

| Sub-score | Weight | What it measures |
|-----------|--------|------------------|
| Keyword match | 30% | Overlap with job description keywords |
| Formatting | 20% | Standard headings, single-column, bullet points |
| Sections | 20% | Presence of required sections (experience, education, skills) |
| Semantic similarity | 15% | TF-IDF cosine similarity with job description |
| Readability | 10% | Flesch-Kincaid grade level, sentence length |
| Grammar | 5% | Weak phrase detection, action verb usage |

The scoring engine lives in `src/lib/ats.ts`. The AI (via `/api/ats`) generates a human-readable explanation of the scores but cannot change them.

---

## Export Formats

| Format | Method | Output |
|--------|--------|--------|
| **ATS-Friendly PDF** | `@sparticuz/chromium` server-side rendering | Single-column, parser-optimized `.pdf` |
| **LaTeX → PDF** | Remote `pdflatex` + Chromium fallback | Real LaTeX-typeset `.pdf` |
| **LaTeX Source** | `toLatex()` generator | Overleaf-ready `.tex` (3 variants) |
| **JSON** | `JSON.stringify` | Portable structured `.json` |
| **DOCX** | Word-compatible HTML | `.doc` file |

---

## Page Sizes

All PDF exports support 6 page sizes:

| Size | Dimensions |
|------|-----------|
| US Letter | 8.5 × 11 in |
| A4 | 210 × 297 mm |
| US Legal | 8.5 × 14 in |
| A3 | 297 × 420 mm |
| Tabloid | 11 × 17 in |
| Executive | 7.25 × 10.5 in |

---

## Deployment on Vercel

ResuMind is designed for Vercel deployment. The `vercel.json` allocates sufficient memory and execution time to the heavy routes:

```json
{
  "functions": {
    "src/app/api/pdf/route.ts": { "memory": 2048, "maxDuration": 60 },
    "src/app/api/latex-pdf/route.ts": { "memory": 2048, "maxDuration": 120 },
    "src/app/api/upload/route.ts": { "memory": 1024, "maxDuration": 60 },
    "src/app/api/ai/route.ts": { "memory": 1024, "maxDuration": 60 }
  }
}
```

### Deployment steps

1. Push your code to GitHub
2. Import the repository into [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `HF_TOKEN` — your Hugging Face token
4. Deploy

### Vercel plan requirement

The `@sparticuz/chromium` package ships a ~58 MB compressed Chromium binary. Vercel **Hobby** tier has a 50 MB compressed function limit, which this exceeds. **Vercel Pro** (250 MB uncompressed limit) is required for the PDF and LaTeX-PDF routes to work.

---

## Notes & Limitations

### PDF Generation
- **Cold-start latency:** The first PDF request after a cold start takes ~2–3 seconds while `@sparticuz/chromium` extracts the binary to `/tmp`. Subsequent warm requests are ~300 ms.
- **Vercel Pro required:** See [Deployment on Vercel](#deployment-on-vercel).

### LaTeX Compilation
- **ModernCV and AltaCV templates** require class files not available server-side. Only Jake's template supports direct PDF compilation. For the other two, use the LaTeX Source (`.tex`) export and compile in Overleaf.
- **Remote API dependency:** The primary LaTeX compilation relies on latexonline.net. If it's down, the Chromium-rendered fallback is used (visually similar but not true LaTeX typesetting).

### Database
- The schema uses PostgreSQL. If you switch to SQLite for local testing, update `prisma/schema.prisma` (`provider = "sqlite"`) and use a file-based `DATABASE_URL`.

### AI Features
- AI features require a valid `HF_TOKEN`. Without it, the deterministic ATS scoring still works (it doesn't use AI), but optimization, chat, and structuring features will fail gracefully with an error message.

### Fonts
- PDF rendering loads Google Fonts at runtime. On Vercel, outbound requests to `fonts.googleapis.com` are allowed. If the request fails, the DejaVu fallback fonts (bundled with `@sparticuz/chromium`) are used.

---

## License

**ResuMind by Pallavi Thakur | All Rights Reserved**

Copyright (c) 2024 Pallavi Thakur. All rights reserved.

This source code is the proprietary property of Pallavi Thakur. Unauthorized copying, modification, or distribution is prohibited.

---

**Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and @sparticuz/chromium.**
