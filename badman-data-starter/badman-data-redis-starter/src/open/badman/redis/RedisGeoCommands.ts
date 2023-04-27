


import {RedisKeyType, RedisValueType, StringOrNullType} from "./RedisDeclares";


export default interface RedisGeoCommands {

	geoAdd(key: RedisKeyType,...longitudeLatitudeMembers: RedisValueType[]): Promise<number>;

	geoDist(key: RedisKeyType, begin: RedisValueType, end: RedisValueType, m: "m"): Promise<StringOrNullType>;

	geoList(key: RedisKeyType, ...members: RedisValueType[]): Promise<([longitude: string, latitude: string] | null)[]>;
}