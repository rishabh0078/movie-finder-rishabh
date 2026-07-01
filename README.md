# Movie Finder 

A cinematic Movie Discovery App built with **Next.js 16** and the **OMDb API**.

**Live URL:** : https://movie-finder-rishabh.vercel.app/

---

## Features

- **Browse** — Responsive grid of movies with poster, title, year, and rating
- **Search** — Live search-as-you-type with 450ms debounce
- **Details** — Click any movie to open a full-detail modal (plot, cast, director, genres, awards)
- **Favorites** — Add/remove movies; persists across reloads via `localStorage`
- **Pagination** — Manual Previous / Next buttons, exactly **12 movies per page**
- **States** — Skeleton loaders while fetching, error messages, and empty-state guidance

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
git clone https://github.com/rishabh0078/movie-finder-rishabh.git
cd movie-finder-rishabh

# 2. Install dependencies
npm install

# 3. Create the environment file
.env  "OMDB_API_KEY=a84bca14" 

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Framework:** Next.js 16
- **Language:** JavaScript
- **Styling:** Custom Vanilla CSS 
- **API:** OMDb (free public movie API)
- **Persistence:** localStorage (favorites)
- **Deployment:** Vercel

---

Built by Rishabh Chaudhary
