

import {Disposable, SyncInitializing} from "badman-core";
import RedisAccesscor from "./RedisAccesscor";
import RedisCommands from "./RedisCommands";
import RedisConnection from "./RedisConnection";
import RedisConnectionFactory from "./RedisConnectionFactory";
import {RedisKeyType, RedisValueType, StringOrNullType} from "./RedisDeclares";
import RedisLock from "./RedisLock";



export default class RedisTemplate extends RedisAccesscor implements RedisCommands,SyncInitializing,Disposable{

	constructor (redisConnectionFactory:RedisConnectionFactory) {
		super(redisConnectionFactory);
	}


	async hashExists (key: RedisKeyType, field: RedisKeyType): Promise<boolean> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashExists(key,field);
	}

	async hashDel (key: RedisKeyType, ...fields:RedisKeyType[]): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashDel(key, ...fields);
	}

	async hashGetAll (key: RedisKeyType): Promise<Record<string, string>> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashGetAll(key);
	}

	async hashGet (key: RedisKeyType, field: RedisKeyType): Promise<StringOrNullType> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashGet(key, field);
	}

	async hashSet (key: RedisKeyType, entry: Map<RedisValueType, RedisValueType> | object): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashSet(key, entry);
	}

	async hashSetNx (key: RedisKeyType, field: string | Buffer, value: string | Buffer | number): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashSetNx(key, field,value);
	}

	async hashLen (key: RedisKeyType): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashLen(key)
	}

	async hashStrlen (key: RedisKeyType, field: RedisKeyType): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashStrlen(key, field);
	}

	async hashValues (key: RedisKeyType): Promise<string[]> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisHashCommands().hashValues(key);
	}

	async geoAdd ( key: RedisKeyType,...longitudeLatitudeMembers: RedisValueType[] ): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisGeoCommands().geoAdd(key,...longitudeLatitudeMembers);
	}

	async geoDist (key: RedisKeyType, begin: RedisValueType, end: RedisValueType, m: "m"): Promise<StringOrNullType> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisGeoCommands().geoDist(key,begin,end,m);
	}

	async geoList (key: RedisKeyType, ...members: RedisValueType[]): Promise<([longitude: string, latitude: string] | null)[]> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisGeoCommands().geoList(key,...members);
	}

	private async createStandaloneConnection():Promise<RedisConnection>{
		let redisConnection:RedisConnection = this.redisConnectionFactory.getConnection();
		if(redisConnection.isClosed()){
			this.logger.debug('RedisConnection has closed,and will reopen it');
			await redisConnection.open();
		}
		return redisConnection;
	}

	async getVal (key: RedisKeyType): Promise<StringOrNullType> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().getVal(key);
	}

	async getBufferVal (key: RedisKeyType): Promise<Buffer | null> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().getBufferVal(key);
	}

	async setEx (key: RedisKeyType, value: RedisValueType, timeoutOfSeconds: number): Promise<boolean> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().setEx(key,value,timeoutOfSeconds);
	}

	async setNx (key: RedisKeyType, value: RedisValueType): Promise<boolean> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().setNx(key,value);
	}

	async setVal (key: RedisKeyType, value: RedisValueType): Promise<boolean> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().setVal(key,value);
	}

	async setNXValExpire (key: RedisKeyType, value: RedisValueType, secondsExpire: number | string): Promise<boolean> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisStringCommands().setNXValExpire(key,value,secondsExpire);
	}

	async zSetRem (key: RedisKeyType, ...members): Promise<number> {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		return await redisConnection.redisZSetCommands().zSetRem(key,...members);
	}



	getLock(lockKey: string) {
		let redisLock:RedisLock = this.redisConnectionFactory.getLock();
		return redisLock;
	}


	afterInitialized () {

	}

	async destroy () {
		let redisConnection:RedisConnection = await this.createStandaloneConnection();
		await redisConnection.quit();
	}

}