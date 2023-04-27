

import {RedisKeyType, RedisValueType} from "../RedisDeclares";
import RedisZSetCommands from "../RedisZSetCommands";
import IoredisConnection from "./IoredisConnection";


export default class IoredisZSetCommands implements RedisZSetCommands{


	private connection:IoredisConnection;

	constructor (connection:IoredisConnection) {
		this.connection = connection;
	}

	zSetRem (key: RedisKeyType, ...members: RedisValueType[]): Promise<number> {
		return this.connection.redisClientInstance().zrem(key,members.flat(1));
	}



}