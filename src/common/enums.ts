// https://www.typescriptlang.org/docs/handbook/enums.html

// REST API HTTP STATUS CODES: https://www.restapitutorial.com/httpstatuscodes.html
export enum API_STATUS {
  // SUCCESS
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // PROBLEM
  BAD_REQUEST = 400,
  UNAUTHORISED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422, // ie. validation failed

  // EXCEPTIONS
  INTERNAL_SERVER_ERROR = 500
}

// Used in Service and DAO layers to signify a type of the error
export enum ERROR_CODES {
  VALIDATION_LOGIC,
  BUSINESS_LOGIC = 400,
  UNAUTHORIZED = 401,
  ENTITY_NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

// DATABASE
export enum SORT_DIR {
  ASC = 'ASC',
  DESC = 'DESC'
}

// JOINS
export enum JOIN_ATTRS {
  IDS = 1,
  ALL
}

////////////////////////////////////////////////////////////////////////
// APPLICATION ENUMS
////////////////////////////////////////////////////////////////////////


