
import {RedisKeyType, RedisValueType, StringOrNullType} from "./RedisDeclares";

export default interface RedisStringCommands {

	setVal(key:RedisKeyType, value:RedisValueType):Promise<boolean>;

	setNx(key:RedisKeyType, value:RedisValueType):Promise<boolean>;

	setEx(key:RedisKeyType, value:RedisValueType,timeoutOfSeconds: number):Promise<boolean>;

	getVal(key:RedisKeyType):Promise<StringOrNullType>;

}