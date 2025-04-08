import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '@/types';
import styles from '../DataTable.module.css';

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasPrevPage,
  hasNextPage
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeft size={16} />
      </button>
      <span className={styles.pageIndicator}>
        {currentPage} / {totalPages}
      </span>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;