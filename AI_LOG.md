# AI_LOG.md — Movie Finder (Rishabh Chaudhary)

## Tools Used

- **Antigravity (AI coding assistant)** — Used for scaffolding components, API route logic, CSS design system, and architecture decisions.
- **OMDb API** — Free public movie database API used to fetch search results and movie details.
- **Next.js 16 (App Router)** — Framework for the full-stack application.

---

## Best Prompts

### Prompt 1 — Pagination logic for 12 items/page from a 10-item API

> "The OMDb API returns exactly 10 results per page, but the spec requires exactly 12 per page. Write a Next.js API route that maps our 12-item page number to the correct OMDb pages, fetches 1 or 2 OMDb pages as needed, and slices out exactly 12 items."

**Why it worked:** Being explicit about the mismatch (10 vs 12) forced a specific algorithm rather than a generic pagination wrapper. The prompt named the exact constraint, which produced the virtual-index slicing approach.

---

### Prompt 2 — Custom cinematic CSS system without Tailwind

> "Design a cinematic dark-theme CSS system for a movie discovery app — no Tailwind. Include CSS variables for palette, typography (Bebas Neue + Inter + Space Mono), card hover effects, glassmorphic modal with blurred backdrop, skeleton loaders with shimmer animation, and a sticky header. The design should feel like a premium streaming platform, not a generic template."

**Why it worked:** Specifying what to avoid (Tailwind, generic templates) + naming the exact deliverables (skeleton shimmer, glassmorphic modal, sticky header) and target aesthetic (premium streaming) produced a highly specific and cohesive result rather than a plain Bootstrap-like layout.

---

### Prompt 3 — Server/client boundary for API key safety

> "Build a Next.js API route at /api/movies that calls OMDb using OMDB_API_KEY from process.env, so the key never reaches the browser bundle. The client component should fetch /api/movies?q=...&page=... instead of calling OMDb directly."

**Why it worked:** Explicitly stating the security requirement (key must not reach browser) and the solution pattern (proxy via API route) made the AI implement proper server-side key handling using Next.js environment variable conventions.

---

## What I Fixed Manually

### 1. OMDb `imdbRating` field missing in search results

The AI initially wrote the `MovieCard` to display `movie.imdbRating` directly from search results. However, OMDb's search endpoint (`?s=`) does **not** return `imdbRating` — that field only comes from the detail endpoint (`?i=`). 

I fixed this by making the rating badge conditional (`{movie.imdbRating && movie.imdbRating !== 'N/A' && ...}`) so it silently hides when the field is absent, instead of showing "N/A ★" on every card. The modal detail view correctly shows the rating since it calls the full detail endpoint.

### 2. Next.js 16 `params` must be awaited as a Promise

The AI's initial API route for `/api/movie/[id]/route.ts` used `params.id` directly (the older Next.js pattern). In Next.js 16 with App Router, `params` is a Promise and must be awaited: `const { id } = await params`. I corrected this to avoid a runtime warning and ensure compatibility with the installed version.

### 3. Poster Priority Sorting

In the browse grid, movies without posters (having `"N/A"` or empty poster values) were causing visual gaps or taking up key slots. I updated the backend slice logic in `/api/movies/route.ts` to sort results such that all movies with valid posters are shown first, followed by movies without posters, providing a cleaner grid representation.

### 4. Stable Pagination & Total Page Count

Initially, the total page count (the number after "of") would change dynamically as the API fetched more pages from OMDb in the background. I stabilized this by fetching the OMDb `totalResults` count on the first query, caching it, and computing `totalPages = Math.ceil(totalResults / 12)`. This ensures a stable pagination count that does not fluctuate as the user navigates between pages.

### 5. Home Reset via Logo Click

I wired the site logo to act as a home button. Clicking it calls `goHome()` which resets search inputs, switches the view back to "Browse", resets the page index back to 1, and scrolls the page smoothly to the top.

