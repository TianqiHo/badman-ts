

import {DEFAULT_REDIS_OPTIONS} from "ioredis/built/redis/RedisOptions";
import IoredisConnectionFactory from "./ioredis/IoredisConnectionFactory";
import RedisConnectionFactory from "./RedisConnectionFactory";


export default class RedisAccesscor {


	protected redisConnectionFactory:RedisConnectionFactory;

	constructor (redisConnectionFactory:RedisConnectionFactory) {
		if(redisConnectionFactory){
			this.redisConnectionFactory = redisConnectionFactory
		}else{
			this.redisConnectionFactory = new IoredisConnectionFactory(DEFAULT_REDIS_OPTIONS);
		}
	}
}