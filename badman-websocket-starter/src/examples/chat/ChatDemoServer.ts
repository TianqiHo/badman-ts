


import {Logging, SingletonObjectFactory2} from "badman-core";
import Http from "http";
import {Configuration, Logger} from "log4js";

import ChatServer from "../../open/badman/chatt/server/ChatServer";
import createExpress, {Express} from "express";
import ChatServerProperties from "../../open/badman/chatt/server/ChatServerProperties";

import bodyParser, {OptionsText} from 'body-parser';
import ChatRouter from "./ChatRouter";




export default class ChatDemoServer {


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

		let logging:Logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[defaultConfiguration]);
		let logger:Logger = logging.logger(ChatDemoServer.name);


		let properties:Partial<ChatServerProperties> = {
			port: 8888,
			path:"/chatServer",
			allowUpgrades:false,
			transports:['polling'],
			cleanupEmptyChildNamespaces:false
		};

		const express:Express = createExpress();

		express.disable("x-powered-by");
		express.use(bodyParser.json({limit: '2mb'}));
		express.use(bodyParser.text({limit: '10mb', extended: true} as OptionsText));

		express.use('/',new ChatRouter(logger).binds());

		let server:Http.Server = express.listen(properties.port,async ()=>{
			let chatServer:ChatServer = await SingletonObjectFactory2.initWithArgs(ChatServer,[properties,logger,server]);
		});

	}

}

(()=>{
	new ChatDemoServer().main();
})()