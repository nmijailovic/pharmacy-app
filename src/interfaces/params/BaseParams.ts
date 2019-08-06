// https://www.typescriptlang.org/docs/handbook/interfaces.html

import { SORT_DIR, JOIN_ATTRS } from '../../common/enums';

// Type aliases
export type timestamp = number;

export interface IBaseParams {
  // Sorting Parameters, example: _sort={ by=id,name, dir=ASC,DESC }
  // If sortDir is omitted default is ASC for that field
  _order?: {
    by?: string[];
    dir?: SORT_DIR[];
  };
  // sortBy?: [string];
  // sortDir?: [SORT_DIR];

  // Pagination Parameters
  _paginate?: {
    page?: number;
    pageSize?: number;
  };
  // page?: number;
  // pageSize?: number;

  // Join Tables
  join?: {
    [key: string]: JOIN_ATTRS;
  };
  // Used to filter Linking Tables
  link?: {
    [key: string]: any;
  };
}
