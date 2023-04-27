

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import IoredisConnectionFactory from "./open/badman/redis/ioredis/IoredisConnectionFactory";
import RedisStandaloneConfiguration from "./open/badman/redis/RedisStandaloneConfiguration";
import RedisTemplate from "./open/badman/redis/RedisTemplate";
import {RedisKeyType, RedisValueType, StringOrNullType} from "./open/badman/redis/RedisDeclares";
import RedisConnection from "./open/badman/redis/RedisConnection";
import RedisCommands from "./open/badman/redis/RedisCommands";
import RedisLock from "./open/badman/redis/RedisLock";
import RedisStringCommands from "./open/badman/redis/RedisStringCommands";
import RedisSetCommands from "./open/badman/redis/RedisSetCommands";
import RedisKeyCommands from "./open/badman/redis/RedisKeyCommands";
import RedisListCommands from "./open/badman/redis/RedisListCommands";
import RedisConnectionFactory from "./open/badman/redis/RedisConnectionFactory";
import RedisClusterConnection from "./open/badman/redis/RedisClusterConnection";
import RedisGeoCommands from "./open/badman/redis/RedisGeoCommands";
import RedisHashCommands from "./open/badman/redis/RedisHashCommands";
import RedisSentinelConnection from "./open/badman/redis/RedisSentinelConnection";
import RedisZSetCommands from "./open/badman/redis/RedisZSetCommands";
import SimpleRedisConnectionFactory from "./open/badman/redis/redis/SimpleRedisConnectionFactory";


export default class BadmanRedis {

	async main(){
		await SingletonObjectFactory2.init<Logging>(Logging);

		let properties:RedisStandaloneConfiguration = {
			password: 'foo',
			db:2,
			port: 5000,
			host: 'localhost'
		}
		let logger:Logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(BadmanRedis.name);
		await SingletonObjectFactory2.initWithArgs(RedisTemplate,[	new IoredisConnectionFactory(properties,logger)]);

		let redisTemplate:RedisTemplate = SingletonObjectFactory2.Instance(RedisTemplate.name);
		logger.info(await redisTemplate.getVal('v3:demo'));

		// @ts-ignore
		//await redisTemplate.geoAdd('s1',['116.404352','39.876672','begin','117.404352','39.876672','end']);

		logger.info(await redisTemplate.geoDist('s1','begin','end','m'));

		//logger.info(await redisTemplate.geoList('s1','begin','end'));
	}
}

// (async ()=>{
// 	await new BadmanRedis().main();
// })();


export {
	SimpleRedisConnectionFactory,
	RedisZSetCommands,
	RedisSentinelConnection,
	RedisHashCommands,
	RedisGeoCommands,
	RedisClusterConnection,
	RedisConnectionFactory,
	RedisListCommands,
	RedisKeyCommands,
	RedisSetCommands,
	RedisStringCommands,
	RedisLock,
	RedisCommands,
	RedisConnection,
	RedisTemplate,
	IoredisConnectionFactory,
	RedisStandaloneConfiguration,
	RedisKeyType,
	RedisValueType,
	StringOrNullType
}