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
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    key: 'selection'
  };
};

/**
 * Adjust date range to not exceed today
 */
export const adjustDateRange = (startDate: Date, endDate: Date): { startDate: Date, endDate: Date } => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const adjustedStartDate = startDate > today ? today : startDate;
  const adjustedEndDate = endDate > today ? today : endDate;

  return {
    startDate: adjustedStartDate,
    endDate: adjustedEndDate
  };
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