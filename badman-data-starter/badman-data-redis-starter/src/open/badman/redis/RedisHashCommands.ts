

import {RedisKeyType, RedisValueType, StringOrNullType} from "./RedisDeclares";


export default interface RedisHashCommands {

	hashSet(key: RedisKeyType, entry: Map<RedisValueType, RedisValueType> | object): Promise<number>;

	hashSetNx(key: RedisKeyType,  field: string | Buffer, value: string | Buffer | number): Promise<number>;

	hashGet(key: RedisKeyType, field: RedisKeyType): Promise<StringOrNullType>;

	hashGetAll(key: RedisKeyType ): Promise<Record<string, string>>;

	hashLen(key: RedisKeyType): Promise<number>;

	hashStrlen(key: RedisKeyType, field: RedisKeyType): Promise<number>;

	hashValues(key: RedisKeyType): Promise<string[]>;

	hashDel(key: RedisKeyType,...fields:RedisKeyType[]):Promise<number>;

	hashExists(key: RedisKeyType, field: RedisKeyType):Promise<boolean>;

}