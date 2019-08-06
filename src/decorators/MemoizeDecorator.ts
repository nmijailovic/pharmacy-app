const memoizeLib = require('fast-memoize');

const log = require('bows')('API:Decorator', 'Memoize');

/**
 * https://www.sitepoint.com/javascript-decorators-what-they-are/
 * https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
 *
 * Use memoize decorator to memoize an expensive computation
 * Note that memoize does NOT expire and hence stays in memory for the length of the task running
 *
 * @param target Class, e.g. CertificatesService
 * @param name Method Name, e.g. list
 * @param descriptor Method Descriptor - Javascript construct { value, writable, enumerable, configurable }
 */
export const memoize = (target, name, descriptor) => {
  // let's see if there is a validate method
  const memoizeClazzFn = target[name];
  if (!memoizeClazzFn) {
    log('Unable to find method to memoize:', name);
  }

  // wrap the original function with memoize
  const mFn = memoizeLib(memoizeClazzFn);

  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = (...args) => {
      try {
        // run the original function next (we use target here so this points to the original context)
        const result = mFn.apply(target, args);
        // return the result from the original fn call
        return result;
      } catch (error) {
        log('Error:', error);
        throw error;
      }
    };
  }
  return descriptor;
};
