import { Request } from 'express';

import { prettyError } from '../errors/PrettyError';

// Custom Error
import CustomError from '../errors/CustomError';

// Enums
import { API_STATUS } from '../common/enums';

// Interfaces
import { IBaseParams } from '../interfaces/params/BaseParams';
import { IApiResponseObject } from '../interfaces/ApiRequestResponse';

const log = require('bows')('API:Controller', 'Base');

export class BaseController {
  /**
   * Process Query Parameters related to Sorting and Pagination
   * @param query Request Query Params object
   */
  public GetListParams(query: any): IBaseParams {
    const params: IBaseParams = {};

    if (query._order) {
      const obj = JSON.parse(query._order);
      params._order = {
        by: obj.by && obj.by.split(','),
        dir: obj.dir && obj.dir.split(',')
      };
    }

    if (query._paginate) {
      const obj = JSON.parse(query._paginate);
      params._paginate = {
        page: obj.page && parseInt(obj.page, 10),
        pageSize: obj.pageSize && parseInt(obj.pageSize, 10)
      };
    }

    // remove the Paging / Sorting keys
    delete query._order;
    delete query._paginate;

    Object.assign(params, query);

    return params;
  }

  // /**
  //  * Extract URL path variables (representing parent resource IDs)
  //  * e.g. /api/resources/:ResourceId/sub-resource
  //  *
  //  * We provide a Default Implementation here returning an empty object
  //  */
  // protected getParentResourceIds(req: Request): IKVObject {
  //   return {};
  // }

  /**
   * Provide an object with relevant errorCode and errorMessage
   * @param error Error thrown
   */
  public processError(error: any): IApiResponseObject {
    log('Error:', prettyError.render(error));

    if (error instanceof CustomError) {
      // these are our business logic errors
      return error.toApiResponseObject();
    } else {
      // these are unhandled internal server errors
      return {
        errorCode: API_STATUS.INTERNAL_SERVER_ERROR,
        errorText: error.message
      };
    }
  }
}
