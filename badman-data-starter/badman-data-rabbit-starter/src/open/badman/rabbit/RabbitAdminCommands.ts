

import RabbitConsumer from "./RabbitConsumer";


export default interface RabbitAdminCommands {

	declareConsumer<Channel,Message>(queue:string,consumer:RabbitConsumer<Channel,Message>,options?:Object);
	declareAckConsumer<Channel,Message>(queue:string,consumer:RabbitConsumer<Channel,Message>);
	declareExchange(exchange: string, type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string, options?: Object):Promise<Object>;
	declareQueue(queue: string, options?: Object):Promise<Object>;
	bindQueue(queue: string, exchange: string, routingKey: string);
}