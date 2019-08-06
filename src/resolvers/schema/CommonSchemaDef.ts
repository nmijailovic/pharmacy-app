///////////////////////////////////////////////////////////////////////////////////////////////////
// THIS IS COMMON SCHEMA DEFINITIONS, IE. ALL OTHER SCHEMAS WILL BE JOINED WITH THIS FILE
///////////////////////////////////////////////////////////////////////////////////////////////////

export const CommonSchemaDef = `
### SCALARS ###

scalar DateTime
scalar Date
scalar Timestamp

### INTERFACES ###

interface IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
}

### ENUMS ###

enum SORT_DIRECTION {
  ASC
  DESC
}

#################################
### COMMON TYPES
#################################

input Order {
  dir: [SORT_DIRECTION]
  by: [String]
}

input Paginate {
  page: Int
  pageSize: Int
}
`;
