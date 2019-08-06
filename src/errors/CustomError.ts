// Enums
import { API_STATUS, ERROR_CODES } from '../common/enums';

// import { ERROR_CODES } from './constants';

// Interfaces
import { IApiResponseObject } from '../interfaces/ApiRequestResponse';

// BaseError
import { BaseError } from './BaseError';

export default class CustomError extends BaseError {
  private errorCode: number;
  private date: Date;

  constructor(errorCode = ERROR_CODES.BUSINESS_LOGIC, error) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(error);

    // Custom debugging information
    this.errorCode = errorCode;
    this.date = new Date();
  }

  public toApiResponseObject(): IApiResponseObject {
    return {
      errorCode: this.mapErrorCodeToApiStatus(this.errorCode),
      errorText: this.message
    } as IApiResponseObject;
  }

  private mapErrorCodeToApiStatus(errorCode: ERROR_CODES): API_STATUS {
    switch (errorCode) {
      case ERROR_CODES.BUSINESS_LOGIC:
        return API_STATUS.BAD_REQUEST;

      case ERROR_CODES.UNAUTHORIZED:
        return API_STATUS.UNAUTHORISED;

      case ERROR_CODES.VALIDATION_LOGIC:
        return API_STATUS.UNPROCESSABLE_ENTITY;

      case ERROR_CODES.ENTITY_NOT_FOUND:
        return API_STATUS.NOT_FOUND;

      default:
        return API_STATUS.INTERNAL_SERVER_ERROR;
    }
  }
}
