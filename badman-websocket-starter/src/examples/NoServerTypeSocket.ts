import {Logging, SingletonObjectFactory2} from "badman-core";
import {Configuration, Logger} from "log4js";
import DefaultWebSocketServer from "../DefaultWebSocketServer";
import WebSocketServerProperties from "../open/badman/websocket/WebSocketServerProperties";

export default class NoServerTypeSocket {

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
		let logger:Logger = logging.logger(NoServerTypeSocket.name);

		let properties:WebSocketServerProperties = {
			port: 1000,
			path: '/custom',
			heartBeatInterval : 10000
		}
		await new DefaultWebSocketServer(properties,logger).afterInitialized();

	}

}