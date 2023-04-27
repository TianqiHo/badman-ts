

import {Channel, ConfirmChannel, Options} from "amqplib";
import {Logger} from "log4js";
import ChannelCallback from "../../ChannelCallback";
import RabbitCommands from "../../RabbitCommands";
import AmqpConnection from "./AmqpConnection";


export default class AmqpCommands implements RabbitCommands{

	private logger:Logger;

	private amqpConnection:AmqpConnection;

	constructor (amqpConnection:AmqpConnection,logger:Logger) {
		this.logger = logger;
		this.amqpConnection = amqpConnection;
	}

	async execute(channelCallback:ChannelCallback,confirm?:boolean){
		let channel:Channel = await this.amqpConnection.getChannel(confirm);
		channelCallback.doInChannel(channel);
	}

	async sendBufferToExchange (exchange: string, routingKey: string, data: Buffer,options?:Options.Publish) {

		await this.execute(new class implements ChannelCallback {
			doInChannel (channel: Channel){
				channel.publish(exchange,routingKey,data,options);
			}
		});

	}

	async sendStringToExchange (exchange: string, routingKey: string, data: string,options?:Options.Publish) {

		await this.execute(new class implements ChannelCallback {
			doInChannel (channel: Channel){
				channel.publish(exchange,routingKey,Buffer.from(data),options);
			}
		});

	}

	async sendBufferToQueue (queueName: string, data: Buffer, options?: Options.Publish) {
		await this.execute(new class implements ChannelCallback {
			doInChannel (channel: Channel){
				channel.sendToQueue(queueName,data,options);
			}
		});
	}

	async sendStringToQueue (queueName: string, data: string, options?: Options.Publish) {
		await this.execute(new class implements ChannelCallback {
			doInChannel (channel: Channel){
				channel.sendToQueue(queueName,Buffer.from(data),options);
			}
		});
	}

	async confirmSendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Options.Publish) {
		let logger:Logger = this.logger;
		await this.execute(new class implements ChannelCallback {
			async doInChannel (channel: ConfirmChannel){
				channel.publish(exchange,routingKey,data,options);

				try {
					await channel.waitForConfirms();
				} catch (e) {
					logger.error(e);
				}

			}
		},true);
	}

	async confirmSendBufferToQueue (queueName: string, data: Buffer, options?: Options.Publish) {
		let logger:Logger = this.logger;
		await this.execute(new class implements ChannelCallback {
			async doInChannel (channel: ConfirmChannel){
				channel.sendToQueue(queueName,data,options);
				try {
					await channel.waitForConfirms();
				} catch (e) {
					logger.error(e);
				}
			}
		},true);
	}

	async confirmSendStringToExchange (exchange: string, routingKey: string, data: string, options?: Options.Publish) {
		let logger:Logger = this.logger;
		await this.execute(new class implements ChannelCallback {
			async doInChannel (channel: ConfirmChannel){
				channel.publish(exchange,routingKey,Buffer.from(data),options);
				try {
					await channel.waitForConfirms();
				} catch (e) {
					logger.error(e);
				}
			}
		},true);
	}

	async confirmSendStringToQueue (queueName: string, data: string, options?: Options.Publish) {
		let logger:Logger = this.logger;
		await this.execute(new class implements ChannelCallback {
			async doInChannel (channel: ConfirmChannel){
				channel.sendToQueue(queueName,Buffer.from(data),options);
				try {
					await channel.waitForConfirms();
				} catch (e) {
					logger.error(e);
				}
			}
		},true);
	}

}