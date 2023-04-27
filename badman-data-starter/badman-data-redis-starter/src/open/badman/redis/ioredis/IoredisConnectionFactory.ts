

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Redis} from "ioredis";
import {Logger} from "log4js";
import RedisClusterConnection from "../RedisClusterConnection";
import RedisConnection from "../RedisConnection";
import RedisConnectionFactory from "../RedisConnectionFactory";
import RedisSentinelConnection from "../RedisSentinelConnection";
import RedisStandaloneConfiguration from "../RedisStandaloneConfiguration";
import RedisTemplate from "../RedisTemplate";
import IoredisClientConfiguration from "./IoredisClientConfiguration";
import IoredisConnection from "./IoredisConnection";


export default class IoredisConnectionFactory implements RedisConnectionFactory{

	private redisStandaloneConfiguration:RedisStandaloneConfiguration;

	private ioredisClientConfiguration:IoredisClientConfiguration;

	private readonly redisClient:Redis;

	private readonly logger:Logger;

	constructor (redisStandaloneConfiguration:RedisStandaloneConfiguration,logger?:Logger,
	             ioredisClientConfiguration?:IoredisClientConfiguration) {

		if(logger){
			this.logger = logger;
		}else{
			this.logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(RedisTemplate.name);
		}

		this.redisStandaloneConfiguration = redisStandaloneConfiguration;

		if(ioredisClientConfiguration){
			this.ioredisClientConfiguration = ioredisClientConfiguration;
		}

		this.redisClient = new Redis(redisStandaloneConfiguration);
		this.redisClient.on('error', (err) => this.logger.error('Redis Client Error', err));
		this.redisClient.on('connect', () => this.logger.info('The client is initiating a connection to the server...'));
		this.redisClient.on('ready', () => this.logger.info('The client successfully initiated the connection to the server...'));
		this.redisClient.on('end', () => this.logger.info('The client disconnected the connection to the server...'));
		this.redisClient.on('reconnecting', (err) => this.logger.info('The client is trying to reconnect to the server...'));

		if(redisStandaloneConfiguration.lazyConnect){
			this.redisClient.connect((err, result)=>{
				if(err)this.logger.error('Redis Connect Error -> ',err);
			});
		}

	}

	getConnection (): RedisConnection {
		return new IoredisConnection(this.redisClient);
	}

	getSentinelConnection (): RedisSentinelConnection {
		throw new Error('Not Implement yet')
	}

	getClusterConnection (): RedisClusterConnection {
		throw new Error('Not Implement yet');
	}
}