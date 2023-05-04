

import {RedisKeyType, RedisValueType, StringOrNullType} from "../RedisDeclares";
import RedisStringCommands from "../RedisStringCommands";
import IoredisConnection from "./IoredisConnection";


export default class IoredisStringCommands implements RedisStringCommands{


	private connection:IoredisConnection;

	private success:string = 'OK';

	constructor (connection:IoredisConnection) {
		this.connection = connection;
	}

	async getVal (key: RedisKeyType): Promise<StringOrNullType> {
		let value:StringOrNullType = await this.connection.redisClientInstance().get(key);
		return value;
	}

	async setVal (key: RedisKeyType, value: RedisValueType): Promise<boolean> {
		try {
			await this.connection.redisClientInstance().set(key, value);
		} catch (e) {
			return false;
		}
		return true;
	}

	async setNXValExpire (key: RedisKeyType, value: RedisValueType, secondsExpire: number | string): Promise<boolean> {

		let ok:string = await this.connection.redisClientInstance().set(key,value,'EX',secondsExpire,'NX');
		if(ok && ok === this.success){
			return true;
		}
		return false;
	}

	async setNx (key: RedisKeyType, value: RedisValueType): Promise<boolean> {
		let result:number = await this.connection.redisClientInstance().setnx(key,value);
		if(result===1){
			return true;
		}
		return false;
	}

	async setEx (key: RedisKeyType, value: RedisValueType,timeoutOfSeconds: number): Promise<boolean> {
		let ok:string = await this.connection.redisClientInstance().setex(key,timeoutOfSeconds,value);
		if(ok && ok === this.success){
			return true;
		}
		return false;
	}

}