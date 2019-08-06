// Models
import models from '../models';

// Enums
import { JOIN_ATTRS } from '../common/enums';

// Utils
import { GetObjectKeysWithValues, GetOwnNestedProperty } from '../utils/objectfns';

// Interfaces
import { IToken } from '../interfaces/jwt/Token';
import { IKVObject } from '../interfaces/KVObject';
import { IApiPagedResponse } from '../interfaces/ApiRequestResponse';
import { ISequilizeIncludeObject } from '../interfaces/DAOInterfaces';
import { ISearchParams } from '../interfaces/params/SearchParams';
import { IPrescriptionsWS, IPrescriptionsParams } from '../interfaces/params/PrescriptionsWS';

// DAOs
import { BaseDAO } from './BaseDAO';

const log = require('bows')('API:DAO', 'Prescriptions');

export class PrescriptionsDAO extends BaseDAO {
  constructor() {
    // no op
    super();
  }

  //////////////////////////////////////////////////////////////////////////
  // LIST BASED ON QUERY PARAMS - GET /api/resources?param1=x&param2=34
  //////////////////////////////////////////////////////////////////////////

  public async list(token: IToken, parentWsIds: IKVObject, params: IPrescriptionsParams): Promise<IApiPagedResponse<IPrescriptionsWS>> {
    try {
      log('list: ParentWsIds:', parentWsIds, 'params:', params);

      // convert params into where clause
      const searchObj = this.GetSearchObj(parentWsIds, params);

      // get the data from db via sequilize
      const results = await models.Prescriptions.findAndCountAll({
        where: searchObj.where,
        order: searchObj.order,
        offset: searchObj.pagination.offset,
        limit: searchObj.pagination.limit,
        // GQL requires Sub-Object IDs
        include: this.getJoinIncludeAry(searchObj)
      });

      log('list: count:', results.count, 'rows.length:', results.rows.length);
      // we return plain objects, rather than sequilize wrapper
      return {
        totalRecords: results.count, // total records
        page: searchObj.pagination.offset / searchObj.pagination.limit,
        pageSize: searchObj.pagination.limit,
        totalPages: this.GetTotalPages(results.count, searchObj.pagination.limit),
        rows: results.rows.map(result => result.get({ plain: true }))
      };
    } catch (error) {
      this.processError(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // GET ONE - GET /api/resources/:id
  //////////////////////////////////////////////////////////////////////////

  public async get(token: IToken, parentWsIds: IKVObject, params: IPrescriptionsParams): Promise<IPrescriptionsWS> {
    try {
      log('get: ParentWsIds:', parentWsIds, 'params:', params);

      // convert params into where clause
      const searchObj = this.GetSearchObj(parentWsIds, params);

      const result = await models.Prescriptions.findOne({
        where: searchObj.where,
        // GQL requires Sub-Object IDs
        include: this.getJoinIncludeAry(searchObj)
      });

      log('get: done');
      // we return plain objects, rather than sequilize wrapper
      return result ? result.get({ plain: true }) : null;
    } catch (error) {
      this.processError(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // CREATE - POST /api/resources + JSON body
  //////////////////////////////////////////////////////////////////////////

  public async create(token: IToken, parentWsIds: IKVObject, ws: IPrescriptionsWS): Promise<IPrescriptionsWS> {
    try {
      log('create: ParentWsIds:', parentWsIds, 'WS:', ws);
      const result = await models.Prescriptions.create({
        // ws fields
        ...ws,
        // parent resource IDs
        ...parentWsIds,
        // set id to undefined
        id: undefined
      });

      log('create: done');
      // we return the data objects ONLY
      return result.get({ plain: true });
    } catch (error) {
      this.processError(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE - PUT /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  public async update(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): Promise<number> {
    try {
      log('update: ParentWsIds:', parentWsIds, 'ID:', id, 'WS:', ws);

      // result: first element is always the number of affected rows, while the second element
      // is the actual affected rows (only supported in postgres with options.returning true.)
      const result = await models.Prescriptions.update(
        {
          // ws fields
          ...ws,
          // set id to our known value
          id
        },
        {
          where: { ...parentWsIds, id }
        }
      );

      log('update: affected rows', result[0]);
      // return rows affected
      return result[0];
    } catch (error) {
      this.processError(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // UPDATE only some fields - PATCH /api/resources/:id + JSON body
  //////////////////////////////////////////////////////////////////////////

  public async patch(token: IToken, parentWsIds: IKVObject, id: number, ws: IPrescriptionsWS): Promise<number> {
    try {
      log('patch: ParentWsIds:', parentWsIds, 'ID:', id, 'WS:', ws);

      // get fields to update - we exclude undefined values
      // note that we do include fields with null values
      const fields = GetObjectKeysWithValues(ws);

      // result: first element is always the number of affected rows, while the second element
      // is the actual affected rows (only supported in postgres with options.returning true.)
      const result = await models.Prescriptions.update(
        {
          // ws fields
          ...ws,
          // set id to our known value
          id
        },
        {
          where: { ...parentWsIds, id },
          // update only specified fields
          fields
        }
      );

      log('patch: affected rows', result[0]);
      // return rows affected
      return result[0];
    } catch (error) {
      this.processError(error);
    }
  }

  //////////////////////////////////////////////////////////////////////////
  // DELETE - DELETE /api/resources/:id
  //////////////////////////////////////////////////////////////////////////

  public async delete(token: IToken, parentWsIds: IKVObject, id: number): Promise<number> {
    try {
      log('delete: ParentWsIds:', parentWsIds, 'ID:', id);

      // delete multiple instances, or set their deletedAt timestamp to the current time
      // if paranoid is enabled.
      // result: The number of destroyed rows
      const result = await models.Prescriptions.destroy({
        where: { ...parentWsIds, id }
      });

      log('delete: deleted rows', result);
      // return rows deleted
      return result;
    } catch (error) {
      this.processError(error);
    }
  }

  /**
   * Helper function to re-use with getXyz and listXyz requests
   * Returns an array of JOIN models as used by Sequilize
   * @param searchObj Object containing the search criteria
   */
  private getJoinIncludeAry(searchObj: ISearchParams): ISequilizeIncludeObject[] {
    const includes: ISequilizeIncludeObject[] = [];

    // let value = GetOwnNestedProperty(searchObj, 'join.skills');
    // if (value) {
    //   includes.push({
    //     model: models.UserSkill,
    //     attributes: value === JOIN_ATTRS.IDS ? ['id'] : undefined
    //   });
    // }

    return includes.length > 0 ? includes : undefined;
  }
}

export const prescriptionsDAO = new PrescriptionsDAO();

