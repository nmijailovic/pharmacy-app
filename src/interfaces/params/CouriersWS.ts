// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface ICouriersWS {
  readonly id?: number
  readonly businessName: string
  readonly contactName: string
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

// export interface CouriersInputWS {
//     readonly id?: number
//     readonly businessName: string
//     readonly contactName: string
//     readonly phoneNumber?: string
//     readonly address1: string
//     readonly address2?: string
//     readonly state: string
//     readonly postcode: string
//     readonly createdAt: Date
//     readonly updatedAt: Date
//     readonly deletedAt?: Date
// }

export interface ICouriersParams extends IBaseParams {
  // ws: ICouriersWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

