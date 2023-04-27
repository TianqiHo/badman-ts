


import RedisClusterConnection from "../RedisClusterConnection";
import RedisConnection from "../RedisConnection";
import RedisConnectionFactory from "../RedisConnectionFactory";
import RedisSentinelConnection from "../RedisSentinelConnection";


export default class SimpleRedisConnectionFactory implements RedisConnectionFactory{


	getClusterConnection (): RedisClusterConnection {
		return undefined;
	}

	getConnection (): RedisConnection {
		return undefined;
	}

	getSentinelConnection (): RedisSentinelConnection {
		return undefined;
	}


}