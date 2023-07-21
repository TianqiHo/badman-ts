import {Channel, ConsumeMessage} from "amqplib";
import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import AmqpConnectionFactory from "../open/badman/rabbit/clients/amqp/AmqpConnectionFactory";
import RabbitAdminTemplate from "../open/badman/rabbit/RabbitAdminTemplate";
import RabbitConnectionFactory from "../open/badman/rabbit/RabbitConnectionFactory";
import RabbitProperties from "../open/badman/rabbit/RabbitProperties";
import RabbitTemplate from "../open/badman/rabbit/RabbitTemplate";
import DefaultConsumer from "./DefaultConsumer";

export default class TestRabbit {

	async main(){

		let logging:Logging = await SingletonObjectFactory2.init<Logging>(Logging);
		let logger:Logger = logging.logger(TestRabbit.name);

		let rabbitProperties:RabbitProperties = {
			rabbit:{
				"protocol":"amqp",
				"hostname":"localhost",
				"port":5672,
				"username":"devuser",
				"password":"pwd4dev",
				"locale":"en_US",
				"frameMax":0,
				"heartbeat":1,
				"channelMax": 512,
				"vhost":"my_vhost"
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


		setTimeout(async ()=>{

			let rabbitAdminTemplate:RabbitAdminTemplate = SingletonObjectFactory2.Instance<RabbitAdminTemplate>(RabbitAdminTemplate.name);

			await rabbitAdminTemplate.declareAckConsumer<Channel,ConsumeMessage>('12345678',new DefaultConsumer());

			let rabbitTemplate:RabbitTemplate = SingletonObjectFactory2.Instance<RabbitTemplate>(RabbitTemplate.name);

			await rabbitTemplate.sendStringToQueue('12345678','Badman-------Badman');

		},10000);



	}
}

(async ()=>{
	new TestRabbit().main();
})();








//
// const fs = require("fs");
// const path = require("path");

// const wait = () =>
// 	new Promise((resolve, reject) => {
// 		setTimeout(()=>{resolve(true)}, 3);
// 	});
// fs.readFile(
// 	path.resolve(__dirname, "./xxx.js"),
// 	"utf-8",
// 	async (err, data) => {
// 		console.log("读取的文件内容1->",data);
// 	}
// );
// fs.readFile(
// 	path.resolve(__dirname, "./xxx.js"),
// 	"utf-8",
// 	async (err, data) => {
// 		console.log("读取的文件内容2");
// 		await wait();
// 		console.log("读取文件内容2，等待3 秒后输出");
// 		process.nextTick(() => {
// 			console.log("读取文件内容2，等待3 秒后执行 process.nextTick");
// 		});
// 	}
// );

// console.log("start");
// console.log(__dirname);
//
// setTimeout(function () {
// 	console.log("setTimeout-1");
// 	process.nextTick(function () {
// 		console.log("setTimeout-1-process.nextTick");
// 	});
// 	new Promise(function (resolve) {
// 		console.log("setTimeout-1-Promise");
// 		resolve('-----------------------------');
// 	}).then(function () {
// 		console.log("setTimeout-1-Promise-then");
// 	});
// });
// setImmediate(() => {
// 	console.log("setImmediate-1");
// 	process.nextTick(function () {
// 		console.log("setImmediate-1-process.nextTick-1");
// 	});
// });
// setImmediate(() => {
// 	console.log("setImmediate-2");
// });
// process.nextTick(function () {
// 	console.log("process.nextTick-1");
// });
// process.nextTick(function () {
// 	console.log("process.nextTick-2");
// });
// new Promise(function (resolve) {
// 	console.log("Promise-1");
// 	resolve('2222222222222222222222222222222222222');
// }).then(function () {
// 	console.log("Promise-1-then");
// });
//
// setTimeout(function () {
// 	console.log("setTimeout-2");
// 	process.nextTick(function () {
// 		console.log("setTimeout-2-process.nextTick");
// 	});
// 	new Promise(function (resolve) {
// 		console.log("setTimeout-2-Promise");
// 		resolve('333333333333333333333333333333333333333333333333333333');
// 	}).then(function () {
// 		console.log("setTimeout-2-Promise-then");
// 	});
// });









