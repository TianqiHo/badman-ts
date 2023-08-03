

import {Base} from "badman-core";
import {Redis} from "ioredis";
import {Logger} from "log4js";
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

	private logger:Logger;

	constructor (redisClient:Redis,logger:Logger) {
		this.closed = false;
		this.redisClient = redisClient;
		this.logger = logger;
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
		let closed = this.redisClient.status ==='end' && this.closed;
		this.logger.debug(`Current redisClient.status is ${closed}`);
		this.logger.debug(`Current connection status is ${closed}`);
		return closed;
	}

	async open () :Promise<boolean>{
		try {
			await this.redisClient.connect();
		} catch (e) {
			//todo
			this.logger.error('IORedis Manual reconnection failed ->',e);
			return false;
		}
		return true;
	}


	async quit():Promise<boolean> {
		this.logger.info('Quiting IORedis...');
		if(this.isClosed()){
			this.logger.info('IORedis has already closed..');
			return true;
		}
		this.redisClient.quit((err, result)=>{
			if(err){
				this.logger.error('Ioredis quit error -> ',err)
			}else{
				this.closed = true;
				this.logger.info('Ioredis quit callback -> ',result);
			}
		});

		while(!this.closed){
			await Base.sleep(2000).then(()=>{this.logger.info('Waiting Close IORedis....')});
		}
		this.logger.info('Closed IORedis successfully...');
		return true;
	}
}