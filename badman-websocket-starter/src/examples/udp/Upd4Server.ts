import {Logging, SingletonObjectFactory2} from "badman-core";
import * as dgram from "dgram";
import {Configuration, Logger} from "log4js";
import readline from "readline";
import AbstractUdp, {UdpType} from "../../open/badman/udp/AbstractUdp";
import UdpProperties from "../../open/badman/udp/UdpProperties";



export default class Upd4Server extends AbstractUdp{

	constructor (properties:UdpProperties,logger:Logger) {
		super(properties,logger);
	}

	protected handleMessage (message: string, clientInfo: dgram.RemoteInfo) {

		this.logger.info(`client,address = ${clientInfo.address}\r\nport = ${clientInfo.port}\r\nfamily = ${clientInfo.family}\r\nsize = ${clientInfo.size}\r\n`);

		this.logger.info(`收到消息,message = ${message}\r\n`);

	}

}

(async ()=>{

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
	}

	let logging:Logging = await SingletonObjectFactory2.initWithArgs<Logging>(Logging,[defaultConfiguration]);
	let logger:Logger = logging.logger(Upd4Server.name);
	let properties:UdpProperties = {
		port: 2000,
		type: UdpType.UDP4,
		address : 'localhost'
	}
	let server:Upd4Server = await SingletonObjectFactory2.initWithArgs<Upd4Server>(Upd4Server,[properties,logger]);
	server.addListener('pong',(args)=>{
		logger.info('服务端pong->',args,'\r\n');
	});
	//server.unref();
	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on('line', function (line) {
		logger.info('服务端->',line.trim(),'\r\n');
		server.send(Buffer.from(line.trim()),2000,'localhost')
	});
	//client.send(Buffer.from('你好大狗'),2001,'192.168.1.11')
})();