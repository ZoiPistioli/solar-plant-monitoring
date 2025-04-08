import { listUtils } from '../listUtils';
import { SolarPlant } from '@/types';

const mockPlants: SolarPlant[] = [
  { name: 'Alpha', uid: '3' },
  { name: 'Charlie', uid: '1' },
  { name: 'Bravo', uid: '2' }
];

describe('listUtils', () => {
  describe('paginate', () => {
    it('returns correct page items and total pages', () => {
      const { currentItems, totalPages } = listUtils.paginate(mockPlants, 1, 2);
      expect(currentItems).toHaveLength(2);
      expect(currentItems[0].name).toBe('Alpha');
      expect(totalPages).toBe(2);
    });

    it('handles pagination for last page with fewer items', () => {
      const { currentItems, totalPages } = listUtils.paginate(mockPlants, 2, 2);
      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].name).toBe('Bravo');
      expect(totalPages).toBe(2);
    });
  });

  describe('sort', () => {
    it('sorts by name ascending', () => {
      const result = listUtils.sort(mockPlants, 'name', 'asc');
      expect(result[0].name).toBe('Alpha');
      expect(result[1].name).toBe('Bravo');
      expect(result[2].name).toBe('Charlie');
    });

    it('sorts by uid descending', () => {
      const result = listUtils.sort(mockPlants, 'uid', 'desc');
      expect(result[0].uid).toBe('3');
      expect(result[1].uid).toBe('2');
      expect(result[2].uid).toBe('1');
    });

    it('returns unchanged list when no field or direction provided', () => {
      const result = listUtils.sort(mockPlants, null, null);
      expect(result).toEqual(mockPlants);
    });
  });

  describe('nextSortState', () => {
    it('cycles from null → asc → desc → null', () => {
      const first = listUtils.nextSortState(null, null, 'name');
      expect(first).toEqual({ field: 'name', direction: 'asc' });

      const second = listUtils.nextSortState('name', 'asc', 'name');
      expect(second).toEqual({ field: 'name', direction: 'desc' });

      const third = listUtils.nextSortState('name', 'desc', 'name');
      expect(third).toEqual({ field: null, direction: null });
    });

    it('resets sort when field changes', () => {
      const result = listUtils.nextSortState('name', 'desc', 'uid');
      expect(result).toEqual({ field: 'uid', direction: 'asc' });
    });

    it('throws error for invalid field', () => {
      expect(() => listUtils.nextSortState('name', 'asc', 'invalid')).toThrow('Invalid sort field: invalid');
    });
  });
});
