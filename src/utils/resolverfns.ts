import { CompareArrays } from './objectfns';

export const IsDeleteOp = (arg: any): boolean => {
  const type = typeof arg;

  if (arg === null) return false;
  if (type === 'string') return arg.startsWith('-');
  if (type === 'number') return arg < 0;
};

// export const IsQueryFieldRequested = (op: any, path: string, isFromField: boolean = false): boolean => {
export const IsQueryFieldRequested = (op: any, path: string): boolean => {
  if (!op || !path) return false;

  const properties = path.split('.');
  // let opObj = op.operation;
  // let opObj = isFromField ? op.fieldNodes : op.operation;
  let opObj = op.fieldNodes;

  const queryPath = [];

  for (const prop of properties) {
    const node = getFieldNode(opObj, prop);
    if (node) {
      queryPath.push(node.name.value);
      // next time around we want to search within the found Field
      opObj = node.selectionSet;
    }
  }

  return CompareArrays(properties, queryPath);
};

//////////////////////////////////////////////////////
/// HELPERS
//////////////////////////////////////////////////////

const getFieldNode = (node: any, fieldName: string): any => {
  if (node.kind === undefined) {
    // we will get here the first time around as fieldNodes is an array
    // and does not have 'kind' property
    for (const item of node || []) {
      if (item.kind === 'Field') {
        if (item.name.value === fieldName) {
          return item;
        }
      }
    }
  } else if (node.kind === 'OperationDefinition') {
    for (const item of node.selectionSet.selections) {
      if (item.kind === 'Field') {
        if (item.name.value === fieldName) {
          return item;
        }
      }
    }
  } else if (node.kind === 'SelectionSet') {
    for (const item of node.selections) {
      if (item.kind === 'Field') {
        if (item.name.value === fieldName) {
          return item;
        }
      }
    }
  } else if (node.kind === 'Field') {
    if (node.name.value === fieldName) {
      return node;
    }
  }

  // not found
  return null;
};
