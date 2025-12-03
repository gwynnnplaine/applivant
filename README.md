# Applivant

## Applivant MVP released - open for feedback!

You can try it here: https://applivant.com/

## Motivation

Applivant is a privacy-first **Personal Job Application Tracker** architected for **Client-Side Data Sovereignty**.

While companies use Applicant Tracking Systems (ATS) to filter candidates, Applivant empowers job seekers to own their pipeline. Traditional tools require surrendering data to centralized servers.

Applivant rejects this model. It employs a **Zero-Trust, Local-First Architecture**:

- **No Server-Side Database:** User data never leaves the client environment.
- **No Analytics:** Zero tracking pixels, cookies, or fingerprinting.
- **No Accounts:** Authentication is unnecessary because the data lives in your browser's IndexedDB.

## Target Audience

Built for the **Technical Job Seeker** who:

- Prioritizes data privacy and ownership.
- Manages high-volume pipelines (50-200 applications).
- Demands offline availability and instant UI latency (<200ms).
- Distrusts "free" cloud services with their personal data.

## Architecture & Stack

This is a **Static Web Application (PWA)** hosted on the Edge, with logic strictly decoupled from any backend processing.

- **Framework:** Next.js 14 (App Router, Static Export - generated as static files for fast, serverless hosting)
- **Storage:** IndexedDB (via Dexie.js wrapper)
- **Language:** TypeScript 5.3+ (Strict Mode)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (via GitHub Actions)

## Getting Started

- **Live Demo:** https://applivant.com/
- **Local Development:** Clone the repo, run `pnpm ci`, then `pnpm dev` to start the development server.

## Feature Set (MVP)

- [x] **CRUD Operations:** Local management of application records.
- [x] **Data Portability:** Full JSON/CSV import/export (Data Sovereignty).
- [x] **Search:** Client-side full-text search.
- [x] **Offline Mode:** Service Worker caching for zero-network functionality.

## Roadmap

We're excited about Applivant's potential! Here are some ideas for future enhancements (not prioritized or committed):

- **Advanced Analytics:** Optional, client-side insights like application success rates or timeline visualizations (still privacy-first).
- **Mobile Optimization:** Enhanced PWA features for better mobile UX, including push notifications for deadlines.

Contributions and feedback are welcome - feel free to open issues or PRs!

## License

MIT License.
