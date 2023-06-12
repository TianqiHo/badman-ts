import {Logging, SingletonObjectFactory2} from "badman-core";
import * as dgram from "dgram";
import {Configuration, Logger} from "log4js";
import readline from "readline";
import AbstractUdp, {UdpType} from "../../open/badman/udp/AbstractUdp";
import UdpProperties from "../../open/badman/udp/UdpProperties";


export default class Udp4Client extends AbstractUdp{


	constructor (properties:UdpProperties,logger:Logger) {
		super(properties,logger);
	}


	protected handleMessage (message: string, clientInfo: dgram.RemoteInfo) {

		this.logger.info(`client,address = ${clientInfo.address}\r\nport = ${clientInfo.port}\r\nfamily = ${clientInfo.family}\r\nsize = ${clientInfo.size}\r\n`);

		this.logger.info(`收到消息,message = ${message}\r\n`);

	}

}

/**
 * UDP 是无连接的协议，因此这里的 connect 并不是在通信双方之间建立真正的连接，
 * 而只是用来设置通信另一端的地址和端口号；连接建立后，socket.send() 调用无需指定 port 和 address 参数，并且仅能收到连接指定的通信另一端的数据报
 */
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
	let logger:Logger = logging.logger(Udp4Client.name);
	let properties:UdpProperties = {
		port: 2001,
		type: UdpType.UDP4,
		address : 'localhost'
	}
	let client:Udp4Client = await SingletonObjectFactory2.initWithArgs<Udp4Client>(Udp4Client,[properties,logger]);//new Udp4Client(properties,logger);

	//client.lessConnectTo(2000,'localhost');

	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on('line', function (line) {
		logger.info('A客户端-》',line.trim(),'\r\n');
		client.send(Buffer.from(line.trim()),2000,'localhost');
	});


})();