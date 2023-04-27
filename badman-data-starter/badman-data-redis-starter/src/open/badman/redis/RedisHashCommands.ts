

import {RedisKeyType, RedisValueType, StringOrNullType} from "./RedisDeclares";


export default interface RedisHashCommands {

	hashSet(key: RedisKeyType, entry: Map<RedisValueType, RedisValueType>): Promise<number>;

	hashGet(key: RedisKeyType, field: RedisKeyType): Promise<StringOrNullType>;

	hashStrlen(key: RedisKeyType, field: RedisKeyType): Promise<number>;

	hashValues(key: RedisKeyType): Promise<string[]>;

	hashDel(key: RedisKeyType,...fields:RedisKeyType[]):Promise<number>;

}