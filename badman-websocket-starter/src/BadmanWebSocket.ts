


import {Logging, SingletonObjectFactory2} from "badman-core";
import {Logger} from "log4js";
import DefaultWebSocketServer from "./DefaultWebSocketServer";
import AbstractWebSocketServerConnection from "./open/badman/websocket/AbstractWebSocketServerConnection";
import AbstractWebSocketServer from "./open/badman/websocket/AbstractWebSocketServer";
import RequestBodyEntity from "./open/badman/websocket/RequestBodyEntity";
import WebSocketServerProperties from "./open/badman/websocket/WebSocketServerProperties";
import WebSocketClientProperties from "./open/badman/websocket/WebSocketClientProperties";
import WebSocketProperties from "./open/badman/websocket/WebSocketProperties";


export default class BadmanWebSocket {

	async main(){
		let logging:Logging = await SingletonObjectFactory2.init<Logging>(Logging);
		let logger:Logger = logging.logger(BadmanWebSocket.name);
		let properties:WebSocketServerProperties={
				port: 1000,
				context: 'custom',
				heartBeatInterval : 10000
		};
		new DefaultWebSocketServer(properties,logger).afterInitialized();
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