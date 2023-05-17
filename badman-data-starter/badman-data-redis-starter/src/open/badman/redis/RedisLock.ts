

export default interface RedisLock {

	lock(key:string,ttl:number,setting:any);

	unLock(key: string);

	delay(millisecond:number);

}