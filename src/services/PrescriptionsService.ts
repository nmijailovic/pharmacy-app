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
import { IPrescriptionsWS, IPrescriptionsParams } from '../interfaces/params/PrescriptionsWS';

// DAOs
import { prescriptionsDAO } from '../daos/PrescriptionsDAO';

// Base Service
import { BaseService } from './BaseService';

const log = require('bows')('API:Service', 'Prescriptions');

export class PrescriptionsService extends BaseService {
  constructor() {
    super();
  }

  //////////////////////////////////////////////////////////////////////////
  // LIST BASED ON QUERY PARAMS - GET /api/resources?param1=x&param2=34
  //////////////////////////////////////////////////////////////////////////

  private validateList(token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams): void {
    log('validateList');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    // const schema = Joi.object()
    // .unknown(false)
    // .keys({
    //  id: Joi.number().optional(),
    //  IssuingDoctorId: Joi.number().optional(),
    //  IssuedToUserId: Joi.number().optional(),
    //  ProvidedByDrugstoreId: Joi.number().optional(),
    //  ProvidedAt: Joi.date().optional(),
    //  DeliveredByCourierId: Joi.number().optional(),
    //  DeliveredAt: Joi.date().optional(),
    //  expiryDate: Joi.date().optional(),
    //  notes: Joi.string().optional(),
    //  createdAt: Joi.date().optional(),
    //  deletedAt: Joi.date().optional(),
    //  updatedAt: Joi.date().optional(),
    // });

    // this.validateObject(queryParams, schema);
  }

  @validate
  public async list(token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams): Promise<IApiPagedResponse<IPrescriptionsWS>> {
    log('list');
    try {
      // we remove undefined values; note that we do include fields with null values
      RemoveUndefinedValues(queryParams);

      // execute the DAO logic
      const resultsWS = await prescriptionsDAO.list(token, parentWsIds, queryParams);

      log('list: done');
      return resultsWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // GET ONE - GET /api/resources/:id
  //////////////////////////////////////////////////////////////////////////

  private validateGet(token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams): void {
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
  public async get(token: IToken, parentWsIds: IKVObject, queryParams: IPrescriptionsParams): Promise<IPrescriptionsWS> {
    log('get');
    try {
      // we remove undefined values; note that we do include fields with null values
      RemoveUndefinedValues(queryParams);

      // execute the DAO logic
      const resultWS = await prescriptionsDAO.get(token, parentWsIds, queryParams);

      // check that we have found the Entity
      this.checkEntityFound(queryParams.id as number, resultWS ? 1 : 0, 'Prescriptions');

      log('get: done');
      return resultWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // CREATE - POST /api/resources + JSON body
  //////////////////////////////////////////////////////////////////////////

  // private prepareCreate(token: IToken, parentWsIds: IKVObject, ws: IPrescriptionsWS): void {
  //   log('prepareCreate');
  //
  //   // preparing the fields that are NOT to be sent from the client but are in db (default values)
  //   // ws.isInternal = false;
  //   // ws.ModuleId = null;
  // }

  private validateCreate(token: IToken, parentWsIds: IKVObject, ws: IPrescriptionsWS): void {
    log('validateCreate');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: Joi.number().forbidden(),
        IssuingDoctorId: Joi.number().required(),
        IssuedToUserId: Joi.number().required(),
        ProvidedByDrugstoreId: Joi.number().optional().allow(null),
        ProvidedAt: Joi.date().optional().allow(null),
        DeliveredByCourierId: Joi.number().required(),
        DeliveredAt: Joi.date().optional().allow(null),
        expiryDate: Joi.date().optional().allow(null),
        notes: Joi.string().optional().allow(null),
        createdAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
      });
    this.validateObject(ws, schema);
  }

  // decorators are executed in the order
  // @prepare
  @validate
  public async create(token: IToken, parentWsIds: IKVObject, ws: IPrescriptionsWS): Promise<IPrescriptionsWS> {
    log('create');
    try {
      // execute the DAO logic
      const resultWS = await prescriptionsDAO.create(token, parentWsIds, ws);

      log('create: done');
      return resultWS;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE - PUT /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  private validateUpdate(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): void {
    log('validateUpdate');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: ws.id !== undefined ? Joi.number().valid(id) : Joi.number().forbidden(),
        IssuingDoctorId: Joi.number().required(),
        IssuedToUserId: Joi.number().required(),
        ProvidedByDrugstoreId: Joi.number().optional().allow(null),
        ProvidedAt: Joi.date().optional().allow(null),
        DeliveredByCourierId: Joi.number().required(),
        DeliveredAt: Joi.date().optional().allow(null),
        expiryDate: Joi.date().optional().allow(null),
        notes: Joi.string().optional().allow(null),
        createdAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
      });

    this.validateObject(ws, schema);
  }

  @validate
  public async update(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): Promise<number> {
    log('update');
    try {
      // execute the DAO logic
      const cnt = await prescriptionsDAO.update(token, parentWsIds, id, ws);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Prescriptions');

      log('update: done');
      return cnt;
    } catch (error) {
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE only some fields - PATCH /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  private validatePatch(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): void {
    log('validatePatch');

    // validate Parent Resource IDs
    this.validateParentWsIds(parentWsIds);

    // validate the request
    const schema = Joi.object()
      .unknown(false)
      .keys({
        id: ws.id !== undefined ? Joi.number().valid(id) : Joi.number().forbidden(),
        IssuingDoctorId: Joi.number().optional(),
        IssuedToUserId: Joi.number().optional(),
        ProvidedByDrugstoreId: Joi.number().optional().allow(null),
        ProvidedAt: Joi.date().optional().allow(null),
        DeliveredByCourierId: Joi.number().optional(),
        DeliveredAt: Joi.date().optional().allow(null),
        expiryDate: Joi.date().optional().allow(null),
        notes: Joi.string().optional().allow(null),
        createdAt: Joi.date().forbidden(),
        deletedAt: Joi.date().forbidden(),
        updatedAt: Joi.date().forbidden(),
      });

    this.validateObject(ws, schema);
  }

  @validate
  public async patch(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): Promise<number> {
    log('patch');
    try {
      // execute the DAO logic
      const cnt = await prescriptionsDAO.patch(token, parentWsIds, id, ws);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Prescriptions');

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
      const cnt = await prescriptionsDAO.delete(token, parentWsIds, id);

      // check that we have found the Entity
      this.checkEntityFound(id, cnt, 'Prescriptions');

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

export const prescriptionsService = new PrescriptionsService();

