# Movie Finder — Rishabh Chaudhary

A cinematic Movie Discovery App built with **Next.js 16** and the **OMDb API**.

**Live URL:** _[Add your Vercel/Netlify link here after deployment]_

---

## Features

- 🎬 **Browse** — Responsive grid of movies with poster, title, year, and rating
- 🔍 **Search** — Live search-as-you-type with 450ms debounce
- 📄 **Details** — Click any movie to open a full-detail modal (plot, cast, director, genres, awards)
- ❤️ **Favorites** — Add/remove movies; persists across reloads via `localStorage`
- ⏮⏭ **Pagination** — Manual Previous / Next buttons, exactly **12 movies per page**
- ⏳ **States** — Skeleton loaders while fetching, error messages, and empty-state guidance

## Data Source

[OMDb API](https://www.omdbapi.com/) — free public movie database API.

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/movie-finder-rishabh.git
cd movie-finder-rishabh

# 2. Install dependencies
npm install

# 3. Create the environment file
echo "OMDB_API_KEY=a84bca14" > .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Custom Vanilla CSS (no Tailwind) |
| API | OMDb (free public movie API) |
| Persistence | localStorage (favorites) |
| Deployment | Vercel

---

Built for **Jeevan** — Rishabh Chaudhary
