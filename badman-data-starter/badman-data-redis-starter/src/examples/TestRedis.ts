import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import IoredisConnectionFactory from "../open/badman/redis/ioredis/IoredisConnectionFactory";
import RedisStandaloneConfiguration from "../open/badman/redis/RedisStandaloneConfiguration";
import RedisTemplate from "../open/badman/redis/RedisTemplate";

export default class TestRedis {

	async main(){
		await SingletonObjectFactory2.init<Logging>(Logging);

		let properties:RedisStandaloneConfiguration = {
			password: 'foobared',
			db:2,
			port: 7369,
			host: 'localhost'
		}

		let logger:Logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(TestRedis.name);
		await SingletonObjectFactory2.initWithArgs(RedisTemplate,[	new IoredisConnectionFactory(properties,logger)]);

		let redisTemplate:RedisTemplate = SingletonObjectFactory2.Instance(RedisTemplate.name);
		logger.info(await redisTemplate.getVal('v3:demo'));


		setTimeout(()=>{
			redisTemplate.destroy();
		},8000);

		// @ts-ignore
		//await redisTemplate.geoAdd('s1',['116.404352','39.876672','begin','117.404352','39.876672','end']);

		//logger.info(await redisTemplate.geoDist('s1','begin','end','m'));

		//logger.info(await redisTemplate.geoList('s1','begin','end'));
	}
}

(async ()=>{
	await new TestRedis().main();
})();