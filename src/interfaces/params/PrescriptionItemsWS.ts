// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface IPrescriptionItemsWS {
  readonly id?: number
  readonly code: string
  readonly name: string
  readonly createdAt?: Date
  readonly updatedAt: Date
  readonly deletedAt?: Date
  // JOIN fields
  // readonly Xyz?: any;
}

// export interface PrescriptionItemsInputWS {
//     readonly id?: number
//     readonly code: string
//     readonly name: string
//     readonly createdAt?: Date
//     readonly updatedAt: Date
//     readonly deletedAt?: Date
// }

export interface IPrescriptionItemsParams extends IBaseParams {
  // ws: IPrescriptionItemsWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

