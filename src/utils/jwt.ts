// JWT token decipher
import * as JwtDecode from 'jwt-decode';
import { IncomingHttpHeaders } from 'http2';

// Enums
import { ERROR_CODES } from '../common/enums';

// Interfaces
import { IToken } from '../interfaces/jwt/Token';
import CustomError from '../errors/CustomError';

const log = require('bows')('API:JWT', 'Utils');

// NOTE these OPEN ROUTES are now managed in 2 places - in Proxy and in API
const OPEN_ROUTES_REGEXPS = [
  new RegExp('/api/login'),
  new RegExp('/api/signup'),
  // Used for Social Logins
  new RegExp('/api/auth/\\w'),
  new RegExp('/api/auth/\\w/callback'),
  // OLD API open end points - should review and remove once we are fully moved to GraphQL
  new RegExp('/api/resetPassword'),
  new RegExp('/api/setNewPassword'),
  new RegExp('/api/getJobTitles'),
  new RegExp('/api/getSkills'),
  new RegExp('/api/getCertificate'),
  new RegExp('/api/createEmail'),
  new RegExp('/api/getJobAd'),
  new RegExp('/api/getOrganizationInviting'),
  new RegExp('/api/updateOrganizationStaffInvitation'),
  new RegExp('/api/removeOrganizationStaffInvitation'),
  // GraphQL
  new RegExp('/api/open/graphql')
];

const ANANAS_ADMIN_TOKEN: IToken = {
  aud: null,
  exp: null,
  iat: null,
  iss: null,
  sub: null,
  user: {
    id: null,
    email: 'open@open.com.au',
    isAdmin: true,
    Organisations: []
  }
};

export const CheckJwt = (headers: IncomingHttpHeaders, url?: string): IToken => {
  let token: IToken = null;

  // Check if we have a header['x-app-token'] where Proxy stores the JWT Token
  const accessToken = headers['x-app-token'] as string;
  log('X-App-Token:', !!accessToken);
  if (!accessToken) {
    // we will ALLOW for 2 cases here

    // 1) OPEN route
    // if user is accessing "open" route, we will allow full access (as open schema is alredy only allowing access to publicly avaialable info)
    if (url) {
      log('Checking if URL', url, 'is an OPEN route');
      for (const regexp of OPEN_ROUTES_REGEXPS) {
        if (url.match(regexp)) {
          log('Matched an OPEN route - returning a dummy JWT');
          return ANANAS_ADMIN_TOKEN;
        }
      }
    }

    // 2) Development Environment
    if (process.env.NODE_ENV !== 'production') {
      log('Non Production environment - returning a dummy JWT');
      return ANANAS_ADMIN_TOKEN;
    }

    // if everything else failed, we thrown an error
    log('JWT Token is missing');
    throw new CustomError(ERROR_CODES.UNAUTHORIZED, 'JWT Token is missing');
  }

  // we have a JWT token - decode and return
  token = JwtDecode(accessToken);
  log('JWT:', token);

  return token;
};

// export const CheckJwt = (headers: IncomingHttpHeaders): IToken => {
//   let token: IToken = null;

//   // Check if we have a header['x-app-token'] where Proxy stores the JWT Token
//   const accessToken = headers['x-app-token'] as string;
//   if (!accessToken) {
//     throw new CustomError(ERROR_CODES.UNAUTHORIZED, 'Token is invalid');
//   }

//   // log('JWT[x-app-token]:', accessToken);
//   // decode the token
//   token = JwtDecode(accessToken);
//   log('JWT:', token);

//   return token;
// };
