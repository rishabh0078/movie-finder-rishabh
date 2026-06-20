'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Movie } from './MovieCard';

interface MovieDetail extends Movie {
  Plot: string;
  Director: string;
  Actors: string;
  Genre: string;
  Runtime: string;
  Language: string;
  Country: string;
  Awards: string;
  Rated: string;
  Released: string;
}

interface DetailModalProps {
  imdbID: string;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onClose: () => void;
}

export default function DetailModal({
  imdbID,
  isFavorite,
  onToggleFavorite,
  onClose,
}: DetailModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/movie/${imdbID}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setMovie(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [imdbID]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const hasPoster = movie?.Poster && movie.Poster !== 'N/A';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={movie ? `Details for ${movie.Title}` : 'Movie details'}
      id="movie-detail-modal"
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="btn-modal-close"
          className="modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>

        {loading && (
          <div className="modal-loading">
            <div className="spinner" role="status" aria-label="Loading movie details" />
            <p className="spinner-text">Loading details…</p>
          </div>
        )}

        {error && (
          <div className="state-container">
            <div className="state-icon">⚠️</div>
            <h2 className="state-title">Failed to Load</h2>
            <p className="state-msg">{error}</p>
            <button className="state-action" onClick={fetchDetail}>Try Again</button>
          </div>
        )}

        {!loading && !error && movie && (
          <>
            {/* Backdrop */}
            <div className="modal-backdrop">
              {hasPoster && (
                <Image
                  src={movie.Poster}
                  alt=""
                  fill
                  sizes="780px"
                  className="modal-backdrop-img"
                  style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'blur(2px) brightness(0.4)' }}
                  aria-hidden
                />
              )}
              <div className="modal-backdrop-overlay" />

              <div className="modal-header-content">
                {/* Poster thumbnail */}
                <div className="modal-poster">
                  {hasPoster ? (
                    <Image
                      src={movie.Poster}
                      alt={`${movie.Title} poster`}
                      width={100}
                      height={150}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="modal-poster-placeholder">🎬</div>
                  )}
                </div>

                {/* Title + badges */}
                <div className="modal-title-block">
                  <h2 className="modal-title">{movie.Title}</h2>
                  <div className="modal-badges">
                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                      <span className="badge badge-rating">★ {movie.imdbRating}</span>
                    )}
                    {movie.Year && <span className="badge badge-year">{movie.Year}</span>}
                    {movie.Type && <span className="badge badge-type">{movie.Type}</span>}
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <span className="badge badge-runtime">⏱ {movie.Runtime}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <section className="modal-section">
                  <p className="modal-label">Overview</p>
                  <p className="modal-overview">{movie.Plot}</p>
                </section>
              )}

              {/* Genre chips */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <section className="modal-section">
                  <p className="modal-label">Genres</p>
                  <div className="modal-genres">
                    {movie.Genre.split(',').map((g) => (
                      <span key={g.trim()} className="genre-chip">{g.trim()}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Info grid */}
              <section className="modal-section">
                <div className="modal-grid">
                  {movie.Director && movie.Director !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Director</p>
                      <p className="modal-info-value">{movie.Director}</p>
                    </div>
                  )}
                  {movie.Actors && movie.Actors !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Cast</p>
                      <p className="modal-info-value">{movie.Actors}</p>
                    </div>
                  )}
                  {movie.Released && movie.Released !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Released</p>
                      <p className="modal-info-value">{movie.Released}</p>
                    </div>
                  )}
                  {movie.Country && movie.Country !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Country</p>
                      <p className="modal-info-value">{movie.Country}</p>
                    </div>
                  )}
                  {movie.Language && movie.Language !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Language</p>
                      <p className="modal-info-value">{movie.Language}</p>
                    </div>
                  )}
                  {movie.Awards && movie.Awards !== 'N/A' && (
                    <div className="modal-info-item">
                      <p className="modal-info-label">Awards</p>
                      <p className="modal-info-value">{movie.Awards}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Favorite button */}
              <button
                id="btn-modal-favorite"
                className={`modal-fav-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(movie)}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
