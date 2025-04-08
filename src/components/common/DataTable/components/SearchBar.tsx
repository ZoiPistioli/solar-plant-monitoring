import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types';
import styles from '../DataTable.module.css';

function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className={styles.searchContainer}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchTerm && (
        <button
          className={styles.clearSearch}
          onClick={() => onSearch('')}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;