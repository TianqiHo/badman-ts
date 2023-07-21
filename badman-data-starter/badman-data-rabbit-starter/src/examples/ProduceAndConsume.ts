
import {Channel, ConsumeMessage} from "amqplib";
import {Logging, SingletonObjectFactory2} from "badman-core";
import * as console from "console";
import {Logger} from "log4js";
import AmqpConnectionFactory from "../open/badman/rabbit/clients/amqp/AmqpConnectionFactory";
import RabbitAdminTemplate from "../open/badman/rabbit/RabbitAdminTemplate";
import RabbitConnectionFactory from "../open/badman/rabbit/RabbitConnectionFactory";
import RabbitConsumer from "../open/badman/rabbit/RabbitConsumer";
import RabbitProperties from "../open/badman/rabbit/RabbitProperties";
import RabbitTemplate from "../open/badman/rabbit/RabbitTemplate";


/**
 * npm -i --save badman-data-rabbit-starter
 * version : latest
 */
class ProduceAndConsume{

	private rabbitTemplate:RabbitTemplate;


	private rabbitAdminTemplate:RabbitAdminTemplate;

	/**
	 * 初始化
	 */
	async init(){
		//rabbit服务配置属性
		let rabbitProperties:RabbitProperties = {
			"rabbit":{
				"protocol":"amqp",
				"hostname":"localhost",
				"port":5672,
				"username":"devuser",
				"password":"pwd4dev",
				"locale":"en_US",
				"frameMax":0,
				"heartbeat":1,
				"vhost":"dev"
			},
			"socket":{
				"timeout":10000,
				"clientProperties":{
					"connection_name": '3A服务'
				}
			}
		}

		//当前客户端名称,用于排查问题更方便
		rabbitProperties.socket.clientProperties = {connection_name: +Date.now()};
		let logging:Logging = await SingletonObjectFactory2.init<Logging>(Logging);
		let logger:Logger = logging.logger(ProduceAndConsume.name);

		//rabbit连接构造工厂
		let rabbitConnectionFactory:RabbitConnectionFactory = new AmqpConnectionFactory(rabbitProperties,logger);

		//rabbit 管理端工具入口类，用于定义队列、交换机、绑定交换机与队列、绑定消费者
		this.rabbitAdminTemplate = new RabbitAdminTemplate(logger,rabbitConnectionFactory);
		//初始化
		await this.rabbitAdminTemplate.afterInitialized();

		//rabbit 发送端工具入口类，用于发送消息
		this.rabbitTemplate = new RabbitTemplate(logger,rabbitConnectionFactory);
		//初始化
		await this.rabbitTemplate.afterInitialized();
	}

	/**
	 * 声明交换机、交换机类型、绑定队列消费者
	 */
	async declaration(){

		//声明交换机
		await this.rabbitAdminTemplate.declareExchange('my_exchange','direct');

		//声明队列
		await this.rabbitAdminTemplate.declareQueue('tenant');
		await this.rabbitAdminTemplate.declareQueue('dict');


		//绑定交换机和队列，并且声明routingKey
		await this.rabbitAdminTemplate.bindQueue('tenant','my_exchange','user');
		await this.rabbitAdminTemplate.bindQueue('tenant','my_exchange','dict');
		await this.rabbitAdminTemplate.bindQueue('dict','my_exchange','dict');


		//绑定消费者和routingKey
		await this.rabbitAdminTemplate.declareAckConsumerWithRoutingKey<Channel,ConsumeMessage>('tenant','user',new UserConsumer());

		//绑定消费者和routingKey
		await this.rabbitAdminTemplate.declareAckConsumerWithRoutingKey<Channel,ConsumeMessage>('tenant','dict',new CommonDictConsumer('租户里的字典'));


		//绑定一个自动提交ack的消费者,手动提交使用this.rabbitAdminTemplate.declareConsumer();
		//直接绑定队列
		//await this.rabbitAdminTemplate.declareAckConsumer<Channel,ConsumeMessage>('dict',new CommonDictConsumer('纯字典'));


		await this.rabbitAdminTemplate.declareEntityAckConsumer<Channel,DictEntity>('dict',new DictConsumer('具体字典'));

	}

	async main(){

		await this.init();
		await this.declaration();

		//模拟生产消息
		setInterval(()=>{
			//直发到队列，此时只有dict才能收到消息
			//this.rabbitTemplate.sendObjectToQueue('dict',{dictId:111,dictName:'字典'});

			//发到交换机，此时只有tenant收到消息
			//this.rabbitTemplate.sendObjectToExchange('my_exchange','user',{id:123,name:'这个人'});

			//发到交换机，此时tenant dict都能收到消息
			//this.rabbitTemplate.sendObjectToExchange('my_exchange','dict',{dictId:222,dictName:'字典2'});
		},5000);
	}
}

//{"id":123,"name":"赫赫323232"}
//用户消费者
class UserConsumer implements RabbitConsumer<Channel, ConsumeMessage>{

	/**
	 * 具体消费逻辑
	 * @param channel
	 * @param user
	 */
	async consume (channel:Channel, message:ConsumeMessage): Promise<void> {
		let user:UserEntity = JSON.parse(message.content.toString('utf-8',0));
		console.log('--receive-----id----------',user.id);
		console.log('--receive-----name----------',user.name);
	}

}

//{"dictId":123,"dictName":"赫赫323232"}
//字典消费者
class CommonDictConsumer implements RabbitConsumer<Channel, ConsumeMessage>{

	private name:string;

	constructor (name:string) {
		this.name = name;
	}
	/**
	 * 具体消费逻辑
	 * @param channel
	 * @param user
	 */
	async consume (channel:Channel, message:ConsumeMessage): Promise<void> {
		let user:DictEntity = JSON.parse(message.content.toString('utf-8',0));
		console.log(`${this.name}--receive-----dictId----------`,user.dictId);
		console.log(`${this.name}--receive-----dictName----------`,user.dictName);
	}
}

class DictConsumer implements RabbitConsumer<Channel, DictEntity>{

	private name:string;

	constructor (name:string) {
		this.name = name;
	}
	/**
	 * 具体消费逻辑
	 * @param channel
	 * @param user
	 */
	async consume (channel:Channel, dict:DictEntity): Promise<void> {
		console.log(`${this.name}--receive-----dictId----------`,dict.dictId);
		console.log(`${this.name}--receive-----dictName----------`,dict.dictName);
		throw new Error('XXXXXXXXXXXXXXXXXX');
	}
}


interface UserEntity{
	id:string;
	name:string;
}

interface DictEntity{
	dictId:string;
	dictName:string;
}


(()=>{
	new ProduceAndConsume().main();
	process.on('SIGINT',async (sig)=>{
		console.info('The Server exit gracefully');
	});
})()