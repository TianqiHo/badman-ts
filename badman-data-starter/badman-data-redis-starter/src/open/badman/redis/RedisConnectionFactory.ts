

import RedisClusterConnection from "./RedisClusterConnection";
import RedisConnection from "./RedisConnection";
import RedisLock from "./RedisLock";
import RedisSentinelConnection from "./RedisSentinelConnection";



export default interface RedisConnectionFactory {

	getConnection():RedisConnection;

	getLock():RedisLock;

	getClusterConnection():RedisClusterConnection;

	getSentinelConnection():RedisSentinelConnection;

	getLogger();

}