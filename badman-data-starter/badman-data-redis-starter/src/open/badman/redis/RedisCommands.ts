


import RedisGeoCommands from "./RedisGeoCommands";
import RedisHashCommands from "./RedisHashCommands";
import RedisKeyCommands from "./RedisKeyCommands";
import RedisListCommands from "./RedisListCommands";
import RedisSetCommands from "./RedisSetCommands";
import RedisStringCommands from "./RedisStringCommands";
import RedisZSetCommands from "./RedisZSetCommands";


export default interface RedisCommands extends RedisGeoCommands,RedisHashCommands,RedisListCommands,RedisKeyCommands,RedisSetCommands,
	RedisStringCommands,RedisZSetCommands{

}