'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import MovieCard from './MovieCard';
import DetailModal from './DetailModal';
import Pagination from './Pagination';

const FAVORITES_KEY = 'moviefinder_favorites';
const DEFAULT_QUERY = 'marvel';
const DEBOUNCE_MS = 450;

function SkeletonGrid() {
  return (
    <div className="movie-grid" aria-label="Loading movies" aria-busy="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton">
          <div className="skeleton-poster" />
          <div className="skeleton-body">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MovieApp() {
  const [view, setView] = useState('browse');
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [openMovieId, setOpenMovieId] = useState(null);

  const debounceTimer = useRef(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setQuery(inputValue.trim());
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue]);

  // Fetch movies whenever query or page changes (browse view only)
  const fetchMovies = useCallback(async () => {
    if (view !== 'browse') return;
    setLoading(true);
    setError('');
    try {
      const q = query || DEFAULT_QUERY;
      const res = await fetch(`/api/movies?q=${encodeURIComponent(q)}&page=${page}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setMovies(data.movies || []);
      setTotalPages(data.totalPages || 0);
      setTotalResults(data.totalResults || 0);
    } catch {
      setError('Failed to load movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [query, page, view]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Reset page when switching to browse
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'browse') {
      setPage(1);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.imdbID === movie.imdbID);
      return exists ? prev.filter((f) => f.imdbID !== movie.imdbID) : [...prev, movie];
    });
  };

  const isFavorite = (id) => favorites.some((f) => f.imdbID === id);

  const clearSearch = () => {
    setInputValue('');
    setQuery('');
    setPage(1);
  };

  const goHome = () => {
    setInputValue('');
    setQuery('');
    setPage(1);
    setView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const displayMovies = view === 'favorites' ? favorites : movies;
  const isSearching = query.length > 0;

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="site-header">
        <div className="header-inner">
          {/* Logo — resets to page 1 */}
          <button className="logo" aria-label="Movie Finder home" id="logo-home-link" onClick={goHome}>
            <span className="logo-icon">🎬</span>
            <span className="logo-text">MOVIE<span>FINDER</span></span>
          </button>

          {/* Search */}
          <div className="search-wrapper" role="search">
            <span className="search-icon" aria-hidden>🔍</span>
            <input
              id="search-input"
              type="search"
              className="search-input"
              placeholder="Search movies…"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (view !== 'browse') handleViewChange('browse');
              }}
              aria-label="Search movies by title"
              autoComplete="off"
            />
            {inputValue && (
              <button
                id="btn-search-clear"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tabs */}
          <nav className="nav-tabs" aria-label="View tabs">
            <button
              id="tab-browse"
              className={`nav-tab ${view === 'browse' ? 'active' : ''}`}
              onClick={() => handleViewChange('browse')}
              aria-pressed={view === 'browse'}
            >
              Browse
            </button>
            <button
              id="tab-favorites"
              className={`nav-tab ${view === 'favorites' ? 'active' : ''}`}
              onClick={() => handleViewChange('favorites')}
              aria-pressed={view === 'favorites'}
            >
              Favorites
              {favorites.length > 0 && (
                <span className="tab-badge">{favorites.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main id="main-content" className="main-content">

        {/* Section header */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h1 className="section-title">
            {view === 'favorites'
              ? '❤️ Your Favorites'
              : isSearching
              ? `Results for "${query}"`
              : 'Popular Movies'}
          </h1>
          {view === 'browse' && !loading && totalResults > 0 && (
            <span className="result-count">{totalResults.toLocaleString()} results</span>
          )}
          {view === 'favorites' && (
            <span className="result-count">{favorites.length} saved</span>
          )}
        </div>

        {/* Browse view */}
        {view === 'browse' && (
          <>
            {loading && <SkeletonGrid />}

            {!loading && error && (
              <div className="state-container">
                <div className="state-icon">⚠️</div>
                <h2 className="state-title">Something went wrong</h2>
                <p className="state-msg">{error}</p>
                <button id="btn-retry" className="state-action" onClick={fetchMovies}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && movies.length === 0 && (
              <div className="state-container">
                <div className="state-icon">🔍</div>
                <h2 className="state-title">No Results Found</h2>
                <p className="state-msg">
                  No movies matched &quot;{query}&quot;. Try a different title.
                </p>
                <button id="btn-clear-search" className="state-action" onClick={clearSearch}>
                  Clear Search
                </button>
              </div>
            )}

            {!loading && !error && movies.length > 0 && (
              <div className="movie-grid" role="list" aria-label="Movie results">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={isFavorite(movie.imdbID)}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetail={setOpenMovieId}
                  />
                ))}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                loading={loading}
              />
            )}
          </>
        )}

        {/* Favorites view */}
        {view === 'favorites' && (
          <>
            {favorites.length === 0 ? (
              <div className="state-container">
                <div className="state-icon">🤍</div>
                <h2 className="state-title">No Favorites Yet</h2>
                <p className="state-msg">
                  Browse movies and tap the heart icon to save your favourites here.
                </p>
                <button
                  id="btn-go-browse"
                  className="state-action"
                  onClick={() => handleViewChange('browse')}
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="movie-grid" role="list" aria-label="Favourite movies">
                {displayMovies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onOpenDetail={setOpenMovieId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Footer (R4 — exact text required) ────────────────── */}
      <footer className="site-footer">
        <p className="footer-text">
          Built for <span>Jeevan</span> — Rishabh Chaudhary
        </p>
      </footer>

      {/* ── Detail Modal ──────────────────────────────────────── */}
      {openMovieId && (
        <DetailModal
          imdbID={openMovieId}
          isFavorite={isFavorite(openMovieId)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setOpenMovieId(null)}
        />
      )}
    </>
  );
}
