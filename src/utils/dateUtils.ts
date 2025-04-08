/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get months included in the date range
 */
export const getMonthsInRange = (start: Date, end: Date): Date[] => {
  const months: Date[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  
  while (current <= end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};

/**
 * Get formatted date range display text
 */
export const getDateRangeDisplay = (startDate: Date, endDate: Date): string => {
  if (!startDate || !endDate) return '';

  if (formatDate(startDate) === formatDate(endDate)) {
    return formatDate(startDate);
  } else {
    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  }
};

/**
 * Create default date range for the current month
 */
export const createDefaultDateRange = (): { startDate: Date, endDate: Date, key: string } => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    key: 'selection'
  };
};

/**
 * Create date range for the current month until today
 */
export const createCurrentMonthToTodayRange = (): { startDate: Date, endDate: Date, key: string } => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    key: 'selection'
  };
};

/**
 * Create date range for a specific month
 * If it's the current month, the range ends today
 */
export const createMonthDateRange = (year: number, month: number): { startDate: Date, endDate: Date, key: string } => {
  const today = new Date();
  const startDate = new Date(year, month, 1);
  startDate.setHours(0, 0, 0, 0);
  
  let endDate;
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  
  if (isCurrentMonth) {
    endDate = new Date(today);
  } else {
    endDate = new Date(year, month + 1, 0);
  }
  
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    key: 'selection'
  };
};

/**
 * Adjust date range for current month to preserve selected dates
 */
export const adjustDateRange = (startDate: Date, endDate: Date): { startDate: Date, endDate: Date } => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const isCurrentMonth = 
    startDate.getFullYear() === today.getFullYear() && 
    startDate.getMonth() === today.getMonth();

  if (!isCurrentMonth) {
    return {
      startDate: startDate > today ? today : startDate,
      endDate: endDate > today ? today : endDate
    };
  }

  return { startDate, endDate };
};

/**
 * Filter data within a specific date range
 */
export const filterDataByDateRange = (data: any[], startDate: Date, endDate: Date): any[] => {
  return data.filter((item: any) => {
    const itemDate = item?.day ? new Date(item.day) : null;
    if (!itemDate || isNaN(itemDate.getTime())) return false;
    return itemDate >= startDate && itemDate <= endDate;
  });
};

/**
 * Check if the date range represents the current month
 */
export const isCurrentMonth = (startDate: Date, endDate: Date): boolean => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return (
    startDate.getFullYear() === currentYear &&
    startDate.getMonth() === currentMonth &&
    endDate.getFullYear() === currentYear &&
    endDate.getMonth() === currentMonth
  );
};

/**
 * Automatically adjust end date to today if the range is for the current month
 */
export const applyCurrentMonthLogic = (startDate: Date, endDate: Date): { startDate: Date, endDate: Date } => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const adjustedEndDate = endDate > today ? today : endDate;

  return {
    startDate,
    endDate: adjustedEndDate
  };
};