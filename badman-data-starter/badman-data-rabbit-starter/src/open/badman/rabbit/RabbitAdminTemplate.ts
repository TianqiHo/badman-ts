


import {Disposable, Initializing} from "badman-core";
import {Logger} from "log4js";
import RabbitAccessor from "./RabbitAccessor";
import RabbitAdminCommands from "./RabbitAdminCommands";
import RabbitConnection from "./RabbitConnection";
import RabbitConnectionFactory from "./RabbitConnectionFactory";
import RabbitConsumer from "./RabbitConsumer";


export default class RabbitAdminTemplate extends RabbitAccessor implements RabbitAdminCommands, Initializing, Disposable {


	private readonly logger: Logger;

	constructor (logger: Logger, rabbitConnectionFactory?: RabbitConnectionFactory) {
		super(rabbitConnectionFactory);
		this.logger = logger;
	}

	afterInitialized () {

	}

	destroy () {

	}


	async bindQueue (queue: string, exchange: string, routingKey: string) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().bindQueue(queue, exchange, routingKey);
	}

	async declareAckConsumer<Channel,Message> (queue: string, consumer: RabbitConsumer<Channel,Message> ) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareAckConsumer(queue, consumer);
		this.logger.info(`DeclareAckConsumer [${consumer.constructor.name}] success`);
	}

	async declareConsumer<Channel,Message>  (queue: string, consumer: RabbitConsumer<Channel,Message> , options?: Object) {
		let connection: RabbitConnection = await this.rabbitConnectionFactory.createConnection();
		connection.getAdminCommands().declareConsumer(queue, consumer, options);
		this.logger.info(`DeclareNormalConsumer [${consumer.constructor.name}] success`);
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