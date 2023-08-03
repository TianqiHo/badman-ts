

import {CommonRedisOptions} from "ioredis";
import {ConnectionOptions} from "tls";


export default interface RedisStandaloneConfiguration extends CommonRedisOptions{

	host?:string;
	port?:number;
	disconnectTimeout?: number;
	tls?: ConnectionOptions;

	useLock?:boolean;

	lazyConnect?:boolean;
}