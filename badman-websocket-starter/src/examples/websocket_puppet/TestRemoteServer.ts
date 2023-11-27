

import {Beans, Logging} from "badman-core";
import {Configuration, Logger} from "log4js";
import WebsocketPuppetClient from "../../open/badman/websocket_puppet/client/WebsocketPuppetClient";
import WebsocketPuppetClientProperties
	from "../../open/badman/websocket_puppet/properties/WebsocketPuppetClientProperties";


export default class TestRemoteServer {

	async main(){

		let defaultConfiguration:Configuration = {
			"appenders": {
				"stdout_appender": {
					"type": "stdout",
					"layout": { "type": "pattern","pattern":"%[[CDPID(%z)]-[%d{yyyy-MM-dd hh:mm:ss.SSS} %c-%p] [%f{1}<%A>.%M(%l)] %] <=> %m %n" }
				}
			},
			"categories": {
				"default": {
					"appenders": ["stdout_appender"],
					"level": "info",
					"enableCallStack": true
				}
			}
		}

		let logging:Logging = await Beans.LoadBean<Logging>({
			constructor:Logging,
			args:[defaultConfiguration]
		});

		let logger:Logger = logging.logger(TestRemoteServer.name);

		let serverClientProperties:Partial<WebsocketPuppetClientProperties>={
			clientId: '病人',
			addTrailingSlash: true,
			//path: "/ss/websocket",
			path: "/emer-websocket-server/",
			reconnectionAttempts: 10,
			transports: ["polling"],
			upgrade: false,
			protocols: ['http', 'https'],
			query: {clientId: '病人',join:'医院'}
		}

		let serverClient:WebsocketPuppetClient = await Beans.LoadBean<WebsocketPuppetClient>({
			constructor: WebsocketPuppetClient,
			beanName:'ServerClient',
			args:[
				'http://127.0.0.1:7999',
				//'https://test.com.cn/ss',
				logger,
				serverClientProperties
			]
		});


		// let customClientProperties:Partial<WebsocketPuppetClientProperties>={
		// 	clientId: '医院',
		// 	addTrailingSlash: true,
		// 	path: "/EmerWebsocket",
		// 	//path: "/emer",
		// 	reconnectionAttempts: 10,
		// 	transports: ["polling"],
		// 	upgrade: false,
		// 	protocols: ['http', 'https'],
		// 	query: {clientId: '医院',join:'病人'}
		// }
		// let CustomClient:WebsocketPuppetClient = await Beans.LoadBean<WebsocketPuppetClient>({
		// 	constructor: WebsocketPuppetClient,
		// 	beanName:'CustomClient',
		// 	args:[
		// 		'http://127.0.0.1:6999',
		// 		logger,
		// 		customClientProperties
		// 	]
		// });

		// setTimeout(()=>{
		// 	serverClient.send('CustomClient', 'cao你ma');
		// },5000);

	}
}

(()=>{
	new TestRemoteServer().main();
})();


// if(!clientParam.hospitalCode){
// 	let msg = 'hospitalCode不能为空,请检查websocket请求地址';
// 	this.logger.error(msg);
// 	connection.emit('connect_login',{success:false,msg:`${msg}`});
// 	connection.disconnect(false);
// }
//
// if(!clientParam.clientWhereType){
// 	let msg = 'hospitalCode不能为空,请检查websocket请求地址';
// 	this.logger.error(msg);
// 	connection.emit('connect_login',{success:false,msg:`${msg}`});
// 	connection.disconnect(false);
// }