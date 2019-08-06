// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface IDoctorsWS {
  readonly id?: number
  readonly firstName: string
  readonly lastName: string
  readonly phoneNumber: string
  readonly licenseNo: string
  readonly licenseExpiry:
  readonly practiceType
  :
  string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt?: Date
  // JOIN fields
  // readonly Xyz?: any;
}

// export interface DoctorsInputWS {
//     readonly id?: number
//     readonly firstName: string
//     readonly lastName: string
//     readonly phoneNumber: string
//     readonly licenseNo: string
//     readonly licenseExpiry:
//     readonly practiceType: string
//     readonly createdAt: Date
//     readonly updatedAt: Date
//     readonly deletedAt?: Date
// }

export interface IDoctorsParams extends IBaseParams {
  // ws: IDoctorsWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

