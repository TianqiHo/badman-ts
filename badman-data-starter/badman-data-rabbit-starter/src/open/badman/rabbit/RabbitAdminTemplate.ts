


import {Disposable, SyncInitializing} from "badman-core";
import {Logger} from "log4js";
import RabbitAccessor from "./RabbitAccessor";
import RabbitAdminCommands from "./RabbitAdminCommands";
import RabbitConnection from "./RabbitConnection";
import RabbitConnectionFactory from "./RabbitConnectionFactory";
import RabbitConsumer from "./RabbitConsumer";


export default class RabbitAdminTemplate extends RabbitAccessor implements RabbitAdminCommands, SyncInitializing, Disposable {


	private readonly logger: Logger;

	constructor (logger: Logger, rabbitConnectionFactory?: RabbitConnectionFactory) {
		super(rabbitConnectionFactory);
		this.logger = logger;
	}

	afterInitialized () {

	}

	async destroy () {
		await this.rabbitConnectionFactory.close();
	}


	async bindQueue (queue: string, exchange: string, routingKey: string) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().bindQueue(queue, exchange, routingKey);
	}

	async declareAckConsumer<Channel,Message> (queue: string, consumer: RabbitConsumer<Channel,Message>,options?:Object ) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareAckConsumer<Channel,Message>(queue, consumer,options);
		this.logger.info(`DeclareAckConsumer [${consumer.constructor.name}] success`);
	}

	async declareAckConsumerWithRoutingKey<Channel, Message> (queue: string, routingKey: string, consumer: RabbitConsumer<Channel, Message>,options?:Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareAckConsumerWithRoutingKey<Channel,Message>(queue, routingKey,consumer,options);
		this.logger.info(`DeclareAckConsumerWithRoutingKey [${consumer.constructor.name}] success`);
	}

	async declareEntityAckConsumer<Channel, Entity> (queue: string, consumer: RabbitConsumer<Channel, Entity>,options?:Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareEntityAckConsumer<Channel,Entity>(queue, consumer,options);
		this.logger.info(`DeclareEntityAckConsumer [${consumer.constructor.name}] success`);
	}

	async declareConsumer<Channel,Message>  (queue: string, consumer: RabbitConsumer<Channel,Message> , options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareConsumer<Channel,Message>(queue, consumer, options);
		this.logger.info(`DeclareConsumer [${consumer.constructor.name}] success`);
	}

	async declareConsumerWithRoutingKey<Channel, Message> (queue: string, routingKey: string, consumer: RabbitConsumer<Channel, Message>, options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareConsumerWithRoutingKey<Channel,Message>(queue, routingKey, consumer, options);
		this.logger.info(`DeclareConsumerWithRoutingKey [${consumer.constructor.name}] success`);
	}

	async declareExchange (exchange: string, type: "direct" | "topic" | "headers" | "fanout" | "match" | string, options?: Object): Promise<Object> {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		return await connection.getAdminCommands().declareExchange(exchange,type,options);
	}

	async declareQueue (queue: string, options?: Object): Promise<Object> {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		return await connection.getAdminCommands().declareQueue(queue, options);
	}
}