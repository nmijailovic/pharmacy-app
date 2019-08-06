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
import { User } from './qlfields/Users';
import { IUsersParams, IUsersWS } from '../interfaces/params/UsersWS';

// Services
import { usersService } from '../services/UsersService';

// Resolvers
// import { CreateOrSaveXyz } from './XyzResolver';

// Joins
import { GetUserJoinObject } from './common/ResolverJoins';

const log = require('bows')('API:GQL', 'UsersResolver');

// Keep service layer in resolvers

////////////////////////////////////////////////////////////
/// LIST
////////////////////////////////////////////////////////////

const ListUsers = async (token: IToken, parentWsIds: IKVObject, queryParams: IUsersParams, ctx: IGQLContext = undefined): Promise<IApiPagedResponse<User>> => {
  // params
  // perform any transformation on queryParams here if required
  const params: IUsersParams = {
    ...queryParams,
    join: GetUserJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await usersService.list(token, parentWsIds, params);

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
    rows: resultObj.rows.map(row => new User(token, parentFieldCtx, row))
  };
};

////////////////////////////////////////////////////////////
/// GET
////////////////////////////////////////////////////////////

const GetUser = async (token: IToken, parentWsIds: IKVObject, queryParams: IUsersParams, ctx: IGQLContext = undefined) => {
  // params
  // perform any transformation on queryParams here if required
  const params: IUsersParams = {
    ...queryParams,
    join: GetUserJoinObject(ctx)
  };

  // execute the service layer operation
  // args are token, parentWsIds, params
  const resultObj = await usersService.get(token, parentWsIds, params);

  // we use parentFieldCtx so we can pass parent values into the Field Resolver to be used in queries if
  // required
  const parentFieldCtx: IKVObject = null;

  // map result to a class (this is so resolver can decide if it needs to load children elements)
  // we should ONLY return ids of Children objects (as they will be loaded via resolver)
  return new User(token, parentFieldCtx, resultObj as any);
};

////////////////////////////////////////////////////////////
/// CREATE OR SAVE
////////////////////////////////////////////////////////////

const CreateOrSaveUser = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<User> => {
  log('CreateOrSaveUser: ws:', ws);

  // if we have negative id then delete
  if (IsDeleteOp(ws.id)) {
    ws.id = Math.abs(ws.id);
    const _ = await DeleteUser(token, parentWsIds, ws);
    return null;
  }

  // if we have id then save, otherwise create
  const user = ws.id ? await SaveUser(token, parentWsIds, ws, ctx) : await CreateUser(token, parentWsIds, ws, ctx);

  // Create or Save Sub Objects
  // const subObjectParentWsIds: IKVObject = {}
  // Single Field - if (obj.subObject) await CreateOrSaveSubObject(token, subObjectParentWsIds, subObjectWS,
  // ctx); Arrays - for (const item of obj.subObjectAry || []) await CreateOrSaveSubObject(token,
  // subObjectParentWsIds, subObjectWS, ctx);

  // perform Get operation ONLY for top level Objects (ie. do not do it for SubObjects)
  // return GetUser(token, parentWsIds, { id: user.id }, ctx);
  // NOTE: we can do below as Top Level Object is doing a FULL re-read including Sub Objects
  return null;
};

const CreateUser = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IUsersWS> => {
  // remove all sub objects as we can only save direct values into table
  log('CreateUser: clean non primitives');
  const userWS = CloneObjectPrimitives(ws) as IUsersWS;

  // create a record in db from ws (with validations checked)
  log('CreateUser: create db record');
  const newUserWS = await usersService.create(token, parentWsIds, userWS);

  // return ws
  log('CreateUser: done');
  return newUserWS;
};

const SaveUser = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<IUsersWS> => {
  // search for the record in db
  log('SaveUser: search record:', ws.id);
  const userDb = await usersService.get(token, parentWsIds, { id: ws.id });
  if (userDb) {
    // if found, check for modifications using ws against db object
    log('SaveUser: record found:', userDb.id);
    const modified = CompareObjectProps(ws, userDb);

    log('SaveUser: record modified:', modified);
    if (modified) {
      // remove all non primitive values (sub-objects)
      log('SaveUser: clean non primitives');
      const userWS = CloneObjectPrimitives(ws) as IUsersWS;

      // execute patch in db (with validations checked)
      log('CreateUser: patch db record');
      const cnt = await usersService.patch(token, parentWsIds, userDb.id, userWS);
      // if record was updated, log it
      if (cnt && cnt > 0) {
        log('SaveUser: record:', userDb.id, 'patched');
        Object.assign(userDb, userWS);
      }
    }
  } else {
    throw new CustomError(ERROR_CODES.ENTITY_NOT_FOUND, `User: ${ws.id} NOT found!`);
  }

  log('SaveUser: done');
  return userDb;
};

const DeleteUser = async (token: IToken, parentWsIds: IKVObject, ws: IKVObject, ctx: IGQLContext = undefined): Promise<number> => {
  // delete a record in db from ws (with validations checked)
  log('DeleteUser: delete db record');
  const cnt = await usersService.delete(token, parentWsIds, ws.id);

  // return cnt
  log('DeleteUser: done', cnt);
  return cnt;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

export { ListUsers, GetUser, CreateOrSaveUser, DeleteUser };

