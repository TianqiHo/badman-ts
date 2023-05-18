


import {Logging, SingletonObjectFactory2} from "badman-core";
import {Configuration, Logger} from "log4js";
import DefaultWebSocketServer from "./DefaultWebSocketServer";
import AbstractWebSocketServerConnection from "./open/badman/websocket/AbstractWebSocketServerConnection";
import AbstractWebSocketServer from "./open/badman/websocket/AbstractWebSocketServer";
import RequestBodyEntity from "./open/badman/websocket/RequestBodyEntity";
import WebSocketServerProperties from "./open/badman/websocket/WebSocketServerProperties";
import WebSocketClientProperties from "./open/badman/websocket/WebSocketClientProperties";
import WebSocketProperties from "./open/badman/websocket/WebSocketProperties";


export default class BadmanWebSocket {

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
					"level": "debug",
					"enableCallStack": true
				}
			}
		};

		let logging:Logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[defaultConfiguration]);
		let logger:Logger = logging.logger(BadmanWebSocket.name);

		let properties:WebSocketServerProperties = {
				port: 1000,
				path: '/custom',
				heartBeatInterval : 10000
		}

		await new DefaultWebSocketServer(properties,logger).afterInitialized();
	}

}


// (() => {
// 	new BadmanWebSocket().main();
// })();

export {
	AbstractWebSocketServerConnection,
	AbstractWebSocketServer,
	RequestBodyEntity,
	WebSocketServerProperties,
	WebSocketClientProperties,
	WebSocketProperties
}