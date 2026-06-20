'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  loading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Movie results pagination">
      <button
        id="btn-prev-page"
        className="pagination-btn"
        onClick={onPrev}
        disabled={currentPage <= 1 || loading}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <div className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>

      <button
        id="btn-next-page"
        className="pagination-btn"
        onClick={onNext}
        disabled={currentPage >= totalPages || loading}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
