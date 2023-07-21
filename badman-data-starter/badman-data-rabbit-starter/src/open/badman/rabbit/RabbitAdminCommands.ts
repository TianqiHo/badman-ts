

import RabbitConsumer from "./RabbitConsumer";


export default interface RabbitAdminCommands {

	declareConsumer<Channel,Message>(queue:string,consumer:RabbitConsumer<Channel,Message>,options?:Object);
	declareConsumerWithRoutingKey<Channel,Message>(queue:string,routingKey:string,consumer:RabbitConsumer<Channel,Message>,options?:Object);
	declareAckConsumer<Channel,Message>(queue:string,consumer:RabbitConsumer<Channel,Message>,options?:Object);
	declareEntityAckConsumer<Channel,Entity>(queue:string,consumer:RabbitConsumer<Channel,Entity>,options?:Object);
	declareAckConsumerWithRoutingKey<Channel,Message>(queue:string,routingKey:string,consumer:RabbitConsumer<Channel,Message>,options?:Object);
	declareExchange(exchange: string, type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string, options?: Object):Promise<Object>;
	declareQueue(queue: string, options?: Object):Promise<Object>;
	bindQueue(queue: string, exchange: string, routingKey: string);
}