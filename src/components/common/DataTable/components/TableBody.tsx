import Loader from '@/components/common/Loader'; 
import { TableBodyProps } from '@/types'; 
import styles from '../DataTable.module.css';
import EmptyState from './EmptyState';

function TableBody<T>({
  data,
  columns,
  keyExtractor,
  isLoading,
  searchTerm,
  onRowClick,
  actions,
  handleSearch,
  itemsPerPage
}: TableBodyProps<T>) {
  if (isLoading) {
    return (
      <tbody className={styles.tableBody}>
        <tr className={`${styles.loaderRow} loaderRow`}>
          <td
            colSpan={columns.length + (actions ? 1 : 0)}
            className={`${styles.loaderCell} loaderCell`}
          >
            <Loader
              size="md"
              variant="primary"
              message="Loading data..."
            />
          </td>
        </tr>
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody className={styles.tableBody}>
        <tr>
          <td
            colSpan={columns.length + (actions ? 1 : 0)}
            className={styles.emptyCell}
          >
            <EmptyState
              searchTerm={searchTerm}
              onClearSearch={() => handleSearch('')}
            />
          </td>
        </tr>
      </tbody>
    );
  }

  const rowsToRender = Math.max(itemsPerPage, data.length);

  return (
    <tbody className={styles.tableBody}>
      {Array.from({ length: rowsToRender }, (_, index) => {
        const item = data[index];
        
        if (item) {
          return (
            <tr
              key={keyExtractor(item)}
              className={`${styles.row} ${
                onRowClick ? styles.clickableRow : ''
              }`}
              onClick={
                onRowClick ? () => onRowClick(item) : undefined
              }
            >
              {columns.map((column) => (
                <td
                  key={`${keyExtractor(item)}-${String(column.key)}`}
                  className={styles.cell}
                  style={{ width: column.width ?? 'auto' }}
                >
                  {column.render
                    ? column.render(item)
                    : (
                        typeof item[column.key as keyof T] === 'object' ? 
                          JSON.stringify(item[column.key as keyof T]) : 
                          String(item[column.key as keyof T] ?? '')
                      )}
                </td>
              ))}
              {actions && (
                <td className={styles.actionsCell}>
                  <div
                    className={styles.actionsCellContent}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(item)}
                  </div>
                </td>
              )}
            </tr>
          );
        }
        
        return (
          <tr key={`empty-${index}`} className={styles.row}>
            <td
              colSpan={columns.length + (actions ? 1 : 0)}
              style={{ height: '53px' }}
            >
              &nbsp;
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default TableBody;