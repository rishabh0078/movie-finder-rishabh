'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  imdbRating?: string;
}

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onOpenDetail: (imdbID: string) => void;
}

export default function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
}: MovieCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imgFailed;

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  return (
    <article
      className="movie-card"
      onClick={() => onOpenDetail(movie.imdbID)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.Title}`}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetail(movie.imdbID)}
      id={`movie-card-${movie.imdbID}`}
    >
      <div className="card-poster">
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 25vw, 17vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="card-poster-placeholder">
            🎬
            <span>No Poster</span>
          </div>
        )}

        {/* Rating badge */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="card-rating" aria-label={`Rating: ${movie.imdbRating}`}>
            ★ {movie.imdbRating}
          </div>
        )}

        {/* Favorite button */}
        <button
          id={`btn-fav-${movie.imdbID}`}
          className={`card-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavClick}
          aria-label={isFavorite ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {/* Hover overlay */}
        <div className="card-overlay">
          <span className="card-view-btn">View Details</span>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={movie.Title}>{movie.Title}</h3>
        <div className="card-meta">
          <span className="card-year">{movie.Year}</span>
          <span className="card-type">{movie.Type}</span>
        </div>
      </div>
    </article>
  );
}
