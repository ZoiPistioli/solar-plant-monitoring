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
    const date = new Date(2025, 3, 5); 
    expect(formatDate(date)).toBe('2025-04-05');
  });

  it('gets all months between two dates', () => {
    const start = new Date(2025, 0, 1); 
    const end = new Date(2025, 2, 1);  
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
    const { startDate, endDate } = createMonthDateRange(2025, 1); 
    expect(startDate.getFullYear()).toBe(2025);
    expect(startDate.getMonth()).toBe(1);
    expect(startDate.getDate()).toBe(1);
    expect(endDate.getMonth()).toBe(1); 
  });

  it('adjusts endDate if it exceeds today', () => {
    const mockToday = new Date('2025-04-08T12:00:00Z'); 
    jest.useFakeTimers().setSystemTime(mockToday);
  
    const future = new Date('2025-04-20T00:00:00Z');
    const start = new Date('2025-03-01T00:00:00Z'); 
  
    const { endDate } = adjustDateRange(start, future);
  
    expect(endDate.getFullYear()).toBe(2025);
    expect(endDate.getMonth()).toBe(3); 
    expect(endDate.getDate()).toBe(8);  
  
    jest.useRealTimers();
  });
  

  it('applies current month logic correctly', () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 10);
    
    const result = applyCurrentMonthLogic(start, end);
    expect(result.endDate.getDate()).toBe(now.getDate());
  });

  describe('Advanced formatDate scenarios', () => {
    it('handles single-digit dates and months correctly', () => {
      const date = new Date(2025, 0, 5); 
      expect(formatDate(date)).toBe('2025-01-05');
    });

    it('handles end of year dates', () => {
      const date = new Date(2024, 11, 31); 
      expect(formatDate(date)).toBe('2024-12-31');
    });
  });

  describe('getMonthsInRange advanced scenarios', () => {
    it('handles cross-year month ranges', () => {
      const start = new Date(2024, 11, 1); 
      const end = new Date(2025, 1, 1);    
      const result = getMonthsInRange(start, end);
      
      expect(result).toHaveLength(3);
      expect(formatDate(result[0])).toBe('2024-12-01');
      expect(formatDate(result[1])).toBe('2025-01-01');
      expect(formatDate(result[2])).toBe('2025-02-01');
    });

    it('handles same month range', () => {
      const start = new Date(2025, 3, 1);
      const end = new Date(2025, 3, 30);
      const result = getMonthsInRange(start, end);
      
      expect(result).toHaveLength(1);
      expect(formatDate(result[0])).toBe('2025-04-01');
    });
  });

  describe('getDateRangeDisplay advanced scenarios', () => {
    it('displays different month range correctly', () => {
      const start = new Date(2025, 3, 25);
      const end = new Date(2025, 4, 5);
      expect(getDateRangeDisplay(start, end)).toBe('2025-04-25 to 2025-05-05');
    });

    it('handles null or undefined dates', () => {
      expect(getDateRangeDisplay(null as any, null as any)).toBe('');
    });
  });

  describe('createMonthDateRange advanced scenarios', () => {
    it('handles different months correctly', () => {
      const { startDate, endDate } = createMonthDateRange(2025, 6); 
      expect(startDate.getFullYear()).toBe(2025);
      expect(startDate.getMonth()).toBe(6);
      expect(startDate.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(6);
      expect(endDate.getDate()).toBe(31);
    });

    it('respects current month logic', () => {
      const now = new Date();
      const { startDate, endDate } = createMonthDateRange(now.getFullYear(), now.getMonth());
      
      expect(startDate.getDate()).toBe(1);
      expect(endDate.getDate()).toBe(now.getDate());
    });
  });

  describe('adjustDateRange advanced scenarios', () => {
    it('preserves dates within current month', () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 5);
      const end = new Date(now.getFullYear(), now.getMonth(), 15);
      
      const { startDate, endDate } = adjustDateRange(start, end);
      
      expect(startDate.getDate()).toBe(5);
      expect(endDate.getDate()).toBe(15);
    });

    it('handles past month dates', () => {
      const pastMonth = new Date(2024, 0, 1); 
      const pastEnd = new Date(2024, 0, 31); 
    
      const { startDate, endDate } = adjustDateRange(pastMonth, pastEnd);
    
      // These should remain unchanged
      expect(startDate).toEqual(pastMonth);
      expect(endDate).toEqual(pastEnd);
    });
    
  });

  describe('filterDataByDateRange advanced scenarios', () => {
    it('handles data with invalid dates', () => {
      const data = [
        { day: '2025-04-01' },
        { day: 'invalid-date' },
        { day: null },
        { day: '2025-04-10' }
      ];
      
      const start = new Date('2025-04-02');
      const end = new Date('2025-04-11');
      
      const result = filterDataByDateRange(data, start, end);
      
      expect(result).toHaveLength(1);
      expect(result[0].day).toBe('2025-04-10');
    });

    it('handles empty data array', () => {
      const data: any[] = [];
      
      const start = new Date('2025-04-02');
      const end = new Date('2025-04-11');
      
      const result = filterDataByDateRange(data, start, end);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('applyCurrentMonthLogic advanced scenarios', () => {
    it('caps end date to today for current month', () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const futureEnd = new Date(now.getFullYear(), now.getMonth(), 31);
      
      const result = applyCurrentMonthLogic(start, futureEnd);
      
      expect(result.endDate.getDate()).toBe(now.getDate());
    });

    it('preserves original dates for non-current month', () => {
      const pastMonth = new Date(2024, 0, 1); 
      const pastEnd = new Date(2024, 0, 31);
      
      const result = applyCurrentMonthLogic(pastMonth, pastEnd);
      
      expect(result.startDate).toEqual(pastMonth);
      expect(result.endDate).toEqual(pastEnd);
    });
  });
});