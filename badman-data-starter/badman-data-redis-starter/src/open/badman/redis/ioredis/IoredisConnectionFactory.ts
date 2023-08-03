

import {Logging, SingletonObjectFactory2, SyncInitializing} from "badman-core";
import {Redis} from "ioredis";
import {Logger} from "log4js";
import RedisClusterConnection from "../RedisClusterConnection";
import RedisConnection from "../RedisConnection";
import RedisConnectionFactory from "../RedisConnectionFactory";
import RedisLock from "../RedisLock";
import RedisSentinelConnection from "../RedisSentinelConnection";
import RedisStandaloneConfiguration from "../RedisStandaloneConfiguration";
import RedisTemplate from "../RedisTemplate";
import IoredisClientConfiguration from "./IoredisClientConfiguration";
import IoredisConnection from "./IoredisConnection";
import IoredisLockFactory from "./IoredisLockFactory";


export default class IoredisConnectionFactory implements RedisConnectionFactory,SyncInitializing{

	private redisStandaloneConfiguration:RedisStandaloneConfiguration;

	private ioredisClientConfiguration:IoredisClientConfiguration;

	private readonly redisClient:Redis;

	private readonly logger:Logger;

	private ioredisLockFactory:IoredisLockFactory;


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

	}

	async afterInitialized () {
		if(!!this.redisStandaloneConfiguration.lazyConnect){
			await this.redisClient.connect((err, result)=>{
				if(err){
					this.logger.error('Redis Connect Error -> ',err);
				}
			});
		}

		if(!!this.redisStandaloneConfiguration.useLock){
			this.ioredisLockFactory = new IoredisLockFactory(this.redisClient);
		}
	}

	getLock():RedisLock{
		if(this.ioredisLockFactory){
			return this.ioredisLockFactory.getRedLock();
		}else{
			new Error('Property useLock must be true');
		}
	}

	getConnection (): RedisConnection {
		this.logger.debug('create a new IoredisConnection');
		return new IoredisConnection(this.redisClient,this.logger);
	}

	getSentinelConnection (): RedisSentinelConnection {
		throw new Error('Not Implement yet')
	}

	getClusterConnection (): RedisClusterConnection {
		throw new Error('Not Implement yet');
	}

	getLogger () {
		return this.logger;
	}
}