import * as Joi from 'joi';

// Utils
import { RemoveUndefinedValues } from '../utils/objectfns';

// Decorators
import { validate } from '../decorators/ValidateDecorator';
import { prepare } from '../decorators/PrepareDecorator';

// Interfaces
import { IToken } from '../interfaces/jwt/Token';
import { IKVObject } from '../interfaces/KVObject';
import { IApiPagedResponse } from '../interfaces/ApiRequestResponse';

// Params
import { IDoctorsWS, IDoctorsParams } from '../interfaces/params/DoctorsWS';

// DAOs
import { doctorsDAO } from '../daos/DoctorsDAO';

// Base Service
import { BaseService } from './BaseService';

const log = require('bows')('API:Service', 'Doctors');

export class DoctorsService extends BaseService {
  constructor() {
    super();
  }

  //////////////////////////////////////////////////////////////////////////
  // LIST BASED ON QUERY PARAMS - GET /api/resources?param1=x&param2=34
  //////////////////////////////////////////////////////////////////////////

  private validateList(token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams): void {
    log('validateList');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    // const schema = Joi.object()
    // .unknown(false)
    // .keys({
    //  id: Joi.number().optional(),
    //  firstName: Joi.string().optional(),
    //  lastName: Joi.string().optional(),
    //  phoneNumber: Joi.string().optional(),
    //  licenseNo: Joi.string().optional(),
    //  licenseExpiry: Joi.date().optional(),
    //  practiceType: Joi.string().optional(),
    //  createdAt: Joi.date().optional(),
    //  updatedAt: Joi.date().optional(),
    //  deletedAt: Joi.date().optional(),
    // });

    // this.validateObject(queryParams, schema);
  }

  @validate
  public async list(token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams): Promise<IApiPagedResponse<IDoctorsWS>> {
    log('list');
    try {
      // we remove undefined values; note that we do include fields with null values
      RemoveUndefinedValues(queryParams);

      // execute the DAO logic
      const resultsWS = await doctorsDAO.list(token, parentWsIds, queryParams);

      log('list: done');
      return resultsWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // GET ONE - GET /api/resources/:id
  //////////////////////////////////////////////////////////////////////////

  private validateGet(token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams): void {
    log('validateGet');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: Joi.number().required(),

        // joins
        join: Joi.object().optional()
      });

    this.validateObject(queryParams, schema);
  }

  @validate
  public async get(token: IToken, parentWsIds: IKVObject, queryParams: IDoctorsParams): Promise<IDoctorsWS> {
    log('get');
    try {
      // we remove undefined values; note that we do include fields with null values
      RemoveUndefinedValues(queryParams);

      // execute the DAO logic
      const resultWS = await doctorsDAO.get(token, parentWsIds, queryParams);

      // check that we have found the Entity
      this.checkEntityFound(queryParams.id as number, resultWS ? 1 : 0, 'Doctors');

      log('get: done');
      return resultWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // CREATE - POST /api/resources + JSON body
  //////////////////////////////////////////////////////////////////////////

  // private prepareCreate(token: IToken, parentWsIds: IKVObject, ws: IDoctorsWS): void {
  //   log('prepareCreate');
  //
  //   // preparing the fields that are NOT to be sent from the client but are in db (default values)
  //   // ws.isInternal = false;
  //   // ws.ModuleId = null;
  // }

  private validateCreate(token: IToken, parentWsIds: IKVObject, ws: IDoctorsWS): void {
    log('validateCreate');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: Joi.number().forbidden(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        licenseNo: Joi.string().required(),
        licenseExpiry: Joi.date().required(),
        practiceType: Joi.string().required(),
        createdAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
      });
    this.validateObject(ws, schema);
  }

  // decorators are executed in the order
  // @prepare
  @validate
  public async create(token: IToken, parentWsIds: IKVObject, ws: IDoctorsWS): Promise<IDoctorsWS> {
    log('create');
    try {
      // execute the DAO logic
      const resultWS = await doctorsDAO.create(token, parentWsIds, ws);

      log('create: done');
      return resultWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE - PUT /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  private validateUpdate(token: IToken, parentWsIds: IKVObject, id: number, ws: IDoctorsWS): void {
    log('validateUpdate');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: ws.id !== undefined ? Joi.number().valid(id) : Joi.number().forbidden(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        licenseNo: Joi.string().required(),
        licenseExpiry: Joi.date().required(),
        practiceType: Joi.string().required(),
        createdAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
      });

    this.validateObject(ws, schema);
  }

  @validate
  public async update(token: IToken, parentWsIds: IKVObject, id: number, ws: IDoctorsWS): Promise<number> {
    log('update');
    try {
      // execute the DAO logic
      const cnt = await doctorsDAO.update(token, parentWsIds, id, ws);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Doctors');

      log('update: done');
      return cnt;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE only some fields - PATCH /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  private validatePatch(token: IToken, parentWsIds: IKVObject, id: number, ws: IDoctorsWS): void {
    log('validatePatch');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: ws.id !== undefined ? Joi.number().valid(id) : Joi.number().forbidden(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        licenseNo: Joi.string().optional(),
        licenseExpiry: Joi.date().optional(),
        practiceType: Joi.string().optional(),
        createdAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
      });

    this.validateObject(ws, schema);
  }

  @validate
  public async patch(token: IToken, parentWsIds: IKVObject, id: number, ws: IDoctorsWS): Promise<number> {
    log('patch');
    try {
      // execute the DAO logic
      const cnt = await doctorsDAO.patch(token, parentWsIds, id, ws);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Doctors');

      log('patch: done');
      return cnt;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // DELETE - DELETE /api/resources/:id
  //////////////////////////////////////////////////////////////////////////

  private validateDelete(token: IToken, parentWsIds: IKVObject, id: number): void {
    log('validateDelete');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object().keys({
      id: Joi.number().required()
    });

    this.validateObject({ id }, schema);
  }

  @validate
  public async delete(token: IToken, parentWsIds: IKVObject, id: number): Promise<number> {
    log('delete');
    try {
      // execute the DAO logic
      const cnt = await doctorsDAO.delete(token, parentWsIds, id);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Doctors');

      log('delete: done');
      return cnt;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // HELPERS
  //////////////////////////////////////////////////////////////////////////

  private validateParentWsIds(parentWsIds: IKVObject): void {
    log('validateParentWsIds');
    // check parentWsIds is set
    if (parentWsIds) {
      // validate Parent Resource IDs
      const parentWsIdsSchema = Joi.object().keys({
        // sample parent resource id validation - implement your relevant validations
        // UserId: Joi.number().required()
      });
      this.validateObject(parentWsIds, parentWsIdsSchema);
    }
  }
}

export const doctorsService = new DoctorsService();

