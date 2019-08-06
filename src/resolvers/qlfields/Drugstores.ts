// Enums
import { JOIN_ATTRS } from '../../common/enums';

// Utils
import { RemoveUndefinedValues, GetOwnNestedProperty } from '../../utils/objectfns';
import { IsQueryFieldRequested } from '../../utils/resolverfns';
import { IsEmptyArray } from '../../utils/arrayfns';

// Interfaces
import { IToken } from '../../interfaces/jwt/Token';
import { IKVObject } from '../../interfaces/KVObject';
// import { IdAware } from '../../interfaces/IdAware';

// WS Models
import { IDrugstoresWS } from '../../interfaces/params/DrugstoresWS';
// import { SubObject } from './SubObject';
// import { SubObjectParams } from '../../interfaces/params/SubObjectWS';

// Services
// import { subObjectService } from '../../services/SubObjectService';

export class Drugstore {
  private token: IToken;

  // we use parentFieldCtx so parents can pass values into this Field Resolver to use in queries if required
  private parentFieldCtx: IKVObject;

  // Current Object fields
  // private DirectFieldId: number;

  // JOIN fields are returned as SubObject: [{ id: 34 }]
  // private SubObjectIds: IdAware[];

  // get SubObjectIds and other properties
  // note that arg name SubObjects MUST be exactly the same as what DAO returned for the sub-object
  constructor(token: IToken, parentFieldCtx: IKVObject, { /*SubObjects,*/ ...rest }: IDrugstoresWS) {
    this.token = token;
    this.parentFieldCtx = parentFieldCtx;

    // JOIN fields
    // this.SubObjectIds = SubObjects;

    // Current Object fields assigned by ...rest
    Object.assign(this, rest);
  }

  // resolves Drugstore.SubObjects field
  // note that arg name SubObjects MUST be exactly the same as what DAO returned for sub-object
  // public async SubObject(obj: any, args: any, op: any): Promise<SubObject> {
  //   if (!this.SubObjectId) return null;
  //
  //   const params: IDrugstoresParams = {
  //     id: this.DrugstoreId OR id: this.DrugstoreId.id
  //     join: GetSubObjectJoinObject(ctx)
  //   };
  //
  //   // args are token, parentWsIds, params
  //   const subObject = await certificateService.get(this.token, null, params);
  //
  //   // map result to a class (this is so resolver can decide if it needs to load children elements)
  //   // we should ONLY return ids of Children objects (as the full object will be loaded via the resolver)
  //   return subObject ? new SubObject(this.token, subObject) : null;
  // }

  // resolves Drugstore.SubObjects field
  // note that arg name SubObjects MUST be exactly the same as what DAO returned for sub-object
  // public async SubObjects(obj: any, args: any, op: any): Promise<SubObject[]> {
  //   if (IsEmptyArray(this.SubObjectsId)) return null;
  //
  //   const params: SubObjectParams = {
  //     id: this.SubObjectIds.map(item => item.id)
  //     join: GetSubObjectJoinObject(ctx)
  //   };
  //
  //   // args are token, parentWsIds, params
  //   const subObjects = await subObjectService.list(this.token, null, params);
  //
  //   // map result to a class (this is so resolver can decide if it needs to load children elements)
  //   // we should ONLY return ids of Children objects (as the full object will be loaded via the resolver)
  //   return subObjects.rows.map(row => new SubObject(this.token, row));
  // }
}

