// Utility function to extract value for sorting
export function getValueForSort<T extends Record<string, any>>(row: T, key: string): any {
  if (key.includes('.')) {
    return key.split('.').reduce((acc, part) => acc?.[part], row) ?? '';
  }
  return row[key];
}

// Universal comparator
export function compareValues(a: any, b: any, isAsc: boolean): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * (isAsc ? 1 : -1);
  }
  return String(a).localeCompare(String(b)) * (isAsc ? 1 : -1);
}
