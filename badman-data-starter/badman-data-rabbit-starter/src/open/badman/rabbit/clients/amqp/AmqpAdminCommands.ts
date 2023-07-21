


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
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			//let data:M = JSON.parse(message.content.toString());
			await consumer.consume(<C>channel,<M>message);
		},options);

	}

	async declareConsumerWithRoutingKey<C, M> (queue: string, routingKey: string, consumer: RabbitConsumer<C, M>, options?: Object) {
		let channel:Channel = await this.amqpConnection.getChannel(false);

		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			if(message){
				try {
					let bindRoutingKey: string = message.fields.routingKey;
					if (bindRoutingKey === routingKey) {
						await consumer.consume(<C>channel, <M>message);
					} else {
						await channel.nack(message, false, true);
						this.logger.debug(`Exchange[${message.fields.exchange}], redelivered [${message.fields.redelivered}], ${bindRoutingKey} != ${routingKey},And then reject it`);
					}
				} catch (e) {
					this.logger.error('Consume error -> ',e);
				}
			}
		},options);
	}

	async declareEntityAckConsumer<C, Entity> (queue: string, consumer: RabbitConsumer<C, Entity>,options?:Object) {
		let channel:Channel = await this.amqpConnection.getChannel(false);
		let option = Object.assign({},options||{},{noAck:false});
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			if(message){
				try {
					let data:Entity= JSON.parse(message.content.toString('utf-8',0));
					await consumer.consume(<C>channel, data);
				} catch (e) {
					this.logger.error('EntityAckConsumer error -> ',e);
				}finally {
					channel.ack(message);
				}
			}

		},option);
	}

	async declareAckConsumer<C,M>(queue:string,consumer:RabbitConsumer<C,M>,options?:Object){
		let channel:Channel = await this.amqpConnection.getChannel(false);
		let option = Object.assign({},options||{},{noAck:false});
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			if(message){
				try { //let data:M = JSON.parse(message.content.toString());
					await consumer.consume(<C>channel, <M>message);
				} catch (e) {
					this.logger.error('AckConsume error -> ',e);
				}finally {
					channel.ack(message);
				}
			}

		},option);
	}


	async declareAckConsumerWithRoutingKey<C, M> (queue: string, routingKey: string, consumer: RabbitConsumer<C, M>,options?:Object) {
		let channel:Channel = <Channel>await this.amqpConnection.getChannel(false);
		let option = Object.assign({},options||{},{noAck:false});
		await channel.consume(queue,async (message:ConsumeMessage|null)=>{
			if(message){
				let bindRoutingKey: string = message.fields.routingKey;
				if (bindRoutingKey === routingKey) {
					try {
						await consumer.consume(<C>channel, <M>message);
					} catch (e) {
						this.logger.error('AckConsumerWithRoutingKey error ->',e);
					}finally {
						channel.ack(message);
					}
				} else {
					await channel.nack(message, false, true);
					this.logger.debug(`Exchange[${message.fields.exchange}], redelivered [${message.fields.redelivered}], ${bindRoutingKey} != ${routingKey},And then reject it`);
				}

			}

		},option);
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