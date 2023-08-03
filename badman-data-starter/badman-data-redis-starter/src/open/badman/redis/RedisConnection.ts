


import RedisGeoCommands from "./RedisGeoCommands";
import RedisHashCommands from "./RedisHashCommands";
import RedisKeyCommands from "./RedisKeyCommands";
import RedisListCommands from "./RedisListCommands";
import RedisSetCommands from "./RedisSetCommands";
import RedisStringCommands from "./RedisStringCommands";
import RedisZSetCommands from "./RedisZSetCommands";


export default interface RedisConnection{

	redisGeoCommands():RedisGeoCommands;

	redisHashCommands():RedisHashCommands;

	redisListCommands():RedisListCommands;

	redisKeyCommands():RedisKeyCommands;

	redisSetCommands():RedisSetCommands;

	redisZSetCommands():RedisZSetCommands;

	redisStringCommands():RedisStringCommands;

	isClosed():boolean;

	close(reconnect?: boolean):void;

	open():Promise<boolean>;

	quit():Promise<boolean>;
}