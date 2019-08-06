export interface BaseError extends Error {
  readonly name: string;
  readonly message: string;
  readonly stack: string;
}
export interface BaseErrorConstructor {
  new (message: string): BaseError;
  readonly prototype: BaseError;
}

export const BaseError: BaseErrorConstructor = <any>class BaseError {
  public constructor(message: string) {
    Object.defineProperty(this, 'name', {
      get: () => (this.constructor as any).name
    });
    Object.defineProperty(this, 'message', {
      get: () => message
    });
    Error.captureStackTrace(this, this.constructor);
  }
};
(BaseError as any).prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;
