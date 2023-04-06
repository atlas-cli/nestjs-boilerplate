import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';

export function plainToJson<V, T>(type, value: Document<T>): V {
  const object: any = plainToInstance(type, value.toJSON());
  object._id = value._id.toString();
  return object;
}
