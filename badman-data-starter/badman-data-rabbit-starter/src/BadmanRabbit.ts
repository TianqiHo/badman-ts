
import {Channel, ConsumeMessage} from "amqplib";
import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import DefaultConsumer from "./DefaultConsumer";
import AmqpConnectionFactory from "./open/badman/rabbit/clients/amqp/AmqpConnectionFactory";
import RabbitAdminTemplate from "./open/badman/rabbit/RabbitAdminTemplate";
import RabbitConnectionFactory from "./open/badman/rabbit/RabbitConnectionFactory";
import RabbitProperties from "./open/badman/rabbit/RabbitProperties";
import RabbitTemplate from "./open/badman/rabbit/RabbitTemplate";
import RabbitConsumer from "./open/badman/rabbit/RabbitConsumer";
import ChannelCallback from "./open/badman/rabbit/ChannelCallback";
import RabbitCommands from "./open/badman/rabbit/RabbitCommands";
import RabbitAdminCommands from "./open/badman/rabbit/RabbitAdminCommands";
import RabbitConnection from "./open/badman/rabbit/RabbitConnection";
import RabbitSocketProperties from "./open/badman/rabbit/RabbitSocketProperties";
import RabbitConnectionProperties from "./open/badman/rabbit/RabbitConnectionProperties";
import RabbitProducerProperties from "./open/badman/rabbit/RabbitProducerProperties";
import RabbitConsumerProperties from "./open/badman/rabbit/RabbitConsumerProperties";




export default class BadmanRabbit {

	async main(){

		let logging:Logging = await SingletonObjectFactory2.init<Logging>(Logging);
		let logger:Logger = logging.logger(BadmanRabbit.name);

		let rabbitProperties:RabbitProperties = {
			rabbit:{
				protocol: "amqp",
				hostname:"localhost",
				port: 5672,
				username: "12345",
				password: "122212",
				locale: "en_US",
				frameMax: 0,
				heartbeat: 1,
				vhost: "/",
			},
			socket:{
				timeout: 10000,
				clientProperties:{
					connection_name: (+Date.now()).toString()
				}
			}
		};

		let rabbitConnectionFactory:RabbitConnectionFactory = await SingletonObjectFactory2.initWithArgs<AmqpConnectionFactory>(AmqpConnectionFactory,[rabbitProperties,logger]);

		await SingletonObjectFactory2.initWithArgs<RabbitAdminTemplate>(RabbitAdminTemplate,[logger,rabbitConnectionFactory]);

		await SingletonObjectFactory2.initWithArgs<RabbitTemplate>(RabbitTemplate,[logger,rabbitConnectionFactory]);

		let rabbitTemplate:RabbitTemplate = SingletonObjectFactory2.Instance<RabbitTemplate>(RabbitTemplate.name);

		await rabbitTemplate.sendStringToQueue('12345678','Badman-------Badman');

		let rabbitAdminTemplate:RabbitAdminTemplate = SingletonObjectFactory2.Instance<RabbitAdminTemplate>(RabbitAdminTemplate.name);

		await rabbitAdminTemplate.declareAckConsumer<Channel,ConsumeMessage>('12345678',new DefaultConsumer());

	}
}

// (async ()=>{
// 	new BadmanRabbit().main();
// })();

export {
	RabbitConnectionFactory,
	AmqpConnectionFactory,
	RabbitAdminTemplate,
	RabbitTemplate,
	RabbitConsumer,
	ChannelCallback,
	RabbitCommands,
	RabbitAdminCommands,
	RabbitConnection,
	RabbitSocketProperties,
	RabbitConnectionProperties,
	RabbitProducerProperties,
	RabbitConsumerProperties,
	RabbitProperties
}