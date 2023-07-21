

export default interface RabbitSocketProperties{

	timeout ?:number;

	clientProperties ?:object;

	noDelay ?:boolean;

	keepAlive?:boolean;

	// 0 is default for node
	keepAliveDelay?:number;
}