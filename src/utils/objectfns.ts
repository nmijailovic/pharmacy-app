const IS_ARRAY_REGEX = /(\w+)(\[(\d?)])?/;

export const RemoveUndefinedValuesAry = (...objAry: object[]): void => {
  for (const obj of objAry) {
    RemoveUndefinedValues(obj);
  }
};

export const RemoveUndefinedValues = (obj: object): void => {
  if (!obj) return;

  for (const key of Object.keys(obj)) {
    if (obj[key] === null) continue;
    if (obj[key] === undefined) {
      delete obj[key];
      continue;
    }

    // get the type
    const type = Object.prototype.toString.call(obj[key]);
    // if we have an empty array we remove it
    if (type === '[object Array]' && obj[key].length === 0) {
      delete obj[key];
      continue;
    }
    // if we have a sub object we descend into it to clean-up undefined values
    if (type === '[object Object]') {
      RemoveUndefinedValues(obj[key]);

      // now we check if sub object has any left over keys, if not, delete it
      if (Object.keys(obj[key]).length === 0 && Object.getOwnPropertySymbols(obj[key]).length === 0) delete obj[key];
    }
  }
};

export const GetObjectKeysWithValues = (obj: object): string[] => {
  const keys = Object.entries(obj)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => key);

  return keys;
};

export const SetObjectDefaultValues = (obj: object, defaultValues: object): void => {
  const entries = Object.entries(defaultValues);
  for (const [key, value] of entries) {
    if (obj[key] === undefined) obj[key] = defaultValues[key];
  }
};

export const GetOwnNestedProperty = (o: object, path: string): any => {
  if (!o || !path) return undefined;

  const propPath = path.split('.');
  let obj = o;

  for (const prop of propPath) {
    const propNameIdx = prop.match(IS_ARRAY_REGEX);
    const propName = propNameIdx[1];
    const propAryIdx = propNameIdx[3];

    if (!obj || !Object.prototype.hasOwnProperty.call(obj, propName)) {
      return undefined;
    } else {
      obj = propAryIdx ? obj[propName] && obj[propName][propAryIdx] : obj[prop];
    }
  }

  return obj;
};

// export const GetOwnNestedProperty = (o: object, path: string): any => {
//   if (!o || !path) return false;

//   const properties = path.split('.');

//   return properties.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), o);
// };

export const CompareObjectProps = (srcObj: object, otherObj: object): boolean => {
  return Object.keys(srcObj).some(key => {
    return IsPrimitive(srcObj[key]) && srcObj[key] !== otherObj[key];
  });
};

// https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
export const CompareArrays = (srcObj: any[], otherObj: any[]): boolean => {
  // Get the value type
  const type = Object.prototype.toString.call(srcObj);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(otherObj)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  const srcLen = type === '[object Array]' ? srcObj.length : Object.keys(srcObj).length;
  const otherLen = type === '[object Array]' ? otherObj.length : Object.keys(otherObj).length;
  if (srcLen !== otherLen) return false;

  // Compare two items
  const compare = (item1: any, item2: any) => {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!CompareArrays(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (Object.prototype.toString.call(item1) !== Object.prototype.toString.call(item2)) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < srcLen; i++) {
      if (compare(srcObj[i], otherObj[i]) === false) return false;
    }
  } else {
    for (let key in srcObj) {
      if (Object.prototype.hasOwnProperty.call(srcObj, key)) {
        if (compare(srcObj[key], otherObj[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

export const CloneObjectPrimitives = (srcObj: object): object => {
  const newObj = {};

  const keys = Object.keys(srcObj);
  for (const key of keys) {
    if (IsPrimitive(srcObj[key])) {
      newObj[key] = srcObj[key];
    }
  }

  return newObj;
};

export const IsPrimitive = (arg: any): boolean => {
  const type = typeof arg;
  return arg == null || (type !== 'object' && type !== 'function');
};
