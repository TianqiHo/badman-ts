


export default interface RabbitCommands {

	sendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object);

	sendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object);

	sendBufferToQueue (queueName: string, data: Buffer, options?: Object);

	sendStringToQueue (queueName: string, data: string, options?: Object);

	confirmSendBufferToExchange (exchange: string, routingKey: string, data: Buffer, options?: Object);

	confirmSendStringToExchange (exchange: string, routingKey: string, data: string, options?: Object);

	confirmSendBufferToQueue (queueName: string, data: Buffer, options?: Object);

	confirmSendStringToQueue (queueName: string, data: string, options?: Object);
}