import { Request, Response } from 'express';

import { prettyError } from '../errors/PrettyError';

// Enums
import { API_STATUS } from '../common/enums';
// Utils
import { CheckJwt } from '../utils/jwt';

const log = require('bows')('API:Controller', 'PathNotFoundController');

export class PathNotFoundController {
  // entry point for OLD way of calling API in the form of getXyz, createXyz etc
  // we want to have REST API End Points here, which are handled by xyzFn
  public root(req: Request, res: Response) {
    log(
      '>>>>>',
      req.method,
      req.url,
      req.query,
      req.body,
      'Cookie:',
      req.headers.cookie !== undefined,
      'X-App-Token:',
      req.headers['x-app-token'] !== undefined
    );

    console.log('path not found');
    res.status(API_STATUS.NOT_FOUND).json({
      errorCode: API_STATUS.NOT_FOUND,
      errorText: req.url + ' - path not found'
    });
  }
}

export const pathNotFoundController = new PathNotFoundController();
