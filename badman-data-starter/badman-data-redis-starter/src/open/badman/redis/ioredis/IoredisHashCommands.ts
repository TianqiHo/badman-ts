

import {RedisKeyType, RedisValueType, StringOrNullType} from "../RedisDeclares";
import RedisHashCommands from "../RedisHashCommands";
import IoredisConnection from "./IoredisConnection";


export default class IoredisHashCommands  implements RedisHashCommands{

	private connection:IoredisConnection;


	constructor (connection:IoredisConnection) {
		this.connection = connection;
	}

	async hashGet (key: RedisKeyType, field: RedisKeyType): Promise<StringOrNullType>{
		return this.connection.redisClientInstance().hget(key,field);
	}

	async hashSet (key: RedisKeyType, entry: Map<RedisValueType, RedisValueType>): Promise<number>{
		return await this.connection.redisClientInstance().hset(key,entry);
	}

	async hashStrlen (key: RedisKeyType, field: RedisKeyType): Promise<number>{
		return await this.connection.redisClientInstance().hstrlen(key,field);
	}

	async hashValues (key: RedisKeyType): Promise<string[]>{
		return await this.connection.redisClientInstance().hvals(key);
	}

	async hashDel (key: RedisKeyType, ...fields: RedisKeyType[]): Promise<number> {

		// @ts-ignore
		return  await this.connection.redisClientInstance().hdel(key,fields.flat(1));
	}

}