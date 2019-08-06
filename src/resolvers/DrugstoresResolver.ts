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
import { Drugstore } from './qlfields/Drugstores';
import { IDrugstoresParams, IDrugstoresWS } from '../interfaces/params/DrugstoresWS';

// Services
import { drugstoresService } from '../services/DrugstoresService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetDrugstoreJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'DrugstoresResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListDrugstores = async (token: IToken, parentWsIds: IKVObject, queryParams: IDrugstoresParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<Drugstore>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: IDrugstoresParams = {
    ...queryParams,
    join: GetDrugstoreJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await drugstoresService.list(token, parentWsIds, params);

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
    rows: resultObj.rows.map(row => new Drugstore(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetDrugstore = async (token: IToken, parentWsIds: IKVObject, queryParams: IDrugstoresParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: IDrugstoresParams = {
    ...queryParams,
    join: GetDrugstoreJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await drugstoresService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new Drugstore(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSaveDrugstore = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<Drugstore> => {
  log('CreateOrSaveDrugstore: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeleteDrugstore(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const drugstore = ws.id ? await SaveDrugstore(token, parentWsIds, ws, ctx) : await CreateDrugstore(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetDrugstore(token, parentWsIds, { id: drugstore.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreateDrugstore = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IDrugstoresWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreateDrugstore: clean non primitives');
  const drugstoreWS = CloneObjectPrimitives(ws) as IDrugstoresWS;

  // create a record in db from ws (with validations checked)
  log('CreateDrugstore: create db record');
  const newDrugstoreWS = await drugstoresService.create(token, parentWsIds, drugstoreWS);

  // return ws
  log('CreateDrugstore: done');
  return newDrugstoreWS;
};

const SaveDrugstore = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IDrugstoresWS> => {
  // search for the record in db
  log('SaveDrugstore: search record:', ws.id);
  const drugstoreDb = await drugstoresService.get(token, parentWsIds, { id: ws.id });
  if (drugstoreDb) {
    // if found, check for modifications using ws against db object
    log('SaveDrugstore: record found:', drugstoreDb.id);
    const modified = CompareObjectProps(ws, drugstoreDb);

    log('SaveDrugstore: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SaveDrugstore: clean non primitives');
      const drugstoreWS = CloneObjectPrimitives(ws) as IDrugstoresWS;

      // execute patch in db (with validations checked)
      log('CreateDrugstore: patch db record');
      const cnt = await drugstoresService.patch(token, parentWsIds, drugstoreDb.id, drugstoreWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SaveDrugstore: record:', drugstoreDb.id, 'patched');
        Object.assign(drugstoreDb, drugstoreWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `Drugstore: ${ws.id} NOT found!`);
  }

  log('SaveDrugstore: done');
  return drugstoreDb;
};

const DeleteDrugstore = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeleteDrugstore: delete db record');
  const cnt = await drugstoresService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeleteDrugstore: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListDrugstores, GetDrugstore, CreateOrSaveDrugstore, DeleteDrugstore };

