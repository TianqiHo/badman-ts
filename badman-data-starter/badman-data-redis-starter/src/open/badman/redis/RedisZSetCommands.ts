
import {RedisKeyType, RedisValueType} from "./RedisDeclares";


export default interface RedisZSetCommands{


	zSetRem(key: RedisKeyType, ...members: RedisValueType[]): Promise<number>;

}