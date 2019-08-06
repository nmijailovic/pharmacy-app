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
import { PrescriptionItem } from './qlfields/PrescriptionItems';
import { IPrescriptionItemsParams, IPrescriptionItemsWS } from '../interfaces/params/PrescriptionItemsWS';

// Services
import { prescriptionItemsService } from '../services/PrescriptionItemsService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetPrescriptionItemJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'PrescriptionItemsResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListPrescriptionItems = async (token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionItemsParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<PrescriptionItem>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: IPrescriptionItemsParams = {
    ...queryParams,
    join: GetPrescriptionItemJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await prescriptionItemsService.list(token, parentWsIds, params);

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
    rows: resultObj.rows.map(row => new PrescriptionItem(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetPrescriptionItem = async (token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionItemsParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: IPrescriptionItemsParams = {
    ...queryParams,
    join: GetPrescriptionItemJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await prescriptionItemsService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new PrescriptionItem(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSavePrescriptionItem = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<PrescriptionItem> => {
  log('CreateOrSavePrescriptionItem: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeletePrescriptionItem(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const prescriptionItem = ws.id ? await SavePrescriptionItem(token, parentWsIds, ws, ctx) : await CreatePrescriptionItem(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetPrescriptionItem(token, parentWsIds, { id: prescriptionItem.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreatePrescriptionItem = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IPrescriptionItemsWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreatePrescriptionItem: clean non primitives');
  const prescriptionItemWS = CloneObjectPrimitives(ws) as IPrescriptionItemsWS;

  // create a record in db from ws (with validations checked)
  log('CreatePrescriptionItem: create db record');
  const newPrescriptionItemWS = await prescriptionItemsService.create(token, parentWsIds, prescriptionItemWS);

  // return ws
  log('CreatePrescriptionItem: done');
  return newPrescriptionItemWS;
};

const SavePrescriptionItem = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IPrescriptionItemsWS> => {
  // search for the record in db
  log('SavePrescriptionItem: search record:', ws.id);
  const prescriptionItemDb = await prescriptionItemsService.get(token, parentWsIds, { id: ws.id });
  if (prescriptionItemDb) {
    // if found, check for modifications using ws against db object
    log('SavePrescriptionItem: record found:', prescriptionItemDb.id);
    const modified = CompareObjectProps(ws, prescriptionItemDb);

    log('SavePrescriptionItem: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SavePrescriptionItem: clean non primitives');
      const prescriptionItemWS = CloneObjectPrimitives(ws) as IPrescriptionItemsWS;

      // execute patch in db (with validations checked)
      log('CreatePrescriptionItem: patch db record');
      const cnt = await prescriptionItemsService.patch(token, parentWsIds, prescriptionItemDb.id, prescriptionItemWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SavePrescriptionItem: record:', prescriptionItemDb.id, 'patched');
        Object.assign(prescriptionItemDb, prescriptionItemWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `PrescriptionItem: ${ws.id} NOT found!`);
  }

  log('SavePrescriptionItem: done');
  return prescriptionItemDb;
};

const DeletePrescriptionItem = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeletePrescriptionItem: delete db record');
  const cnt = await prescriptionItemsService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeletePrescriptionItem: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListPrescriptionItems, GetPrescriptionItem, CreateOrSavePrescriptionItem, DeletePrescriptionItem };

