

import {Disposable, SyncInitializing} from "badman-core";
import {Logger} from "log4js";
import RabbitAccessor from "./RabbitAccessor";
import RabbitCommands from "./RabbitCommands";
import RabbitConnection from "./RabbitConnection";
import RabbitConnectionFactory from "./RabbitConnectionFactory";



export default class RabbitTemplate extends RabbitAccessor implements RabbitCommands, SyncInitializing, Disposable {


	private readonly logger: Logger;

	constructor (logger: Logger, rabbitConnectionFactory: RabbitConnectionFactory) {
		super(rabbitConnectionFactory);
		this.logger = logger;
	}

	afterInitialized () {

	}

	async destroy () {
		await this.rabbitConnectionFactory.close();
	}


	async sendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendBufferToExchange(exchange, routingKey, data, options);
	}

	async sendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object) {

		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendStringToExchange(exchange, routingKey, data, options);
	}

	async sendObjectToExchange (exchange: string, routingKey: string, data: object, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendStringToExchange(exchange, routingKey, JSON.stringify(data), options);
	}

	async sendBufferToQueue (queueName: string, data: Buffer, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendBufferToQueue(queueName, data, options);
	}

	async sendStringToQueue (queueName: string, data: string, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendStringToQueue(queueName, data, options);
	}

	async sendObjectToQueue (queueName: string, data: object, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().sendStringToQueue(queueName, JSON.stringify(data), options);
	}

	async confirmSendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendBufferToExchange(exchange, routingKey, data, options);
	}

	async confirmSendBufferToQueue (queueName: string, data: Buffer, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendBufferToQueue(queueName, data, options);
	}

	async confirmSendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendStringToExchange(exchange, routingKey, data, options);
	}

	async confirmSendObjectToExchange (exchange: string, routingKey: string, data: object, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendStringToExchange(exchange, routingKey, JSON.stringify(data), options);
	}

	async confirmSendStringToQueue (queueName: string, data: string, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendStringToQueue(queueName, data, options);
	}

	async confirmSendObjectToQueue (queueName: string, data: object, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getCommands().confirmSendStringToQueue(queueName, JSON.stringify(data), options);
	}

}