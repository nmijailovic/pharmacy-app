import { Op } from 'sequelize';
import { BaseError } from 'sequelize/lib/errors';

import { prettyError } from '../errors/PrettyError';

// Custom Error
import CustomError from '../errors/CustomError';

// Enums
import { SORT_DIR, ERROR_CODES } from '../common/enums';

// Interfaces
import { IKVObject } from '../interfaces/KVObject';
import { Op as SVOp, ISVObject } from '../interfaces/SVObject';
import { IBaseParams } from '../interfaces/params/BaseParams';
import { ISearchParams } from '../interfaces/params/SearchParams';

const log = require('bows')('API:DAO', 'Base');

const DEFAULT_PAGE_SIZE: number = 500;

export class BaseDAO {
  constructor() {
    // no op
  }

  // SEQUILIZE Search Object
  public GetSearchObj(parentWsIds: IKVObject, params: IBaseParams): ISearchParams {
    const searchObj: ISearchParams = {};

    // de-structure params
    const {
      _order: { by, dir } = { by: undefined, dir: undefined },
      _paginate: { pageSize, page } = { pageSize: DEFAULT_PAGE_SIZE, page: undefined },
      join,
      link,
      ...rest
    } = params;

    // Sorting Properties
    // if (sortBy) {
    //   const order = sortBy.map((field, idx) => {
    //     const dir = (sortDir && sortDir[idx]) || SORT_DIR.ASC;
    //     return [field, dir];
    //   });
    //   searchObj.order = order;
    // }
    if (by) {
      const order = by.map((field, idx) => {
        const sdir = (dir && dir[idx]) || SORT_DIR.ASC;
        return [field, sdir];
      });
      searchObj.order = order;
    }

    // Pagination Properties
    searchObj.pagination = {
      limit: pageSize,
      offset: page ? page * searchObj.pagination.limit : 0
    };
    // searchObj.pagination.limit = pageSize || DEFAULT_PAGE_SIZE;
    // searchObj.pagination.offset = page ? page * searchObj.pagination.limit : 0;

    // Join Tables
    searchObj.join = join;
    // Link is used to filter fields in Linking Tables
    searchObj.link = link;

    // copy the fields and values to where object
    searchObj.where = {
      ...rest,
      ...parentWsIds
    };

    // perform conversion of any Symbol Operators to actual implementation
    for (const key of Object.keys(searchObj.where)) {
      const type = Object.prototype.toString.call(searchObj.where[key]);
      if (type === '[object Object]') {
        // replace the original object with sequelize specific operators
        searchObj.where[key] = this.getOperatorObject(searchObj.where[key]);
      }
    }

    // log for debugging
    log('SearchObj:', searchObj);

    return searchObj;
  }

  public GetTotalPages(totalRecords: number, pageSize: number): number {
    let totalPages = Math.floor(totalRecords / pageSize);

    // in case we have a remainder we add an extra page to cover the extra records
    if (totalRecords % pageSize > 0) ++totalPages;

    return totalPages;
  }

  /**
   * Sequelize returns strings instead of numbers for BIGINT / DECIMAL columns as Javascript
   * cannot accurately represent the big numbers
   * In our cases we do not use HUGE numbers so we can safely convert back to integers / floats
   *
   */
  public ConvertStringToNumberObject(obj: IKVObject): IKVObject {
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        if (typeof obj[key] === 'string') {
          // avgXyz fields are floats, everything else is int
          if (key.startsWith('cnt') || key.startsWith('sum')) {
            obj[key] = parseInt(obj[key], 10);
          } else if (key.startsWith('avg')) {
            obj[key] = parseFloat(obj[key]);
          }
        }
      }
    }
    return obj;
  }

  public processError(error) {
    if (error instanceof BaseError) {
      const errorMessage = (error.original && error.original.sqlMessage) || error;
      log('SEQError:', errorMessage);
      throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, errorMessage);
    } else {
      log('Error:', prettyError.render(error));
      throw new CustomError(ERROR_CODES.INTERNAL_SERVER_ERROR, error);
    }
  }

  private getOperatorObject(whereSubObj: ISVObject): ISVObject {
    const sequelizeObj = {};

    const symbols = Object.getOwnPropertySymbols(whereSubObj);
    for (const sym of symbols) {
      const sequelizeSym = this.getOperatorSymbol(sym);
      sequelizeObj[sequelizeSym] = whereSubObj[sym];
    }

    return sequelizeObj;
  }

  private getOperatorSymbol(sym: symbol): symbol {
    switch (sym) {
      case SVOp.eq:
        return Op.eq;
      case SVOp.ne:
        return Op.ne;
      case SVOp.gte:
        return Op.gte;
      case SVOp.gt:
        return Op.gt;
      case SVOp.lte:
        return Op.lte;
      case SVOp.lt:
        return Op.lt;
      case SVOp.not:
        return Op.not;
      case SVOp.is:
        return Op.is;
      case SVOp.in:
        return Op.in;
      case SVOp.notIn:
        return Op.notIn;
      case SVOp.like:
        return Op.like;
      case SVOp.notLike:
        return Op.notLike;
      case SVOp.notILike:
        return Op.notILike;
      case SVOp.regexp:
        return Op.regexp;
      case SVOp.notRegexp:
        return Op.notRegexp;
      case SVOp.iRegexp:
        return Op.iRegexp;
      case SVOp.notIRegexp:
        return Op.notIRegexp;
      case SVOp.between:
        return Op.between;
      case SVOp.notBetween:
        return Op.notBetween;
      case SVOp.overlap:
        return Op.overlap;
      case SVOp.contains:
        return Op.contains;
      case SVOp.contained:
        return Op.contained;
      case SVOp.and:
        return Op.and;
      case SVOp.or:
        return Op.or;
      case SVOp.any:
        return Op.any;
      case SVOp.all:
        return Op.all;
      default:
        return Op.eq;
    }
  }

  /**
   *
   * Note: Node.js API does not throw exceptions, and instead prefers the
   * asynchronous style of error handling described below.
   *
   * An error from the Stripe API or an otheriwse asynchronous error
   * will be available as the first argument of any Stripe method's callback:
   * E.g. stripe.customers.create({...}, function(err, result) {});
   *
   * Or in the form of a rejected promise.
   * E.g. stripe.customers.create({...}).then(
   *    function(result) {},
   *    function(err) {}
   *  );
   *
   * @param error
   */
  public processStripeError(error) {
    log('error.type', error.type);
    switch (error.type) {
      case 'StripeCardError':
        // A declined card error
        // => e.g. "Your card's expiration year is invalid."
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      case 'RateLimitError':
        // Too many requests made to the API too quickly
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
      default:
        // Handle any other types of unexpected errors
        throw new CustomError(ERROR_CODES.BUSINESS_LOGIC, error.message);
    }
  }
}

export const baseDAO = new BaseDAO();
