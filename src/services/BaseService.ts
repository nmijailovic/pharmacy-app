import * as Joi from 'joi';
import * as moment from 'moment';

// Error
import CustomError from '../errors/CustomError';

// Enums
import { ERROR_CODES, SORT_DIR } from '../common/enums';

// Interfaces
import { IBaseParams } from '../interfaces/params/BaseParams';

const log = require('bows')('API:Service', 'Base');

export class BaseService {
  public validateObject(object, schema) {
    const { error } = Joi.validate(object, schema);
    if (error != null) {
      log('Error:', error.message);
      throw new CustomError(ERROR_CODES.VALIDATION_LOGIC, error.message);
    }
  }

  public checkEntityFound(id: number | string, cnt: number, name: string) {
    if (cnt !== 1) {
      throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `${name} with Id: ${id} NOT found`);
    }
  }

  /**
   * we want to search for the latest available data, ie. today, and in case we are just after midnight
   * and do not have today's data as yet, search for yesterday's data
   * @param token
   * @param parentWsIds
   * @param params
   */
  public GetViewHistoryParams(queryParams: IBaseParams): IBaseParams {
    // calculate today and yesterday
    const today = moment().endOf('day');
    // const yesterday = today.add(-1, 'day');

    // we search for the latest available data
    const historyParams = {
      ...queryParams,
      // TxDate: [today.format(), yesterday.format()],
      // sequelize works on UTC time, so with endOf day we are still good
      TxDate: today.format('YYYY-MM-DD')
      // _order: {
      //   by: ['TxDate'],
      //   dir: [SORT_DIR.DESC]
      // }
    };
    return historyParams;
  }
}
