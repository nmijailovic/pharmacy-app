// Enums
import { JOIN_ATTRS, ERROR_CODES } from '../common/enums';
import CustomError from '../errors/CustomError';

// Utils
import { RemoveUndefinedValues, CompareObjectProps, CloneObjectPrimitives } from '../utils/objectfns';
import { IsDeleteOp, IsQueryFieldRequested } from '../utils/resolverfns';

// Interfaces
import { IToken } from '../interfaces/jwt/Token';
import { IKVObject } from '../interfaces/KVObject';
import { IGQLContext } from '../interfaces/GQLContext';
import { IApiPagedResponse } from '../interfaces/ApiRequestResponse';

// WS Models
import { Courier } from './qlfields/Couriers';
import { ICouriersParams, ICouriersWS } from '../interfaces/params/CouriersWS';

// Services
import { couriersService } from '../services/CouriersService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetCourierJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'CouriersResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListCouriers = async (token: IToken, parentWsIds: IKVObject, queryParams: ICouriersParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<Courier>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: ICouriersParams = {
    ...queryParams,
    join: GetCourierJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await couriersService.list(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return {
    totalRecords: resultObj.totalRecords,
    page: resultObj.page,
    pageSize: resultObj.pageSize,
    totalPages: resultObj.totalPages,
    rows: resultObj.rows.map(row => new Courier(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetCourier = async (token: IToken, parentWsIds: IKVObject, queryParams: ICouriersParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: ICouriersParams = {
    ...queryParams,
    join: GetCourierJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await couriersService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new Courier(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSaveCourier = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<Courier> => {
  log('CreateOrSaveCourier: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeleteCourier(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const courier = ws.id ? await SaveCourier(token, parentWsIds, ws, ctx) : await CreateCourier(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetCourier(token, parentWsIds, { id: courier.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreateCourier = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<ICouriersWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreateCourier: clean non primitives');
  const courierWS = CloneObjectPrimitives(ws) as ICouriersWS;

  // create a record in db from ws (with validations checked)
  log('CreateCourier: create db record');
  const newCourierWS = await couriersService.create(token, parentWsIds, courierWS);

  // return ws
  log('CreateCourier: done');
  return newCourierWS;
};

const SaveCourier = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<ICouriersWS> => {
  // search for the record in db
  log('SaveCourier: search record:', ws.id);
  const courierDb = await couriersService.get(token, parentWsIds, { id: ws.id });
  if (courierDb) {
    // if found, check for modifications using ws against db object
    log('SaveCourier: record found:', courierDb.id);
    const modified = CompareObjectProps(ws, courierDb);

    log('SaveCourier: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SaveCourier: clean non primitives');
      const courierWS = CloneObjectPrimitives(ws) as ICouriersWS;

      // execute patch in db (with validations checked)
      log('CreateCourier: patch db record');
      const cnt = await couriersService.patch(token, parentWsIds, courierDb.id, courierWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SaveCourier: record:', courierDb.id, 'patched');
        Object.assign(courierDb, courierWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `Courier: ${ws.id} NOT found!`);
  }

  log('SaveCourier: done');
  return courierDb;
};

const DeleteCourier = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeleteCourier: delete db record');
  const cnt = await couriersService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeleteCourier: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListCouriers, GetCourier, CreateOrSaveCourier, DeleteCourier };

