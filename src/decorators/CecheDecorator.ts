//import * as memoize from 'fast-memoize';
const cacheLib = require('js-cache');

const log = require('bows')('API:Decorator', 'Cache');

/**
 * https://www.sitepoint.com/javascript-decorators-what-they-are/
 * https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
 *
 * @param target Class, e.g. CertificatesService
 * @param name Method Name, e.g. list
 * @param descriptor Method Descriptor - Javascript construct { value, writable, enumerable, configurable }
 */
export const cache = maxAge => {
  return (target, name, descriptor) => {
    // let's see if there is a validate method
    const clazzFn = target[name];
    if (!clazzFn) {
      log('Unable to find method:', name);
    }

    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = (...args) => {
        try {
          // create the cache key from class name + method name + fn args (skip the token which is first arg)
          const argstringified = GetFnArgs(args, 1);
          const key = [target.constructor.name, name, ...argstringified].join(';');

          let result = cacheLib.get(key);
          if (!result) {
            // run the original function next (we use target here so this points to the original context)
            result = original.apply(target, args);
            cacheLib.set(key, result, maxAge ? maxAge * 1000 : undefined);
          }

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
};

const GetFnArgs = (args: any[], skip: number): string[] => {
  return args.slice(skip).map(arg => JSON.stringify(arg));
};
