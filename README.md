# Applivant

> Applivant in active development.

## Motivation
Applivant is a privacy-first **Personal Job Application Tracker** architected for **Client-Side Data Sovereignty**.

While companies use Applicant Tracking Systems (ATS) to filter candidates, Applivant empowers job seekers to own their pipeline. Traditional tools require surrendering data to centralized servers.

Applivant rejects this model. It employs a **Zero-Trust, Local-First Architecture**:
*   **No Server-Side Database:** User data never leaves the client environment.
*   **No Analytics:** Zero tracking pixels, cookies, or fingerprinting.
*   **No Accounts:** Authentication is unnecessary because the data lives in your browser's IndexedDB.

## Target Audience
Built for the **Technical Job Seeker** who:
*   Prioritizes data privacy and ownership.
*   Manages high-volume pipelines (50-200 applications).
*   Demands offline availability and instant UI latency (<200ms).
*   Distrusts "free" cloud services with their personal data.

## Architecture & Stack
This is a **Static Web Application (PWA)** hosted on the Edge, with logic strictly decoupled from any backend processing.

*   **Framework:** Next.js 14 (App Router, Static Export)
*   **Storage:** IndexedDB (via Dexie.js wrapper)
*   **Language:** TypeScript 5.3+ (Strict Mode)
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel Edge (Immutable Assets)

## Security Posture (OWASP ASVS L2)
This project adheres to security-by-design principles.

*   **Content Security Policy (CSP):** Strict enforcement. `script-src 'self'`. No external CDNs allowed for logic.
*   **Data Persistence:** Relying on OS-level full-disk encryption (FileVault/BitLocker) via the browser sandbox.
*   **Input Sanitization:** DOMPurify for all user-generated Markdown.
*   **Dependency Management:** Pin exact versions; automated auditing via GitHub Dependabot.

## Feature Set (MVP)
*   [ ] **CRUD Operations:** Local management of application records.
*   [ ] **Data Portability:** Full JSON/CSV import/export (Data Sovereignty).
*   [ ] **Search:** Client-side full-text search.
*   [ ] **Offline Mode:** Service Worker caching for zero-network functionality.

## License
MIT License.
