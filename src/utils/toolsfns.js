/**
 * Function sorting arrays of objects by property.
 * This function generates sort methods dynamically.
 * Simply supply each sortable child property name, prepended with +/- to indicate ascending or descending order.
 * Example usage: items.sort(getSortMethod('-price', '+priority', '+name'));
 * Use - for descending, and + for ascending
 */
export function GetSortMethod() {
  const _args = Array.prototype.slice.call(arguments);
  return (a, b) => {
    for (let x = 0; x < _args.length; x++) {
      const propPath = _args[x].substring(1).split('.');
      // let ax = a[_args[x].substring(1)];
      let av = propPath.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), a);
      // let bx = b[_args[x].substring(1)];
      let bv = propPath.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), b);
      let cv;

      av = typeof av === 'string' ? av.toLowerCase() : av / 1.0;
      bv = typeof bv === 'string' ? bv.toLowerCase() : bv / 1.0;

      if (_args[x].substring(0, 1) === '-') {
        cv = av;
        av = bv;
        bv = cv;
      }
      if (av !== bv) {
        return av < bv ? -1 : 1;
      }
    }
  };
}

/**
 * The queryParams are coming like this "status1,status2,status3"
 * and we need to pass to the IN filter inside the SQL query like this "1,2,3"
 * @param {*} constAry
 * @param {*} queryParamList
 */
export const GetFieldIdsFromQueryParams = (constAry, queryParamList) => {
  let result = [];

  if (queryParamList) {
    const paramsArray = queryParamList.split(',');
    for (let param of paramsArray) {
      result.push(constAry[param]);
    }
  }
  return result;
};

// /**
//  * Search the const Array for a field name by its field id
//  * @param {*} constAry
//  * @param {*} fieldId
//  */
// export const getObjectFieldName = (constAry, fieldId) => {
//   const objectFields = Object.entries(constAry);
//   // search the entries by the fieldId
//   const entry = objectFields.find(item => item[1] === fieldId);
//   if (entry) {
//     // return the name of the field
//     return entry[0];
//   }
//   return null;
// };
