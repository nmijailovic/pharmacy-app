import { API_STATUS } from '../common/enums';

export interface IApiResponseObject {
  errorCode: API_STATUS;
  errorText: string;
}

// We would eventually need to remove T = any and just leave T
export interface IApiPagedResponse<T = any> {
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rows: T[];
}
