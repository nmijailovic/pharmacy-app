// Interfaces
import { IKVObject } from '../interfaces/KVObject';

export interface ISequilizeIncludeObject {
  model: any;
  as?: string;
  attributes: string[];
  where?: IKVObject;
  through?: { where: IKVObject };
  required?: boolean;
}
