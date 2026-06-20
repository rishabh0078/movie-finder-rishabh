import { NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = "https://www.omdbapi.com";
const ITEMS_PER_PAGE = 12;

// ── In-memory cache per query ──────────────────────────────────
// We accumulate ALL results (including N/A posters — client handles those)
// so we can serve any page without re-fetching from OMDb.
const queryCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getOrCreateCache(query) {
  const existing = queryCache.get(query);
  if (existing && Date.now() - existing.timestamp < CACHE_TTL_MS) {
    return existing;
  }
  const fresh = {
    allMovies: [],
    omdbPagesFetched: 0,
    totalOmdbResults: 0,
    timestamp: Date.now(),
  };
  queryCache.set(query, fresh);
  return fresh;
}

/** Fetch one OMDb search page (10 results) */
async function fetchOmdbPage(query, page) {
  try {
    const res = await fetch(
      `${OMDB_BASE}/?s=${encodeURIComponent(query)}&type=movie&page=${page}&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();
    if (data.Response === "False") return { movies: [], totalResults: 0 };
    return {
      movies: data.Search || [],
      totalResults: parseInt(data.totalResults || "0", 10),
    };
  } catch {
    return { movies: [], totalResults: 0 };
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "marvel";
  const ourPage = parseInt(searchParams.get("page") || "1", 10);

  if (!OMDB_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const entry = getOrCreateCache(query);

    // How many results we need to serve this page
    const needed = ourPage * ITEMS_PER_PAGE;

    // Keep fetching OMDb pages until we have enough results to fill the requested page
    // (or we've fetched everything OMDb has)
    while (entry.allMovies.length < needed) {
      // Work out OMDb page ceiling from what we know
      const maxOmdbPages =
        entry.totalOmdbResults > 0
          ? Math.ceil(entry.totalOmdbResults / 10)
          : 999; // unknown yet, keep going

      if (entry.omdbPagesFetched >= maxOmdbPages) break;

      // Fetch up to 3 OMDb pages at a time (30 results)
      const batchStart = entry.omdbPagesFetched + 1;
      const batchEnd = Math.min(batchStart + 2, maxOmdbPages);

      const fetches = [];
      for (let p = batchStart; p <= batchEnd; p++) {
        fetches.push(fetchOmdbPage(query, p));
      }

      const results = await Promise.all(fetches);
      const seenIds = new Set(entry.allMovies.map((m) => m.imdbID));

      for (const result of results) {
        entry.omdbPagesFetched++;
        if (result.totalResults > 0) {
          entry.totalOmdbResults = result.totalResults;
        }
        for (const movie of result.movies) {
          if (!seenIds.has(movie.imdbID)) {
            entry.allMovies.push(movie);
            seenIds.add(movie.imdbID);
          }
        }
      }

      // Hard safety cap — never fetch more than 50 OMDb pages
      if (entry.omdbPagesFetched >= 50) break;
    }

    // Sort: movies with a real poster come first, no-poster movies fill the end
    const sorted = [
      ...entry.allMovies.filter((m) => m.Poster && m.Poster !== "N/A"),
      ...entry.allMovies.filter((m) => !m.Poster || m.Poster === "N/A"),
    ];

    // Serve the exact slice of 12 for the requested page
    const start = (ourPage - 1) * ITEMS_PER_PAGE;
    const pageMovies = sorted.slice(start, start + ITEMS_PER_PAGE);

    // totalPages is derived from OMDb's own totalResults count — stable, never changes
    const totalMoviesKnown = entry.allMovies.length;
    const totalPages = entry.totalOmdbResults > 0
      ? Math.ceil(entry.totalOmdbResults / ITEMS_PER_PAGE)
      : Math.ceil(totalMoviesKnown / ITEMS_PER_PAGE);

    return NextResponse.json({
      movies: pageMovies,
      totalResults: entry.totalOmdbResults || totalMoviesKnown,
      totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
