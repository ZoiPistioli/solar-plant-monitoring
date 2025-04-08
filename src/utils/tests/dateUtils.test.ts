import {
  formatDate,
  getMonthsInRange,
  getDateRangeDisplay,
  createDefaultDateRange,
  isCurrentMonth,
  filterDataByDateRange,
  createMonthDateRange,
  adjustDateRange,
  applyCurrentMonthLogic,
} from '../dateUtils';

describe('dateUtils', () => {
  it('formats a date to YYYY-MM-DD', () => {
    const date = new Date(2025, 3, 5); // April 5, 2025
    expect(formatDate(date)).toBe('2025-04-05');
  });

  it('gets all months between two dates', () => {
    const start = new Date(2025, 0, 1); // Jan
    const end = new Date(2025, 2, 1);   // March
    const result = getMonthsInRange(start, end);
    expect(result).toHaveLength(3);
    expect(formatDate(result[0])).toBe('2025-01-01');
  });

  it('gets display text for a single date range', () => {
    const date = new Date(2025, 4, 10);
    expect(getDateRangeDisplay(date, date)).toBe('2025-05-10');
  });

  it('creates a default range starting from the 1st of the month to today', () => {
    const { startDate, endDate } = createDefaultDateRange();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    expect(startDate.getDate()).toBe(1);
    expect(endDate.getFullYear()).toBe(today.getFullYear());
    expect(endDate.getMonth()).toBe(today.getMonth());
    expect(endDate.getDate()).toBe(today.getDate());
  });

  it('checks if range is in current month', () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    expect(isCurrentMonth(start, end)).toBe(true);
  });

  it('filters items inside the date range', () => {
    const data = [
      { day: '2025-04-01' },
      { day: '2025-04-05' },
      { day: '2025-04-10' },
    ];
    const start = new Date('2025-04-02');
    const end = new Date('2025-04-08');
    const result = filterDataByDateRange(data, start, end);
    expect(result).toHaveLength(1);
    expect(result[0].day).toBe('2025-04-05');
  });

  it('creates a date range for a given month', () => {
    const { startDate, endDate } = createMonthDateRange(2025, 1); // February 2025
    expect(startDate.getFullYear()).toBe(2025);
    expect(startDate.getMonth()).toBe(1);
    expect(startDate.getDate()).toBe(1);
    expect(endDate.getMonth()).toBe(1); // Should still be February if not current month
  });

  it('adjusts endDate if it exceeds today', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);

    const { endDate } = adjustDateRange(new Date(), future);
    const today = new Date();
    expect(endDate.getDate()).toBe(today.getDate());
  });

  it('applies current month logic correctly', () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 10);

    const result = applyCurrentMonthLogic(start, end);
    expect(result.endDate.getDate()).toBe(now.getDate());
  });
});
