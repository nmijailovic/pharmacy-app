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
import { Doctor } from './qlfields/Doctors';
import { IDoctorsParams, IDoctorsWS } from '../interfaces/params/DoctorsWS';

// Services
import { doctorsService } from '../services/DoctorsService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetDoctorJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'DoctorsResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListDoctors = async (token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<Doctor>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: IDoctorsParams = {
    ...queryParams,
    join: GetDoctorJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await doctorsService.list(token, parentWsIds, params);

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
    rows: resultObj.rows.map(row => new Doctor(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetDoctor = async (token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: IDoctorsParams = {
    ...queryParams,
    join: GetDoctorJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await doctorsService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new Doctor(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSaveDoctor = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<Doctor> => {
  log('CreateOrSaveDoctor: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeleteDoctor(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const doctor = ws.id ? await SaveDoctor(token, parentWsIds, ws, ctx) : await CreateDoctor(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetDoctor(token, parentWsIds, { id: doctor.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreateDoctor = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IDoctorsWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreateDoctor: clean non primitives');
  const doctorWS = CloneObjectPrimitives(ws) as IDoctorsWS;

  // create a record in db from ws (with validations checked)
  log('CreateDoctor: create db record');
  const newDoctorWS = await doctorsService.create(token, parentWsIds, doctorWS);

  // return ws
  log('CreateDoctor: done');
  return newDoctorWS;
};

const SaveDoctor = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IDoctorsWS> => {
  // search for the record in db
  log('SaveDoctor: search record:', ws.id);
  const doctorDb = await doctorsService.get(token, parentWsIds, { id: ws.id });
  if (doctorDb) {
    // if found, check for modifications using ws against db object
    log('SaveDoctor: record found:', doctorDb.id);
    const modified = CompareObjectProps(ws, doctorDb);

    log('SaveDoctor: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SaveDoctor: clean non primitives');
      const doctorWS = CloneObjectPrimitives(ws) as IDoctorsWS;

      // execute patch in db (with validations checked)
      log('CreateDoctor: patch db record');
      const cnt = await doctorsService.patch(token, parentWsIds, doctorDb.id, doctorWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SaveDoctor: record:', doctorDb.id, 'patched');
        Object.assign(doctorDb, doctorWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `Doctor: ${ws.id} NOT found!`);
  }

  log('SaveDoctor: done');
  return doctorDb;
};

const DeleteDoctor = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeleteDoctor: delete db record');
  const cnt = await doctorsService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeleteDoctor: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListDoctors, GetDoctor, CreateOrSaveDoctor, DeleteDoctor };

