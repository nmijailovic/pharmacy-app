const log = require('bows')('API:Decorator', 'Validate');

/**
 * https://www.sitepoint.com/javascript-decorators-what-they-are/
 * https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841
 *
 * Use prepare decorator to invoke the prepareFn which is made up of word prepare + method name
 * with the first letter of method name capitalised
 * e.g. for method list invoke prepareList method with the exact same arguments
 *
 * @param target Class, e.g. CertificatesService
 * @param name Method Name, e.g. list
 * @param descriptor Method Descriptor - Javascript construct { value, writable, enumerable, configurable }
 */
export const prepare = (target, name, descriptor) => {
  // if decorator set on method called list we will search for prepareList method
  // parameter name points to the current method
  const prepareMethodName = `prepare${name[0].toUpperCase()}${name.substring(1)}`;
  // let's see if there is a prepare method
  const prepareFn = target[prepareMethodName];
  if (!prepareFn) {
    log('Unable to find prepare method:', prepareMethodName);
  }

  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = (...args) => {
      try {
        // run validation function first (we use target here so this points to the original context)
        prepareFn.apply(target, args);
        // run the original function next (we use target here so this points to the original context)
        const result = original.apply(target, args);
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

// Use this form if you nee to pass arguments to the decorator itself, e.g. @prepare("prepareOtherFnName"), in this case
// prepareOtherFnName could be the method name to use for validation
// const prepareWithName = name => {
//   return function decorator(target, name, descriptor) {
//     const original = descriptor.value;
//     if (typeof original === 'function') {
//       descriptor.value = function(...args) {
//         console.log(`Arguments for ${name}: ${args}`);
//         try {
//           const result = original.apply(this, args);
//           console.log(`Result from ${name}: ${result}`);
//           return result;
//         } catch (e) {
//           console.log(`Error from ${name}: ${e}`);
//           throw e;
//         }
//       };
//     }
//     return descriptor;
//   };
// };
