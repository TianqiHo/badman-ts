


import {Channel, ConsumeMessage, Options, Replies} from "amqplib";
import * as console from "console";
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
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			//let data:M = JSON.parse(message.content.toString());
			await consumer.consume(<C>channel,<M>message);
		},options);

	}

	async declareConsumerWithRoutingKey<C, M> (queue: string, routingKey: string, consumer: RabbitConsumer<C, M>, options?: Object) {
		let channel:Channel = await this.amqpConnection.getChannel(false);

		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			//let data:M = JSON.parse(message.content.toString());
			let bindRoutingKey:string = message.fields.routingKey;
			if(bindRoutingKey === routingKey){
				await consumer.consume(<C>channel,<M>message);
			}else{
				this.logger.warn(`Exchange[${message.fields.exchange}],${bindRoutingKey} != ${routingKey},Then recover`);
				await channel.nack(message,false,true);
			}

		},options);
	}

	async declareAckConsumer<C,M>(queue:string,consumer:RabbitConsumer<C,M>){
		let channel:Channel = await this.amqpConnection.getChannel(false);
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			//let data:M = JSON.parse(message.content.toString());
			await consumer.consume(<C>channel,<M>message);
			channel.ack(message);
		},{noAck:false});
	}

	async declareAckConsumerWithRoutingKey<C, M> (queue: string, routingKey: string, consumer: RabbitConsumer<C, M>) {
		let channel:Channel = <Channel>await this.amqpConnection.getChannel(false);

		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			//let data:M = JSON.parse(message.content.toString());
			//consumer.consume(<C>channel,<M>message);

			let bindRoutingKey:string = message.fields.routingKey;
			if(bindRoutingKey === routingKey){
				await consumer.consume(<C>channel,<M>message);
				channel.ack(message);
			}else{
				// await channel.cancel(message.fields.consumerTag);
				// this.logger.warn(`Exchange[${message.fields.exchange}],${bindRoutingKey} != ${routingKey},Then cancel it`);
				await channel.nack(message,false,true);
				this.logger.warn(`Exchange[${message.fields.exchange}], redelivered [${message.fields.redelivered}], ${bindRoutingKey} != ${routingKey},And then reject it`);
			}

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