interface IOperator {
  eq: symbol;
  ne: symbol;
  gte: symbol;
  gt: symbol;
  lte: symbol;
  lt: symbol;
  not: symbol;
  is: symbol;
  in: symbol;
  notIn: symbol;
  like: symbol;
  notLike: symbol;
  iLike: symbol;
  notILike: symbol;
  regexp: symbol;
  notRegexp: symbol;
  iRegexp: symbol;
  notIRegexp: symbol;
  between: symbol;
  notBetween: symbol;
  overlap: symbol;
  contains: symbol;
  contained: symbol;
  and: symbol;
  or: symbol;
  any: symbol;
  all: symbol;
}

export const Op: IOperator = {
  eq: Symbol('eq'),
  ne: Symbol('ne'),
  gte: Symbol('gte'),
  gt: Symbol('gt'),
  lte: Symbol('lte'),
  lt: Symbol('lt'),
  not: Symbol('not'),
  is: Symbol('is'),
  in: Symbol('in'),
  notIn: Symbol('notIn'),
  like: Symbol('like'),
  notLike: Symbol('notLike'),
  iLike: Symbol('iLike'),
  notILike: Symbol('notILike'),
  regexp: Symbol('regexp'),
  notRegexp: Symbol('notRegexp'),
  iRegexp: Symbol('iRegexp'),
  notIRegexp: Symbol('notIRegexp'),
  between: Symbol('between'),
  notBetween: Symbol('notBetween'),
  overlap: Symbol('overlap'),
  contains: Symbol('contains'),
  contained: Symbol('contained'),
  and: Symbol('and'),
  or: Symbol('or'),
  any: Symbol('any'),
  all: Symbol('all')
};

export interface ISVObject {
  // [Op.eq]: any;
  [s: symbol]: any;
}
