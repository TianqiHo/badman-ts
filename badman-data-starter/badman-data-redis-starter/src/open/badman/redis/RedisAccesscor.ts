

import {DEFAULT_REDIS_OPTIONS} from "ioredis/built/redis/RedisOptions";
import IoredisConnectionFactory from "./ioredis/IoredisConnectionFactory";
import RedisConnectionFactory from "./RedisConnectionFactory";


export default class RedisAccesscor {


	protected redisConnectionFactory:RedisConnectionFactory;

	protected logger:any;

	constructor (redisConnectionFactory:RedisConnectionFactory) {
		if(redisConnectionFactory){
			this.redisConnectionFactory = redisConnectionFactory;
			this.logger = this.redisConnectionFactory.getLogger();
		}else{
			this.redisConnectionFactory = new IoredisConnectionFactory(DEFAULT_REDIS_OPTIONS);
			this.logger = console;
		}
	}
}