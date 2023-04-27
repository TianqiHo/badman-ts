

import {Redis} from "ioredis";
import RedisConnection from "../RedisConnection";
import RedisGeoCommands from "../RedisGeoCommands";
import RedisHashCommands from "../RedisHashCommands";
import RedisKeyCommands from "../RedisKeyCommands";
import RedisListCommands from "../RedisListCommands";
import RedisSetCommands from "../RedisSetCommands";
import RedisStringCommands from "../RedisStringCommands";
import RedisZSetCommands from "../RedisZSetCommands";
import IoredisGeoCommands from "./IoredisGeoCommands";
import IoredisHashCommands from "./IoredisHashCommands";
import IoredisStringCommands from "./IoredisStringCommands";
import IoredisZSetCommands from "./IoredisZSetCommands";



export default class IoredisConnection implements RedisConnection{

	private readonly redisClient:Redis;

	private closed:boolean;

	constructor (redisClient:Redis) {
		this.closed = false;
		this.redisClient = redisClient;
	}

	redisClientInstance():Redis{
		return this.redisClient;
	}

	redisGeoCommands (): RedisGeoCommands {
		return new IoredisGeoCommands(this);
	}

	redisHashCommands (): RedisHashCommands {
		return new IoredisHashCommands(this);
	}

	redisKeyCommands (): RedisKeyCommands {
		return undefined;
	}

	redisListCommands (): RedisListCommands {
		return undefined;
	}

	redisSetCommands (): RedisSetCommands {
		return undefined;
	}

	redisZSetCommands (): RedisZSetCommands {
		return new IoredisZSetCommands(this);
	}

	redisStringCommands (): RedisStringCommands {
		return new IoredisStringCommands(this);
	}

	close (reconnect?: boolean): void {
		this.redisClient.disconnect(reconnect);
		this.closed = true;
	}

	isClosed (): boolean {
		return this.closed;
	}

	async open () :Promise<boolean>{
		try {
			await this.redisClient.connect();
		} catch (e) {
			//todo


			return false;
		}
		return true;
	}

}