

import {Logging, SingletonObjectFactory2} from "badman-core";
import {Redis} from "ioredis";
import {Logger} from "log4js";
import RedLock from "redlock";
import RedisLock from "../RedisLock";
import RedisLockFactory from "../RedisLockFactory";
import IoredisLock from "./IoredisLock";


export default class IoredisLockFactory implements RedisLockFactory{

	private readonly redLock:RedLock;
	private logger:Logger;

	constructor (redis:Redis) {
		this.logger = SingletonObjectFactory2.Instance<Logging>(Logging.name).logger(this.constructor.name);
		this.redLock = new RedLock([redis]);
		this.redLock.on('error',(args:any[])=>{
			this.logger.error('RedLock Error',args);
		});
	}

	getRedLock ():RedisLock {
		return new IoredisLock(this.redLock);
	}

}