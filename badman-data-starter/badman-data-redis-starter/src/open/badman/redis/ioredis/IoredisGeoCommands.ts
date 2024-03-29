


import {RedisKeyType, RedisValueType, StringOrNullType} from "../RedisDeclares";
import RedisGeoCommands from "../RedisGeoCommands";
import IoredisConnection from "./IoredisConnection";


export default class IoredisGeoCommands implements RedisGeoCommands{

	private connection:IoredisConnection;

	constructor (connection:IoredisConnection) {
		this.connection = connection;
	}

	connections(){
		return this.connection.redisClientInstance();
	}

	async geoAdd (key: RedisKeyType,...longitudeLatitudeMembers: RedisValueType[] ): Promise<number> {
		return this.connection.redisClientInstance().geoadd(key,...longitudeLatitudeMembers);
	}

	geoDist (key: RedisKeyType, begin: RedisValueType, end: RedisValueType, m: "m"): Promise<StringOrNullType> {
		// @ts-ignore
		return this.connection.redisClientInstance().geodist(key,begin,end,'m');
	}


	geoList (key: RedisKeyType, ...members: RedisValueType[]): Promise<([longitude: string, latitude: string] | null)[]> {
		return this.connection.redisClientInstance().geopos(key,...members);
	}

}