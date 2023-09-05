


import {Logging, SingletonObjectFactory2} from "badman-core";
import Http from "http";
import {Configuration, Logger} from "log4js";

import ChatServer from "../../open/badman/chatt/server/ChatServer";
import createExpress, {Express} from "express";
import ChatServerProperties from "../../open/badman/chatt/server/ChatServerProperties";

import bodyParser, {OptionsText} from 'body-parser';
import ChatRouter from "./ChatRouter";
import RemoteChatRouter from "./RemoteChatRouter";

import Cluster from "cluster";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";



export default class ClusterChatDemoServer {



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
		let logger:Logger = logging.logger(ClusterChatDemoServer.name);

		let properties:Partial<ChatServerProperties> = {
			port: 8888,
			path:"/chatServer",
			allowUpgrades:false,
			transports:['polling'],
			cleanupEmptyChildNamespaces:false
		};

		let express:Express = createExpress();
		express.disable("x-powered-by");
		express.use(bodyParser.json({limit: '2mb'}));
		express.use(bodyParser.text({limit: '10mb', extended: true} as OptionsText));
		express.use('/',new ChatRouter(logger).binds());
		express.use('/remote',new RemoteChatRouter(logger).binds());

		if(Cluster.isPrimary){
			logger.info(` ChatServer Master ${process.pid} is running.`);
			// let server:Http.Server = express.listen(properties.port,async ()=>{});
			let server:Http.Server = Http.createServer(express);

			setupMaster(server, {
				loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
			});
			setupPrimary();
			server.listen(properties.port);
			//for (let i = 0; i < 1; i++) {
			Cluster.fork();
			//}
			Cluster.on("exit", (worker) => {
				logger.info(`Worker ${worker.process.pid} died.`);
				Cluster.fork();
			});
		}else{
			logger.info(`Worker ${process.pid} started`);
			//let server:Http.Server = Http.createServer();
			let server:Http.Server = Http.createServer();
			let chatServer:ChatServer = await SingletonObjectFactory2.initWithArgs(ChatServer,[properties,logger,server]);
			// @ts-ignore
			//chatServer.adapter(createAdapter());
			// @ts-ignore
			//setupWorker(chatServer.getHeart());

		}
	}

}

(()=>{
	new ClusterChatDemoServer().main();

	// if(!properties.allowUpgrades && heart){
	// 	if(Cluster.isPrimary){
	// 		this.logger.info(` ChatServer Master ${process.pid} is running.`);
	// 		setupMaster(heart, {
	// 			loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
	// 		});
	// 		setupPrimary();
	//
	// 		let cpuLength:number = OS.cpus().length;
	// 		for (let i = 0; i < 1; i++) {
	// 			Cluster.fork();
	// 		}
	//
	// 		Cluster.on("exit", (worker) => {
	// 			this.logger.info(`Worker ${worker.process.pid} died.`);
	// 			Cluster.fork();
	// 		});
	// 	}else{
	//
	// 		this.logger.info(`Worker ${process.pid} started`);
	// 		this.server = new Server(http.createServer());
	// 		this.closed = false;
	// 		this.server.on("connection_error", (err) => {
	// 			this.logger.error('Error->',err);
	// 		});
	// 		this.server.adapter(createAdapter());
	// 		setupWorker(this.server);
	//
	// 	}
	// }
})()