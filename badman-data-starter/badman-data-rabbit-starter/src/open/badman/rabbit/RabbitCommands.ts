


export default interface RabbitCommands {

	sendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object);

	sendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object);

	sendObjectToExchange (exchange: string, routingKey: string, data: object, options?: Object);

	sendBufferToQueue (queueName: string, data: Buffer, options?: Object);

	sendStringToQueue (queueName: string, data: string, options?: Object);

	sendObjectToQueue (queueName: string, data: object, options?: Object)

	confirmSendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object);

	confirmSendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object);

	confirmSendObjectToExchange (exchange: string, routingKey: string, data: object, options?: Object);

	confirmSendBufferToQueue (queueName: string, data: Buffer, options?: Object);

	confirmSendStringToQueue (queueName: string, data: string, options?: Object);

	confirmSendObjectToQueue (queueName: string, data: object, options?: Object);
}