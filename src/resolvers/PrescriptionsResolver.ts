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
import { Prescription } from './qlfields/Prescriptions';
import { IPrescriptionsParams, IPrescriptionsWS } from '../interfaces/params/PrescriptionsWS';

// Services
import { prescriptionsService } from '../services/PrescriptionsService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetPrescriptionJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'PrescriptionsResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListPrescriptions = async (token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<Prescription>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: IPrescriptionsParams = {
    ...queryParams,
    join: GetPrescriptionJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await prescriptionsService.list(token, parentWsIds, params);

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
    rows: resultObj.rows.map(row => new Prescription(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetPrescription = async (token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: IPrescriptionsParams = {
    ...queryParams,
    join: GetPrescriptionJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await prescriptionsService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new Prescription(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSavePrescription = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<Prescription> => {
  log('CreateOrSavePrescription: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeletePrescription(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const prescription = ws.id ? await SavePrescription(token, parentWsIds, ws, ctx) : await CreatePrescription(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetPrescription(token, parentWsIds, { id: prescription.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreatePrescription = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IPrescriptionsWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreatePrescription: clean non primitives');
  const prescriptionWS = CloneObjectPrimitives(ws) as IPrescriptionsWS;

  // create a record in db from ws (with validations checked)
  log('CreatePrescription: create db record');
  const newPrescriptionWS = await prescriptionsService.create(token, parentWsIds, prescriptionWS);

  // return ws
  log('CreatePrescription: done');
  return newPrescriptionWS;
};

const SavePrescription = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IPrescriptionsWS> => {
  // search for the record in db
  log('SavePrescription: search record:', ws.id);
  const prescriptionDb = await prescriptionsService.get(token, parentWsIds, { id: ws.id });
  if (prescriptionDb) {
    // if found, check for modifications using ws against db object
    log('SavePrescription: record found:', prescriptionDb.id);
    const modified = CompareObjectProps(ws, prescriptionDb);

    log('SavePrescription: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SavePrescription: clean non primitives');
      const prescriptionWS = CloneObjectPrimitives(ws) as IPrescriptionsWS;

      // execute patch in db (with validations checked)
      log('CreatePrescription: patch db record');
      const cnt = await prescriptionsService.patch(token, parentWsIds, prescriptionDb.id, prescriptionWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SavePrescription: record:', prescriptionDb.id, 'patched');
        Object.assign(prescriptionDb, prescriptionWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `Prescription: ${ws.id} NOT found!`);
  }

  log('SavePrescription: done');
  return prescriptionDb;
};

const DeletePrescription = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeletePrescription: delete db record');
  const cnt = await prescriptionsService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeletePrescription: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListPrescriptions, GetPrescription, CreateOrSavePrescription, DeletePrescription };

