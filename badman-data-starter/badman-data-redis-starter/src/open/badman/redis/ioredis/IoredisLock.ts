import RedLock, {Lock} from "redlock";
import RedisLock from "../RedisLock";


export default class IoredisLock implements RedisLock{

	private readonly redLock:RedLock;

	private l:Lock;

	constructor (redLock:RedLock) {
		this.redLock = redLock;
	}

	async lock (key:string,ttl:number,setting:any) {
		if(!this.l){
			this.l = await this.redLock.acquire([key],ttl,setting);
		}
		return this.l;
	}

	async unLock (key: string) {
		if(this.l){
			await this.l.release();
		}else{
			throw new Error('no Lock instance');
		}
	}

	async delay (millisecond:number) {
		await this.l.extend(millisecond);
	}

}