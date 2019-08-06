// https://www.typescriptlang.org/docs/handbook/interfaces.html

//   aud: 'access',
//   exp: 1553229658,
//   iat: 1553226058,
//   iss: 'AA',
//   sub: '69',
//   user: { id: 69, email: 'nesh@lambdas.io', isAdmin: false },
//   organisations: [ { id: 0 } ],
//   venues: []

export interface IToken {
  readonly aud: string;
  readonly exp: number;
  readonly iat: number;
  readonly iss: string;
  readonly sub: string;
  readonly user: ITokenUser;
}

interface ITokenUser {
  id: number;
  email: string;
  isAdmin: boolean;
  Organisations: ITokenOrganisation[];
}

interface ITokenOrganisation {
  id: number;
  isManager: boolean;
  Venues: ITokenVenue[];
}

interface ITokenVenue {
  id: number;
  isManager: boolean;
}
