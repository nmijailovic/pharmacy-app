// import { timestamp } from './BaseParams';
import { IBaseParams } from './BaseParams';

/**
 * The interface representing DTO (Data Transfer Object)
 * TS interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
export interface IPrescriptionsWS {
  readonly id?: number
  readonly IssuingDoctorId: number
  readonly IssuedToUserId: number
  readonly ProvidedByDrugstoreId?: number
  readonly ProvidedAt?: Date
  readonly DeliveredByCourierId: number
  readonly DeliveredAt?: Date
  readonly expiryDate?:
  readonly notes
  ?:
  string
  readonly createdAt: Date
  readonly deletedAt?: Date
  readonly updatedAt: Date
  // JOIN fields
  // readonly Xyz?: any;
}

// export interface PrescriptionsInputWS {
//     readonly id?: number
//     readonly IssuingDoctorId: number
//     readonly IssuedToUserId: number
//     readonly ProvidedByDrugstoreId?: number
//     readonly ProvidedAt?: Date
//     readonly DeliveredByCourierId: number
//     readonly DeliveredAt?: Date
//     readonly expiryDate?:
//     readonly notes?: string
//     readonly createdAt: Date
//     readonly deletedAt?: Date
//     readonly updatedAt: Date
// }

export interface IPrescriptionsParams extends IBaseParams {
  // ws: IPrescriptionsWS;
  //
  // extra params here
  id?: number | number[];
  //
  // GraphQL sub object IDs to be included
  // join?: {
  //   subObject: boolean;
  // };
}

