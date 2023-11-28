

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

	async hashGetAll (key: RedisKeyType): Promise<Record<string, string>> {
		return this.connection.redisClientInstance().hgetall(key);
	}

	async hashSet (key: RedisKeyType, entry: Map<RedisValueType, RedisValueType> | object): Promise<number>{
		return this.connection.redisClientInstance().hset(key,entry);
	}

	async hashSetNx (key: RedisKeyType,  field: string | Buffer, value: string | Buffer | number): Promise<number> {
		return (await this.connection.redisClientInstance().hsetnx(key,field,value));
	}

	async hashLen (key: RedisKeyType): Promise<number> {
		return (await this.connection.redisClientInstance().hlen(key));
	}

	async hashStrlen (key: RedisKeyType, field: RedisKeyType): Promise<number>{
		return (await this.connection.redisClientInstance().hstrlen(key,field));
	}

	async hashValues (key: RedisKeyType): Promise<string[]>{
		return (await this.connection.redisClientInstance().hvals(key));
	}

	async hashDel (key: RedisKeyType, ...fields: RedisKeyType[]): Promise<number> {

		return (await this.connection.redisClientInstance().hdel(key,...fields));
	}

	async hashExists (key: RedisKeyType, field: RedisKeyType): Promise<boolean> {
		let n:number =  await this.connection.redisClientInstance().hexists(key,field);
		return n===0?false:true;
	}

}