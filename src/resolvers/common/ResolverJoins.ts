// Enums
import { JOIN_ATTRS } from '../../common/enums';

// Utils
// import { IsQueryFieldRequested } from '../../utils/resolverfns';
import { IntersectArrays } from '../../utils/arrayfns';

// Interfaces
import { IGQLContext } from '../../interfaces/GQLContext';

export const GetSearchIds = (searchIds: any[] = [], filterIds: any[] = []): any[] => {
  let result = searchIds;

  if (filterIds.length > 0) {
    result = IntersectArrays(searchIds, filterIds);
  }

  return result;
};

export const GetCourierJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

export const GetDoctorJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

export const GetDrugstoreJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

export const GetPrescriptionItemJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

export const GetPrescriptionJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

export const GetUserJoinObject = (ctx: IGQLContext): any => {
  // const fieldName = getFieldName(ctx);

  // const joinObj = ctx && {
  //   venues: IsQueryFieldRequested(ctx.op, `${fieldName}.Venues`) ? JOIN_ATTRS.IDS : undefined,
  //   users: IsQueryFieldRequested(ctx.op, `${fieldName}.Users`) ? JOIN_ATTRS.IDS : undefined
  // };
  // return joinObj;
  return undefined;
};

////////////////////////////////////////////////////////////
/// HELPERS
////////////////////////////////////////////////////////////

const getFieldName = (ctx: IGQLContext): string => {
  let fieldName = (ctx && ctx.op.fieldName) || '';

  // with ListXyz we have rows in the middle
  if (fieldName.startsWith('List')) fieldName += '.rows';

  return fieldName;
};
