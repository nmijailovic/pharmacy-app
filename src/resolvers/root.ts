import { buildSchema } from 'graphql';

// constants
import { STATUS } from '../common/constants';

// Enums
// import { STATUS } from '../common/enums';

// utils
import { CheckJwt } from '../utils/jwt';
import { GetOwnNestedProperty } from '../utils/objectfns';

// Params
import { ICouriersParams } from '../interfaces/params/CouriersWS';
import { IDoctorsParams } from '../interfaces/params/DoctorsWS';
import { IDrugstoresParams } from '../interfaces/params/DrugstoresWS';
import { IPrescriptionsParams, IPrescriptionsWS } from '../interfaces/params/PrescriptionsWS';
import { IUsersParams, IUsersWS } from '../interfaces/params/UsersWS';

// Resolvers
import { GetCourier, CreateOrSaveCourier } from './CouriersResolver';
import { ListDoctors } from './DoctorsResolver';
import { ListDrugstores } from './DrugstoresResolver';
import { ListPrescriptions } from './PrescriptionsResolver';
import { GetUser, CreateOrSaveUser } from './UsersResolver';

import { CommonSchemaDef } from './schema/CommonSchemaDef';
import { OpenSchemaDef } from './schema/OpenSchemaDef';
import { SchemaDef } from './schema/SchemaDef';

const log = require('bows')('API:GQL', 'RootResolver');

////////////////////////////////////////////////////////
/// NEW FIELD ADDED or REMOVED
///
/// Add / Remove the field(s) to src/models/File.js
/// Add / Remove the field(s) to src/interface/params/FileWS.ts
/// Add / Remove the field(s) to src/interface/params/FileParams.ts
/// Add / Remove relevant validation fields to src/services/FileService.ts
/// Modify getListParams in src/controllers/FileController.ts
/// Add / Remove the field(s) to relevant schema objects in src/resolvers/schema.ts
/// Add / Remove the field(s) in relevant Business Logic in src/business_logic/*.ts
////////////////////////////////////////////////////////

// graphQL stuff
// Construct a schema, using GraphQL schema language
const openSchema = buildSchema(CommonSchemaDef + OpenSchemaDef);
const schema = buildSchema(CommonSchemaDef + SchemaDef);

// The root provides a resolver function for each API endpoint
const root = {
  GetCourier: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const queryParams: ICouriersParams = {
      id: obj.id
    };

    const result = await GetUser(token, null, queryParams, { obj, args, op });
    return result;
  },

  CreateOrSaveCourier: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const result = await CreateOrSaveUser(token, null, obj.user, { obj, args, op });
    return result;
  },

  GetUser: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const queryParams: IUsersParams = {
      id: obj.id
    };

    const result = await GetUser(token, null, queryParams, { obj, args, op });
    return result;
  },

  CreateOrSaveUser: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const result = await CreateOrSaveUser(token, null, obj.user, { obj, args, op });
    return result;
  },

  ListDoctors: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const queryParams: IDoctorsParams = {
      id: obj.ids
    };

    const results = await ListDoctors(token, null, queryParams, { obj, args, op });
    return results;
  },

  ListDrugstores: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const queryParams: IDrugstoresParams = {
      id: obj.ids
    };

    const results = await ListDrugstores(token, null, queryParams, { obj, args, op });
    return results;
  },

  ListPrescriptions: async (obj, args, op) => {
    const token = CheckJwt(args.headers, args.client.parser.incoming.baseUrl);

    const queryParams: IPrescriptionsParams = {
      id: obj.id
    };

    const results = await ListPrescriptions(token, null, queryParams, { obj, args, op });
    return results.rows;
  }

};

export { openSchema, schema, root };
