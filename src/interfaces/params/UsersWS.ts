// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface IUsersWS {
  readonly id?: number
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly phoneNumber?: string
  readonly address1: string
  readonly address2?: string
  readonly state: string
  readonly postcode: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt?: Date
  // JOIN fields
  // readonly Xyz?: any;
}

// export interface UsersInputWS {
//     readonly id?: number
//     readonly email: string
//     readonly firstName: string
//     readonly lastName: string
//     readonly phoneNumber?: string
//     readonly address1: string
//     readonly address2?: string
//     readonly state: string
//     readonly postcode: string
//     readonly createdAt: Date
//     readonly updatedAt: Date
//     readonly deletedAt?: Date
// }

export interface IUsersParams extends IBaseParams {
  // ws: IUsersWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

