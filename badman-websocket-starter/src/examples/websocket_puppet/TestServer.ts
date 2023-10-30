

import {Beans, Logging} from "badman-core";
import Http from "http";
import {Http2SecureServer} from "http2";
import {Server as HTTPSServer} from "https";
import {Configuration, Logger} from "log4js";
import {Socket} from "socket.io/dist/socket";
import WebsocketPuppetClient from "../../open/badman/websocket_puppet/client/WebsocketPuppetClient";
import WebsocketPuppetClientProperties
	from "../../open/badman/websocket_puppet/properties/WebsocketPuppetClientProperties";
import WebsocketPuppetServerProperties
	from "../../open/badman/websocket_puppet/properties/WebsocketPuppetServerProperties";
import WebsocketPuppetServer from "../../open/badman/websocket_puppet/server/WebsocketPuppetServer";


class MyServer extends WebsocketPuppetServer{
	constructor (properties:Partial<WebsocketPuppetServerProperties>,logger:Logger, heart?:Http.Server | HTTPSServer | Http2SecureServer) {
		super(properties, logger, heart);
	}
	doWithConn (connection: Socket): Promise<void> {
		return Promise.resolve(undefined);
	}
}

export default class TestServer {

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

		let logger:Logger = logging.logger(TestServer.name);

		let namespace = '/websocket-puppet';
		let properties:Partial<WebsocketPuppetServerProperties> = {
			namespace: namespace,
			port: 8888,
			path:"/emer/",
			allowUpgrades:false,
			transports:['polling'],
			cleanupEmptyChildNamespaces:false
		}

		let server:MyServer = await Beans.LoadBean<MyServer>({
			constructor:MyServer,
			args:[
				properties,
				logger
			]
		});

		let serverClientProperties:Partial<WebsocketPuppetClientProperties>={
			clientId: 'ServerClient',
			addTrailingSlash: true,
			path: "/emer/",
			reconnectionAttempts: 10,
			transports: ["polling"],
			upgrade: false,
			protocols: ['http', 'https'],
			query: {clientId: 'ServerClient',serverClient:true}
		}

		let serverClient:WebsocketPuppetClient = await Beans.LoadBean<WebsocketPuppetClient>({
			constructor: WebsocketPuppetClient,
			beanName:'ServerClient',
			args:[
				`http://127.0.0.1:8888${namespace}`,
				logger,
				serverClientProperties
			]
		});

		let customClientProperties:Partial<WebsocketPuppetClientProperties>={
			clientId: 'CustomClient',
			addTrailingSlash: true,
			path: "/emer/",
			reconnectionAttempts: 10,
			transports: ["polling"],
			upgrade: false,
			protocols: ['http', 'https'],
			query: {clientId: 'CustomClient'}
		}
		let CustomClient:WebsocketPuppetClient = await Beans.LoadBean<WebsocketPuppetClient>({
			constructor: WebsocketPuppetClient,
			beanName:'CustomClient',
			args:[
				`http://127.0.0.1:8888${namespace}`,
				logger,
				customClientProperties
			]
		});

		setTimeout(async ()=>{
			//serverClient.send('CustomClient', 'cao你ma');
			logger.info('-------------------------------------');
			logger.info(await server.getReceives(null));
			logger.info('-------------------------------------');
			//logger.info(await server.getReceivesGroupByRoomId());
		},5000);

	}
}

(()=>{
	new TestServer().main();
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