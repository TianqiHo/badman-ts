

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
	 /**
   * 设置哈希并设置过期时间
   * @param key 哈希键
   * @param entry 哈希字段和对应的值
   * @param ttl 过期时间（秒）
   * @returns 返回操作结果
   */
  async hashSetWithExpiry(key: RedisKeyType, entry: Map<RedisValueType, RedisValueType> | object, ttl: number): Promise<number> {
    // 设置哈希
    const result = await this.connection.redisClientInstance().hset(key, entry);

    // 设置过期时间
    await this.connection.redisClientInstance().expire(key, ttl);

    return result;
  }

  /**
   * 设置哈希并设置过期时间（毫秒）
   * @param key 哈希键
   * @param entry 哈希字段和对应的值
   * @param ttl 毫秒级过期时间
   * @returns 返回操作结果
   */
  async hashSetWithExpiryMs(key: RedisKeyType, entry: Map<RedisValueType, RedisValueType> | object, ttl: number): Promise<number> {
    // 设置哈希
    const result = await this.connection.redisClientInstance().hset(key, entry);

    // 设置过期时间（毫秒）
    await this.connection.redisClientInstance().pexpire(key, ttl);

    return result;
  }

}
