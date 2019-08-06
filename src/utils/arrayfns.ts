// Functions taken from https://medium.com/@alvaro.saburido/set-theory-for-arrays-in-es6-eb2f20a61848

// Is empty array
// Default generic type is number
export function IsEmptyArray<T = any>(ary: T[]): boolean {
  return ary === undefined || ary === null || ary.length === 0;
}

// Flatten the array, i.e. [1, 2, [3, 4]] => [1, 2, 3, 4]
// Default generic type is number
export function FlatArray<T = any>(ary: T[]): T[] {
  if (ary === undefined || ary === null || ary.length === 0) return [];

  // return ary.reduce((acc, val) => acc.concat(val), []);
  return [].concat(...ary);
}

// Unique elements of array only
// Default generic type is number
export function UniqueArray<T = any>(ary: T[]): T[] {
  if (ary === undefined || ary === null || ary.length === 0) return [];

  return Array.from(new Set(ary));
}

// Intersect 2 given arrays
// Default generic type is number
export function IntersectArrays<T = number>(aryA: T[], aryB: T[]): T[] {
  // if ary variable is undefined or null we initialise to empty array
  aryA = aryA || [];
  aryB = aryB || [];

  // we look into elements of the FIRST array, then into the SECOND array
  return aryA.filter(x => aryB.includes(x));
}

// Difference of 2 given arrays
// Default generic type is number
export function DifferenceArrays<T = number>(aryA: T[], aryB: T[]): T[] {
  // if ary variable is undefined or null we initialise to empty array
  aryA = aryA || [];
  aryB = aryB || [];

  // we look into elements of the FIRST array, then into the SECOND array
  return aryA.filter(x => !aryB.includes(x));
}

// Symmetrical Difference of 2 given arrays
// Default generic type is number
export function SymmetricalDifferenceArrays<T = number>(aryA: T[], aryB: T[]): T[] {
  // if ary variable is undefined or null we initialise to empty array
  aryA = aryA || [];
  aryB = aryB || [];

  // we look into elements of the FIRST array, then into the SECOND array
  return aryA.filter(x => !aryB.includes(x)).concat(aryB.filter(x => !aryA.includes(x)));
}

// Union of 2 given arrays
// Default generic type is number
export function UnionArrays<T = number>(aryA: T[], aryB: T[]): T[] {
  // if ary variable is undefined or null we initialise to empty array
  aryA = aryA || [];
  aryB = aryB || [];

  // union of both arrays (removing the duplicates)
  return [...new Set([...aryA, ...aryB])];
}
