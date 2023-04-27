

import RedisClusterConnection from "./RedisClusterConnection";
import RedisConnection from "./RedisConnection";
import RedisSentinelConnection from "./RedisSentinelConnection";



export default interface RedisConnectionFactory {


	getConnection():RedisConnection;

	getClusterConnection():RedisClusterConnection;

	getSentinelConnection():RedisSentinelConnection;

}