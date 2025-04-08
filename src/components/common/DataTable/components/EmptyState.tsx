import { SearchX } from 'lucide-react';
import styles from '../DataTable.module.css';

interface EmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

function EmptyState({ searchTerm, onClearSearch }: EmptyStateProps) {
  return (
    <>
      <div className={styles.iconWrapper}>
        <SearchX size={48} className={styles.emptyIcon} />
      </div>
      <p className={styles.emptyTitle}>
        {searchTerm ? 'No matching results' : 'No entries found'}
      </p>
      <p className={styles.emptySubtitle}>
        {searchTerm 
          ? 'Try a different search term or clear your search to see all data.'
          : 'Add your first entry to get started.'}
      </p>
      {searchTerm && (
        <button
          className={styles.clearButton}
          onClick={onClearSearch}
        >
          Clear Search
        </button>
      )}
    </>
  );
}

export default EmptyState;