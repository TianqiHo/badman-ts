


import {Channel, ConsumeMessage, Options, Replies} from "amqplib";
import {Logger} from "log4js";
import RabbitAdminCommands from "../../RabbitAdminCommands";
import RabbitConsumer from "../../RabbitConsumer";
import AmqpConnection from "./AmqpConnection";


export default class AmqpAdminCommands  implements RabbitAdminCommands{



	private logger:Logger;

	private amqpConnection:AmqpConnection;


	constructor (logger:Logger,amqpConnection:AmqpConnection) {
		this.logger = logger;
		this.amqpConnection = amqpConnection;
	}

	async declareConsumer<C,M>(queue:string,consumer:RabbitConsumer<C,M>,options?:Options.Consume){

		let channel:Channel = await this.amqpConnection.getChannel(false);
		await channel.consume(queue,(message:ConsumeMessage|null)=>{
			consumer.consume(<C>channel,<M>message);
		},options);

	}

	async declareAckConsumer<C,M>(queue:string,consumer:RabbitConsumer<C,M>){
		let channel:Channel = await this.amqpConnection.getChannel(false);
		await channel.consume(queue,(message:ConsumeMessage|null)=>{
			consumer.consume(<C>channel,<M>message);
			channel.ack(message);
		},{noAck:false});
	}

	async declareExchange(exchange: string, type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string, options?: Options.AssertExchange):Promise<Replies.AssertExchange>{
		let channel:Channel = await this.amqpConnection.getChannel(false);
		return await channel.assertExchange(exchange, type, options);
	}

	async declareQueue(queue: string, options?: Options.AssertQueue): Promise<Replies.AssertQueue>{
		let channel:Channel = await this.amqpConnection.getChannel(false);
		return await channel.assertQueue(queue,options);
	}

	async bindQueue(queue: string, exchange: string, routingKey: string){
		let channel:Channel = await this.amqpConnection.getChannel(false);
		await channel.bindQueue(queue,exchange,routingKey);
	}

}