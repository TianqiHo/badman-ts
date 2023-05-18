
import createApplication, {Application} from "express";
import * as Http from "http";
import {Logging, SingletonObjectFactory2} from "badman-core";
import {Configuration, Logger} from "log4js";
import DefaultWebSocketServer from "../DefaultWebSocketServer";
import WebSocketServerProperties from "../open/badman/websocket/WebSocketServerProperties";


export default class ServerTypeSocket {

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
		let logger:Logger = logging.logger(ServerTypeSocket.name);

		let app:Application = createApplication();
		let server:Http.Server = app.listen(1000);

		let properties:WebSocketServerProperties = {
			path: '/custom',
			heartBeatInterval : 10000,
			server:server
		}

		await new DefaultWebSocketServer(properties,logger).afterInitialized();

		// app.get('/t',(req,res)=>{
		// 	logger.info(`${JSON.stringify(req.params)}`);
		// 	res.json({"success":true});
		// });

	}

}