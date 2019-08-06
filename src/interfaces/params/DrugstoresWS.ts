// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface IDrugstoresWS {
  readonly id?: number
  readonly businessName: string
  readonly contactName?: string
  readonly phoneNumber?: string
  readonly address1: string
  readonly address2?: string
  readonly state: string
  readonly postcode: string
  readonly hoursOpening: string
  readonly hoursClosing: string
  readonly updatedAt: Date
  readonly createdAt: Date
  readonly deletedAt?: Date
  // JOIN fields
  // readonly Xyz?: any;
}

// export interface DrugstoresInputWS {
//     readonly id?: number
//     readonly businessName: string
//     readonly contactName?: string
//     readonly phoneNumber?: string
//     readonly address1: string
//     readonly address2?: string
//     readonly state: string
//     readonly postcode: string
//     readonly hoursOpening: string
//     readonly hoursClosing: string
//     readonly updatedAt: Date
//     readonly createdAt: Date
//     readonly deletedAt?: Date
// }

export interface IDrugstoresParams extends IBaseParams {
  // ws: IDrugstoresWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

