// https://www.typescriptlang.org/docs/handbook/interfaces.html

// Enums
import { SORT_DIR } from '../../common/enums';

export interface ISearchParams {
  // Sorting Parameters, example: _sort={ by=id,name, dir=ASC,DESC }
  order?: string[][];

  // Pagination Parameters
  pagination?: { limit?: number; offset?: number };

  // Join Tables
  join?: {
    [key: string]: any;
  };
  // Used to filter Linking Tables
  link?: {
    [key: string]: any;
  };

  // Where clause params
  where?: any;
}
